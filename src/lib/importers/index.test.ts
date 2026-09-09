import { beforeEach, describe, expect, it } from 'vitest'
import { applyImport, summarizeImport } from './index'
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

describe('summarizeImport', () => {
  it('counts mods and only the categories that do not already exist', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')

    const summary = summarizeImport([
      { name: 'Ordinator', category: 'Gameplay' },
      { name: 'SkyUI', category: 'Interface' },
      { name: 'Apachii Hair' },
    ])

    expect(summary.modsImported).toBe(3)
    expect(summary.categoriesCreated).toBe(1)
  })
})

describe('applyImport', () => {
  it('creates mods and categories from parsed rows (append mode)', () => {
    useLoadOrderStore.getState().addMod('Existing Mod')

    applyImport(
      [
        {
          name: 'Ordinator',
          category: 'Gameplay',
          color: '#ff0000',
          description: 'Overhaul',
        },
        { name: 'SkyUI' },
      ],
      'append',
    )

    const state = useLoadOrderStore.getState()
    expect(state.mods.map((mod) => mod.name)).toEqual([
      'Existing Mod',
      'Ordinator',
      'SkyUI',
    ])
    expect(state.categories).toHaveLength(1)
    expect(state.categories[0]).toMatchObject({
      name: 'Gameplay',
      color: '#ff0000',
    })

    const ordinator = state.mods.find((mod) => mod.name === 'Ordinator')
    expect(ordinator?.categoryId).toBe(state.categories[0].id)
    expect(ordinator?.description).toBe('Overhaul')
  })

  it('reuses an existing category by name instead of duplicating it', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')

    applyImport([{ name: 'Ordinator', category: 'gameplay' }], 'append')

    const state = useLoadOrderStore.getState()
    expect(state.categories).toHaveLength(1)
    expect(state.mods[0].categoryId).toBe(state.categories[0].id)
  })

  it('falls back to a default palette color when none is provided', () => {
    applyImport([{ name: 'Ordinator', category: 'Gameplay' }], 'append')

    const state = useLoadOrderStore.getState()
    expect(state.categories[0].color).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('clears existing mods first when mode is "replace"', () => {
    useLoadOrderStore.getState().addMod('Old Mod')

    applyImport([{ name: 'New Mod' }], 'replace')

    const state = useLoadOrderStore.getState()
    expect(state.mods.map((mod) => mod.name)).toEqual(['New Mod'])
  })
})
