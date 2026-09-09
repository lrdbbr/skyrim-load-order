import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Category, LoadOrderState, Mod } from './types'

const SCHEMA_VERSION = 1

export const initialLoadOrderState: LoadOrderState = {
  mods: [],
  categories: [],
  meta: {
    schemaVersion: SCHEMA_VERSION,
    lastModified: new Date(0).toISOString(),
  },
}

interface LoadOrderActions {
  addMod: (name: string) => void
  removeMod: (id: string) => void
  updateMod: (
    id: string,
    changes: Partial<Pick<Mod, 'name' | 'description' | 'categoryId'>>,
  ) => void
  reorderMods: (newOrder: string[]) => void
  addCategory: (name: string, color: string) => void
  updateCategory: (
    id: string,
    changes: Partial<Pick<Category, 'name' | 'color'>>,
  ) => void
  removeCategory: (id: string) => void
}

export type LoadOrderStore = LoadOrderState & LoadOrderActions

function touch(): LoadOrderState['meta'] {
  return {
    schemaVersion: SCHEMA_VERSION,
    lastModified: new Date().toISOString(),
  }
}

export const useLoadOrderStore = create<LoadOrderStore>()(
  persist(
    (set) => ({
      ...initialLoadOrderState,

      addMod: (name) =>
        set((state) => {
          const nextPosition =
            state.mods.length === 0
              ? 0
              : Math.max(...state.mods.map((mod) => mod.position)) + 1
          const now = new Date().toISOString()
          const newMod: Mod = {
            id: uuidv4(),
            name,
            description: '',
            categoryId: null,
            position: nextPosition,
            createdAt: now,
            updatedAt: now,
          }
          return { mods: [...state.mods, newMod], meta: touch() }
        }),

      removeMod: (id) =>
        set((state) => ({
          mods: state.mods.filter((mod) => mod.id !== id),
          meta: touch(),
        })),

      updateMod: (id, changes) =>
        set((state) => ({
          mods: state.mods.map((mod) =>
            mod.id === id
              ? { ...mod, ...changes, updatedAt: new Date().toISOString() }
              : mod,
          ),
          meta: touch(),
        })),

      reorderMods: (newOrder) =>
        set((state) => {
          const positionById = new Map(newOrder.map((id, index) => [id, index]))
          return {
            mods: state.mods.map((mod) => {
              const position = positionById.get(mod.id)
              return position === undefined ? mod : { ...mod, position }
            }),
            meta: touch(),
          }
        }),

      addCategory: (name, color) =>
        set((state) => {
          const nextOrder =
            state.categories.length === 0
              ? 0
              : Math.max(
                  ...state.categories.map((category) => category.order),
                ) + 1
          const newCategory: Category = {
            id: uuidv4(),
            name,
            color,
            order: nextOrder,
          }
          return {
            categories: [...state.categories, newCategory],
            meta: touch(),
          }
        }),

      updateCategory: (id, changes) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...changes } : category,
          ),
          meta: touch(),
        })),

      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          mods: state.mods.map((mod) =>
            mod.categoryId === id ? { ...mod, categoryId: null } : mod,
          ),
          meta: touch(),
        })),
    }),
    {
      name: 'skyrim-load-order:v1',
      partialize: (state) => ({
        mods: state.mods,
        categories: state.categories,
        meta: state.meta,
      }),
    },
  ),
)
