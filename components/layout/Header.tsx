'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import AuthButton from '@/components/auth/AuthButton'
import AdminLink from '@/components/admin/AdminLink'

const NAV_LINKS = [
  { key: 'training', path: '/training' },
  { key: 'progress', path: '/progress' },
  { key: 'feed', path: '/feed' },
  { key: 'profile', path: '/profile' },
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

export default function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('nav')

  const isActive = (path: string) => {
    const full = `/${locale}${path}`
    if (pathname.startsWith(full)) return true
    for (const [sub, parent] of Object.entries(SUB_PATH_MAP)) {
      if (parent === path && pathname.startsWith(`/${locale}${sub}`)) return true
    }
    return false
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-lg font-bold text-primary hover:text-primary-hover transition-colors"
        >
          MyBJJStory
        </Link>

        <nav className="hidden sm:flex items-center gap-5 text-sm text-muted">
          {NAV_LINKS.map(({ key, path }) => {
            const href = `/${locale}${path}`
            const active = isActive(path)
            return (
              <Link
                key={key}
                href={href}
                className={`transition-colors ${
                  active
                    ? 'text-primary font-semibold'
                    : 'hover:text-foreground'
                }`}
              >
                {t(key)}
              </Link>
            )
          })}
          <AdminLink />
        </nav>

        <AuthButton compact />
      </div>
    </header>
  )
}
