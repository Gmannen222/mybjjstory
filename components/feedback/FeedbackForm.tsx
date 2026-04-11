'use client'

import { useState, useEffect, useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { submitFeedback } from '@/lib/actions/feedback'
import SubmitButton from '@/components/ui/SubmitButton'

const FEEDBACK_TYPES = ['suggestion', 'wish', 'bug', 'other'] as const

const TYPE_ICONS: Record<string, string> = {
  suggestion: '💡',
  wish: '🌟',
  bug: '🐛',
  other: '💬',
}

const TYPE_KEYS: Record<string, string> = {
  suggestion: 'typeSuggestion',
  wish: 'typeWish',
  bug: 'typeBug',
  other: 'typeOther',
}

export default function FeedbackForm({ userId }: { userId: string }) {
  const t = useTranslations('feedback')
  const [type, setType] = useState<string>('suggestion')
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(submitFeedback, { success: false, error: '' })

  // Show success view on successful submission
  useEffect(() => {
    if (state.success) {
      setShowSuccess(true)
    }
  }, [state.success])

  if (showSuccess) {
    return (
      <div className="bg-surface rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="text-xl font-bold mb-2">{t('success')}</h2>
        <p className="text-muted mb-6">{t('successDescription')}</p>
        <button
          onClick={() => setShowSuccess(false)}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          {t('sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} className="bg-surface rounded-xl p-6 space-y-5">
      <input type="hidden" name="type" value={type} />

      {/* Type selector */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('type')}</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FEEDBACK_TYPES.map((ft) => (
            <button
              key={ft}
              type="button"
              onClick={() => setType(ft)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                type === ft
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-background/50 text-muted hover:text-foreground border border-white/5'
              }`}
            >
              <span>{TYPE_ICONS[ft]}</span>
              <span>{t(TYPE_KEYS[ft])}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="feedback-message" className="block text-sm font-medium mb-2">
          {t('message')}
        </label>
        <textarea
          id="feedback-message"
          name="message"
          placeholder={t('messagePlaceholder')}
          rows={5}
          required
          className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Email (optional) */}
      <div>
        <label htmlFor="feedback-email" className="block text-sm font-medium mb-2">
          {t('email')}
        </label>
        <input
          id="feedback-email"
          type="email"
          name="contact_email"
          placeholder={t('emailPlaceholder')}
          className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Error message */}
      {!state.success && state.error && (
        <p className="text-red-400 text-sm">{state.error}</p>
      )}

      {/* Submit */}
      <SubmitButton
        pendingText={t('sending')}
        className="w-full py-3"
      >
        {t('submit')}
      </SubmitButton>
    </form>
  )
}
