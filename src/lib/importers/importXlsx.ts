import { findColumnMapping, rowToParsedMod } from './columnMapping'
import type { ParsedModRow } from './types'

/**
 * Lit la première feuille d'un fichier .xls/.xlsx, avec la même logique de
 * détection de colonnes que importCsv. La librairie xlsx (volumineuse) est
 * chargée à la demande pour ne pas alourdir le bundle initial.
 */
export async function importXlsx(data: ArrayBuffer): Promise<ParsedModRow[]> {
  const XLSX = await import('xlsx')

  let workbook: ReturnType<typeof XLSX.read>

  try {
    workbook = XLSX.read(data, { type: 'array' })
  } catch {
    throw new Error('The Excel file is unreadable or corrupted.')
  }

  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) {
    throw new Error('The Excel workbook contains no sheets.')
  }

  const sheet = workbook.Sheets[firstSheetName]
  const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  })

  if (sheetRows.length === 0) {
    throw new Error('The Excel sheet is empty.')
  }

  const headers = Object.keys(sheetRows[0])
  const mapping = findColumnMapping(headers)

  const rows = sheetRows
    .map((row) => rowToParsedMod(row, mapping))
    .filter((row): row is ParsedModRow => row !== null)

  if (rows.length === 0) {
    throw new Error('No mods found in the Excel file.')
  }

  return rows
}
