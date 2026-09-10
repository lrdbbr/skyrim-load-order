import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ResetConfirmModal from './ResetConfirmModal'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../../store/loadOrderStore'

function resetStore() {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
}

beforeEach(() => {
  resetStore()
})

describe('ResetConfirmModal', () => {
  it('keeps the confirm button disabled until the exact word is typed', () => {
    render(<ResetConfirmModal onClose={() => {}} />)

    const confirmButton = screen.getByRole('button', {
      name: /tout réinitialiser/i,
    })
    expect(confirmButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/tapez reset/i), {
      target: { value: 'nope' },
    })
    expect(confirmButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/tapez reset/i), {
      target: { value: 'RESET' },
    })
    expect(confirmButton).toBeEnabled()
  })

  it('accepts the confirmation word regardless of case', () => {
    render(<ResetConfirmModal onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText(/tapez reset/i), {
      target: { value: 'reset' },
    })

    expect(
      screen.getByRole('button', { name: /tout réinitialiser/i }),
    ).toBeEnabled()
  })

  it('wipes mods and categories once confirmed and closes the modal', () => {
    useLoadOrderStore.getState().addCategory('Gameplay', '#ff0000')
    useLoadOrderStore.getState().addMod('Mod A')
    const onClose = vi.fn()

    render(<ResetConfirmModal onClose={onClose} />)
    fireEvent.change(screen.getByLabelText(/tapez reset/i), {
      target: { value: 'RESET' },
    })
    fireEvent.click(screen.getByRole('button', { name: /tout réinitialiser/i }))

    const state = useLoadOrderStore.getState()
    expect(state.mods).toHaveLength(0)
    expect(state.categories).toHaveLength(0)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not reset anything when the confirmation word is wrong', () => {
    useLoadOrderStore.getState().addMod('Mod A')

    render(<ResetConfirmModal onClose={() => {}} />)
    fireEvent.change(screen.getByLabelText(/tapez reset/i), {
      target: { value: 'nope' },
    })
    fireEvent.click(screen.getByRole('button', { name: /tout réinitialiser/i }))

    expect(useLoadOrderStore.getState().mods).toHaveLength(1)
  })

  it('closes without resetting when cancelled', () => {
    useLoadOrderStore.getState().addMod('Mod A')
    const onClose = vi.fn()

    render(<ResetConfirmModal onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /^annuler$/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(useLoadOrderStore.getState().mods).toHaveLength(1)
  })
})
