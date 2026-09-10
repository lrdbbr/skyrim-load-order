import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  hasPersistedData,
  onStorageWriteError,
  safeJsonStorage,
} from './storage'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('hasPersistedData', () => {
  it('returns false when nothing is stored', () => {
    expect(hasPersistedData('skyrim-load-order:v1')).toBe(false)
  })

  it('returns false when the stored state has no mods or categories', () => {
    window.localStorage.setItem(
      'skyrim-load-order:v1',
      JSON.stringify({ state: { mods: [], categories: [] }, version: 0 }),
    )
    expect(hasPersistedData('skyrim-load-order:v1')).toBe(false)
  })

  it('returns true when the stored state has mods', () => {
    window.localStorage.setItem(
      'skyrim-load-order:v1',
      JSON.stringify({
        state: { mods: [{ id: '1' }], categories: [] },
        version: 0,
      }),
    )
    expect(hasPersistedData('skyrim-load-order:v1')).toBe(true)
  })

  it('returns false when the stored value is not valid JSON', () => {
    window.localStorage.setItem('skyrim-load-order:v1', 'not json')
    expect(hasPersistedData('skyrim-load-order:v1')).toBe(false)
  })
})

describe('safeJsonStorage', () => {
  it('reads back a value written through the wrapper', () => {
    safeJsonStorage?.setItem('some-key', {
      state: { mods: [] },
      version: 0,
    })
    expect(safeJsonStorage?.getItem('some-key')).not.toBeNull()
  })

  it('does not throw and notifies listeners when the underlying write fails', () => {
    const listener = vi.fn()
    const unsubscribe = onStorageWriteError(listener)

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError')
    })

    expect(() =>
      safeJsonStorage?.setItem('some-key', { state: { mods: [] }, version: 0 }),
    ).not.toThrow()
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
  })

  it('stops notifying a listener once unsubscribed', () => {
    const listener = vi.fn()
    const unsubscribe = onStorageWriteError(listener)
    unsubscribe()

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('inaccessible')
    })
    safeJsonStorage?.setItem('some-key', { state: { mods: [] }, version: 0 })

    expect(listener).not.toHaveBeenCalled()
  })

  it('returns null instead of throwing when reading fails', () => {
    window.localStorage.setItem('some-key', 'irrelevant')
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('inaccessible')
    })
    expect(safeJsonStorage?.getItem('some-key')).toBeNull()
  })
})
