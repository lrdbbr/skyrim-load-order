import { useEffect, useState, type FormEvent } from 'react'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import {
  DANGER_SOLID_BUTTON,
  ICON_BUTTON,
  SECONDARY_BUTTON,
} from '../ui/buttonStyles'

interface ResetConfirmModalProps {
  onClose: () => void
}

const CONFIRM_WORD = 'RESET'

function ResetConfirmModal({ onClose }: ResetConfirmModalProps) {
  const resetAll = useLoadOrderStore((state) => state.resetAll)
  const [confirmText, setConfirmText] = useState('')

  const isConfirmed = confirmText.trim().toUpperCase() === CONFIRM_WORD

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isConfirmed) return
    resetAll()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm reset"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full flex-col gap-4 rounded-t-2xl bg-neutral-900 p-5 sm:max-w-[440px] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-danger">
            Reset the load order
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={ICON_BUTTON}
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-neutral-300">
          This action <strong>permanently</strong> deletes all mods and
          categories. It is <strong>irreversible</strong>: the data cannot be
          recovered unless you exported a backup beforehand.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-sm text-neutral-300">
            Type{' '}
            <span className="font-mono font-semibold text-neutral-100">
              {CONFIRM_WORD}
            </span>{' '}
            to confirm
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              aria-label={`Type ${CONFIRM_WORD} to confirm`}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 focus:border-red-500 focus:outline-none"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isConfirmed}
              className={`flex-1 ${DANGER_SOLID_BUTTON}`}
            >
              Reset everything
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 ${SECONDARY_BUTTON}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetConfirmModal
