import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CATEGORY_COLOR_PALETTE, getNextAvailableColor } from '../../lib/colors'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import {
  DANGER_FILLED_BUTTON,
  ICON_BUTTON,
  PRIMARY_BUTTON,
} from '../ui/buttonStyles'
import CategoryBadge from './CategoryBadge'

interface CategoryManagerProps {
  onClose: () => void
}

function CategoryManager({ onClose }: CategoryManagerProps) {
  const categories = useLoadOrderStore((state) => state.categories)
  const addCategory = useLoadOrderStore((state) => state.addCategory)
  const updateCategory = useLoadOrderStore((state) => state.updateCategory)
  const removeCategory = useLoadOrderStore((state) => state.removeCategory)

  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState<string>(() =>
    getNextAvailableColor(categories.map((category) => category.color)),
  )

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = newName.trim()
    if (!trimmedName) return
    addCategory(trimmedName, newColor)
    setNewName('')
    setNewColor(
      getNextAvailableColor([
        ...categories.map((category) => category.color),
        newColor,
      ]),
    )
  }

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(
      `Supprimer la catégorie "${name}" ? Les mods associés repasseront en "Sans catégorie".`,
    )
    if (confirmed) removeCategory(id)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Gestion des catégories"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90svh] w-full flex-col gap-5 overflow-y-auto rounded-t-2xl bg-neutral-900 p-5 sm:max-w-[480px] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-100">Catégories</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className={ICON_BUTTON}
          >
            ✕
          </button>
        </div>

        {sortedCategories.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Aucune catégorie pour l'instant.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {sortedCategories.map((category) => (
              <li
                key={category.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-800 p-3"
              >
                <input
                  type="color"
                  value={category.color}
                  onChange={(event) =>
                    updateCategory(category.id, { color: event.target.value })
                  }
                  aria-label={`Couleur de ${category.name}`}
                  className="h-11 w-11 shrink-0 cursor-pointer rounded-full border border-neutral-700 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={category.name}
                  onChange={(event) =>
                    updateCategory(category.id, { name: event.target.value })
                  }
                  aria-label={`Nom de la catégorie ${category.name}`}
                  className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 focus:border-neutral-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(category.id, category.name)}
                  className={`shrink-0 ${DANGER_FILLED_BUTTON}`}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-3 border-t border-neutral-800 pt-4"
        >
          <span className="text-sm font-medium text-neutral-300">
            Nouvelle catégorie
          </span>

          <div className="flex gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(event) => setNewColor(event.target.value)}
              aria-label="Couleur de la nouvelle catégorie"
              className="h-11 w-11 shrink-0 cursor-pointer rounded-full border border-neutral-700 bg-transparent p-0"
            />
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Nom de la catégorie"
              aria-label="Nom de la nouvelle catégorie"
              className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLOR_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                aria-label={`Choisir la couleur ${color}`}
                aria-pressed={newColor === color}
                style={{ backgroundColor: color }}
                className={`h-11 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 ${
                  newColor === color
                    ? 'border-neutral-100'
                    : 'border-transparent'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <CategoryBadge
              category={{
                id: 'preview',
                name: newName || 'Aperçu',
                color: newColor,
                order: 0,
              }}
            />
            <button type="submit" className={`shrink-0 ${PRIMARY_BUTTON}`}>
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryManager
