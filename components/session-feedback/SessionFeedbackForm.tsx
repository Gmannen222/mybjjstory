'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { SessionFeedbackType } from '@/lib/types/database'

const FEEDBACK_TYPES: { key: SessionFeedbackType; icon: string }[] = [
  { key: 'tip', icon: '\u{1F4A1}' },
  { key: 'encouragement', icon: '\u{1F44F}' },
  { key: 'observation', icon: '\u{1F441}\uFE0F' },
  { key: 'question', icon: '\u2753' },
]

interface Partner {
  id: string
  name: string
  userId: string | null
}

export default function SessionFeedbackForm({
  sessionId,
  sessionDate,
  onSent,
}: {
  sessionId: string
  sessionDate: string
  onSent?: () => void
}) {
  const t = useTranslations('sessionFeedback')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const supabase = createClient()

  const [partners, setPartners] = useState<Partner[]>([])
  const [recipientId, setRecipientId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ id: string; username: string; display_name: string | null }[]>([])
  const [feedbackType, setFeedbackType] = useState<SessionFeedbackType>('encouragement')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Load sparring partners for this session
  useEffect(() => {
    async function loadPartners() {
      const { data: rounds } = await supabase
        .from('sparring_rounds')
        .select('partner_name, partner_user_id')
        .eq('session_id', sessionId)

      if (rounds) {
        const unique = new Map<string, Partner>()
        for (const r of rounds) {
          if (r.partner_user_id) {
            unique.set(r.partner_user_id, {
              id: r.partner_user_id,
              name: r.partner_name,
              userId: r.partner_user_id,
            })
          }
        }
        setPartners(Array.from(unique.values()))
      }
    }
    loadPartners()
  }, [sessionId, supabase])

  // Search for users by username
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .ilike('username', `%${searchQuery}%`)
        .limit(5)

      if (data) {
        setSearchResults(data)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientId || !message.trim()) return

    setSaving(true)
    setError(null)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setSaving(false)
      return
    }

    const { error: dbError } = await supabase.from('session_feedback').insert({
      session_id: sessionId,
      sender_id: sessionData.session.user.id,
      recipient_id: recipientId,
      message: message.trim(),
      feedback_type: feedbackType,
    })

    if (dbError) {
      console.error('Failed to send feedback:', dbError)
      setError(tCommon('error'))
      setSaving(false)
      return
    }

    setMessage('')
    setRecipientId('')
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)

    if (onSent) onSent()
    router.refresh()
  }

  const selectSearchResult = (profile: { id: string; username: string; display_name: string | null }) => {
    setRecipientId(profile.id)
    setSearchQuery(profile.display_name || profile.username)
    setSearchResults([])
    setShowSearch(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Recipient selection */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('recipient')} *
        </label>

        {/* Partners from sparring rounds */}
        {partners.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {partners.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setRecipientId(p.userId!)
                  setShowSearch(false)
                  setSearchQuery('')
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  recipientId === p.userId
                    ? 'bg-primary/20 text-primary ring-1 ring-primary'
                    : 'bg-surface-hover text-muted hover:text-foreground'
                }`}
              >
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="px-3 py-1.5 text-sm rounded-lg bg-surface-hover text-muted hover:text-foreground transition-colors"
            >
              + Annen
            </button>
          </div>
        )}

        {/* Search box (shown if no partners or user clicks "Annen") */}
        {(partners.length === 0 || showSearch) && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-surface border border-white/10 rounded-lg overflow-hidden shadow-xl">
                {searchResults.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => selectSearchResult(profile)}
                    className="w-full px-4 py-3 text-left hover:bg-surface-hover transition-colors text-sm"
                  >
                    <span className="font-medium">{profile.display_name || profile.username}</span>
                    {profile.username && (
                      <span className="text-muted ml-2">@{profile.username}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback type selector */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('type')}
        </label>
        <div className="flex gap-2">
          {FEEDBACK_TYPES.map(({ key, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFeedbackType(key)}
              className={`flex-1 py-2.5 text-center rounded-lg transition-all text-sm ${
                feedbackType === key
                  ? 'bg-primary/20 ring-2 ring-primary'
                  : 'bg-surface-hover hover:bg-surface-hover/80'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <br />
              <span className="text-xs">{t(`types.${key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('message')} *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
          placeholder={t('placeholder')}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{t('sendSuccess')}</p>}

      <button
        type="submit"
        disabled={saving || !recipientId || !message.trim()}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? tCommon('saving') : t('send')}
      </button>
    </form>
  )
}
