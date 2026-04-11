'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { SessionFeedback, SessionFeedbackType } from '@/lib/types/database'

const TYPE_ICONS: Record<SessionFeedbackType, string> = {
  tip: '\u{1F4A1}',
  encouragement: '\u{1F44F}',
  observation: '\u{1F441}\uFE0F',
  question: '\u2753',
}

interface FeedbackWithProfile extends SessionFeedback {
  sender?: { display_name: string | null; username: string | null; avatar_url: string | null }
  recipient?: { display_name: string | null; username: string | null; avatar_url: string | null }
}

export default function SessionFeedbackList({
  sessionId,
  currentUserId,
}: {
  sessionId: string
  currentUserId: string
}) {
  const t = useTranslations('sessionFeedback')
  const supabase = createClient()
  const [feedback, setFeedback] = useState<FeedbackWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('session_feedback')
        .select(`
          *,
          sender:profiles!session_feedback_sender_id_fkey(display_name, username, avatar_url),
          recipient:profiles!session_feedback_recipient_id_fkey(display_name, username, avatar_url)
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })

      if (data) {
        setFeedback(data as FeedbackWithProfile[])

        // Mark unread received feedback as read
        const unreadIds = data
          .filter((f) => f.recipient_id === currentUserId && !f.is_read)
          .map((f) => f.id)

        if (unreadIds.length > 0) {
          await supabase
            .from('session_feedback')
            .update({ is_read: true })
            .in('id', unreadIds)
        }
      }

      setLoading(false)
    }
    load()
  }, [sessionId, currentUserId, supabase])

  if (loading) return null
  if (feedback.length === 0) return null

  return (
    <div className="space-y-3">
      {feedback.map((f) => {
        const isSender = f.sender_id === currentUserId
        const personName = isSender
          ? f.recipient?.display_name || f.recipient?.username || '—'
          : f.sender?.display_name || f.sender?.username || '—'
        const directionLabel = isSender ? t('sentTo') : t('sentBy')

        return (
          <div
            key={f.id}
            className={`p-4 rounded-lg border transition-colors ${
              !f.is_read && !isSender
                ? 'bg-primary/5 border-primary/20'
                : 'bg-surface-hover border-white/5'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg shrink-0">{TYPE_ICONS[f.feedback_type]}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted">{directionLabel}</span>
                    <span className="font-medium truncate">{personName}</span>
                    {!f.is_read && !isSender && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full font-medium">
                        {t('unread')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted">
                    {t(`types.${f.feedback_type}`)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted shrink-0">
                {new Date(f.created_at).toLocaleDateString('no-NO', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
            <p className="mt-2 text-sm whitespace-pre-wrap">{f.message}</p>
          </div>
        )
      })}
    </div>
  )
}
