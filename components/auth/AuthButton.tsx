'use client'

import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { useAuthProfile } from '@/lib/hooks/useAuthProfile'

export default function AuthButton({ compact = false }: { compact?: boolean }) {
  const { user, profile, loading, isAuthenticated } = useAuthProfile()
  const t = useTranslations('auth')

  const handleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="h-10 w-20 animate-pulse rounded-lg bg-surface" />
  }

  if (isAuthenticated && user) {
    const name = profile?.display_name || user.user_metadata?.full_name || user.email
    const avatar = profile?.avatar_url || user.user_metadata?.avatar_url

    return (
      <div className="flex items-center gap-3">
        {!compact && avatar && (
          <Image
            src={avatar}
            alt={name ?? ''}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        )}
        {!compact && (
          <span className="text-sm text-muted hidden sm:inline">{name}</span>
        )}
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          {t('logout')}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
    >
      {compact ? t('login') : t('loginWithGoogle')}
    </button>
  )
}
