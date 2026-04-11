import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import ReactionButton from '@/components/feed/ReactionButton'
import CommentSection from '@/components/feed/CommentSection'
import CreatePostForm from '@/components/feed/CreatePostForm'
import EmptyState from '@/components/ui/EmptyState'

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
    data: { user },
  } = await supabase.auth.getUser()

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
  if (user && posts && posts.length > 0) {
    const postIds = posts.map((p) => p.id)
    const { data: myReactions } = await supabase
      .from('reactions')
      .select('post_id, type')
      .eq('user_id', user.id)
      .in('post_id', postIds)

    if (myReactions) {
      for (const r of myReactions) {
        userReactions[r.post_id] = r.type
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link
          href={`/${locale}/academies`}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm text-muted hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <span>🏫</span>
          <span>Akademier</span>
        </Link>
      </div>

      {user && <CreatePostForm locale={locale} />}

      {!posts || posts.length === 0 ? (
        <EmptyState
          icon="📝"
          title={t('emptyState.title')}
          description={t('emptyState.description')}
        />
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
                  <Link href={profile?.username ? `/${locale}/profile/${profile.username}` : '#'} className="shrink-0">
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
