import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import type { Mod } from '../../store/types'

interface ModCardDetailsProps {
  mod: Mod
}

const DESCRIPTION_DEBOUNCE_MS = 300

function ModCardDetails({ mod }: ModCardDetailsProps) {
  const updateMod = useLoadOrderStore((state) => state.updateMod)
  const removeMod = useLoadOrderStore((state) => state.removeMod)
  const categories = useLoadOrderStore((state) => state.categories)

  const [description, setDescription] = useState(mod.description)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      `Supprimer "${mod.name}" du load order ? Cette action est irréversible.`,
    )
    if (confirmed) {
      removeMod(mod.id)
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
          placeholder="Notes, compatibilité, ordre d'installation..."
          className="w-full resize-y rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-400 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-300">Catégorie</span>
        <select
          value={mod.categoryId ?? ''}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 focus:border-neutral-400 focus:outline-none"
        >
          <option value="">Sans catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={handleDelete}
        className="self-start rounded-lg border border-red-900 bg-red-950 px-4 py-2.5 text-sm font-medium text-red-300"
      >
        Supprimer
      </button>
    </div>
  )
}

export default ModCardDetails
