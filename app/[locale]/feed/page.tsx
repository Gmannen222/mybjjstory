import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const t = await getTranslations('feed')
  const supabase = await createClient()

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">{t('empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const profile = post.profiles as {
              display_name: string | null
              avatar_url: string | null
              belt_rank: string | null
              username: string | null
            } | null

            return (
              <article
                key={post.id}
                className="bg-surface rounded-xl p-5"
              >
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
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(post.created_at).toLocaleDateString('no-NO')}
                    </div>
                  </div>
                </div>

                {post.content && <p className="mb-3">{post.content}</p>}

                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>
                    {(post.reactions as { count: number }[])?.[0]?.count ?? 0} reaksjoner
                  </span>
                  <span>
                    {(post.comments as { count: number }[])?.[0]?.count ?? 0}{' '}
                    {t('comments')}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
