'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const NAV_ITEMS = [
  { key: 'training', path: '/training', icon: '🥋' },
  { key: 'competitions', path: '/competitions', icon: '🏆' },
  { key: 'feed', path: '/feed', icon: '📰' },
  { key: 'academies', path: '/academies', icon: '🏫' },
  { key: 'profile', path: '/profile', icon: '👤' },
] as const

export default function BottomNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-md safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ key, path, icon }) => {
          const href = `/${locale}${path}`
          const isActive = pathname.startsWith(href)

          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors ${
                isActive
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
