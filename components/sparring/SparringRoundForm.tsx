'use client'

import { useState, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createRound } from '@/lib/actions/sparring'
import SubmitButton from '@/components/ui/SubmitButton'

const RATING_LABELS = [
  { key: 'intensity', emojis: ['💤', '😌', '😤', '💪', '🔥'] },
  { key: 'technique', emojis: ['🤷', '🙂', '👍', '🎯', '⚡'] },
  { key: 'flow', emojis: ['🧱', '🌊', '🏄', '🎶', '✨'] },
  { key: 'learning', emojis: ['😶', '🤔', '📝', '💡', '🧠'] },
  { key: 'mood', emojis: ['😣', '😕', '😐', '😊', '😄'] },
] as const

type RatingKey = 'intensity' | 'technique' | 'flow' | 'learning' | 'mood'

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

  const [ratings, setRatings] = useState<Record<RatingKey, number | null>>({
    intensity: null,
    technique: null,
    flow: null,
    learning: null,
    mood: null,
  })
  const [isShared, setIsShared] = useState(false)

  const [state, formAction] = useActionState(createRound, { success: false, error: '' })

  // Reset form on success
  useEffect(() => {
    if (state.success) {
      setRatings({ intensity: null, technique: null, flow: null, learning: null, mood: null })
      setIsShared(false)
      if (onSaved) onSaved()
      router.refresh()
    }
  }, [state.success, onSaved, router])

  const setRating = (key: RatingKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="session_id" value={sessionId} />
      <input type="hidden" name="is_shared" value={String(isShared)} />
      {/* Hidden inputs for ratings */}
      {(Object.keys(ratings) as RatingKey[]).map((key) => (
        <input key={key} type="hidden" name={key} value={ratings[key] ?? ''} />
      ))}

      {/* Partner name */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('partner')} *
        </label>
        <input
          type="text"
          name="partner_name"
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
          name="notes"
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

      {!state.success && state.error && <p className="text-red-500 text-sm">{state.error}</p>}

      <SubmitButton
        pendingText={tCommon('saving')}
        className="w-full py-3"
      >
        {t('save')}
      </SubmitButton>
    </form>
  )
}
