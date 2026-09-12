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
    throw new Error('The CSV file is empty.')
  }

  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  })

  const headers = result.meta.fields ?? []
  if (headers.length === 0) {
    throw new Error('The CSV file is empty or unreadable.')
  }

  const mapping = findColumnMapping(headers)

  const rows = result.data
    .map((row) => rowToParsedMod(row, mapping))
    .filter((row): row is ParsedModRow => row !== null)

  if (rows.length === 0) {
    throw new Error('No mods found in the CSV file.')
  }

  return rows
}
