import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from './store/loadOrderStore'

beforeEach(() => {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
})

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Skyrim Load Order')).toBeInTheDocument()
  })
})
