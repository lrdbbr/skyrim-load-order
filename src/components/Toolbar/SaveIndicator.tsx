import { useEffect, useRef, useState } from 'react'
import { useLoadOrderStore } from '../../store/loadOrderStore'
import { useHasHydrated } from '../../hooks/useHasHydrated'

const SHOW_DEBOUNCE_MS = 600
const HIDE_AFTER_MS = 2000

function SaveIndicator() {
  const lastModified = useLoadOrderStore((state) => state.meta.lastModified)
  const storageAvailable = useLoadOrderStore((state) => state.storageAvailable)
  const storageWriteError = useLoadOrderStore(
    (state) => state.storageWriteError,
  )
  const hasHydrated = useHasHydrated()

  const [showSaved, setShowSaved] = useState(false)
  const previousLastModified = useRef<string | null>(null)
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!hasHydrated) return

    // Le premier passage après hydratation correspond au chargement des
    // données persistées, pas à une modification de l'utilisateur.
    if (previousLastModified.current === null) {
      previousLastModified.current = lastModified
      return
    }
    if (previousLastModified.current === lastModified) return
    previousLastModified.current = lastModified

    if (!storageAvailable || storageWriteError) return

    clearTimeout(showTimeoutRef.current)
    clearTimeout(hideTimeoutRef.current)

    showTimeoutRef.current = setTimeout(() => {
      setShowSaved(true)
      hideTimeoutRef.current = setTimeout(
        () => setShowSaved(false),
        HIDE_AFTER_MS,
      )
    }, SHOW_DEBOUNCE_MS)
  }, [lastModified, hasHydrated, storageAvailable, storageWriteError])

  useEffect(
    () => () => {
      clearTimeout(showTimeoutRef.current)
      clearTimeout(hideTimeoutRef.current)
    },
    [],
  )

  if (!storageAvailable || storageWriteError) {
    return (
      <span
        role="status"
        aria-live="polite"
        className="text-xs font-medium text-red-400"
      >
        Sauvegarde impossible (stockage plein ou inaccessible)
      </span>
    )
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className={`text-xs font-medium text-neutral-500 transition-opacity duration-300 ${
        showSaved ? 'opacity-100' : 'opacity-0'
      }`}
    >
      Sauvegardé
    </span>
  )
}

export default SaveIndicator
