export const PRIMARY_BUTTON =
  'cursor-pointer rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export const SECONDARY_BUTTON =
  'cursor-pointer rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-100 transition-colors hover:border-neutral-600 hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export const DANGER_BUTTON =
  'cursor-pointer rounded-lg border border-red-900 px-4 py-3 text-sm font-medium text-danger transition-colors hover:border-red-700 hover:bg-danger-hover-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'

// Variante pleine, pour les actions de suppression directe et immédiate
// (pas de confirmation via modale) : plus affirmée que DANGER_BUTTON.
export const DANGER_FILLED_BUTTON =
  'cursor-pointer rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:border-red-700 hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'

export const DANGER_SOLID_BUTTON =
  'cursor-pointer rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-300 disabled:hover:bg-neutral-700'

export const ICON_BUTTON =
  'flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
