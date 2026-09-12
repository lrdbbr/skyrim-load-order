import { describe, expect, it } from 'vitest'
import { importCsv } from './importCsv'

describe('importCsv', () => {
  it('detects Name/Category/Color/Description columns case-insensitively', () => {
    const csv =
      'Name,Category,Color,Description\n' +
      'Ordinator,Gameplay,#ff0000,Overhaul des perks\n' +
      'SkyUI,,,'

    expect(importCsv(csv)).toEqual([
      {
        name: 'Ordinator',
        category: 'Gameplay',
        color: '#ff0000',
        description: 'Overhaul des perks',
      },
      {
        name: 'SkyUI',
        category: undefined,
        color: undefined,
        description: undefined,
      },
    ])
  })

  it('accepts French column name variants', () => {
    const csv = 'Nom,Catégorie\nOrdinator,Gameplay'

    const result = importCsv(csv)

    expect(result).toEqual([
      {
        name: 'Ordinator',
        category: 'Gameplay',
        color: undefined,
        description: undefined,
      },
    ])
  })

  it('falls back to the first column as the name when no Name column is found', () => {
    const csv = 'Titre,Notes\nOrdinator,Great overhaul'

    const result = importCsv(csv)

    expect(result[0].name).toBe('Ordinator')
    expect(result[0].description).toBe('Great overhaul')
  })

  it('throws when the file is empty', () => {
    expect(() => importCsv('')).toThrow(/empty/i)
  })

  it('throws when there is no data row', () => {
    expect(() => importCsv('Name,Category\n')).toThrow(/no mods/i)
  })
})
