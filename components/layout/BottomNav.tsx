'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { NAV_ITEMS, isActivePath } from '@/lib/navigation'
import { useAuthProfile } from '@/lib/hooks/useAuthProfile'

const bottomItems = NAV_ITEMS.filter((item) => item.showInBottomNav)

export default function BottomNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')
  const { isAuthenticated, loading } = useAuthProfile()

  if (loading) {
    return (
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-md safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 min-w-[56px] min-h-[48px] justify-center">
              <div className="w-6 h-6 rounded bg-surface-hover animate-pulse" />
              <div className="w-8 h-2 rounded bg-surface-hover animate-pulse" />
            </div>
          ))}
        </div>
      </nav>
    )
  }

  if (!isAuthenticated) return null

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-md safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {bottomItems.map(({ key, path, icon }) => {
          const href = `/${locale}${path}`
          const active = isActivePath(pathname, locale, path)

          return (
            <Link
              key={key}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 min-w-[56px] min-h-[48px] justify-center px-3 py-1.5 text-xs transition-colors ${
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
