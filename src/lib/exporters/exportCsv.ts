import Papa from 'papaparse'
import type { Category, Mod } from '../../store/types'
import { buildExportRows, EXPORT_COLUMNS } from './exportRows'

/**
 * Génère un CSV (colonnes Name, Category, Color, Description) dans l'ordre
 * du load order. papaparse échappe par défaut les champs contenant des
 * virgules, guillemets ou retours à la ligne (RFC 4180).
 */
export function exportCsv(mods: Mod[], categories: Category[]): string {
  const rows = buildExportRows(mods, categories)
  return Papa.unparse(rows, { columns: [...EXPORT_COLUMNS] })
}
