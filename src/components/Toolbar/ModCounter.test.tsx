import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ModCounter from './ModCounter'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../../store/loadOrderStore'

beforeEach(() => {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
})

describe('ModCounter', () => {
  it('shows "0 mods" when the list is empty', () => {
    render(<ModCounter />)
    expect(screen.getByText('0 mods')).toBeInTheDocument()
  })

  it('uses the singular form for exactly one mod', () => {
    useLoadOrderStore.getState().addMod('Ordinator')
    render(<ModCounter />)
    expect(screen.getByText('1 mod')).toBeInTheDocument()
  })

  it('uses the plural form for more than one mod', () => {
    useLoadOrderStore.getState().addMod('Ordinator')
    useLoadOrderStore.getState().addMod('SkyUI')
    render(<ModCounter />)
    expect(screen.getByText('2 mods')).toBeInTheDocument()
  })

  it('counts disabled mods too', () => {
    useLoadOrderStore.getState().addMod('Ordinator')
    const mod = useLoadOrderStore.getState().mods[0]
    useLoadOrderStore.getState().updateMod(mod.id, { disabled: true })

    render(<ModCounter />)
    expect(screen.getByText('1 mod')).toBeInTheDocument()
  })
})
