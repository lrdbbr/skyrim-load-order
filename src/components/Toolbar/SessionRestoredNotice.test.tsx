import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  window.localStorage.clear()
  vi.resetModules()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SessionRestoredNotice', () => {
  it('shows a message when data already existed in localStorage on load', async () => {
    window.localStorage.setItem(
      'skyrim-load-order:v1',
      JSON.stringify({
        state: { mods: [{ id: '1' }], categories: [] },
        version: 0,
      }),
    )
    const { default: SessionRestoredNotice } =
      await import('./SessionRestoredNotice')

    render(<SessionRestoredNotice />)

    expect(
      screen.getByText(/session précédente restaurée/i),
    ).toBeInTheDocument()
  })

  it('renders nothing when there was no prior session', async () => {
    const { default: SessionRestoredNotice } =
      await import('./SessionRestoredNotice')

    render(<SessionRestoredNotice />)

    expect(
      screen.queryByText(/session précédente restaurée/i),
    ).not.toBeInTheDocument()
  })

  it('hides itself automatically after a few seconds', async () => {
    vi.useFakeTimers()
    window.localStorage.setItem(
      'skyrim-load-order:v1',
      JSON.stringify({
        state: { mods: [{ id: '1' }], categories: [] },
        version: 0,
      }),
    )
    const { default: SessionRestoredNotice } =
      await import('./SessionRestoredNotice')

    render(<SessionRestoredNotice />)
    expect(
      screen.getByText(/session précédente restaurée/i),
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(
      screen.queryByText(/session précédente restaurée/i),
    ).not.toBeInTheDocument()
  })
})
