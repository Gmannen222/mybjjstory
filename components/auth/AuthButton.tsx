'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { Session } from '@supabase/supabase-js'

export default function AuthButton({ compact = false }: { compact?: boolean }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const t = useTranslations('auth')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (loading) {
    return <div className="h-10 w-20 animate-pulse rounded-lg bg-surface" />
  }

  if (session) {
    const user = session.user
    const name = user.user_metadata?.full_name || user.email
    const avatar = user.user_metadata?.avatar_url

    return (
      <div className="flex items-center gap-3">
        {!compact && avatar && (
          <img
            src={avatar}
            alt={name ?? ''}
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
