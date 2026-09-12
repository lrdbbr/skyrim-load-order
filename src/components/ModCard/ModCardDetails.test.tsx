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
    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Overhaul complet des perks' },
    })

    expect(useLoadOrderStore.getState().mods[0].description).toBe('')

    vi.advanceTimersByTime(300)

    expect(useLoadOrderStore.getState().mods[0].description).toBe(
      'Overhaul complet des perks',
    )
  })

  it('lists "Uncategorized" plus every existing category in the select', () => {
    const mod = addMod()
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')

    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    const select = screen.getByLabelText(/category/i)
    expect(select).toHaveValue('')
    expect(
      screen.getByRole('option', { name: 'Uncategorized' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Gameplay' })).toBeInTheDocument()
  })

  it('lists categories alphabetically, regardless of creation order', () => {
    const mod = addMod()
    useLoadOrderStore.getState().addCategory('Weapons', '#ff0000')
    useLoadOrderStore.getState().addCategory('Armor', '#00ff00')
    useLoadOrderStore.getState().addCategory('Gameplay', '#0000ff')

    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toEqual([
      'Uncategorized',
      'Armor',
      'Gameplay',
      'Weapons',
    ])
  })

  it('updates the category immediately when the select changes', () => {
    const mod = addMod()
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    const category = useLoadOrderStore.getState().categories[0]

    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: category.id },
    })

    expect(useLoadOrderStore.getState().mods[0].categoryId).toBe(category.id)
  })

  it('removes the mod once the deletion is confirmed', () => {
    const mod = addMod()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(useLoadOrderStore.getState().mods).toHaveLength(0)
  })

  it('keeps the mod when the deletion is cancelled', () => {
    const mod = addMod()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(useLoadOrderStore.getState().mods).toHaveLength(1)
  })

  it('disables the mod when "Disable" is clicked', () => {
    const mod = addMod()
    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    fireEvent.click(screen.getByRole('button', { name: /disable/i }))

    expect(useLoadOrderStore.getState().mods[0].disabled).toBe(true)
  })

  it('re-enables an already disabled mod', () => {
    const mod = addMod()
    useLoadOrderStore.getState().updateMod(mod.id, { disabled: true })

    render(<ModCardDetails mod={useLoadOrderStore.getState().mods[0]} position={1} totalCount={1} />)
    fireEvent.click(screen.getByRole('button', { name: /enable/i }))

    expect(useLoadOrderStore.getState().mods[0].disabled).toBe(false)
  })

  it('shows the current position in the field', () => {
    const mod = addMod()
    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    expect(screen.getByLabelText(`Position of ${mod.name}`)).toHaveValue(1)
  })

  it('moves the mod to a new position on submit', () => {
    useLoadOrderStore.getState().addMod('First')
    useLoadOrderStore.getState().addMod('Second')
    useLoadOrderStore.getState().addMod('Third')
    const first = useLoadOrderStore.getState().mods[0]

    render(<ModCardDetails mod={first} position={1} totalCount={3} />)
    const input = screen.getByLabelText(`Position of ${first.name}`)
    fireEvent.change(input, { target: { value: '3' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)

    const names = [...useLoadOrderStore.getState().mods]
      .sort((a, b) => a.position - b.position)
      .map((mod) => mod.name)
    expect(names).toEqual(['Second', 'Third', 'First'])
  })

  it('clamps a position beyond the list length to the last position', () => {
    useLoadOrderStore.getState().addMod('First')
    useLoadOrderStore.getState().addMod('Second')
    const first = useLoadOrderStore.getState().mods[0]

    render(<ModCardDetails mod={first} position={1} totalCount={2} />)
    const input = screen.getByLabelText(`Position of ${first.name}`)
    fireEvent.change(input, { target: { value: '99' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)

    const names = [...useLoadOrderStore.getState().mods]
      .sort((a, b) => a.position - b.position)
      .map((mod) => mod.name)
    expect(names).toEqual(['Second', 'First'])
  })

  it('reverts to the current position when the field is left empty', () => {
    const mod = addMod()
    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    const input = screen.getByLabelText(`Position of ${mod.name}`)
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)

    expect(input).toHaveValue(1)
  })

  it('reverts to the current position on Escape', () => {
    const mod = addMod()
    render(<ModCardDetails mod={mod} position={1} totalCount={1} />)

    const input = screen.getByLabelText(`Position of ${mod.name}`)
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(input).toHaveValue(1)
  })
})
