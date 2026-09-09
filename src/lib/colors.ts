export const CATEGORY_COLOR_PALETTE = [
  '#ef4444', // rouge
  '#f97316', // orange
  '#eab308', // ambre
  '#22c55e', // vert
  '#10b981', // émeraude
  '#06b6d4', // cyan
  '#3b82f6', // bleu
  '#8b5cf6', // violet
  '#ec4899', // rose
  '#64748b', // ardoise
] as const

/**
 * Retourne la première couleur de la palette qui n'est pas déjà utilisée,
 * ou reboucle sur la palette si toutes les couleurs sont déjà prises.
 */
export function getNextAvailableColor(usedColors: readonly string[] = []) {
  const normalizedUsed = usedColors.map((color) => color.toLowerCase())
  const unused = CATEGORY_COLOR_PALETTE.find(
    (color) => !normalizedUsed.includes(color),
  )
  if (unused) return unused
  return CATEGORY_COLOR_PALETTE[
    usedColors.length % CATEGORY_COLOR_PALETTE.length
  ]
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '')
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized
  const value = parseInt(expanded, 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const srgb = channel / 255
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Choisit du texte noir ou blanc selon la luminance relative (WCAG) du fond,
 * pour garantir un contraste lisible quelle que soit la couleur de catégorie.
 */
export function getContrastingTextColor(
  backgroundColor: string,
): '#000000' | '#ffffff' {
  const luminance = relativeLuminance(hexToRgb(backgroundColor))
  return luminance > 0.5 ? '#000000' : '#ffffff'
}
