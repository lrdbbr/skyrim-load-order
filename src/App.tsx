import { useState, type FormEvent } from 'react'
import ModList from './components/ModList/ModList'
import { useLoadOrderStore } from './store/loadOrderStore'

function App() {
  const addMod = useLoadOrderStore((state) => state.addMod)
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')

  const cancelAdd = () => {
    setIsAdding(false)
    setName('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    addMod(trimmedName)
    cancelAdd()
  }

  return (
    <div className="min-h-svh bg-neutral-950 px-4 py-6 text-neutral-100 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Skyrim Load Order
        </h1>

        {isAdding ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nom du mod"
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-400 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900 sm:flex-none"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={cancelAdd}
                className="flex-1 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 sm:flex-none"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="self-start rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900"
          >
            + Ajouter un mod
          </button>
        )}

        <ModList />
      </div>
    </div>
  )
}

export default App
