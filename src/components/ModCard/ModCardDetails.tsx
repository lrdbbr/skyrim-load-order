import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { sortCategoriesByName } from '../../lib/sortCategories'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import type { Mod } from '../../store/types'
import { DANGER_FILLED_BUTTON, SECONDARY_BUTTON } from '../ui/buttonStyles'

interface ModCardDetailsProps {
  mod: Mod
  position: number
  totalCount: number
}

const DESCRIPTION_DEBOUNCE_MS = 300

function ModCardDetails({ mod, position, totalCount }: ModCardDetailsProps) {
  const updateMod = useLoadOrderStore((state) => state.updateMod)
  const removeMod = useLoadOrderStore((state) => state.removeMod)
  const moveModToPosition = useLoadOrderStore(
    (state) => state.moveModToPosition,
  )
  const categories = useLoadOrderStore((state) => state.categories)
  const sortedCategories = sortCategoriesByName(categories)

  const [description, setDescription] = useState(mod.description)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [positionDraft, setPositionDraft] = useState(String(position))

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target
    setDescription(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateMod(mod.id, { description: value })
    }, DESCRIPTION_DEBOUNCE_MS)
  }

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    updateMod(mod.id, { categoryId: value === '' ? null : value })
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${mod.name}" from the load order? This action is irreversible.`,
    )
    if (confirmed) {
      removeMod(mod.id)
    }
  }

  const handleToggleDisabled = () => {
    updateMod(mod.id, { disabled: !mod.disabled })
  }

  const commitPosition = () => {
    const parsed = parseInt(positionDraft, 10)
    if (Number.isNaN(parsed)) {
      setPositionDraft(String(position))
      return
    }
    moveModToPosition(mod.id, parsed)
  }

  const handlePositionSubmit = (event: FormEvent) => {
    event.preventDefault()
    commitPosition()
  }

  const handlePositionKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      setPositionDraft(String(position))
      event.currentTarget.blur()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-300">
          Description
        </span>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          rows={3}
          placeholder="Notes, compatibility, install order..."
          className="w-full resize-y rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-400 focus:border-accent focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-300">Category</span>
        <select
          value={mod.categoryId ?? ''}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 focus:border-accent focus:outline-none"
        >
          <option value="">Uncategorized</option>
          {sortedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-300">
          Position ({totalCount} mod{totalCount === 1 ? '' : 's'})
        </span>
        <form onSubmit={handlePositionSubmit}>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={totalCount}
            value={positionDraft}
            onChange={(event) => setPositionDraft(event.target.value)}
            onBlur={commitPosition}
            onKeyDown={handlePositionKeyDown}
            onFocus={(event) => event.target.select()}
            aria-label={`Position of ${mod.name}`}
            className="w-24 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 focus:border-accent focus:outline-none"
          />
        </form>
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleToggleDisabled}
          className={SECONDARY_BUTTON}
        >
          {mod.disabled ? 'Enable' : 'Disable'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className={DANGER_FILLED_BUTTON}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ModCardDetails
