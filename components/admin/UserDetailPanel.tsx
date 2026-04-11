'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { AdminUser } from './UserList'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('no-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ROLE_LABELS: Record<string, string> = {
  athlete: 'Utøver',
  competitor: 'Konkurrent',
  instructor: 'Instruktør',
  academy: 'Akademi',
}

export default function UserDetailPanel({
  user,
}: {
  user: AdminUser
  locale?: string
}) {
  const t = useTranslations('admin.users')
  const tBelts = useTranslations('belts')
  const router = useRouter()
  const [showBanForm, setShowBanForm] = useState(false)
  const [showUnbanConfirm, setShowUnbanConfirm] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBan() {
    if (!banReason.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_banned: true,
        banned_at: new Date().toISOString(),
        ban_reason: banReason.trim(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Ban error:', updateError)
      setError('Kunne ikke utestenge brukeren. Prøv igjen.')
      setLoading(false)
      return
    }

    setLoading(false)
    setShowBanForm(false)
    setBanReason('')
    router.refresh()
  }

  async function handleUnban() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_banned: false,
        banned_at: null,
        ban_reason: null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Unban error:', updateError)
      setError('Kunne ikke fjerne utestengelsen. Prøv igjen.')
      setLoading(false)
      return
    }

    setLoading(false)
    setShowUnbanConfirm(false)
    router.refresh()
  }

  return (
    <div className="bg-surface/60 rounded-xl p-5 mt-1 mb-2 border border-white/5">
      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-5">
        <div>
          <span className="text-muted block text-xs mb-0.5">{t('role')}</span>
          <span className="font-medium">{ROLE_LABELS[user.role] || user.role}</span>
        </div>
        <div>
          <span className="text-muted block text-xs mb-0.5">Belte</span>
          <span className="font-medium">
            {tBelts(user.belt_rank || 'white')}
            {user.belt_degrees > 0 && ` (${user.belt_degrees} striper)`}
          </span>
        </div>
        <div>
          <span className="text-muted block text-xs mb-0.5">Akademi</span>
          <span className="font-medium">{user.academy_name || '-'}</span>
        </div>
        <div>
          <span className="text-muted block text-xs mb-0.5">{t('sessions')}</span>
          <span className="font-medium">{user.session_count}</span>
        </div>
        <div>
          <span className="text-muted block text-xs mb-0.5">{t('lastActive')}</span>
          <span className="font-medium">
            {user.last_session ? formatDate(user.last_session) : '-'}
          </span>
        </div>
        <div>
          <span className="text-muted block text-xs mb-0.5">{t('joined')}</span>
          <span className="font-medium">{formatDate(user.created_at)}</span>
        </div>
      </div>

      {/* Ban status info */}
      {user.is_banned && user.banned_at && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 mb-4 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-400 font-medium">{t('banned')}</span>
            <span className="text-muted">
              {t('bannedAt')}: {formatDateTime(user.banned_at)}
            </span>
          </div>
          {user.ban_reason && (
            <div className="text-muted mt-1">
              <span className="font-medium text-foreground">{t('banReason')}:</span>{' '}
              {user.ban_reason}
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-3 mb-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {user.is_banned ? (
          <>
            {!showUnbanConfirm ? (
              <button
                onClick={() => setShowUnbanConfirm(true)}
                className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium min-h-[44px]"
              >
                {t('unban')}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUnban}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 min-h-[44px]"
                >
                  {loading ? '...' : t('confirmUnban')}
                </button>
                <button
                  onClick={() => setShowUnbanConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-muted hover:bg-white/10 transition-colors text-sm min-h-[44px]"
                >
                  Avbryt
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {!showBanForm ? (
              <button
                onClick={() => setShowBanForm(true)}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium min-h-[44px]"
              >
                {t('ban')}
              </button>
            ) : (
              <div className="w-full space-y-3">
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder={t('banReasonPlaceholder')}
                  rows={3}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleBan}
                    disabled={loading || !banReason.trim()}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 min-h-[44px]"
                  >
                    {loading ? '...' : t('confirmBan')}
                  </button>
                  <button
                    onClick={() => {
                      setShowBanForm(false)
                      setBanReason('')
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 text-muted hover:bg-white/10 transition-colors text-sm min-h-[44px]"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
