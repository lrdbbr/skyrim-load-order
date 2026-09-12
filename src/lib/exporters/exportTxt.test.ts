import { describe, expect, it } from 'vitest'
import { exportTxt } from './exportTxt'
import type { Mod } from '../../store/types'

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

describe('exportTxt', () => {
  it('generates one line per mod, sorted by position', () => {
    const mods = [
      makeMod({ id: '1', name: 'SkyUI', position: 1 }),
      makeMod({ id: '2', name: 'Ordinator', position: 0 }),
    ]

    expect(exportTxt(mods)).toBe('Ordinator\nSkyUI\n')
  })

  it('returns an empty string when there are no mods', () => {
    expect(exportTxt([])).toBe('')
  })

  it('excludes disabled mods', () => {
    const mods = [
      makeMod({ id: '1', name: 'SkyUI', position: 0 }),
      makeMod({ id: '2', name: 'Disabled Mod', position: 1, disabled: true }),
    ]

    expect(exportTxt(mods)).toBe('SkyUI\n')
  })
})
