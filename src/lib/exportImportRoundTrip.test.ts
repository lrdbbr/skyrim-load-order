import { beforeEach, describe, expect, it } from 'vitest'
import { exportCsv } from './exporters/exportCsv'
import { applyImport, importCsv } from './importers'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../store/loadOrderStore'
import type { Category, Mod } from '../store/types'

function resetStore() {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
}

function byPosition(mods: Mod[]): Mod[] {
  return [...mods].sort((a, b) => a.position - b.position)
}

function categoryNamesByColor(categories: Category[]) {
  return categories
    .map((category) => ({ name: category.name, color: category.color }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

beforeEach(() => {
  resetStore()
})

describe('export → import round-trip (CSV)', () => {
  it('reproduces the same mods, categories, colors, descriptions and order', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    useLoadOrderStore.getState().addCategory('Textures', '#22c55e')
    useLoadOrderStore.getState().addMod('Ordinator')
    useLoadOrderStore.getState().addMod("Tomato's Landscapes, AIO")
    useLoadOrderStore.getState().addMod('SkyUI')

    const [ordinator, tomatos] = useLoadOrderStore.getState().mods
    const [gameplay, textures] = useLoadOrderStore.getState().categories

    useLoadOrderStore.getState().updateMod(ordinator.id, {
      categoryId: gameplay.id,
      description: 'Overhaul complet, avec des "perks" personnalisés',
    })
    useLoadOrderStore
      .getState()
      .updateMod(tomatos.id, { categoryId: textures.id })
    // SkyUI reste volontairement "Sans catégorie"

    const originalMods = byPosition(useLoadOrderStore.getState().mods)
    const originalCategories = useLoadOrderStore.getState().categories
    const originalCategoryNameById = new Map(
      originalCategories.map((category) => [category.id, category.name]),
    )

    // Export puis réimport (mode "replace") dans un store vierge
    const csv = exportCsv(originalMods, originalCategories)
    const parsedRows = importCsv(csv)
    resetStore()
    applyImport(parsedRows, 'replace')

    const resultMods = byPosition(useLoadOrderStore.getState().mods)
    const resultCategories = useLoadOrderStore.getState().categories
    const resultCategoryNameById = new Map(
      resultCategories.map((category) => [category.id, category.name]),
    )

    expect(resultMods.map((mod) => mod.name)).toEqual(
      originalMods.map((mod) => mod.name),
    )
    expect(resultMods.map((mod) => mod.description)).toEqual(
      originalMods.map((mod) => mod.description),
    )
    expect(
      resultMods.map((mod) =>
        mod.categoryId ? resultCategoryNameById.get(mod.categoryId) : null,
      ),
    ).toEqual(
      originalMods.map((mod) =>
        mod.categoryId ? originalCategoryNameById.get(mod.categoryId) : null,
      ),
    )

    // Même ensemble de catégories (nom + couleur), l'id et l'ordre interne
    // n'ont pas à être identiques après un aller-retour fichier.
    expect(categoryNamesByColor(resultCategories)).toEqual(
      categoryNamesByColor(originalCategories),
    )
  })
})
