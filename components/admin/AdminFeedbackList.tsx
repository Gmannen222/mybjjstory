'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { getTemplatesForType } from '@/lib/feedback-templates'

interface FeedbackItem {
  id: string
  type: string
  message: string
  contact_email: string | null
  status: string
  admin_note: string | null
  admin_reply: string | null
  replied_at: string | null
  email_sent_at: string | null
  created_at: string
  user_id: string
  profiles: {
    display_name: string | null
    email: string | null
    belt_rank: string | null
  } | null
}

const TYPE_ICONS: Record<string, string> = {
  suggestion: '💡',
  wish: '🌟',
  bug: '🐛',
  other: '💬',
}

const TYPE_LABELS: Record<string, string> = {
  suggestion: 'Forslag',
  wish: 'Ønske',
  bug: 'Feilrapport',
  other: 'Annet',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-400/20 text-blue-400',
  read: 'bg-yellow-400/20 text-yellow-400',
  resolved: 'bg-green-400/20 text-green-400',
}

export default function AdminFeedbackList({
  feedback,
}: {
  feedback: FeedbackItem[]
  locale?: string
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {feedback.map((fb) => (
        <FeedbackCard
          key={fb.id}
          item={fb}
          expanded={expandedId === fb.id}
          onToggle={() => setExpandedId(expandedId === fb.id ? null : fb.id)}
        />
      ))}
    </div>
  )
}

function FeedbackCard({
  item,
  expanded,
  onToggle,
}: {
  item: FeedbackItem
  expanded: boolean
  onToggle: () => void
}) {
  const t = useTranslations('admin.feedback')
  const router = useRouter()
  const [note, setNote] = useState(item.admin_note || '')
  const [reply, setReply] = useState(item.admin_reply || '')
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendEmail, setSendEmail] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emailResult, setEmailResult] = useState<string | null>(null)

  const templates = getTemplatesForType(item.type)

  async function updateStatus(newStatus: string) {
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.from('feedback').update({ status: newStatus }).eq('id', item.id)
    if (err) {
      setError(err.message)
      return
    }
    router.refresh()
  }

  async function saveNote() {
    setError(null)
    setSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase.from('feedback').update({ admin_note: note.trim() || null }).eq('id', item.id)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    router.refresh()
  }

  async function sendReply() {
    if (!reply.trim()) return
    setError(null)
    setEmailResult(null)
    setSending(true)

    try {
      const res = await fetch('/api/admin/feedback-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId: item.id,
          reply: reply.trim(),
          sendEmail: sendEmail && !!item.contact_email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Noe gikk galt')
        setSending(false)
        return
      }

      if (data.emailSent) {
        setEmailResult('Svar lagret og e-post sendt!')
      } else if (sendEmail && item.contact_email && !data.emailSent) {
        setEmailResult('Svar lagret. E-post kunne ikke sendes (sjekk RESEND_API_KEY).')
      } else {
        setEmailResult('Svar lagret i appen.')
      }
    } catch {
      setError('Nettverksfeil. Prøv igjen.')
    }

    setSending(false)
    router.refresh()
  }

  const userName = item.profiles?.display_name || item.profiles?.email || t('anonymous')

  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      {/* Header — clickable */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">{TYPE_ICONS[item.type] || '💬'}</span>
            <div>
              <div className="font-medium text-sm">{TYPE_LABELS[item.type]}</div>
              <div className="text-xs text-muted">{userName}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {item.email_sent_at && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400" title="E-post sendt">
                ✉
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>
              {item.status === 'new' ? t('new') : item.status === 'read' ? t('read') : t('resolved')}
            </span>
            <span className="text-xs text-muted">
              {new Date(item.created_at).toLocaleDateString('nb-NO', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="text-muted text-sm">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
        <p className="text-sm mt-2 line-clamp-2">{item.message}</p>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {emailResult && (
            <div className="text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2">
              {emailResult}
            </div>
          )}

          {/* Full message */}
          <div>
            <p className="text-sm whitespace-pre-wrap">{item.message}</p>
          </div>

          {/* Contact email */}
          {item.contact_email && (
            <div className="text-sm">
              <span className="text-muted">{t('contactEmail')}:</span>{' '}
              <a href={`mailto:${item.contact_email}`} className="text-primary hover:underline">
                {item.contact_email}
              </a>
            </div>
          )}

          {/* Status actions */}
          <div className="flex gap-2 flex-wrap">
            {item.status !== 'new' && (
              <button
                onClick={() => updateStatus('new')}
                className="px-3 py-1.5 text-xs rounded-lg bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-colors"
              >
                {t('markNew')}
              </button>
            )}
            {item.status !== 'read' && (
              <button
                onClick={() => updateStatus('read')}
                className="px-3 py-1.5 text-xs rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors"
              >
                {t('markRead')}
              </button>
            )}
            {item.status !== 'resolved' && (
              <button
                onClick={() => updateStatus('resolved')}
                className="px-3 py-1.5 text-xs rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors"
              >
                {t('markResolved')}
              </button>
            )}
          </div>

          {/* Admin note (internal) */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              {t('adminNote')} <span className="text-muted/50">(intern)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('adminNotePlaceholder')}
              rows={2}
              className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <button
              onClick={saveNote}
              disabled={saving}
              className="mt-2 px-3 py-1.5 text-xs bg-primary text-background rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {saving ? '...' : t('saveNote')}
            </button>
          </div>

          {/* Reply section */}
          <div className="border border-primary/20 bg-primary/5 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-medium text-primary">
              Svar til bruker <span className="text-primary/50">(synlig for brukeren)</span>
            </label>

            {/* Previous reply */}
            {item.admin_reply && item.replied_at && (
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{item.admin_reply}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-muted">
                    Besvart {new Date(item.replied_at).toLocaleDateString('nb-NO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {item.email_sent_at && (
                    <span className="text-xs text-green-400">✉ E-post sendt</span>
                  )}
                </div>
              </div>
            )}

            {/* Quick template buttons */}
            <div>
              <p className="text-xs text-muted mb-2">Hurtigsvar:</p>
              <div className="flex gap-2 flex-wrap">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setReply(tmpl.message)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply textarea */}
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Skriv et svar som brukeren kan se..."
              rows={3}
              className="w-full bg-background/50 border border-primary/20 rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />

            {/* Email toggle + send */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={sendEmail && !!item.contact_email}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  disabled={!item.contact_email}
                  className="rounded border-white/20 bg-background/50 text-primary focus:ring-primary/50"
                />
                <span className={item.contact_email ? 'text-foreground' : 'text-muted'}>
                  Send e-post til {item.contact_email || '(ingen e-post oppgitt)'}
                </span>
              </label>

              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="px-4 py-1.5 text-xs bg-primary text-background rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {sending ? 'Sender...' : 'Send svar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
