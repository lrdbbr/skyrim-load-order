import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ModCardDetails from './ModCardDetails'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../../store/loadOrderStore'
import type { Mod } from '../../store/types'

function resetStore() {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
}

function addMod(): Mod {
  useLoadOrderStore.getState().addMod('Ordinator - Perks of Skyrim')
  return useLoadOrderStore.getState().mods[0]
}

beforeEach(() => {
  resetStore()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('ModCardDetails', () => {
  it('debounces description edits before writing them to the store', () => {
    vi.useFakeTimers()
    const mod = addMod()
    render(<ModCardDetails mod={mod} />)

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Overhaul complet des perks' },
    })

    expect(useLoadOrderStore.getState().mods[0].description).toBe('')

    vi.advanceTimersByTime(300)

    expect(useLoadOrderStore.getState().mods[0].description).toBe(
      'Overhaul complet des perks',
    )
  })

  it('lists "Sans catégorie" plus every existing category in the select', () => {
    const mod = addMod()
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')

    render(<ModCardDetails mod={mod} />)

    const select = screen.getByLabelText(/catégorie/i)
    expect(select).toHaveValue('')
    expect(
      screen.getByRole('option', { name: 'Sans catégorie' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Gameplay' })).toBeInTheDocument()
  })

  it('updates the category immediately when the select changes', () => {
    const mod = addMod()
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    const category = useLoadOrderStore.getState().categories[0]

    render(<ModCardDetails mod={mod} />)

    fireEvent.change(screen.getByLabelText(/catégorie/i), {
      target: { value: category.id },
    })

    expect(useLoadOrderStore.getState().mods[0].categoryId).toBe(category.id)
  })

  it('removes the mod once the deletion is confirmed', () => {
    const mod = addMod()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<ModCardDetails mod={mod} />)
    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    expect(useLoadOrderStore.getState().mods).toHaveLength(0)
  })

  it('keeps the mod when the deletion is cancelled', () => {
    const mod = addMod()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<ModCardDetails mod={mod} />)
    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    expect(useLoadOrderStore.getState().mods).toHaveLength(1)
  })

  it('disables the mod when "Désactiver" is clicked', () => {
    const mod = addMod()
    render(<ModCardDetails mod={mod} />)

    fireEvent.click(screen.getByRole('button', { name: /désactiver/i }))

    expect(useLoadOrderStore.getState().mods[0].disabled).toBe(true)
  })

  it('re-enables an already disabled mod', () => {
    const mod = addMod()
    useLoadOrderStore.getState().updateMod(mod.id, { disabled: true })

    render(<ModCardDetails mod={useLoadOrderStore.getState().mods[0]} />)
    fireEvent.click(screen.getByRole('button', { name: /réactiver/i }))

    expect(useLoadOrderStore.getState().mods[0].disabled).toBe(false)
  })
})
