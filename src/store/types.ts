export interface Category {
  id: string
  name: string
  color: string // hex
  order: number
}

export interface Mod {
  id: string // uuid
  name: string
  description: string
  categoryId: string | null
  position: number
  disabled: boolean
  createdAt: string
  updatedAt: string
}

export interface LoadOrderState {
  mods: Mod[]
  categories: Category[]
  meta: { schemaVersion: number; lastModified: string }
}
