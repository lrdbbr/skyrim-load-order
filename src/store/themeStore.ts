import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'nordique' | 'imperial' | 'aurore' | 'parchemin'

interface ThemeInfo {
  id: ThemeId
  label: string
  description: string
  accent: string
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'nordique',
    label: 'Nordique',
    description: 'Sombre, bleu glacier',
    accent: '#276bb9',
  },
  {
    id: 'imperial',
    label: 'Impérial',
    description: 'Sombre, or bronze',
    accent: '#986816',
  },
  {
    id: 'aurore',
    label: 'Aurore',
    description: 'Clair, vert aurore',
    accent: '#0e6659',
  },
  {
    id: 'parchemin',
    label: 'Parchemin',
    description: 'Clair, encre brune',
    accent: '#7a4a1f',
  },
]

const DEFAULT_THEME: ThemeId = 'nordique'
const THEME_IDS: readonly string[] = THEMES.map((info) => info.id)

interface ThemeState {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'skyrim-load-order:theme',
      // Retombe sur le thème par défaut si la valeur persistée ne
      // correspond plus à un thème connu (ex. un thème renommé/retiré
      // depuis la dernière visite).
      merge: (persisted, current) => {
        const persistedTheme = (persisted as Partial<ThemeState> | null)
          ?.theme
        return {
          ...current,
          theme: THEME_IDS.includes(persistedTheme as string)
            ? (persistedTheme as ThemeId)
            : DEFAULT_THEME,
        }
      },
    },
  ),
)
