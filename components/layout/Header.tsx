'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import AuthButton from '@/components/auth/AuthButton'
import AdminLink from '@/components/admin/AdminLink'

const NAV_LINKS = [
  { key: 'training', path: '/training' },
  { key: 'competitions', path: '/competitions' },
  { key: 'feed', path: '/feed' },
  { key: 'academies', path: '/academies' },
  { key: 'gradings', path: '/gradings' },
  { key: 'injuries', path: '/injuries' },
  { key: 'profile', path: '/profile' },
  { key: 'feedback', path: '/feedback' },
] as const

export default function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('nav')

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
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={key}
                href={href}
                className={`transition-colors ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'hover:text-foreground'
                }`}
              >
                {t(key)}
              </Link>
            )
          })}
          <Link
            href={`/${locale}/settings`}
            aria-label={t('settings')}
            className={`transition-colors ${
              pathname.startsWith(`/${locale}/settings`)
                ? 'text-primary font-semibold'
                : 'hover:text-foreground'
            }`}
          >
            ⚙
          </Link>
          <AdminLink />
        </nav>

        <AuthButton compact />
      </div>
    </header>
  )
}
