import { describe, expect, it } from 'vitest'
import {
  CATEGORY_COLOR_PALETTE,
  getContrastingTextColor,
  getContrastRatio,
} from './colors'

const WCAG_AA_NORMAL_TEXT = 4.5

describe('getContrastRatio', () => {
  it('returns 21:1 for black on white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })

  it('returns 1:1 for identical colors', () => {
    expect(getContrastRatio('#737373', '#737373')).toBeCloseTo(1, 5)
  })

  it('is symmetric regardless of argument order', () => {
    const a = getContrastRatio('#ef4444', '#000000')
    const b = getContrastRatio('#000000', '#ef4444')
    expect(a).toBeCloseTo(b, 5)
  })
})

describe('getContrastingTextColor meets WCAG AA for every category color', () => {
  it.each(CATEGORY_COLOR_PALETTE)(
    'chooses a text color with a ≥4.5:1 ratio against %s',
    (backgroundColor) => {
      const textColor = getContrastingTextColor(backgroundColor)
      const ratio = getContrastRatio(textColor, backgroundColor)
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT)
    },
  )
})

/**
 * Vérifications de contraste WCAG AA (4.5:1) pour le texte normal utilisé
 * ailleurs dans l'app (Phase 9), sur les teintes neutres fixes de Tailwind
 * (non exposées par lib/colors.ts, donc vérifiées ici directement) :
 *
 * - text-neutral-100 (#f5f5f5) sur bg-neutral-900/950 : ~19:1 — OK
 * - text-neutral-300 (#d4d4d4) sur bg-neutral-900/950 : ~11-13:1 — OK
 * - text-neutral-400 (#a3a3a3) sur bg-neutral-900/950 : ~7-8:1 — OK
 *   (utilisé pour les textes discrets : placeholders, états vides,
 *   indicateur "Sauvegardé")
 * - text-red-200/300 sur bg-red-950 ou bg-neutral-950 : ~8-11:1 — OK
 * - texte blanc sur bg-red-600 (bouton "Tout réinitialiser") : ~4.8:1 — OK
 *
 * text-neutral-500 (#737373) sur bg-neutral-950 (#0a0a0a) ne passait PAS ce
 * seuil (~4.2:1) : tous les usages de texte informatif en neutral-500 ont
 * été remplacés par neutral-400 lors de la Phase 9.
 *
 * Ces teintes ne sont pas ré-exposées par lib/colors.ts (propre aux couleurs
 * de catégorie), d'où cette note manuelle plutôt qu'un test automatisé.
 */
