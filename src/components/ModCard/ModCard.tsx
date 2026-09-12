import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CategoryBadge from '../CategoryManager/CategoryBadge'
import type { Category, Mod } from '../../store/types'
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mod.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch rounded-xl border ${
        isDragging
          ? 'relative z-10 border-neutral-600 bg-neutral-800 opacity-80 shadow-xl'
          : 'border-neutral-800 bg-neutral-900'
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Réordonner ${mod.name}`}
        className="flex w-11 shrink-0 touch-none cursor-grab items-center justify-center rounded-l-xl text-neutral-500 hover:text-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-400 active:cursor-grabbing"
      >
        <DragHandleIcon />
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          className={`flex w-full items-center justify-between gap-3 rounded-tr-xl p-4 text-left transition-colors hover:bg-neutral-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-400 ${
            isExpanded ? '' : 'rounded-br-xl'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <ChevronIcon expanded={isExpanded} />
            <span className="truncate text-base font-medium text-neutral-100">
              {mod.name}
            </span>
          </span>
          <CategoryBadge category={category} />
        </button>

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
