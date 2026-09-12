import { describe, expect, it } from 'vitest'
import { sortCategoriesByName } from './sortCategories'

describe('sortCategoriesByName', () => {
  it('sorts by name regardless of insertion/creation order', () => {
    const categories = [
      { name: 'Weapons', order: 0 },
      { name: 'Armor', order: 1 },
      { name: 'Gameplay', order: 2 },
    ]

    expect(sortCategoriesByName(categories).map((c) => c.name)).toEqual([
      'Armor',
      'Gameplay',
      'Weapons',
    ])
  })

  it('is case-insensitive', () => {
    const categories = [{ name: 'weapons' }, { name: 'Armor' }]

    expect(sortCategoriesByName(categories).map((c) => c.name)).toEqual([
      'Armor',
      'weapons',
    ])
  })

  it('is accent-insensitive', () => {
    const categories = [{ name: 'Étrange' }, { name: 'Armor' }]

    expect(sortCategoriesByName(categories).map((c) => c.name)).toEqual([
      'Armor',
      'Étrange',
    ])
  })

  it('does not mutate the original array', () => {
    const categories = [{ name: 'Weapons' }, { name: 'Armor' }]
    const original = [...categories]

    sortCategoriesByName(categories)

    expect(categories).toEqual(original)
  })
})
