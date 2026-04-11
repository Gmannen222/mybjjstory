'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

const RATING_LABELS = [
  { key: 'intensity', emojis: ['💤', '😌', '😤', '💪', '🔥'] },
  { key: 'technique', emojis: ['🤷', '🙂', '👍', '🎯', '⚡'] },
  { key: 'flow', emojis: ['🧱', '🌊', '🏄', '🎶', '✨'] },
  { key: 'learning', emojis: ['😶', '🤔', '📝', '💡', '🧠'] },
  { key: 'mood', emojis: ['😣', '😕', '😐', '😊', '😄'] },
] as const

type RatingKey = 'intensity' | 'technique' | 'flow' | 'learning' | 'mood'

const DB_FIELD_MAP: Record<RatingKey, string> = {
  intensity: 'intensity',
  technique: 'technique_rating',
  flow: 'flow_rating',
  learning: 'learning_rating',
  mood: 'mood_rating',
}

export default function SparringRoundForm({
  sessionId,
  onSaved,
}: {
  sessionId: string
  onSaved?: () => void
}) {
  const t = useTranslations('sparring')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const supabase = createClient()

  const [partnerName, setPartnerName] = useState('')
  const [ratings, setRatings] = useState<Record<RatingKey, number | null>>({
    intensity: null,
    technique: null,
    flow: null,
    learning: null,
    mood: null,
  })
  const [notes, setNotes] = useState('')
  const [isShared, setIsShared] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setRating = (key: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partnerName.trim()) return
    setSaving(true)
    setError(null)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setSaving(false)
      return
    }

    const payload: Record<string, unknown> = {
      session_id: sessionId,
      user_id: sessionData.session.user.id,
      partner_name: partnerName.trim(),
      notes: notes.trim() || null,
      is_shared: isShared,
    }

    for (const key of Object.keys(ratings) as RatingKey[]) {
      payload[DB_FIELD_MAP[key]] = ratings[key]
    }

    const { error: dbError } = await supabase.from('sparring_rounds').insert(payload)

    if (dbError) {
      console.error('Failed to save sparring round:', dbError)
      setError(tCommon('error'))
      setSaving(false)
      return
    }

    setPartnerName('')
    setRatings({ intensity: null, technique: null, flow: null, learning: null, mood: null })
    setNotes('')
    setIsShared(false)
    setSaving(false)

    if (onSaved) onSaved()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Partner name */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('partner')} *
        </label>
        <input
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder={t('partnerPlaceholder')}
          required
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      {/* Rating dimensions */}
      <div className="space-y-4">
        {RATING_LABELS.map(({ key, emojis }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-muted mb-2">
              {t(key)}
            </label>
            <div className="flex gap-1">
              {emojis.map((emoji, i) => {
                const value = i + 1
                const selected = ratings[key] === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(key, value)}
                    className={`flex-1 py-2.5 text-xl rounded-lg transition-all ${
                      selected
                        ? 'bg-primary/20 ring-2 ring-primary scale-105'
                        : ratings[key] !== null && ratings[key]! < value
                          ? 'bg-surface-hover opacity-40 hover:opacity-70'
                          : 'bg-surface-hover hover:bg-surface-hover/80'
                    }`}
                    title={`${value}/5`}
                  >
                    {emoji}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('notes')}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={t('notesPlaceholder')}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {/* Share toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isShared}
          onChange={(e) => setIsShared(e.target.checked)}
          className="w-5 h-5 rounded border-white/20 bg-surface text-primary focus:ring-primary"
        />
        <span className="text-sm text-muted">{t('shareWith')}</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving || !partnerName.trim()}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? tCommon('saving') : t('save')}
      </button>
    </form>
  )
}
