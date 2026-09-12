import { useState, type KeyboardEvent } from 'react'

interface UseInlineEditOptions {
  value: string
  onCommit: (value: string) => void
}

/**
 * État commun à un texte modifiable sur place (titre de page, nom de mod...) :
 * bascule affichage/édition, brouillon local, validation (Entrée ou perte de
 * focus) et annulation (Échap) sans toucher à `value` tant que rien n'est
 * validé.
 */
export function useInlineEdit({ value, onCommit }: UseInlineEditOptions) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const start = () => {
    setDraft(value)
    setIsEditing(true)
  }

  const commit = () => {
    onCommit(draft)
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setIsEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      cancel()
    }
  }

  return { isEditing, draft, setDraft, start, commit, cancel, handleKeyDown }
}
