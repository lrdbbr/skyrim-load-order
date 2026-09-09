import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ModList from './ModList'
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

describe('ModList', () => {
  it('shows an empty state when there are no mods', () => {
    render(<ModList />)

    expect(screen.getByText(/aucun mod/i)).toBeInTheDocument()
  })

  it('renders one ModCard per mod, sorted by position', () => {
    useLoadOrderStore.getState().addMod('Mod A')
    useLoadOrderStore.getState().addMod('Mod B')
    const [modA, modB] = useLoadOrderStore.getState().mods
    useLoadOrderStore.getState().reorderMods([modB.id, modA.id])

    render(<ModList />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Mod B')
    expect(items[1]).toHaveTextContent('Mod A')
  })

  it('shows the category badge for a mod with a category', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    const category = useLoadOrderStore.getState().categories[0]
    useLoadOrderStore.getState().addMod('Mod A')
    const mod = useLoadOrderStore.getState().mods[0]
    useLoadOrderStore.getState().updateMod(mod.id, { categoryId: category.id })

    render(<ModList />)

    const badge = screen.getByText('Gameplay')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle({ backgroundColor: '#ff0000' })
  })

  it('shows "Sans catégorie" for a mod without a category', () => {
    useLoadOrderStore.getState().addMod('Mod A')

    render(<ModList />)

    expect(screen.getByText('Sans catégorie')).toBeInTheDocument()
  })
})
