import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ImportButton from './ImportButton'
import {
  initialLoadOrderState,
  useLoadOrderStore,
} from '../../store/loadOrderStore'

function resetStore() {
  useLoadOrderStore.setState(structuredClone(initialLoadOrderState))
  window.localStorage.clear()
}

function selectFile(input: HTMLInputElement, file: File) {
  Object.defineProperty(input, 'files', { value: [file], configurable: true })
  fireEvent.change(input)
}

function getFileInput(): HTMLInputElement {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

beforeEach(() => {
  resetStore()
})

describe('ImportButton', () => {
  it('shows a confirmation summary after parsing a valid .txt file', async () => {
    render(<ImportButton />)
    const file = new File(['Ordinator\nSkyUI'], 'mods.txt', {
      type: 'text/plain',
    })

    selectFile(getFileInput(), file)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/2 mods/i)).toBeInTheDocument()
  })

  it('imports the mods into the store once confirmed', async () => {
    render(<ImportButton />)
    const file = new File(['Ordinator\nSkyUI'], 'mods.txt', {
      type: 'text/plain',
    })

    selectFile(getFileInput(), file)
    const dialog = await screen.findByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: /^import$/i }))

    await waitFor(() => {
      expect(useLoadOrderStore.getState().mods.map((mod) => mod.name)).toEqual([
        'Ordinator',
        'SkyUI',
      ])
    })
  })

  it('replaces the current list when "Replace" is selected', async () => {
    useLoadOrderStore.getState().addMod('Old Mod')
    render(<ImportButton />)
    const file = new File(['New Mod'], 'mods.txt', { type: 'text/plain' })

    selectFile(getFileInput(), file)
    const dialog = await screen.findByRole('dialog')
    fireEvent.click(within(dialog).getByLabelText(/replace/i))
    fireEvent.click(within(dialog).getByRole('button', { name: /^import$/i }))

    await waitFor(() => {
      expect(useLoadOrderStore.getState().mods.map((mod) => mod.name)).toEqual([
        'New Mod',
      ])
    })
  })

  it('shows an error message for an unsupported file extension', async () => {
    render(<ImportButton />)
    const file = new File(['whatever'], 'mods.json', {
      type: 'application/json',
    })

    selectFile(getFileInput(), file)

    expect(await screen.findByRole('alert')).toHaveTextContent(/not supported|unsupported/i)
  })

  it('shows an error message for an empty file', async () => {
    render(<ImportButton />)
    const file = new File([''], 'mods.txt', { type: 'text/plain' })

    selectFile(getFileInput(), file)

    expect(await screen.findByRole('alert')).toHaveTextContent(/empty/i)
  })
})
