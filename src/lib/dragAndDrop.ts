import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'

/**
 * Calcule le nouvel ordre des ids à partir d'un événement de fin de drag
 * dnd-kit. Séparé du composant pour être testable sans simuler un vrai
 * glisser-déposer (il suffit de passer un objet { active, over }).
 */
export function getReorderedModIds(
  modIds: string[],
  event: Pick<DragEndEvent, 'active' | 'over'>,
): string[] | null {
  const { active, over } = event
  if (!over || active.id === over.id) return null

  const oldIndex = modIds.indexOf(String(active.id))
  const newIndex = modIds.indexOf(String(over.id))
  if (oldIndex === -1 || newIndex === -1) return null

  return arrayMove(modIds, oldIndex, newIndex)
}
