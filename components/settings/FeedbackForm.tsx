'use client'

import { useState, useEffect, useActionState } from 'react'
import { submitFeedback } from '@/lib/actions/feedback'
import SubmitButton from '@/components/ui/SubmitButton'
import type { FeedbackType } from '@/lib/types/database'

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'suggestion', label: 'Forslag', icon: '💡' },
  { value: 'wish', label: 'Ønske', icon: '✨' },
  { value: 'bug', label: 'Feil', icon: '🐛' },
  { value: 'other', label: 'Annet', icon: '💬' },
]

export default function FeedbackForm({
  locale,
  userEmail,
}: {
  locale: string
  userEmail: string
}) {
  const [type, setType] = useState<FeedbackType>('suggestion')
  const [sent, setSent] = useState(false)

  const [state, formAction] = useActionState(submitFeedback, { success: false, error: '' })

  // Show success message and auto-reset
  useEffect(() => {
    if (state.success) {
      setSent(true)
      const timer = setTimeout(() => setSent(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [state.success])

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      {/* Type picker */}
      <div className="flex gap-2">
        {FEEDBACK_TYPES.map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              type === value
                ? 'bg-primary text-background'
                : 'bg-background text-muted hover:text-foreground'
            }`}
          >
            <span className="block text-lg mb-0.5">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Message */}
      <textarea
        name="message"
        key={state.success ? 'reset' : 'active'}
        placeholder={
          type === 'bug'
            ? 'Beskriv feilen du opplevde...'
            : type === 'wish'
              ? 'Hva ønsker du at vi legger til?'
              : type === 'suggestion'
                ? 'Del dine ideer og forslag...'
                : 'Skriv din melding...'
        }
        rows={3}
        required
        className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary resize-none text-sm"
      />

      {/* Contact email */}
      <div>
        <label className="block text-xs text-muted mb-1">
          E-post for oppfølging (valgfritt)
        </label>
        <input
          type="email"
          name="contact_email"
          defaultValue={userEmail}
          className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary text-sm"
        />
      </div>

      {!state.success && state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <SubmitButton
        pendingText="Sender..."
        className={`w-full py-3 rounded-xl text-sm ${
          sent ? 'bg-green-500/20 text-green-400' : ''
        }`}
      >
        {sent ? '✓ Takk for tilbakemeldingen!' : 'Send tilbakemelding'}
      </SubmitButton>
    </form>
  )
}
