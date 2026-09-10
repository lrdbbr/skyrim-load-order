import { useEffect, useState, type FormEvent } from 'react'
import { useLoadOrderStore } from '../../store/loadOrderStore'

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
        aria-label="Confirmer la réinitialisation"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full flex-col gap-4 rounded-t-2xl bg-neutral-900 p-5 sm:max-w-[440px] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-red-300">
            Réinitialiser le load order
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-neutral-400 hover:text-neutral-100"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-neutral-300">
          Cette action supprime <strong>définitivement</strong> tous les mods et
          toutes les catégories. Elle est <strong>irréversible</strong> : les
          données ne pourront pas être récupérées, sauf si vous avez exporté une
          sauvegarde au préalable.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-sm text-neutral-300">
            Tapez{' '}
            <span className="font-mono font-semibold text-neutral-100">
              {CONFIRM_WORD}
            </span>{' '}
            pour confirmer
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              aria-label={`Tapez ${CONFIRM_WORD} pour confirmer`}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 focus:border-red-500 focus:outline-none"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isConfirmed}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              Tout réinitialiser
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetConfirmModal
