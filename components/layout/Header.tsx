'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { NAV_ITEMS, isActivePath } from '@/lib/navigation'
import { useAuthProfile } from '@/lib/hooks/useAuthProfile'
import AuthButton from '@/components/auth/AuthButton'
import AdminLink from '@/components/admin/AdminLink'
import InstallButton from '@/components/layout/InstallButton'

const headerItems = NAV_ITEMS.filter((item) => item.showInHeader)

export default function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('nav')
  const { isAuthenticated } = useAuthProfile()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-lg font-bold text-primary hover:text-primary-hover transition-colors"
        >
          MyBJJStory
        </Link>

        {isAuthenticated && (
          <nav className="hidden sm:flex items-center gap-5 text-sm text-muted">
            {headerItems.map(({ key, path }) => {
              const href = `/${locale}${path}`
              const active = isActivePath(pathname, locale, path)
              return (
                <Link
                  key={key}
                  href={href}
                  className={`py-2 px-1 transition-colors ${
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
        )}

        <div className="flex items-center gap-2">
          <InstallButton />
          <AuthButton compact />
        </div>
      </div>
    </header>
  )
}
