import { useEffect, useRef, useState, type FormEvent } from 'react'
import CategoryManager from '../CategoryManager/CategoryManager'
import ExportMenu from '../ImportExport/ExportMenu'
import ImportButton from '../ImportExport/ImportButton'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import { DANGER_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from '../ui/buttonStyles'
import SaveIndicator from './SaveIndicator'
import ResetConfirmModal from './ResetConfirmModal'
import ThemeSwitcher from './ThemeSwitcher'

function Toolbar() {
  const addMod = useLoadOrderStore((state) => state.addMod)
  const [isAddingMod, setIsAddingMod] = useState(false)
  const [modName, setModName] = useState('')
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const modNameInputRef = useRef<HTMLInputElement>(null)

  const cancelAddMod = () => {
    setIsAddingMod(false)
    setModName('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = modName.trim()
    if (!trimmedName) return
    addMod(trimmedName)
    setModName('')
    modNameInputRef.current?.focus()
  }

  useEffect(() => {
    if (!isAddingMod) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancelAddMod()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAddingMod])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAddingMod(true)}
          className={PRIMARY_BUTTON}
        >
          + Add mod
        </button>
        <button
          type="button"
          onClick={() => setIsCategoryManagerOpen(true)}
          className={SECONDARY_BUTTON}
        >
          Categories
        </button>
        <ImportButton />
        <ExportMenu />
        <ThemeSwitcher />
        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className={DANGER_BUTTON}
        >
          Reset
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
            ref={modNameInputRef}
            autoFocus
            type="text"
            value={modName}
            onChange={(event) => setModName(event.target.value)}
            placeholder="Mod name"
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-400 focus:border-accent focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 sm:flex-none ${PRIMARY_BUTTON}`}
            >
              Add
            </button>
            <button
              type="button"
              onClick={cancelAddMod}
              className={`flex-1 sm:flex-none ${SECONDARY_BUTTON}`}
            >
              Cancel
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
