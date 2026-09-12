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
  it('does not show "Saved" right after mounting', () => {
    render(<SaveIndicator />)
    expect(screen.getByText('Saved')).toHaveClass('opacity-0')
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('shows "Saved" a short while after a change, then hides it again', () => {
    vi.useFakeTimers()
    render(<SaveIndicator />)

    act(() => {
      useLoadOrderStore.getState().addMod('Mod A')
    })
    expect(screen.getByText('Saved')).toHaveClass('opacity-0')

    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(screen.getByText('Saved')).toHaveClass('opacity-100')
    // La région live (annoncée par les lecteurs d'écran) reçoit un vrai
    // changement de contenu, contrairement à l'indicateur visuel dont le
    // texte reste constant.
    expect(screen.getByRole('status')).toHaveTextContent(
      'Changes saved automatically.',
    )

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('Saved')).toHaveClass('opacity-0')
    expect(screen.getByRole('status')).toHaveTextContent('')
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
    expect(screen.getByText('Saved')).toHaveClass('opacity-0')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByText('Saved')).toHaveClass('opacity-100')
  })

  it('shows a warning instead when the storage write failed', () => {
    useLoadOrderStore.setState({ storageWriteError: true })
    render(<SaveIndicator />)

    expect(screen.getByText(/unable to save/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      /unable to save/i,
    )
  })

  it('shows a warning instead when localStorage is unavailable', () => {
    useLoadOrderStore.setState({ storageAvailable: false })
    render(<SaveIndicator />)

    expect(screen.getByText(/unable to save/i)).toBeInTheDocument()
  })
})
