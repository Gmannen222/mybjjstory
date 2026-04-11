'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const NAV_ITEMS = [
  { key: 'training', path: '/training', icon: '🥋' },
  { key: 'progress', path: '/progress', icon: '📊' },
  { key: 'feed', path: '/feed', icon: '📰' },
  { key: 'profile', path: '/profile', icon: '👤' },
] as const

// Sub-paths that should highlight the parent tab
const SUB_PATH_MAP: Record<string, string> = {
  '/gradings': '/progress',
  '/competitions': '/progress',
  '/sparring': '/progress',
  '/academies': '/feed',
  '/injuries': '/profile',
  '/settings': '/profile',
  '/feedback': '/profile',
}

export default function BottomNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')

  const isActive = (path: string) => {
    const full = `/${locale}${path}`
    if (pathname.startsWith(full)) return true
    // Check if current path is a sub-path of this tab
    for (const [sub, parent] of Object.entries(SUB_PATH_MAP)) {
      if (parent === path && pathname.startsWith(`/${locale}${sub}`)) return true
    }
    return false
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-md safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ key, path, icon }) => {
          const href = `/${locale}${path}`
          const active = isActive(path)

          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{t(key)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
