import type { Category, Mod } from '../../store/types'
import { buildExportRows, EXPORT_COLUMNS } from './exportRows'

/**
 * Génère un classeur .xlsx (mêmes colonnes que le CSV) dans une feuille
 * "Load Order". La librairie xlsx (volumineuse) est chargée à la demande.
 *
 * Note : la coloration de fond de la cellule "Category" selon la couleur de
 * la catégorie n'est pas implémentée — la version gratuite de la librairie
 * xlsx n'écrit pas les styles de cellule dans le fichier généré (fonctionnalité
 * réservée à la version payante SheetJS Pro), ça n'aurait donc aucun effet
 * visible dans le fichier exporté.
 */
export async function exportXlsx(
  mods: Mod[],
  categories: Category[],
): Promise<ArrayBuffer> {
  const XLSX = await import('xlsx')
  const rows = buildExportRows(mods, categories)

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [...EXPORT_COLUMNS],
  })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Load Order')

  return XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx',
  }) as ArrayBuffer
}
