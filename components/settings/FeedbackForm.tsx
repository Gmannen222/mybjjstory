'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  const [message, setMessage] = useState('')
  const [contactEmail, setContactEmail] = useState(userEmail)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError(null)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setSending(false); return }

    const { error: insertError } = await supabase.from('feedback').insert({
      user_id: sessionData.session.user.id,
      type,
      message: message.trim(),
      contact_email: contactEmail || null,
    })

    if (insertError) {
      setError('Kunne ikke sende. Prøv igjen.')
      setSending(false)
      return
    }

    setSent(true)
    setMessage('')
    setSending(false)
    router.refresh()

    // Reset success state after 3s
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full px-4 py-2.5 bg-background border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={sending || !message.trim()}
        className={`w-full py-3 font-semibold rounded-xl transition-all text-sm disabled:opacity-50 ${
          sent
            ? 'bg-green-500/20 text-green-400'
            : 'bg-primary text-background hover:bg-primary-hover'
        }`}
      >
        {sent ? '✓ Takk for tilbakemeldingen!' : sending ? 'Sender...' : 'Send tilbakemelding'}
      </button>
    </form>
  )
}
