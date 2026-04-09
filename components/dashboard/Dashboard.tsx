'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { BeltBadge } from '@/components/ui/BeltBadge'

interface Stats {
  weekCount: number
  monthCount: number
  totalCount: number
  currentBelt: string | null
  displayName: string | null
  competitionCount: number
  goldCount: number
  activeInjuries: number
}

interface RecentSession {
  id: string
  date: string
  type: string
  duration_min: number | null
}

interface ActiveInjury {
  id: string
  body_part: string
  severity: string
  date_occurred: string
  training_impact: string
}

const SEVERITY_COLORS: Record<string, string> = {
  mild: 'text-yellow-400',
  moderate: 'text-orange-400',
  severe: 'text-red-400',
}

export default function Dashboard({
  locale,
  userId,
}: {
  locale: string
  userId: string
}) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const t = useTranslations('home')
  const tTraining = useTranslations('training')

  useEffect(() => {
    async function load() {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

      const [weekRes, monthRes, totalRes, profileRes, compRes, goldRes, injuryRes] = await Promise.all([
        supabase
          .from('training_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('date', weekAgo.toISOString().split('T')[0]),
        supabase
          .from('training_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('date', monthAgo.toISOString().split('T')[0]),
        supabase
          .from('training_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('profiles')
          .select('belt_rank, display_name')
          .eq('id', userId)
          .single(),
        supabase
          .from('competitions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('competitions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('result', 'gold'),
        supabase
          .from('injuries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .is('date_recovered', null),
      ])

      setStats({
        weekCount: weekRes.count ?? 0,
        monthCount: monthRes.count ?? 0,
        totalCount: totalRes.count ?? 0,
        currentBelt: profileRes.data?.belt_rank ?? null,
        displayName: profileRes.data?.display_name ?? null,
        competitionCount: compRes.count ?? 0,
        goldCount: goldRes.count ?? 0,
        activeInjuries: injuryRes.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface rounded w-64" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {t('welcome')}, {stats?.displayName || 'utøver'}!
          </h1>
          {stats?.currentBelt && (
            <div className="mt-2">
              <BeltBadge rank={stats.currentBelt} />
            </div>
          )}
        </div>
        <Link
          href={`/${locale}/training/new`}
          className="px-6 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors"
        >
          + {tTraining('newSession')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10">
        {[
          { label: tTraining('stats.thisWeek'), value: stats?.weekCount ?? 0 },
          { label: tTraining('stats.thisMonth'), value: stats?.monthCount ?? 0 },
          { label: tTraining('stats.total'), value: stats?.totalCount ?? 0 },
          { label: 'Konkurranser', value: stats?.competitionCount ?? 0 },
          { label: 'Gull', value: stats?.goldCount ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary">{value}</div>
            <div className="text-xs sm:text-sm text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Active injuries alert */}
      {(stats?.activeInjuries ?? 0) > 0 && (
        <Link
          href={`/${locale}/injuries`}
          className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 hover:bg-red-500/15 transition-colors"
        >
          <span className="text-2xl">🩹</span>
          <div>
            <div className="font-semibold text-red-400">
              {stats!.activeInjuries} aktiv{stats!.activeInjuries > 1 ? 'e' : ''} skade{stats!.activeInjuries > 1 ? 'r' : ''}
            </div>
            <div className="text-xs text-muted">Trykk for å se detaljer</div>
          </div>
        </Link>
      )}

      {/* Quick actions */}
      <h2 className="text-lg font-bold mb-4">Hurtigvalg</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {[
          { href: `/${locale}/training/new`, icon: '🥋', label: tTraining('newSession') },
          { href: `/${locale}/training`, icon: '📋', label: tTraining('title') },
          { href: `/${locale}/competitions`, icon: '🏆', label: 'Konkurranser' },
          { href: `/${locale}/feed`, icon: '📰', label: 'Feed' },
          { href: `/${locale}/gradings`, icon: '🏅', label: 'Graderinger' },
          { href: `/${locale}/injuries`, icon: '🩹', label: 'Skader' },
        ].map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="bg-surface hover:bg-surface-hover rounded-xl p-4 text-center transition-colors"
          >
            <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
            <div className="text-sm font-medium">{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent training */}
      <RecentTraining userId={userId} locale={locale} />

      {/* Active injuries detail */}
      <ActiveInjuriesList userId={userId} locale={locale} />
    </div>
  )
}

function RecentTraining({ userId, locale }: { userId: string; locale: string }) {
  const [sessions, setSessions] = useState<RecentSession[]>([])
  const supabase = createClient()
  const tTraining = useTranslations('training')

  useEffect(() => {
    supabase
      .from('training_sessions')
      .select('id, date, type, duration_min')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5)
      .then(({ data }) => setSessions(data || []))
  }, [userId, supabase])

  if (sessions.length === 0) return null

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Siste treninger</h2>
        <Link
          href={`/${locale}/training`}
          className="text-sm text-primary hover:text-primary-hover transition-colors"
        >
          Se alle →
        </Link>
      </div>
      <div className="space-y-2">
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/${locale}/training/${s.id}`}
            className="flex items-center justify-between bg-surface hover:bg-surface-hover rounded-xl p-4 transition-colors"
          >
            <div>
              <span className="font-medium">{s.date}</span>
              <span className="text-sm text-muted ml-3">
                {tTraining(`types.${s.type}`)}
              </span>
            </div>
            {s.duration_min && (
              <span className="text-sm text-muted">
                {s.duration_min} min
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

function ActiveInjuriesList({ userId, locale }: { userId: string; locale: string }) {
  const [injuries, setInjuries] = useState<ActiveInjury[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('injuries')
      .select('id, body_part, severity, date_occurred, training_impact')
      .eq('user_id', userId)
      .is('date_recovered', null)
      .order('date_occurred', { ascending: false })
      .limit(5)
      .then(({ data }) => setInjuries(data || []))
  }, [userId, supabase])

  if (injuries.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Aktive skader</h2>
        <Link
          href={`/${locale}/injuries`}
          className="text-sm text-primary hover:text-primary-hover transition-colors"
        >
          Se alle →
        </Link>
      </div>
      <div className="space-y-2">
        {injuries.map((i) => (
          <Link
            key={i.id}
            href={`/${locale}/injuries/${i.id}`}
            className="flex items-center justify-between bg-surface hover:bg-surface-hover rounded-xl p-4 transition-colors border-l-4 border-red-400"
          >
            <div>
              <span className="font-medium">{i.body_part}</span>
              <span className={`text-sm ml-3 ${SEVERITY_COLORS[i.severity]}`}>
                {i.severity}
              </span>
            </div>
            <span className="text-sm text-muted">{i.date_occurred}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
