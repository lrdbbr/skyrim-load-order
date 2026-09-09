import type { ParsedModRow } from './types'

export interface ColumnMapping {
  name: string | null
  category: string | null
  color: string | null
  description: string | null
}

type MappedField = keyof ColumnMapping

const COLUMN_ALIASES: Record<MappedField, string[]> = {
  name: ['name', 'nom', 'mod', 'mod name', 'nom du mod'],
  category: ['category', 'categorie', 'categorie du mod'],
  color: ['color', 'colour', 'couleur'],
  description: ['description', 'desc', 'notes'],
}

function stripDiacritics(value: string): string {
  let result = ''
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0
    if (code < 0x0300 || code > 0x036f) result += char
  }
  return result
}

function normalizeHeader(header: string): string {
  return stripDiacritics(header.normalize('NFD')).trim().toLowerCase()
}

/**
 * Détecte, parmi les en-têtes d'un fichier CSV/XLSX, lesquelles correspondent
 * aux colonnes Name/Category/Color/Description (insensible à la casse et aux
 * accents, tolère les variantes FR/EN). Si aucune colonne "Name" n'est
 * trouvée, la première colonne du fichier est utilisée comme nom.
 */
export function findColumnMapping(headers: string[]): ColumnMapping {
  const normalizedHeaders = headers.map((header) => ({
    header,
    normalized: normalizeHeader(header),
  }))

  const mapping: ColumnMapping = {
    name: null,
    category: null,
    color: null,
    description: null,
  }

  for (const field of Object.keys(COLUMN_ALIASES) as MappedField[]) {
    const match = normalizedHeaders.find(({ normalized }) =>
      COLUMN_ALIASES[field].includes(normalized),
    )
    if (match) mapping[field] = match.header
  }

  if (!mapping.name && headers.length > 0) {
    mapping.name = headers[0]
  }

  return mapping
}

function readString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/**
 * Convertit une ligne brute (CSV ou XLSX) en ParsedModRow à partir du mapping
 * de colonnes détecté. Retourne null si la ligne n'a pas de nom exploitable.
 */
export function rowToParsedMod(
  row: Record<string, unknown>,
  mapping: ColumnMapping,
): ParsedModRow | null {
  const name = mapping.name ? readString(row[mapping.name]) : undefined
  if (!name) return null

  return {
    name,
    category: mapping.category ? readString(row[mapping.category]) : undefined,
    color: mapping.color ? readString(row[mapping.color]) : undefined,
    description: mapping.description
      ? readString(row[mapping.description])
      : undefined,
  }
}
