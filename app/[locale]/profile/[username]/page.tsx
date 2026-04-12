import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Profile, Competition, Injury } from '@/lib/types/database'
import { BeltBadge } from '@/components/ui/BeltBadge'
import ProfileAvatar from '@/components/profile/ProfileAvatar'

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ locale: string; username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const p = profile as Profile
  const currentYear = new Date().getFullYear()
  const yearsTrained = p.training_since_year ? currentYear - p.training_since_year : null

  // Fetch public data based on visibility settings
  const [competitionsRes, injuriesRes, postsRes] = await Promise.all([
    p.show_competitions
      ? supabase.from('competitions').select('*').eq('user_id', p.id).eq('is_public', true).order('event_date', { ascending: false }).limit(10)
      : { data: null },
    p.show_injuries
      ? supabase.from('injuries').select('*').eq('user_id', p.id).is('date_recovered', null).order('date_occurred', { ascending: false })
      : { data: null },
    p.show_feed
      ? supabase.from('posts').select('*, comments (count), reactions (count)').eq('user_id', p.id).eq('moderation_status', 'active').order('created_at', { ascending: false }).limit(10)
      : { data: null },
  ])

  const competitions = (competitionsRes.data || []) as Competition[]
  const activeInjuries = (injuriesRes.data || []) as Injury[]
  const posts = postsRes.data || []

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            userId={p.id}
            avatarUrl={p.avatar_url}
            displayName={p.display_name}
            size="md"
          />
          <div>
            <h1 className="text-xl font-bold">{p.display_name}</h1>
            <p className="text-sm text-muted">@{p.username}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {p.show_belt && p.belt_rank && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-32">Belte:</span>
              <BeltBadge rank={p.belt_rank} degrees={p.belt_degrees} />
            </div>
          )}
          {p.show_academy && p.academy_name && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-32">Akademi:</span>
              <span>{p.academy_name}</span>
            </div>
          )}
          {p.show_training_since && yearsTrained !== null && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-32">Trent i:</span>
              <span>{yearsTrained} år (siden {p.training_since_year})</span>
            </div>
          )}
          {p.show_favorite_guard && p.favorite_guard && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-32">Favorittguard:</span>
              <span>{p.favorite_guard}</span>
            </div>
          )}
          {p.show_favorite_submission && p.favorite_submission && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-32">Favorittsub:</span>
              <span>{p.favorite_submission}</span>
            </div>
          )}
          {p.bio && <p className="text-muted mt-4">{p.bio}</p>}
        </div>
      </div>

      {/* Active injuries */}
      {p.show_injuries && activeInjuries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Aktive skader
          </h2>
          <div className="space-y-2">
            {activeInjuries.map((injury) => (
              <div key={injury.id} className="bg-surface rounded-xl p-3 border-l-4 border-red-400">
                <div className="font-medium text-sm">{injury.body_part}</div>
                {injury.description && (
                  <p className="text-xs text-muted mt-0.5">{injury.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competition results */}
      {p.show_competitions && competitions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Konkurranser</h2>
          <div className="space-y-2">
            {competitions.map((c) => (
              <div key={c.id} className="bg-surface rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {c.result === 'gold' && '🥇'}
                    {c.result === 'silver' && '🥈'}
                    {c.result === 'bronze' && '🥉'}
                    {c.event_name}
                  </div>
                  <div className="text-xs text-muted">
                    {c.event_date} {c.organization && `· ${c.organization}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(c.wins > 0 || c.losses > 0) && (
                    <span className="text-xs">
                      <span className="text-green-400">{c.wins}W</span>
                      /<span className="text-red-400">{c.losses}L</span>
                    </span>
                  )}
                  {c.verified && (
                    <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {p.show_feed && posts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Innlegg</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-surface rounded-xl p-4">
                {post.content && <p>{post.content}</p>}
                <div className="flex items-center gap-4 text-xs text-muted mt-2">
                  <span>{new Date(post.created_at).toLocaleDateString('no-NO')}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
