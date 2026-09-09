import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CategoryManager from './CategoryManager'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../../store/loadOrderStore'

function resetStore() {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
}

beforeEach(() => {
  resetStore()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CategoryManager', () => {
  it('shows the empty state when there are no categories', () => {
    render(<CategoryManager onClose={() => {}} />)

    expect(screen.getByText(/aucune catégorie/i)).toBeInTheDocument()
  })

  it('creates a new category with a name and a color', () => {
    render(<CategoryManager onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText(/nom de la nouvelle catégorie/i), {
      target: { value: 'Gameplay' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^ajouter$/i }))

    const { categories } = useLoadOrderStore.getState()
    expect(categories).toHaveLength(1)
    expect(categories[0].name).toBe('Gameplay')
    expect(categories[0].color).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('lists existing categories with their name and color swatch', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ef4444')

    render(<CategoryManager onClose={() => {}} />)

    expect(screen.getByLabelText('Nom de la catégorie Gameplay')).toHaveValue(
      'Gameplay',
    )
    expect(screen.getByLabelText('Couleur de Gameplay')).toHaveValue('#ef4444')
  })

  it('renames an existing category', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ef4444')
    const category = useLoadOrderStore.getState().categories[0]

    render(<CategoryManager onClose={() => {}} />)

    fireEvent.change(
      screen.getByLabelText(`Nom de la catégorie ${category.name}`),
      { target: { value: 'Gameplay overhaul' } },
    )

    expect(useLoadOrderStore.getState().categories[0].name).toBe(
      'Gameplay overhaul',
    )
  })

  it('changes the color of an existing category', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ef4444')
    const category = useLoadOrderStore.getState().categories[0]

    render(<CategoryManager onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText(`Couleur de ${category.name}`), {
      target: { value: '#3b82f6' },
    })

    expect(useLoadOrderStore.getState().categories[0].color).toBe('#3b82f6')
  })

  it('removes a category once deletion is confirmed and reverts its mods to "Sans catégorie"', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ef4444')
    const category = useLoadOrderStore.getState().categories[0]
    useLoadOrderStore.getState().addMod('Ordinator')
    const mod = useLoadOrderStore.getState().mods[0]
    useLoadOrderStore.getState().updateMod(mod.id, { categoryId: category.id })

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<CategoryManager onClose={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    const state = useLoadOrderStore.getState()
    expect(state.categories).toHaveLength(0)
    expect(state.mods[0].categoryId).toBeNull()
  })

  it('keeps the category and its mods when deletion is cancelled', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ef4444')
    const category = useLoadOrderStore.getState().categories[0]
    useLoadOrderStore.getState().addMod('Ordinator')
    const mod = useLoadOrderStore.getState().mods[0]
    useLoadOrderStore.getState().updateMod(mod.id, { categoryId: category.id })

    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<CategoryManager onClose={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    const state = useLoadOrderStore.getState()
    expect(state.categories).toHaveLength(1)
    expect(state.mods[0].categoryId).toBe(category.id)
  })
})
