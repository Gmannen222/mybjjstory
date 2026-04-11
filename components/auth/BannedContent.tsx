'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BannedContent({ locale }: { locale: string }) {
  const t = useTranslations('admin.users')
  const tAuth = useTranslations('auth')
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-surface rounded-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-400/20 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-3">{t('bannedPage')}</h1>
        <p className="text-muted mb-6">{t('bannedMessage')}</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-xl bg-white/10 text-foreground hover:bg-white/20 transition-colors text-sm font-medium min-h-[44px]"
        >
          {tAuth('logout')}
        </button>
      </div>
    </div>
  )
}
