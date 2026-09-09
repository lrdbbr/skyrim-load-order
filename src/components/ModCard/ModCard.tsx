import { useState } from 'react'
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

function ModCard({ mod, category }: ModCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <li className="rounded-xl border border-neutral-800 bg-neutral-900">
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <ChevronIcon expanded={isExpanded} />
          <span className="truncate text-base font-medium text-neutral-100">
            {mod.name}
          </span>
        </span>
        {category ? (
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-neutral-950"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-300">
            Sans catégorie
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-neutral-800 p-4">
          <ModCardDetails mod={mod} />
        </div>
      )}
    </li>
  )
}

export default ModCard
