'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const NAV_ITEMS = [
  { key: 'training', path: '/training', icon: '🥋' },
  { key: 'competitions', path: '/competitions', icon: '🏆' },
  { key: 'feed', path: '/feed', icon: '📰' },
  { key: 'profile', path: '/profile', icon: '👤' },
] as const

const MORE_ITEMS = [
  { key: 'academies', path: '/academies', icon: '🏫' },
  { key: 'gradings', path: '/gradings', icon: '🎖️' },
  { key: 'injuries', path: '/injuries', icon: '🩹' },
  { key: 'settings', path: '/settings', icon: '⚙️' },
  { key: 'feedback', path: '/feedback', icon: '💬' },
] as const

export default function BottomNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')
  const [moreOpen, setMoreOpen] = useState(false)

  // Close menu when navigating
  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  // Close menu on backdrop click via keyboard (Escape)
  useEffect(() => {
    if (!moreOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [moreOpen])

  const moreActive = MORE_ITEMS.some(({ path }) =>
    pathname.startsWith(`/${locale}${path}`)
  )

  return (
    <>
      {/* Backdrop */}
      {moreOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* Slide-up "Mer" menu */}
      <div
        className={`sm:hidden fixed left-0 right-0 z-50 bg-surface border-t border-white/10 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
          moreOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ bottom: '4rem' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-4 pb-4 pt-2">
          <p className="text-xs text-muted uppercase tracking-wider mb-3 px-1">Mer</p>
          <div className="grid grid-cols-1 gap-0.5">
            {MORE_ITEMS.map(({ key, path, icon }) => {
              const href = `/${locale}${path}`
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={key}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground hover:bg-surface-hover'
                  }`}
                >
                  <span className="text-xl w-8 text-center">{icon}</span>
                  <span className="text-sm font-medium">{t(key)}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
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

          {/* Mer-tab */}
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors ${
              moreActive || moreOpen
                ? 'text-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <span className="text-xl leading-none">•••</span>
            <span>Mer</span>
          </button>
        </div>
      </nav>
    </>
  )
}
