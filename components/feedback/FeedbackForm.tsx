'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

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
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setStatus('sending')
    const supabase = createClient()

    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      type,
      message: message.trim(),
      contact_email: email.trim() || null,
    })

    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      setMessage('')
      setEmail('')
      setType('suggestion')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-surface rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="text-xl font-bold mb-2">{t('success')}</h2>
        <p className="text-muted mb-6">{t('successDescription')}</p>
        <button
          onClick={() => setStatus('idle')}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          {t('sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 space-y-5">
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p className="text-red-400 text-sm">{t('error')}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending' || !message.trim()}
        className="w-full px-4 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  )
}
