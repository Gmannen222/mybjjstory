'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

interface CommentData {
  id: string
  content: string
  created_at: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default function CommentSection({
  postId,
  initialCount,
}: {
  postId: string
  initialCount: number
}) {
  const [comments, setComments] = useState<CommentData[]>([])
  const [newComment, setNewComment] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const supabase = createClient()
  const t = useTranslations('feed')

  useEffect(() => {
    if (!expanded) return

    setLoading(true)
    supabase
      .from('comments')
      .select('id, content, created_at, profiles:user_id (display_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setComments((data as unknown as CommentData[]) || [])
        setLoading(false)
      })
  }, [expanded, postId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSending(true)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setSending(false)
      return
    }

    const { data } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: sessionData.session.user.id,
        content: newComment.trim(),
      })
      .select('id, content, created_at, profiles:user_id (display_name, avatar_url)')
      .single()

    if (data) {
      setComments((prev) => [...prev, data as unknown as CommentData])
    }

    setNewComment('')
    setSending(false)
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        {initialCount} {t('comments')}
        {expanded ? ' ▴' : ' ▾'}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {loading ? (
            <p className="text-xs text-muted">Laster...</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {(c.profiles?.display_name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-semibold">
                    {c.profiles?.display_name || 'Anonym'}
                  </span>
                  <p className="text-sm">{c.content}</p>
                </div>
              </div>
            ))
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`${t('comment')}...`}
              className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={sending || !newComment.trim()}
              className="px-3 py-2 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
