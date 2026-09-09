import type { Category, Mod } from '../../store/types'

interface ModCardProps {
  mod: Mod
  category: Category | undefined
}

function ModCard({ mod, category }: ModCardProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <span className="truncate text-base font-medium text-neutral-100">
        {mod.name}
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
    </li>
  )
}

export default ModCard
