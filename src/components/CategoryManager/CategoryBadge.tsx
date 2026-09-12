import { getContrastingTextColor } from '../../lib/colors'
import type { Category } from '../../store/types'

interface CategoryBadgeProps {
  category: Category | undefined
}

function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-300">
        Uncategorized
      </span>
    )
  }

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        backgroundColor: category.color,
        color: getContrastingTextColor(category.color),
      }}
    >
      {category.name}
    </span>
  )
}

export default CategoryBadge
