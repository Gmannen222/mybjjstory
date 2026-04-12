'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import ReactionButton from '@/components/feed/ReactionButton'
import CommentSection from '@/components/feed/CommentSection'
import EditPostForm from '@/components/feed/EditPostForm'
import ReportButton from '@/components/moderation/ReportButton'
import OnlineDot from '@/components/ui/OnlineDot'
import { useOnlineStatus } from '@/components/realtime/RealtimeProvider'
import { useRealtimeInserts } from '@/lib/hooks/useRealtimeInserts'

export interface PostWithProfile {
  id: string
  content: string | null
  created_at: string
  updated_at: string | null
  user_id: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
    belt_rank: string | null
    username: string | null
  } | null
  comments: { count: number }[]
  reactions: { count: number }[]
}

interface LoadMorePostsProps {
  initialPosts: PostWithProfile[]
  initialUserReactions: Record<string, string>
  locale: string
  userId: string | null
  pageSize: number
}

export default function LoadMorePosts({
  initialPosts,
  initialUserReactions,
  locale,
  userId,
  pageSize,
}: LoadMorePostsProps) {
  const t = useTranslations('feed')
  const [posts, setPosts] = useState<PostWithProfile[]>(initialPosts)
  const [userReactions, setUserReactions] = useState<Record<string, string>>(initialUserReactions)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length >= pageSize)
  const [newPostCount, setNewPostCount] = useState(0)
  const [pendingPosts, setPendingPosts] = useState<string[]>([])
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const { isOnline } = useOnlineStatus()

  const handleNewPost = useCallback(
    (payload: Record<string, unknown>) => {
      const postUserId = payload.user_id as string
      // Don't count own posts
      if (postUserId === userId) return
      setPendingPosts((prev) => [...prev, payload.id as string])
      setNewPostCount((prev) => prev + 1)
    },
    [userId]
  )

  useRealtimeInserts('posts', null, handleNewPost)

  const showNewPosts = async () => {
    if (pendingPosts.length === 0) return
    const supabase = createClient()
    const { data: newPosts } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (display_name, avatar_url, belt_rank, username),
        comments (count),
        reactions (count)
      `)
      .eq('moderation_status', 'active')
      .in('id', pendingPosts)
      .order('created_at', { ascending: false })

    if (newPosts && newPosts.length > 0) {
      setPosts((prev) => [...(newPosts as PostWithProfile[]), ...prev])
    }
    setPendingPosts([])
    setNewPostCount(0)
  }

  const loadMore = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: newPosts } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (display_name, avatar_url, belt_rank, username),
          comments (count),
          reactions (count)
        `)
        .eq('moderation_status', 'active')
        .order('created_at', { ascending: false })
        .range(posts.length, posts.length + pageSize - 1)

      if (!newPosts || newPosts.length === 0) {
        setHasMore(false)
        return
      }

      // Fetch user reactions for new posts
      if (userId && newPosts.length > 0) {
        const postIds = newPosts.map((p) => p.id)
        const { data: myReactions } = await supabase
          .from('reactions')
          .select('post_id, type')
          .eq('user_id', userId)
          .in('post_id', postIds)

        if (myReactions) {
          const newReactions = { ...userReactions }
          for (const r of myReactions) {
            newReactions[r.post_id] = r.type
          }
          setUserReactions(newReactions)
        }
      }

      setPosts((prev) => [...prev, ...(newPosts as PostWithProfile[])])
      if (newPosts.length < pageSize) {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {newPostCount > 0 && (
        <button
          onClick={showNewPosts}
          className="w-full mt-4 px-4 py-2.5 bg-primary/10 border border-primary/30 rounded-xl text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
        >
          Vis {newPostCount} {newPostCount === 1 ? 'nytt innlegg' : 'nye innlegg'}
        </button>
      )}

      <div className="space-y-4 mt-6">
        {posts.map((post) => {
          const profile = post.profiles

          const commentCount =
            (post.comments as { count: number }[])?.[0]?.count ?? 0
          const reactionCount =
            (post.reactions as { count: number }[])?.[0]?.count ?? 0

          return (
            <article key={post.id} className="bg-surface rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Link href={profile?.username ? `/${locale}/profile/${profile.username}` : '#'} className="shrink-0 relative">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full hover:ring-2 hover:ring-primary transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary hover:ring-2 hover:ring-primary transition-all">
                      {(profile?.display_name || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <OnlineDot isOnline={isOnline(post.user_id)} size="sm" />
                </Link>
                <div>
                  <div className="font-semibold text-sm">
                    {profile?.username ? (
                      <Link href={`/${locale}/profile/${profile.username}`} className="hover:text-primary transition-colors">
                        {profile?.display_name || 'Anonym'}
                      </Link>
                    ) : (
                      profile?.display_name || 'Anonym'
                    )}
                    {profile?.username && (
                      <Link href={`/${locale}/profile/${profile.username}`} className="text-muted font-normal ml-1 hover:text-primary transition-colors">
                        @{profile.username}
                      </Link>
                    )}
                  </div>
                  <div className="text-xs text-muted">
                    {new Date(post.created_at).toLocaleDateString('no-NO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {post.updated_at && (
                      <span className="ml-1 text-muted/60">({t('edited')})</span>
                    )}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {post.user_id === userId && editingPostId !== post.id && (
                    <button
                      onClick={() => setEditingPostId(post.id)}
                      className="text-xs text-muted hover:text-primary transition-colors"
                      title={t('edit')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                      </svg>
                    </button>
                  )}
                  {userId && post.user_id !== userId && (
                    <ReportButton contentType="post" contentId={post.id} />
                  )}
                </div>
              </div>

              {editingPostId === post.id ? (
                <EditPostForm
                  postId={post.id}
                  currentContent={post.content || ''}
                  onCancel={() => setEditingPostId(null)}
                  onSaved={() => {
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id
                          ? { ...p, content: (document.getElementById(`edit-post-${post.id}`) as HTMLTextAreaElement)?.value || p.content, updated_at: new Date().toISOString() }
                          : p
                      )
                    )
                    setEditingPostId(null)
                  }}
                />
              ) : (
                post.content && <p className="mb-4">{post.content}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <ReactionButton
                  postId={post.id}
                  initialCount={reactionCount}
                  userReaction={
                    (userReactions[post.id] as 'oss' | 'high_five' | 'fire') || null
                  }
                />
                <CommentSection
                  postId={post.id}
                  initialCount={commentCount}
                />
              </div>
            </article>
          )
        })}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-surface border border-white/10 rounded-xl text-sm font-semibold hover:border-primary/30 hover:text-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Laster...
              </span>
            ) : (
              'Last flere'
            )}
          </button>
        </div>
      )}
    </>
  )
}
