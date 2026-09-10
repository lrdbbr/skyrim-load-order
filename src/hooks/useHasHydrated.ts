import { useEffect, useState } from 'react'
import { useLoadOrderStore } from '../store/loadOrderStore'

/**
 * Distingue l'hydratation initiale depuis le localStorage des modifications
 * réelles faites par l'utilisateur, pour éviter d'afficher "Sauvegardé" au
 * chargement de la page.
 */
export function useHasHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(() =>
    useLoadOrderStore.persist.hasHydrated(),
  )

  useEffect(
    () =>
      useLoadOrderStore.persist.onFinishHydration(() => setHasHydrated(true)),
    [],
  )

  return hasHydrated
}
