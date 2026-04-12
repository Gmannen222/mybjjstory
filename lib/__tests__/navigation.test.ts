import { describe, it, expect } from 'vitest'
import { NAV_ITEMS, SUB_PATH_MAP, isActivePath } from '../navigation'

describe('NAV_ITEMS', () => {
  it('contains all required nav tabs', () => {
    const keys = NAV_ITEMS.map((item) => item.key)
    expect(keys).toContain('home')
    expect(keys).toContain('training')
    expect(keys).toContain('progress')
    expect(keys).toContain('feed')
    expect(keys).toContain('profile')
  })

  it('every item has key, path, and icon', () => {
    for (const item of NAV_ITEMS) {
      expect(item.key).toBeTruthy()
      expect(typeof item.path).toBe('string')
      expect(item.icon).toBeTruthy()
    }
  })

  it('home path is empty string', () => {
    const home = NAV_ITEMS.find((i) => i.key === 'home')
    expect(home?.path).toBe('')
  })
})

describe('SUB_PATH_MAP', () => {
  it('every sub-path parent matches a NAV_ITEMS path or is __none__', () => {
    const navPaths = NAV_ITEMS.map((i) => i.path)
    for (const [sub, parent] of Object.entries(SUB_PATH_MAP)) {
      expect(
        navPaths.includes(parent) || parent === '__none__',
        `SUB_PATH_MAP["${sub}"] -> "${parent}" does not match any NAV_ITEMS path`
      ).toBe(true)
    }
  })

  it('contains expected sub-path mappings', () => {
    expect(SUB_PATH_MAP['/gradings']).toBe('/progress')
    expect(SUB_PATH_MAP['/competitions']).toBe('/progress')
    expect(SUB_PATH_MAP['/my-academy']).toBe('/feed')
    expect(SUB_PATH_MAP['/injuries']).toBe('/profile')
    expect(SUB_PATH_MAP['/settings']).toBe('/profile')
    expect(SUB_PATH_MAP['/inbox']).toBe('/profile')
  })
})

describe('isActivePath', () => {
  it('home is active on exact locale path', () => {
    expect(isActivePath('/no', 'no', '')).toBe(true)
    expect(isActivePath('/no/', 'no', '')).toBe(true)
  })

  it('home is NOT active on sub-paths', () => {
    expect(isActivePath('/no/training', 'no', '')).toBe(false)
    expect(isActivePath('/no/profile', 'no', '')).toBe(false)
  })

  it('direct path match is active', () => {
    expect(isActivePath('/no/training', 'no', '/training')).toBe(true)
    expect(isActivePath('/no/training/new', 'no', '/training')).toBe(true)
    expect(isActivePath('/no/profile', 'no', '/profile')).toBe(true)
  })

  it('sub-path highlights parent tab', () => {
    expect(isActivePath('/no/gradings', 'no', '/progress')).toBe(true)
    expect(isActivePath('/no/competitions', 'no', '/progress')).toBe(true)
    expect(isActivePath('/no/my-academy', 'no', '/feed')).toBe(true)
    expect(isActivePath('/no/injuries', 'no', '/profile')).toBe(true)
    expect(isActivePath('/no/settings', 'no', '/profile')).toBe(true)
    expect(isActivePath('/no/inbox', 'no', '/profile')).toBe(true)
  })

  it('__none__ sub-path does not highlight any tab', () => {
    expect(isActivePath('/no/onboarding', 'no', '')).toBe(false)
    expect(isActivePath('/no/onboarding', 'no', '/training')).toBe(false)
    expect(isActivePath('/no/onboarding', 'no', '/profile')).toBe(false)
  })

  it('unrelated path is not active', () => {
    expect(isActivePath('/no/training', 'no', '/profile')).toBe(false)
    expect(isActivePath('/no/feed', 'no', '/progress')).toBe(false)
  })
})
