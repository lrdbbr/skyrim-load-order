import { useState, type FormEvent } from 'react'
import CategoryManager from '../CategoryManager/CategoryManager'
import ExportMenu from '../ImportExport/ExportMenu'
import ImportButton from '../ImportExport/ImportButton'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import SaveIndicator from './SaveIndicator'
import ResetConfirmModal from './ResetConfirmModal'

function Toolbar() {
  const addMod = useLoadOrderStore((state) => state.addMod)
  const [isAddingMod, setIsAddingMod] = useState(false)
  const [modName, setModName] = useState('')
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const cancelAddMod = () => {
    setIsAddingMod(false)
    setModName('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = modName.trim()
    if (!trimmedName) return
    addMod(trimmedName)
    cancelAddMod()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAddingMod(true)}
          className="rounded-lg bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900"
        >
          + Ajouter un mod
        </button>
        <button
          type="button"
          onClick={() => setIsCategoryManagerOpen(true)}
          className="rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-100"
        >
          Catégories
        </button>
        <ImportButton />
        <ExportMenu />
        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="rounded-lg border border-red-900 px-4 py-3 text-sm font-medium text-red-300"
        >
          Réinitialiser
        </button>
        <span className="sm:ml-auto">
          <SaveIndicator />
        </span>
      </div>

      {isAddingMod && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            autoFocus
            type="text"
            value={modName}
            onChange={(event) => setModName(event.target.value)}
            placeholder="Nom du mod"
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900 sm:flex-none"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={cancelAddMod}
              className="flex-1 rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 sm:flex-none"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {isCategoryManagerOpen && (
        <CategoryManager onClose={() => setIsCategoryManagerOpen(false)} />
      )}

      {isResetModalOpen && (
        <ResetConfirmModal onClose={() => setIsResetModalOpen(false)} />
      )}
    </div>
  )
}

export default Toolbar
