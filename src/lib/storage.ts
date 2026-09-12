import { createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { LoadOrderState, Mod } from '../store/types'

const STORAGE_PROBE_KEY = '__skyrim_load_order_storage_probe__'

function probeLocalStorage(): boolean {
  try {
    window.localStorage.setItem(STORAGE_PROBE_KEY, '1')
    window.localStorage.removeItem(STORAGE_PROBE_KEY)
    return true
  } catch {
    return false
  }
}

/**
 * Résultat figé au chargement du module : couvre le cas de la navigation
 * privée stricte (Safari iOS notamment) où `localStorage` existe mais lève
 * une exception dès le premier accès.
 */
export const isLocalStorageAvailable = probeLocalStorage()

type WriteErrorListener = () => void
const writeErrorListeners = new Set<WriteErrorListener>()

export function onStorageWriteError(listener: WriteErrorListener): () => void {
  writeErrorListeners.add(listener)
  return () => writeErrorListeners.delete(listener)
}

function notifyWriteError() {
  writeErrorListeners.forEach((listener) => listener())
}

/**
 * Wrapper autour de `localStorage` qui n'echoue jamais silencieusement côté
 * app : toute erreur (quota dépassé, accès refusé) est interceptée et
 * signalée aux écouteurs, sans faire planter le store.
 */
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value)
    } catch (error) {
      console.warn(
        '[skyrim-load-order] Échec de la sauvegarde dans le localStorage (quota dépassé ou stockage inaccessible).',
        error,
      )
      notifyWriteError()
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name)
    } catch {
      // ignore
    }
  },
}

export const safeJsonStorage = createJSONStorage(() => safeLocalStorage)

/**
 * Migration du schéma persisté vers `targetVersion`, appelée par Zustand au
 * chargement si la version stockée diffère. Actuellement : ajoute `disabled`
 * (schema v2) aux mods sauvegardés avant son introduction, sans toucher au
 * reste des données.
 */
export function migrateLoadOrderState(
  persisted: unknown,
  targetVersion: number,
): Pick<LoadOrderState, 'mods' | 'categories' | 'meta'> {
  const state = (persisted ?? {}) as Partial<LoadOrderState>
  const mods = Array.isArray(state.mods) ? (state.mods as Mod[]) : []
  const categories = Array.isArray(state.categories) ? state.categories : []

  return {
    mods: mods.map((mod) => ({ ...mod, disabled: mod.disabled ?? false })),
    categories,
    meta: {
      schemaVersion: targetVersion,
      lastModified: state.meta?.lastModified ?? new Date().toISOString(),
    },
  }
}

/**
 * Lecture brute synchrone, indépendante de l'hydratation du store Zustand,
 * pour savoir dès le chargement du module si une session précédente existe.
 */
export function hasPersistedData(key: string): boolean {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return false
    const parsed = JSON.parse(raw) as {
      state?: { mods?: unknown[]; categories?: unknown[] }
    }
    const state = parsed.state
    return Boolean(state?.mods?.length || state?.categories?.length)
  } catch {
    return false
  }
}
