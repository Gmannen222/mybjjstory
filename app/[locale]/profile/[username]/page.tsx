import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Profile } from '@/lib/types/database'
import { BeltBadge } from '@/components/ui/BeltBadge'

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ locale: string; username: string }>
}) {
  const { locale, username } = await params
  const t = await getTranslations('profile')
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) {
    notFound()
  }

  const p = profile as Profile

  const { data: posts } = await supabase
    .from('posts')
    .select('*, comments (count), reactions (count)')
    .eq('user_id', p.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center gap-4">
          {p.avatar_url ? (
            <img src={p.avatar_url} alt="" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {(p.display_name || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{p.display_name}</h1>
            <p className="text-sm text-muted">@{p.username}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {p.belt_rank && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-24">{t('belt')}:</span>
              <BeltBadge rank={p.belt_rank} degrees={p.belt_degrees} />
            </div>
          )}
          {p.academy_name && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-24">{t('academy')}:</span>
              <span>{p.academy_name}</span>
            </div>
          )}
          {p.bio && <p className="text-muted mt-3">{p.bio}</p>}
        </div>
      </div>

      {posts && posts.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Innlegg</h2>
          {posts.map((post) => (
            <article key={post.id} className="bg-surface rounded-xl p-4">
              {post.content && <p>{post.content}</p>}
              <div className="flex items-center gap-4 text-xs text-muted mt-2">
                <span>
                  {new Date(post.created_at).toLocaleDateString('no-NO')}
                </span>
                <span>
                  {(post.reactions as { count: number }[])?.[0]?.count ?? 0}{' '}
                  reaksjoner
                </span>
                <span>
                  {(post.comments as { count: number }[])?.[0]?.count ?? 0}{' '}
                  kommentarer
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
