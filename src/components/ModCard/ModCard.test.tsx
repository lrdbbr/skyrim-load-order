import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ModCard from './ModCard'
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

describe('ModCard', () => {
  it('renders the mod name', () => {
    render(<ModCard mod={baseMod} category={undefined} />)

    expect(screen.getByText('Ordinator - Perks of Skyrim')).toBeInTheDocument()
  })

  it('shows "Sans catégorie" in gray when the mod has no category', () => {
    render(<ModCard mod={baseMod} category={undefined} />)

    const badge = screen.getByText('Sans catégorie')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-neutral-700')
  })

  it('shows the category badge with its name and color', () => {
    render(
      <ModCard
        mod={{ ...baseMod, categoryId: gameplayCategory.id }}
        category={gameplayCategory}
      />,
    )

    const badge = screen.getByText('Gameplay')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle({ backgroundColor: '#ff0000' })
  })
})
