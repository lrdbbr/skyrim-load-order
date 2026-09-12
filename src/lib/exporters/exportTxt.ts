import type { Mod } from '../../store/types'

/**
 * Génère un texte brut, un nom de mod par ligne, dans l'ordre du load order.
 * Les mods désactivés sont exclus.
 */
export function exportTxt(mods: Mod[]): string {
  const names = mods
    .filter((mod) => !mod.disabled)
    .sort((a, b) => a.position - b.position)
    .map((mod) => mod.name)

  return names.length > 0 ? names.join('\n') + '\n' : ''
}
