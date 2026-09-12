import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'nordic' | 'imperial' | 'aurora' | 'parchment'

interface ThemeInfo {
  id: ThemeId
  label: string
  description: string
  accent: string
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'nordic',
    label: 'Nordic',
    description: 'Dark, glacier blue',
    accent: '#276bb9',
  },
  {
    id: 'imperial',
    label: 'Imperial',
    description: 'Dark, bronze gold',
    accent: '#986816',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    description: 'Light, aurora green',
    accent: '#0e6659',
  },
  {
    id: 'parchment',
    label: 'Parchment',
    description: 'Light, brown ink',
    accent: '#7a4a1f',
  },
]

const DEFAULT_THEME: ThemeId = 'nordic'
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
