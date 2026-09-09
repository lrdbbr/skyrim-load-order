import ModCard from '../ModCard/ModCard'
import { useLoadOrderStore } from '../../store/loadOrderStore'

function ModList() {
  const mods = useLoadOrderStore((state) => state.mods)
  const categories = useLoadOrderStore((state) => state.categories)

  if (mods.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-500">
        Aucun mod pour l'instant.
      </p>
    )
  }

  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  )
  const sortedMods = [...mods].sort((a, b) => a.position - b.position)

  return (
    <ul className="flex flex-col gap-3">
      {sortedMods.map((mod) => (
        <ModCard
          key={mod.id}
          mod={mod}
          category={
            mod.categoryId ? categoryById.get(mod.categoryId) : undefined
          }
        />
      ))}
    </ul>
  )
}

export default ModList
