import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import { importXlsx } from './importXlsx'

function buildWorkbookBuffer(rows: Record<string, unknown>[]): ArrayBuffer {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mods')
  return XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx',
  }) as ArrayBuffer
}

describe('importXlsx', () => {
  it('reads the first sheet and detects Name/Category/Color/Description columns', async () => {
    const buffer = buildWorkbookBuffer([
      {
        Name: 'Ordinator',
        Category: 'Gameplay',
        Color: '#ff0000',
        Description: 'Overhaul',
      },
      { Name: 'SkyUI', Category: '', Color: '', Description: '' },
    ])

    const result = await importXlsx(buffer)

    expect(result).toEqual([
      {
        name: 'Ordinator',
        category: 'Gameplay',
        color: '#ff0000',
        description: 'Overhaul',
      },
      {
        name: 'SkyUI',
        category: undefined,
        color: undefined,
        description: undefined,
      },
    ])
  })

  it('throws when the sheet has no data rows', async () => {
    const buffer = buildWorkbookBuffer([])

    await expect(importXlsx(buffer)).rejects.toThrow(/empty/i)
  })

  it('throws a friendly error when the file cannot be read', async () => {
    const garbage = new TextEncoder().encode(
      'not a real spreadsheet file',
    ).buffer

    await expect(importXlsx(garbage)).rejects.toThrow(/unreadable|empty/i)
  })
})
