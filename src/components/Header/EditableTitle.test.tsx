import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import EditableTitle from './EditableTitle'
import { DEFAULT_TITLE, useTitleStore } from '../../store/titleStore'

beforeEach(() => {
  useTitleStore.setState({ title: DEFAULT_TITLE })
  window.localStorage.clear()
})

describe('EditableTitle', () => {
  it('shows the current title as a heading, with an edit button', () => {
    render(<EditableTitle />)
    expect(
      screen.getByRole('heading', { name: DEFAULT_TITLE }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /edit title/i }),
    ).toBeInTheDocument()
  })

  it('switches to an editable input when the pencil button is clicked', () => {
    render(<EditableTitle />)
    fireEvent.click(screen.getByRole('button', { name: /edit title/i }))

    const input = screen.getByRole('textbox', { name: /load order title/i })
    expect(input).toHaveValue(DEFAULT_TITLE)
  })

  it('saves the new title on Enter and updates the store', () => {
    render(<EditableTitle />)
    fireEvent.click(screen.getByRole('button', { name: /edit title/i }))

    const input = screen.getByRole('textbox', { name: /load order title/i })
    fireEvent.change(input, { target: { value: 'Ma liste de mods' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)

    expect(
      screen.getByRole('heading', { name: 'Ma liste de mods' }),
    ).toBeInTheDocument()
    expect(useTitleStore.getState().title).toBe('Ma liste de mods')
  })

  it('saves the new title on blur', () => {
    render(<EditableTitle />)
    fireEvent.click(screen.getByRole('button', { name: /edit title/i }))

    const input = screen.getByRole('textbox', { name: /load order title/i })
    fireEvent.change(input, { target: { value: 'Titre au blur' } })
    fireEvent.blur(input)

    expect(useTitleStore.getState().title).toBe('Titre au blur')
  })

  it('discards changes and keeps the previous title when Escape is pressed', () => {
    render(<EditableTitle />)
    fireEvent.click(screen.getByRole('button', { name: /edit title/i }))

    const input = screen.getByRole('textbox', { name: /load order title/i })
    fireEvent.change(input, { target: { value: 'Abandonné' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(
      screen.getByRole('heading', { name: DEFAULT_TITLE }),
    ).toBeInTheDocument()
    expect(useTitleStore.getState().title).toBe(DEFAULT_TITLE)
  })

  it('falls back to the default title when saving an empty value', () => {
    render(<EditableTitle />)
    fireEvent.click(screen.getByRole('button', { name: /edit title/i }))

    const input = screen.getByRole('textbox', { name: /load order title/i })
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)

    expect(useTitleStore.getState().title).toBe(DEFAULT_TITLE)
  })
})
