'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { SessionFeedback, SessionFeedbackType } from '@/lib/types/database'
import Link from 'next/link'

const TYPE_ICONS: Record<SessionFeedbackType, string> = {
  tip: '\u{1F4A1}',
  encouragement: '\u{1F44F}',
  observation: '\u{1F441}\uFE0F',
  question: '\u2753',
}

interface FeedbackWithDetails extends SessionFeedback {
  sender?: { display_name: string | null; username: string | null }
  session?: { date: string }
}

interface GroupedFeedback {
  date: string
  sessionId: string
  items: FeedbackWithDetails[]
}

export default function FeedbackInbox() {
  const t = useTranslations('sessionFeedback')
  const locale = useLocale()
  const supabase = createClient()
  const [groups, setGroups] = useState<GroupedFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getSession()
      if (!userData.session) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('session_feedback')
        .select(`
          *,
          sender:profiles!session_feedback_sender_id_fkey(display_name, username),
          session:training_sessions!session_feedback_session_id_fkey(date)
        `)
        .eq('recipient_id', userData.session.user.id)
        .order('created_at', { ascending: false })

      if (data) {
        // Group by session
        const grouped = new Map<string, GroupedFeedback>()
        for (const item of data as FeedbackWithDetails[]) {
          const key = item.session_id
          if (!grouped.has(key)) {
            grouped.set(key, {
              date: item.session?.date || '',
              sessionId: item.session_id,
              items: [],
            })
          }
          grouped.get(key)!.items.push(item)
        }
        setGroups(Array.from(grouped.values()))
      }

      setLoading(false)
    }
    load()
  }, [supabase])

  const markAsRead = async (id: string) => {
    await supabase
      .from('session_feedback')
      .update({ is_read: true })
      .eq('id', id)

    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        ),
      }))
    )
  }

  const toggleExpand = async (id: string, isRead: boolean) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      if (!isRead) {
        await markAsRead(id)
      }
    }
  }

  if (loading) {
    return <p className="text-muted text-sm text-center py-8">{t('noFeedback')}</p>
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">{'\u{1F4AC}'}</p>
        <p className="text-muted">{t('noFeedback')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const unreadCount = group.items.filter((i) => !i.is_read).length

        return (
          <div key={group.sessionId} className="bg-surface rounded-xl overflow-hidden">
            {/* Session header */}
            <Link
              href={`/${locale}/training/${group.sessionId}`}
              className="flex items-center justify-between px-4 py-3 bg-surface-hover hover:bg-surface-hover/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t('fromSession')}</span>
                <span className="text-sm text-primary font-semibold">{group.date}</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full font-medium">
                  {unreadCount} {t('unread')}
                </span>
              )}
            </Link>

            {/* Feedback items */}
            <div className="divide-y divide-white/5">
              {group.items.map((item) => {
                const isExpanded = expandedId === item.id
                const senderName = item.sender?.display_name || item.sender?.username || '—'

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleExpand(item.id, item.is_read)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      !item.is_read ? 'bg-primary/5' : 'hover:bg-surface-hover/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{TYPE_ICONS[item.feedback_type]}</span>
                        <span className="font-medium text-sm truncate">{senderName}</span>
                        <span className="text-xs text-muted">{t(`types.${item.feedback_type}`)}</span>
                        {!item.is_read && (
                          <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted shrink-0">
                        {new Date(item.created_at).toLocaleDateString('no-NO', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    {isExpanded && (
                      <p className="mt-2 text-sm whitespace-pre-wrap text-foreground">
                        {item.message}
                      </p>
                    )}

                    {!isExpanded && (
                      <p className="mt-1 text-xs text-muted truncate">
                        {item.message}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
