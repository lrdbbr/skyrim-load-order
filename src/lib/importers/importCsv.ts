import Papa from 'papaparse'
import { findColumnMapping, rowToParsedMod } from './columnMapping'
import type { ParsedModRow } from './types'

/**
 * Parse un CSV avec en-têtes. Détecte les colonnes Name/Category/Color/
 * Description (insensible à la casse, tolère les variantes FR/EN). Si
 * aucune colonne "Name" n'est trouvée, la première colonne sert de nom.
 */
export function importCsv(content: string): ParsedModRow[] {
  if (!content.trim()) {
    throw new Error('Le fichier CSV est vide.')
  }

  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  })

  const headers = result.meta.fields ?? []
  if (headers.length === 0) {
    throw new Error('Le fichier CSV est vide ou illisible.')
  }

  const mapping = findColumnMapping(headers)

  const rows = result.data
    .map((row) => rowToParsedMod(row, mapping))
    .filter((row): row is ParsedModRow => row !== null)

  if (rows.length === 0) {
    throw new Error('Aucun mod trouvé dans le fichier CSV.')
  }

  return rows
}
