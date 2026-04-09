import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import ReactionButton from '@/components/feed/ReactionButton'
import CommentSection from '@/components/feed/CommentSection'
import CreatePostForm from '@/components/feed/CreatePostForm'

export const dynamic = 'force-dynamic'

export default async function FeedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('feed')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (display_name, avatar_url, belt_rank, username),
      comments (count),
      reactions (count)
    `)
    .order('created_at', { ascending: false })
    .limit(30)

  // Get user's reactions if logged in
  let userReactions: Record<string, string> = {}
  if (session && posts && posts.length > 0) {
    const postIds = posts.map((p) => p.id)
    const { data: myReactions } = await supabase
      .from('reactions')
      .select('post_id, type')
      .eq('user_id', session.user.id)
      .in('post_id', postIds)

    if (myReactions) {
      for (const r of myReactions) {
        userReactions[r.post_id] = r.type
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      {session && <CreatePostForm locale={locale} />}

      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">{t('empty')}</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {posts.map((post) => {
            const profile = post.profiles as {
              display_name: string | null
              avatar_url: string | null
              belt_rank: string | null
              username: string | null
            } | null

            const commentCount =
              (post.comments as { count: number }[])?.[0]?.count ?? 0
            const reactionCount =
              (post.reactions as { count: number }[])?.[0]?.count ?? 0

            return (
              <article key={post.id} className="bg-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {(profile?.display_name || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-sm">
                      {profile?.display_name || 'Anonym'}
                      {profile?.username && (
                        <span className="text-muted font-normal ml-1">
                          @{profile.username}
                        </span>
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
                    </div>
                  </div>
                </div>

                {post.content && <p className="mb-4">{post.content}</p>}

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
      )}
    </div>
  )
}
