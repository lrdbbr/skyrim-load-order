import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const DEFAULT_TITLE = 'Skyrim Load Order'

interface TitleState {
  title: string
  setTitle: (title: string) => void
}

export const useTitleStore = create<TitleState>()(
  persist(
    (set) => ({
      title: DEFAULT_TITLE,
      setTitle: (title) => set({ title: title.trim() || DEFAULT_TITLE }),
    }),
    { name: 'skyrim-load-order:title' },
  ),
)
