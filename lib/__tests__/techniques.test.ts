import { describe, it, expect } from 'vitest'
import { TECHNIQUE_LIBRARY } from '../techniques'

describe('TECHNIQUE_LIBRARY', () => {
  it('contains techniques', () => {
    expect(TECHNIQUE_LIBRARY.length).toBeGreaterThan(0)
  })

  it('every technique has a name and category', () => {
    for (const technique of TECHNIQUE_LIBRARY) {
      expect(technique.name).toBeTruthy()
      expect(technique.category).toBeTruthy()
    }
  })

  it('contains expected categories', () => {
    const categories = new Set(TECHNIQUE_LIBRARY.map((t) => t.category))
    expect(categories.has('guard')).toBe(true)
    expect(categories.has('pass')).toBe(true)
    expect(categories.has('sweep')).toBe(true)
    expect(categories.has('submission')).toBe(true)
  })

  it('has no duplicate technique names', () => {
    const names = TECHNIQUE_LIBRARY.map((t) => t.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })
})
