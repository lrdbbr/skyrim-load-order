const FALLBACK_SLUG = 'export'

/**
 * Convertit un titre libre en nom de fichier sûr : espaces remplacés par
 * des underscores, caractères interdits par Windows/macOS/Linux retirés,
 * underscores redondants réduits. La casse du titre est conservée.
 */
export function toFileNameSlug(title: string): string {
  const slug = title
    .trim()
    // eslint-disable-next-line no-control-regex -- caractères réellement interdits dans un nom de fichier
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')

  return slug || FALLBACK_SLUG
}
