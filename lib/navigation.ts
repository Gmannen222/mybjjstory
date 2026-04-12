/**
 * Single source of truth for app navigation.
 * Header and BottomNav MUST import from here — never hardcode routes in layout components.
 */

export interface NavItem {
  key: string
  path: string
  icon: string
  showInHeader: boolean
  showInBottomNav: boolean
}

export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'home', path: '', icon: '🏠', showInHeader: true, showInBottomNav: true },
  { key: 'training', path: '/training', icon: '🥋', showInHeader: true, showInBottomNav: true },
  { key: 'progress', path: '/progress', icon: '📊', showInHeader: true, showInBottomNav: true },
  { key: 'feed', path: '/feed', icon: '📰', showInHeader: true, showInBottomNav: true },
  { key: 'profile', path: '/profile', icon: '👤', showInHeader: true, showInBottomNav: true },
] as const

/**
 * Maps sub-paths to their parent nav tab for active-state highlighting.
 * When adding a new page that lives under an existing tab, add it here.
 * Use '__none__' to suppress all tab highlighting for that path.
 */
export const SUB_PATH_MAP: Readonly<Record<string, string>> = {
  '/gradings': '/progress',
  '/competitions': '/progress',
  '/sparring': '/progress',
  '/academies': '/feed',
  '/my-academy': '/feed',
  '/injuries': '/profile',
  '/settings': '/profile',
  '/feedback': '/profile',
  '/inbox': '/profile',
  '/onboarding': '__none__',
}

/**
 * Pure function to determine if a nav item is active.
 * Testable without React or DOM.
 */
export function isActivePath(
  pathname: string,
  locale: string,
  navPath: string,
): boolean {
  const full = `/${locale}${navPath}`
  if (navPath === '') {
    return pathname === `/${locale}` || pathname === `/${locale}/`
  }
  if (pathname.startsWith(full)) return true
  for (const [sub, parent] of Object.entries(SUB_PATH_MAP)) {
    if (parent === navPath && pathname.startsWith(`/${locale}${sub}`)) return true
  }
  return false
}
