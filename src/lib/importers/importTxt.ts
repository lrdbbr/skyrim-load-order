import type { ParsedModRow } from './types'

/**
 * Parse un fichier .txt : une ligne = un nom de mod (les lignes vides sont
 * ignorées), dans l'ordre du fichier.
 */
export function importTxt(content: string): ParsedModRow[] {
  const rows = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((name) => ({ name }))

  if (rows.length === 0) {
    throw new Error('The text file is empty.')
  }

  return rows
}
