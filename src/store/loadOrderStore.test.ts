import { beforeEach, describe, expect, it } from 'vitest'
import { initialLoadOrderState, useLoadOrderStore } from './loadOrderStore'

function resetStore() {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
}

beforeEach(() => {
  resetStore()
})

describe('addMod', () => {
  it('adds a mod at the end of the list with default values', () => {
    useLoadOrderStore.getState().addMod('Unofficial Skyrim Patch')

    const { mods } = useLoadOrderStore.getState()
    expect(mods).toHaveLength(1)
    expect(mods[0]).toMatchObject({
      name: 'Unofficial Skyrim Patch',
      description: '',
      categoryId: null,
      position: 0,
    })
    expect(mods[0].id).toBeTruthy()
    expect(mods[0].createdAt).toBe(mods[0].updatedAt)
  })

  it('appends subsequent mods after the last position', () => {
    useLoadOrderStore.getState().addMod('Mod A')
    useLoadOrderStore.getState().addMod('Mod B')

    const { mods } = useLoadOrderStore.getState()
    expect(mods.map((mod) => mod.name)).toEqual(['Mod A', 'Mod B'])
    expect(mods.map((mod) => mod.position)).toEqual([0, 1])
  })
})

describe('removeMod', () => {
  it('removes the mod matching the given id', () => {
    useLoadOrderStore.getState().addMod('Mod A')
    useLoadOrderStore.getState().addMod('Mod B')
    const [modA, modB] = useLoadOrderStore.getState().mods

    useLoadOrderStore.getState().removeMod(modA.id)

    const { mods } = useLoadOrderStore.getState()
    expect(mods).toHaveLength(1)
    expect(mods[0].id).toBe(modB.id)
  })

  it('does nothing when the id does not exist', () => {
    useLoadOrderStore.getState().addMod('Mod A')

    useLoadOrderStore.getState().removeMod('unknown-id')

    expect(useLoadOrderStore.getState().mods).toHaveLength(1)
  })
})

describe('updateMod', () => {
  it('merges the given changes and refreshes updatedAt', async () => {
    useLoadOrderStore.getState().addMod('Mod A')
    const original = useLoadOrderStore.getState().mods[0]

    await new Promise((resolve) => setTimeout(resolve, 5))
    useLoadOrderStore
      .getState()
      .updateMod(original.id, { name: 'Mod A (renamed)', description: 'desc' })

    const updated = useLoadOrderStore.getState().mods[0]
    expect(updated.name).toBe('Mod A (renamed)')
    expect(updated.description).toBe('desc')
    expect(updated.categoryId).toBeNull()
    expect(updated.createdAt).toBe(original.createdAt)
    expect(updated.updatedAt).not.toBe(original.updatedAt)
  })
})

describe('reorderMods', () => {
  it('reassigns positions according to the given id order', () => {
    useLoadOrderStore.getState().addMod('Mod A')
    useLoadOrderStore.getState().addMod('Mod B')
    useLoadOrderStore.getState().addMod('Mod C')
    const [modA, modB, modC] = useLoadOrderStore.getState().mods

    useLoadOrderStore.getState().reorderMods([modC.id, modA.id, modB.id])

    const byId = new Map(
      useLoadOrderStore.getState().mods.map((mod) => [mod.id, mod.position]),
    )
    expect(byId.get(modC.id)).toBe(0)
    expect(byId.get(modA.id)).toBe(1)
    expect(byId.get(modB.id)).toBe(2)
  })
})

describe('addCategory', () => {
  it('creates a category with a new id and incremented order', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    useLoadOrderStore.getState().addCategory('Graphics', '#00ff00')

    const { categories } = useLoadOrderStore.getState()
    expect(categories).toHaveLength(2)
    expect(categories[0]).toMatchObject({
      name: 'Gameplay',
      color: '#ff0000',
      order: 0,
    })
    expect(categories[1]).toMatchObject({
      name: 'Graphics',
      color: '#00ff00',
      order: 1,
    })
    expect(categories[0].id).not.toBe(categories[1].id)
  })
})

describe('updateCategory', () => {
  it('merges the given changes', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    const category = useLoadOrderStore.getState().categories[0]

    useLoadOrderStore
      .getState()
      .updateCategory(category.id, { color: '#0000ff' })

    const updated = useLoadOrderStore.getState().categories[0]
    expect(updated.name).toBe('Gameplay')
    expect(updated.color).toBe('#0000ff')
  })
})

describe('resetAll', () => {
  it('clears all mods and categories', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    useLoadOrderStore.getState().addMod('Mod A')
    useLoadOrderStore.getState().addMod('Mod B')

    useLoadOrderStore.getState().resetAll()

    const state = useLoadOrderStore.getState()
    expect(state.mods).toHaveLength(0)
    expect(state.categories).toHaveLength(0)
  })

  it('refreshes meta.lastModified', async () => {
    useLoadOrderStore.getState().addMod('Mod A')
    const before = useLoadOrderStore.getState().meta.lastModified

    await new Promise((resolve) => setTimeout(resolve, 5))
    useLoadOrderStore.getState().resetAll()

    expect(useLoadOrderStore.getState().meta.lastModified).not.toBe(before)
  })
})

describe('removeCategory', () => {
  it('removes the category and clears categoryId on affected mods', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    const category = useLoadOrderStore.getState().categories[0]
    useLoadOrderStore.getState().addMod('Mod A')
    const mod = useLoadOrderStore.getState().mods[0]
    useLoadOrderStore.getState().updateMod(mod.id, { categoryId: category.id })

    useLoadOrderStore.getState().removeCategory(category.id)

    const state = useLoadOrderStore.getState()
    expect(state.categories).toHaveLength(0)
    expect(state.mods[0].categoryId).toBeNull()
  })

  it('leaves mods with a different category untouched', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    useLoadOrderStore.getState().addCategory('Graphics', '#00ff00')
    const [gameplay, graphics] = useLoadOrderStore.getState().categories
    useLoadOrderStore.getState().addMod('Mod A')
    const mod = useLoadOrderStore.getState().mods[0]
    useLoadOrderStore.getState().updateMod(mod.id, { categoryId: graphics.id })

    useLoadOrderStore.getState().removeCategory(gameplay.id)

    const state = useLoadOrderStore.getState()
    expect(state.categories).toEqual([graphics])
    expect(state.mods[0].categoryId).toBe(graphics.id)
  })
})
