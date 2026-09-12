import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { KeyboardEvent } from 'react'
import { useInlineEdit } from './useInlineEdit'

describe('useInlineEdit', () => {
  it('starts out not editing, with the draft matching the current value', () => {
    const { result } = renderHook(() =>
      useInlineEdit({ value: 'Initial', onCommit: vi.fn() }),
    )

    expect(result.current.isEditing).toBe(false)
    expect(result.current.draft).toBe('Initial')
  })

  it('enters edit mode with the draft reset to the current value on start()', () => {
    const { result } = renderHook(() =>
      useInlineEdit({ value: 'Initial', onCommit: vi.fn() }),
    )

    act(() => result.current.setDraft('typed but not started'))
    act(() => result.current.start())

    expect(result.current.isEditing).toBe(true)
    expect(result.current.draft).toBe('Initial')
  })

  it('calls onCommit with the draft and exits edit mode on commit()', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() =>
      useInlineEdit({ value: 'Initial', onCommit }),
    )

    act(() => result.current.start())
    act(() => result.current.setDraft('New value'))
    act(() => result.current.commit())

    expect(onCommit).toHaveBeenCalledWith('New value')
    expect(result.current.isEditing).toBe(false)
  })

  it('discards the draft and exits edit mode on cancel()', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() =>
      useInlineEdit({ value: 'Initial', onCommit }),
    )

    act(() => result.current.start())
    act(() => result.current.setDraft('Abandoned'))
    act(() => result.current.cancel())

    expect(onCommit).not.toHaveBeenCalled()
    expect(result.current.isEditing).toBe(false)
    expect(result.current.draft).toBe('Initial')
  })

  it('cancels on Escape via handleKeyDown, stopping propagation', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() =>
      useInlineEdit({ value: 'Initial', onCommit }),
    )

    act(() => result.current.start())
    act(() => result.current.setDraft('Abandoned'))

    const stopPropagation = vi.fn()
    act(() =>
      result.current.handleKeyDown({
        key: 'Escape',
        stopPropagation,
      } as unknown as KeyboardEvent<HTMLInputElement>),
    )

    expect(stopPropagation).toHaveBeenCalled()
    expect(result.current.isEditing).toBe(false)
    expect(result.current.draft).toBe('Initial')
    expect(onCommit).not.toHaveBeenCalled()
  })

  it('ignores keys other than Escape', () => {
    const { result } = renderHook(() =>
      useInlineEdit({ value: 'Initial', onCommit: vi.fn() }),
    )

    act(() => result.current.start())
    const stopPropagation = vi.fn()
    act(() =>
      result.current.handleKeyDown({
        key: 'Enter',
        stopPropagation,
      } as unknown as KeyboardEvent<HTMLInputElement>),
    )

    expect(stopPropagation).not.toHaveBeenCalled()
    expect(result.current.isEditing).toBe(true)
  })
})
