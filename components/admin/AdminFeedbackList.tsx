'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface FeedbackItem {
  id: string
  type: string
  message: string
  contact_email: string | null
  status: string
  admin_note: string | null
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
  locale,
}: {
  feedback: FeedbackItem[]
  locale: string
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
  const [saving, setSaving] = useState(false)

  async function updateStatus(newStatus: string) {
    const supabase = createClient()
    await supabase.from('feedback').update({ status: newStatus }).eq('id', item.id)
    router.refresh()
  }

  async function saveNote() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('feedback').update({ admin_note: note.trim() || null }).eq('id', item.id)
    setSaving(false)
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

          {/* Admin note */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              {t('adminNote')}
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
        </div>
      )}
    </div>
  )
}
