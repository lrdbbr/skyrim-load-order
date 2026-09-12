import { useLoadOrderStore } from '../../store/loadOrderStore'

function ModCounter() {
  const count = useLoadOrderStore((state) => state.mods.length)

  return (
    <span className="text-xs font-medium text-neutral-400">
      {count} mod{count === 1 ? '' : 's'}
    </span>
  )
}

export default ModCounter
