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
    <span className="inline-flex">
      {/*
        Indicateur visuel : le texte reste constant, seule l'opacité change.
        aria-hidden car une transition CSS sur un texte statique n'est jamais
        annoncée par un lecteur d'écran (le contenu ne change pas vraiment).
      */}
      <span
        aria-hidden="true"
        className={`text-xs font-medium text-neutral-400 transition-opacity duration-300 ${
          showSaved ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Sauvegardé
      </span>
      {/*
        Région live séparée, visuellement masquée : son contenu apparaît et
        disparaît réellement, ce qui déclenche l'annonce par le lecteur
        d'écran (poliment, sans interrompre l'utilisateur).
      */}
      <span role="status" aria-live="polite" className="sr-only">
        {showSaved ? 'Modifications enregistrées automatiquement.' : ''}
      </span>
    </span>
  )
}

export default SaveIndicator
