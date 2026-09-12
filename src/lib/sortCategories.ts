import type { Category } from '../store/types'

/**
 * Trie les catégories par nom (ordre alphabétique, insensible à la casse et
 * aux accents), pour un affichage stable partout où elles sont listées
 * (gestion des catégories, liste déroulante d'un mod...), indépendamment de
 * leur ordre de création (`Category.order`).
 */
export function sortCategoriesByName<T extends Pick<Category, 'name'>>(
  categories: T[],
): T[] {
  return [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  )
}
