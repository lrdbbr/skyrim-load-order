import { describe, expect, it } from 'vitest'
import { toFileNameSlug } from './fileNameSlug'

describe('toFileNameSlug', () => {
  it('replaces spaces with underscores', () => {
    expect(toFileNameSlug('Skyrim Load Order')).toBe('Skyrim_Load_Order')
  })

  it('collapses multiple consecutive spaces into a single underscore', () => {
    expect(toFileNameSlug('My   Cool  List')).toBe('My_Cool_List')
  })

  it('trims leading and trailing whitespace', () => {
    expect(toFileNameSlug('  Padded Title  ')).toBe('Padded_Title')
  })

  it('strips characters forbidden in file names', () => {
    expect(toFileNameSlug('Mods: "Best" List <2024>')).toBe(
      'Mods_Best_List_2024',
    )
  })

  it('preserves accents and case', () => {
    expect(toFileNameSlug('Modlist Préférée')).toBe('Modlist_Préférée')
  })

  it('falls back to a default slug when nothing is left after sanitizing', () => {
    expect(toFileNameSlug('   ')).toBe('export')
    expect(toFileNameSlug('///:::')).toBe('export')
  })
})
