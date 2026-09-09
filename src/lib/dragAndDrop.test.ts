import type { DragEndEvent } from '@dnd-kit/core'
import { describe, expect, it } from 'vitest'
import { getReorderedModIds } from './dragAndDrop'

describe('getReorderedModIds', () => {
  it('moves the dragged id to the position of the drop target', () => {
    const result = getReorderedModIds(['a', 'b', 'c'], {
      active: { id: 'c' },
      over: { id: 'a' },
    } as DragEndEvent)

    expect(result).toEqual(['c', 'a', 'b'])
  })

  it('returns null when dropped outside a droppable target', () => {
    const result = getReorderedModIds(['a', 'b'], {
      active: { id: 'a' },
      over: null,
    } as DragEndEvent)

    expect(result).toBeNull()
  })

  it('returns null when dropped back on itself', () => {
    const result = getReorderedModIds(['a', 'b'], {
      active: { id: 'a' },
      over: { id: 'a' },
    } as DragEndEvent)

    expect(result).toBeNull()
  })
})
