import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import CreatePostForm from '@/components/feed/CreatePostForm'
import LoadMorePosts, { type PostWithProfile } from '@/components/feed/LoadMorePosts'
import EmptyState from '@/components/ui/EmptyState'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 30

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
    .eq('moderation_status', 'active')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  // Get user's reactions if logged in
  const userReactions: Record<string, string> = {}
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
        <LoadMorePosts
          initialPosts={posts as PostWithProfile[]}
          initialUserReactions={userReactions}
          locale={locale}
          userId={user?.id ?? null}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  )
}
