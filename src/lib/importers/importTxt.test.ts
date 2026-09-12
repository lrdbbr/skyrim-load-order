import { describe, expect, it } from 'vitest'
import { importTxt } from './importTxt'

describe('importTxt', () => {
  it('parses one mod name per non-empty line, preserving order', () => {
    const content = 'Ordinator\n\nSkyUI\r\nApachii Hair\n   \n'

    expect(importTxt(content)).toEqual([
      { name: 'Ordinator' },
      { name: 'SkyUI' },
      { name: 'Apachii Hair' },
    ])
  })

  it('trims surrounding whitespace on each line', () => {
    expect(importTxt('  Ordinator  \n\tSkyUI\t')).toEqual([
      { name: 'Ordinator' },
      { name: 'SkyUI' },
    ])
  })

  it('throws when the file is empty', () => {
    expect(() => importTxt('')).toThrow(/empty/i)
  })

  it('throws when the file only contains blank lines', () => {
    expect(() => importTxt('\n\n   \n')).toThrow(/empty/i)
  })
})
