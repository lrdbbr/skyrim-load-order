import { getNextAvailableColor } from '../colors'
import { UNCATEGORIZED_LABEL } from '../exporters/exportRows'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import type { Mod } from '../../store/types'
import type { ParsedModRow } from './types'

export type { ParsedModRow } from './types'
export { importTxt } from './importTxt'
export { importCsv } from './importCsv'
export { importXlsx } from './importXlsx'

export type ImportMode = 'append' | 'replace'

export interface ImportSummary {
  modsImported: number
  categoriesCreated: number
}

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function normalizeColor(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return HEX_COLOR_PATTERN.test(withHash) ? withHash : undefined
}

/**
 * Le libellé "Sans catégorie" écrit par nos propres exports ne doit pas être
 * réimporté comme une vraie catégorie : sans ce garde-fou, exporter puis
 * réimporter un mod sans catégorie créerait une catégorie "Sans catégorie".
 */
function resolveCategoryName(row: ParsedModRow): string | undefined {
  const name = row.category?.trim()
  if (!name || name.toLowerCase() === UNCATEGORIZED_LABEL.toLowerCase()) {
    return undefined
  }
  return name
}

/**
 * Résume un import avant confirmation : nombre de mods et de catégories qui
 * seraient créées (les catégories déjà existantes, par nom, sont réutilisées).
 */
export function summarizeImport(rows: ParsedModRow[]): ImportSummary {
  const existingNames = new Set(
    useLoadOrderStore
      .getState()
      .categories.map((category) => category.name.toLowerCase()),
  )
  const newCategoryNames = new Set<string>()

  for (const row of rows) {
    const name = resolveCategoryName(row)
    if (name && !existingNames.has(name.toLowerCase())) {
      newCategoryNames.add(name.toLowerCase())
    }
  }

  return { modsImported: rows.length, categoriesCreated: newCategoryNames.size }
}

function findOrCreateCategory(name: string, color: string | undefined): string {
  const state = useLoadOrderStore.getState()
  const existing = state.categories.find(
    (category) => category.name.toLowerCase() === name.toLowerCase(),
  )
  if (existing) return existing.id

  const usedColors = state.categories.map((category) => category.color)
  const resolvedColor =
    normalizeColor(color) ?? getNextAvailableColor(usedColors)

  state.addCategory(name, resolvedColor)
  const created = useLoadOrderStore.getState().categories.at(-1)
  return created?.id ?? ''
}

/**
 * Applique le résultat d'un des parseurs (importTxt/importCsv/importXlsx) au
 * store : crée ou retrouve les catégories par nom, puis crée les mods.
 */
export function applyImport(rows: ParsedModRow[], mode: ImportMode): void {
  const store = useLoadOrderStore.getState()

  if (mode === 'replace') {
    for (const mod of [...store.mods]) {
      store.removeMod(mod.id)
    }
  }

  for (const row of rows) {
    const categoryName = resolveCategoryName(row)
    const categoryId = categoryName
      ? findOrCreateCategory(categoryName, row.color)
      : null

    store.addMod(row.name)
    const createdMod = useLoadOrderStore.getState().mods.at(-1)
    if (!createdMod) continue

    const changes: Partial<Pick<Mod, 'description' | 'categoryId'>> = {}
    if (row.description) changes.description = row.description
    if (categoryId) changes.categoryId = categoryId

    if (Object.keys(changes).length > 0) {
      store.updateMod(createdMod.id, changes)
    }
  }
}
