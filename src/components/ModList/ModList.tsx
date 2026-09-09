import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { getReorderedModIds } from '../../lib/dragAndDrop'
import ModCard from '../ModCard/ModCard'
import { useLoadOrderStore } from '../../store/loadOrderStore'

function ModList() {
  const mods = useLoadOrderStore((state) => state.mods)
  const categories = useLoadOrderStore((state) => state.categories)
  const reorderMods = useLoadOrderStore((state) => state.reorderMods)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 75, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

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
  const modIds = sortedMods.map((mod) => mod.id)

  const handleDragEnd = (event: DragEndEvent) => {
    const newOrder = getReorderedModIds(modIds, event)
    if (newOrder) reorderMods(newOrder)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={modIds} strategy={verticalListSortingStrategy}>
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
      </SortableContext>
    </DndContext>
  )
}

export default ModList
