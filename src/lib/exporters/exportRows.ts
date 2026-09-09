import type { Category, Mod } from '../../store/types'

export const EXPORT_COLUMNS = [
  'Name',
  'Category',
  'Color',
  'Description',
] as const

/**
 * Libellé écrit dans la colonne Category des exports quand un mod n'a pas de
 * catégorie. Traité comme équivalent à "pas de catégorie" à la réimport
 * (voir lib/importers), pour que l'aller-retour export→import soit fidèle.
 */
export const UNCATEGORIZED_LABEL = 'Sans catégorie'

export interface ExportRow {
  Name: string
  Category: string
  Color: string
  Description: string
}

/**
 * Trie les mods par position et résout le nom/couleur de catégorie depuis
 * categoryId (jamais l'id brut), "Sans catégorie" si categoryId est null.
 * Logique commune aux trois exporteurs (txt/csv/xlsx).
 */
export function buildExportRows(
  mods: Mod[],
  categories: Category[],
): ExportRow[] {
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  )

  return [...mods]
    .sort((a, b) => a.position - b.position)
    .map((mod) => {
      const category = mod.categoryId
        ? categoryById.get(mod.categoryId)
        : undefined
      return {
        Name: mod.name,
        Category: category ? category.name : UNCATEGORIZED_LABEL,
        Color: category ? category.color : '',
        Description: mod.description,
      }
    })
}
