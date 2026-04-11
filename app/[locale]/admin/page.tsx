import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const BELT_COLORS: Record<string, string> = {
  white: 'bg-white',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  brown: 'bg-amber-700',
  black: 'bg-gray-900 border border-white/20',
}

const BELT_LABELS: Record<string, string> = {
  white: 'Hvitt',
  blue: 'Blått',
  purple: 'Lilla',
  brown: 'Brunt',
  black: 'Svart',
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('admin')
  const supabase = await createClient()

  // Fetch all stats in parallel
  const [
    { count: totalUsers },
    { count: totalSessions },
    { count: totalPosts },
    { count: totalGradings },
    { count: newFeedback },
    { count: pendingAcademies },
    { data: recentUsers },
    { data: activeTrainers },
    { data: beltData },
    { data: recentFeedback },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('training_sessions').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('gradings').select('*', { count: 'exact', head: true }),
    supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('academies').select('*', { count: 'exact', head: true }).eq('is_active', false),
    supabase
      .from('profiles')
      .select('id')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('training_sessions')
      .select('user_id')
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    supabase.from('profiles').select('belt_rank').limit(10000),
    supabase
      .from('feedback')
      .select('id, type, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Count unique active trainers
  const uniqueActiveUsers = new Set((activeTrainers || []).map((s) => s.user_id)).size

  // Belt distribution
  const beltCounts: Record<string, number> = {}
  for (const p of beltData || []) {
    const belt = p.belt_rank || 'white'
    // Group child belts under main belts for simplicity
    const mainBelt = belt.includes('grey') || belt.includes('yellow') || belt.includes('orange') || belt.includes('green')
      ? 'white' // child belts grouped under white for admin overview
      : belt
    beltCounts[mainBelt] = (beltCounts[mainBelt] || 0) + 1
  }

  const TYPE_ICONS: Record<string, string> = {
    suggestion: '💡',
    wish: '🌟',
    bug: '🐛',
    other: '💬',
  }

  const STATUS_COLORS: Record<string, string> = {
    new: 'bg-blue-400/20 text-blue-400',
    read: 'bg-yellow-400/20 text-yellow-400',
    resolved: 'bg-green-400/20 text-green-400',
  }

  return (
    <div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('stats.users')} value={totalUsers || 0} />
        <StatCard label={t('stats.trainingSessions')} value={totalSessions || 0} />
        <StatCard label={t('stats.posts')} value={totalPosts || 0} />
        <StatCard label={t('stats.gradings')} value={totalGradings || 0} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User activity */}
        <div className="bg-surface rounded-xl p-5">
          <h2 className="font-bold mb-4">Brukeraktivitet</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{t('stats.newUsersWeek')}</span>
              <span className="font-semibold">{recentUsers?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{t('stats.activeUsers')}</span>
              <span className="font-semibold">{uniqueActiveUsers}</span>
            </div>
          </div>
        </div>

        {/* Belt distribution */}
        <div className="bg-surface rounded-xl p-5">
          <h2 className="font-bold mb-4">{t('stats.beltDistribution')}</h2>
          <div className="space-y-2">
            {['white', 'blue', 'purple', 'brown', 'black'].map((belt) => {
              const count = beltCounts[belt] || 0
              const total = totalUsers || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={belt} className="flex items-center gap-3 text-sm">
                  <div className={`w-3 h-3 rounded-full ${BELT_COLORS[belt]}`} />
                  <span className="w-12">{BELT_LABELS[belt]}</span>
                  <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-muted w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent feedback */}
        <div className="bg-surface rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Siste tilbakemeldinger</h2>
            {(newFeedback || 0) > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-400 font-medium">
                {newFeedback} nye
              </span>
            )}
          </div>
          {(recentFeedback || []).length === 0 ? (
            <p className="text-sm text-muted">{t('feedback.noFeedback')}</p>
          ) : (
            <div className="space-y-3">
              {(recentFeedback || []).map((fb) => (
                <div key={fb.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{TYPE_ICONS[fb.type] || '💬'}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${STATUS_COLORS[fb.status]}`}>
                      {fb.status}
                    </span>
                  </div>
                  <p className="text-muted line-clamp-2">{fb.message}</p>
                </div>
              ))}
            </div>
          )}
          <Link
            href={`/${locale}/admin/feedback`}
            className="block mt-4 text-sm text-primary hover:underline"
          >
            Se alle tilbakemeldinger →
          </Link>
        </div>

        {/* Pending academies */}
        <div className="bg-surface rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">{t('academies.title')}</h2>
            {(pendingAcademies || 0) > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-medium">
                {pendingAcademies} ventende
              </span>
            )}
          </div>
          <p className="text-sm text-muted">
            {(pendingAcademies || 0) === 0
              ? 'Ingen akademier venter på godkjenning.'
              : `${pendingAcademies} akademier venter på godkjenning.`}
          </p>
          <Link
            href={`/${locale}/admin/academies`}
            className="block mt-4 text-sm text-primary hover:underline"
          >
            Administrer akademier →
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  )
}
