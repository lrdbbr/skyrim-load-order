import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SaveIndicator from './SaveIndicator'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../../store/loadOrderStore'

function resetStore() {
  useLoadOrderStore.setState({
    ...structuredClone(initialLoadOrderState),
    storageAvailable: true,
    storageWriteError: false,
  })
  window.localStorage.clear()
}

beforeEach(() => {
  resetStore()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('SaveIndicator', () => {
  it('does not show "Sauvegardé" right after mounting', () => {
    render(<SaveIndicator />)
    expect(screen.getByRole('status')).toHaveClass('opacity-0')
  })

  it('shows "Sauvegardé" a short while after a change, then hides it again', () => {
    vi.useFakeTimers()
    render(<SaveIndicator />)

    act(() => {
      useLoadOrderStore.getState().addMod('Mod A')
    })
    expect(screen.getByRole('status')).toHaveClass('opacity-0')

    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(screen.getByRole('status')).toHaveClass('opacity-100')
    expect(screen.getByText('Sauvegardé')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByRole('status')).toHaveClass('opacity-0')
  })

  it('does not flicker between rapid successive changes (debounced)', () => {
    vi.useFakeTimers()
    render(<SaveIndicator />)

    act(() => {
      useLoadOrderStore.getState().addMod('Mod A')
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    act(() => {
      useLoadOrderStore.getState().addMod('Mod B')
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByRole('status')).toHaveClass('opacity-0')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByRole('status')).toHaveClass('opacity-100')
  })

  it('shows a warning instead when the storage write failed', () => {
    useLoadOrderStore.setState({ storageWriteError: true })
    render(<SaveIndicator />)

    expect(screen.getByText(/sauvegarde impossible/i)).toBeInTheDocument()
  })

  it('shows a warning instead when localStorage is unavailable', () => {
    useLoadOrderStore.setState({ storageAvailable: false })
    render(<SaveIndicator />)

    expect(screen.getByText(/sauvegarde impossible/i)).toBeInTheDocument()
  })
})
