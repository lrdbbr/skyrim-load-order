import Papa from 'papaparse'
import { describe, expect, it } from 'vitest'
import { exportCsv } from './exportCsv'
import type { Category, Mod } from '../../store/types'

function makeMod(
  overrides: Partial<Mod> & Pick<Mod, 'id' | 'name' | 'position'>,
): Mod {
  return {
    description: '',
    categoryId: null,
    disabled: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const gameplay: Category = {
  id: 'cat-1',
  name: 'Gameplay',
  color: '#ff0000',
  order: 0,
}

describe('exportCsv', () => {
  it('resolves the category name (not the raw id) and falls back to "Uncategorized"', () => {
    const mods = [
      makeMod({
        id: '1',
        name: 'Ordinator',
        position: 0,
        categoryId: gameplay.id,
        description: 'Overhaul',
      }),
      makeMod({ id: '2', name: 'SkyUI', position: 1, categoryId: null }),
    ]

    const csv = exportCsv(mods, [gameplay])
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true })

    expect(parsed.data).toEqual([
      {
        Name: 'Ordinator',
        Category: 'Gameplay',
        Color: '#ff0000',
        Description: 'Overhaul',
      },
      { Name: 'SkyUI', Category: 'Uncategorized', Color: '', Description: '' },
    ])
  })

  it('preserves load order (sorted by position)', () => {
    const mods = [
      makeMod({ id: '1', name: 'B', position: 1 }),
      makeMod({ id: '2', name: 'A', position: 0 }),
    ]

    const parsed = Papa.parse<{ Name: string }>(exportCsv(mods, []), {
      header: true,
      skipEmptyLines: true,
    })

    expect(parsed.data.map((row) => row.Name)).toEqual(['A', 'B'])
  })

  it('escapes fields containing commas and quotes (default papaparse behavior)', () => {
    const mods = [
      makeMod({
        id: '1',
        name: 'Mod, with comma',
        position: 0,
        description: 'Has "quotes" inside',
      }),
    ]

    const csv = exportCsv(mods, [])

    expect(csv).toContain('"Mod, with comma"')
    expect(csv).toContain('"Has ""quotes"" inside"')

    const parsed = Papa.parse<{ Name: string; Description: string }>(csv, {
      header: true,
      skipEmptyLines: true,
    })
    expect(parsed.data[0].Name).toBe('Mod, with comma')
    expect(parsed.data[0].Description).toBe('Has "quotes" inside')
  })

  it('excludes disabled mods', () => {
    const mods = [
      makeMod({ id: '1', name: 'SkyUI', position: 0 }),
      makeMod({ id: '2', name: 'Disabled Mod', position: 1, disabled: true }),
    ]

    const parsed = Papa.parse<{ Name: string }>(exportCsv(mods, []), {
      header: true,
      skipEmptyLines: true,
    })

    expect(parsed.data.map((row) => row.Name)).toEqual(['SkyUI'])
  })
})
