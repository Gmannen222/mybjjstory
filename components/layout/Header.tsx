'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import AuthButton from '@/components/auth/AuthButton'
import AdminLink from '@/components/admin/AdminLink'

export default function Header() {
  const locale = useLocale()

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
          <Link href={`/${locale}/training`} className="hover:text-foreground transition-colors">
            Trening
          </Link>
          <Link href={`/${locale}/competitions`} className="hover:text-foreground transition-colors">
            Konkurranser
          </Link>
          <Link href={`/${locale}/feed`} className="hover:text-foreground transition-colors">
            Feed
          </Link>
          <Link href={`/${locale}/academies`} className="hover:text-foreground transition-colors">
            Akademier
          </Link>
          <Link href={`/${locale}/gradings`} className="hover:text-foreground transition-colors">
            Graderinger
          </Link>
          <Link href={`/${locale}/injuries`} className="hover:text-foreground transition-colors">
            Skader
          </Link>
          <Link href={`/${locale}/profile`} className="hover:text-foreground transition-colors">
            Profil
          </Link>
          <Link href={`/${locale}/feedback`} className="hover:text-foreground transition-colors">
            Tilbakemelding
          </Link>
          <Link href={`/${locale}/settings`} className="hover:text-foreground transition-colors">
            ⚙
          </Link>
          <AdminLink />
        </nav>

        <AuthButton compact />
      </div>
    </header>
  )
}
