import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ModCard from './ModCard'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../../store/loadOrderStore'
import type { Category, Mod } from '../../store/types'

const baseMod: Mod = {
  id: 'mod-1',
  name: 'Ordinator - Perks of Skyrim',
  description: '',
  categoryId: null,
  position: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const gameplayCategory: Category = {
  id: 'cat-1',
  name: 'Gameplay',
  color: '#ff0000',
  order: 0,
}

function renderModCard(mod: Mod, category: Category | undefined) {
  return render(
    <DndContext>
      <SortableContext items={[mod.id]} strategy={verticalListSortingStrategy}>
        <ul>
          <ModCard mod={mod} category={category} />
        </ul>
      </SortableContext>
    </DndContext>,
  )
}

beforeEach(() => {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
})

describe('ModCard', () => {
  it('renders the mod name', () => {
    renderModCard(baseMod, undefined)

    expect(screen.getByText('Ordinator - Perks of Skyrim')).toBeInTheDocument()
  })

  it('shows "Sans catégorie" in gray when the mod has no category', () => {
    renderModCard(baseMod, undefined)

    const badge = screen.getByText('Sans catégorie')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-neutral-700')
  })

  it('shows the category badge with its name and color', () => {
    renderModCard(
      { ...baseMod, categoryId: gameplayCategory.id },
      gameplayCategory,
    )

    const badge = screen.getByText('Gameplay')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle({ backgroundColor: '#ff0000' })
  })

  it('exposes a dedicated drag handle separate from the toggle button', () => {
    renderModCard(baseMod, undefined)

    expect(
      screen.getByRole('button', {
        name: `Réordonner ${baseMod.name}`,
      }),
    ).toBeInTheDocument()
  })

  it('is collapsed by default and does not show the details section', () => {
    renderModCard(baseMod, undefined)

    expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument()
  })

  it('toggles the details section when the card header is clicked', () => {
    renderModCard(baseMod, undefined)

    const toggle = screen.getByRole('button', {
      name: /^Ordinator - Perks of Skyrim/i,
    })

    fireEvent.click(toggle)
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument()

    fireEvent.click(toggle)
    expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument()
  })
})
