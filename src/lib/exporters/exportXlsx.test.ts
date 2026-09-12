import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import { exportXlsx } from './exportXlsx'
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

describe('exportXlsx', () => {
  it('writes the mods to a "Load Order" sheet, resolving category names in order', async () => {
    const mods = [
      makeMod({ id: '1', name: 'SkyUI', position: 1, categoryId: null }),
      makeMod({
        id: '2',
        name: 'Ordinator',
        position: 0,
        categoryId: gameplay.id,
        description: 'Overhaul',
      }),
    ]

    const buffer = await exportXlsx(mods, [gameplay])
    const workbook = XLSX.read(buffer, { type: 'array' })

    expect(workbook.SheetNames).toContain('Load Order')

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Load Order'])
    expect(rows).toEqual([
      {
        Name: 'Ordinator',
        Category: 'Gameplay',
        Color: '#ff0000',
        Description: 'Overhaul',
      },
      { Name: 'SkyUI', Category: 'Sans catégorie', Color: '', Description: '' },
    ])
  })

  it('produces an empty sheet (headers only) when there are no mods', async () => {
    const buffer = await exportXlsx([], [])
    const workbook = XLSX.read(buffer, { type: 'array' })

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Load Order'])
    expect(rows).toEqual([])
  })
})
