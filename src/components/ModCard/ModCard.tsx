import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CategoryBadge from '../CategoryManager/CategoryBadge'
import { useInlineEdit } from '../../hooks/useInlineEdit'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import type { Category, Mod } from '../../store/types'
import { ICON_BUTTON } from '../ui/buttonStyles'
import { PencilIcon } from '../ui/icons'
import ModCardDetails from './ModCardDetails'

interface ModCardProps {
  mod: Mod
  category: Category | undefined
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-150 ${
        expanded ? 'rotate-180' : ''
      }`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function DragHandleIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle cx="7" cy="5" r="1.5" />
      <circle cx="13" cy="5" r="1.5" />
      <circle cx="7" cy="10" r="1.5" />
      <circle cx="13" cy="10" r="1.5" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="13" cy="15" r="1.5" />
    </svg>
  )
}

function ModCard({ mod, category }: ModCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateMod = useLoadOrderStore((state) => state.updateMod)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mod.id })

  const {
    isEditing: isEditingName,
    draft: nameDraft,
    setDraft: setNameDraft,
    start: startEditingName,
    commit: commitName,
    handleKeyDown: handleNameKeyDown,
  } = useInlineEdit({
    value: mod.name,
    onCommit: (value) =>
      updateMod(mod.id, { name: value.trim() || mod.name }),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const toggleExpanded = () => setIsExpanded((expanded) => !expanded)

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Ignore les touches qui remontent depuis un contrôle imbriqué (bouton
    // crayon, champ de saisie du nom) : seule la ligne elle-même, quand
    // elle a le focus, doit réagir à Entrée/Espace.
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleExpanded()
    }
  }

  const handleNameSubmit = (event: FormEvent) => {
    event.preventDefault()
    commitName()
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch rounded-xl border ${
        isDragging
          ? 'relative z-10 border-neutral-600 bg-neutral-800 opacity-80 shadow-xl'
          : `border-neutral-800 bg-neutral-900 ${mod.disabled ? 'disabled-card' : ''}`
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Réordonner ${mod.name}`}
        className="flex w-11 shrink-0 touch-none cursor-grab items-center justify-center rounded-l-xl text-neutral-500 hover:text-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent active:cursor-grabbing"
      >
        <DragHandleIcon />
      </button>

      <div className="min-w-0 flex-1">
        <div
          role="button"
          tabIndex={0}
          onClick={toggleExpanded}
          onKeyDown={handleRowKeyDown}
          aria-expanded={isExpanded}
          className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-tr-xl p-4 text-left transition-colors hover:bg-neutral-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
            isExpanded ? '' : 'rounded-br-xl'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <ChevronIcon expanded={isExpanded} />
            {isEditingName ? (
              <form
                onSubmit={handleNameSubmit}
                onClick={(event) => event.stopPropagation()}
                className="min-w-0 flex-1"
              >
                <input
                  autoFocus
                  type="text"
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  onBlur={commitName}
                  onKeyDown={handleNameKeyDown}
                  onFocus={(event) => event.target.select()}
                  aria-label={`Nom de ${mod.name}`}
                  className="w-full min-w-0 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-0.5 text-base text-neutral-100 focus:border-accent focus:outline-none"
                />
              </form>
            ) : (
              <>
                <span
                  className={`truncate text-base font-medium text-neutral-100 ${
                    mod.disabled ? 'italic' : ''
                  }`}
                >
                  {mod.name}
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    startEditingName()
                  }}
                  aria-label={`Modifier le nom de ${mod.name}`}
                  className={ICON_BUTTON}
                >
                  <PencilIcon />
                </button>
              </>
            )}
            {mod.disabled && (
              <span className="shrink-0 text-xs text-neutral-500">
                disabled
              </span>
            )}
          </span>
          <CategoryBadge category={category} />
        </div>

        {isExpanded && (
          <div
            className="animate-[card-details-in_150ms_ease-out] border-t border-neutral-800 p-4"
          >
            <ModCardDetails mod={mod} />
          </div>
        )}
      </div>
    </li>
  )
}

export default ModCard
