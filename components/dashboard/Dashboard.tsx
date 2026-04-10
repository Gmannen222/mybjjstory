'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { BeltDisplay, BELT_LABELS } from '@/components/ui/BeltBadge'
import AvatarSVG, { DEFAULT_AVATAR, type AvatarConfig } from '@/components/avatar/AvatarSVG'
import DashboardSettings from './DashboardSettings'
import type { DashboardConfig } from '@/lib/types/database'

const DEFAULT_DASHBOARD: DashboardConfig = {
  showTrainingStats: true,
  showCompetitionStats: false,
  showActiveInjuries: true,
  showRecentTraining: true,
  showQuickActions: true,
  showFavoriteSub: false,
  showFavoriteGuard: false,
  showBelt: true,
  showAvatar: true,
}

interface ProfileData {
  belt_rank: string | null
  belt_degrees: number
  display_name: string | null
  avatar_config: AvatarConfig | null
  dashboard_config: DashboardConfig | null
  favorite_guard: string | null
  favorite_submission: string | null
  training_since_year: number | null
  academy_name: string | null
}

interface Stats {
  weekCount: number
  monthCount: number
  totalCount: number
  competitionCount: number
  goldCount: number
  activeInjuries: number
  streakDays: number
}

interface RecentSession {
  id: string
  date: string
  type: string
  duration_min: number | null
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
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [dashConfig, setDashConfig] = useState<DashboardConfig>(DEFAULT_DASHBOARD)
  const supabase = createClient()
  const t = useTranslations('home')
  const tTraining = useTranslations('training')

  useEffect(() => {
    async function load() {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

      const [weekRes, monthRes, totalRes, profileRes, compRes, goldRes, injuryRes, recentRes] = await Promise.all([
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
          .select('belt_rank, belt_degrees, display_name, avatar_config, dashboard_config, favorite_guard, favorite_submission, training_since_year, academy_name')
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
        // Get recent sessions for streak calculation
        supabase
          .from('training_sessions')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(30),
      ])

      // Calculate streak
      let streakDays = 0
      if (recentRes.data && recentRes.data.length > 0) {
        const dates = [...new Set(recentRes.data.map((s: { date: string }) => s.date))].sort().reverse()
        const today = now.toISOString().split('T')[0]
        const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0]

        if (dates[0] === today || dates[0] === yesterday) {
          streakDays = 1
          for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1] as string)
            const curr = new Date(dates[i] as string)
            const diffDays = (prev.getTime() - curr.getTime()) / 86400000
            if (diffDays <= 1) {
              streakDays++
            } else {
              break
            }
          }
        }
      }

      const profileData = profileRes.data as ProfileData | null
      setProfile(profileData)
      setDashConfig({ ...DEFAULT_DASHBOARD, ...(profileData?.dashboard_config ?? {}) })

      setStats({
        weekCount: weekRes.count ?? 0,
        monthCount: monthRes.count ?? 0,
        totalCount: totalRes.count ?? 0,
        competitionCount: compRes.count ?? 0,
        goldCount: goldRes.count ?? 0,
        activeInjuries: injuryRes.count ?? 0,
        streakDays,
      })
      setLoading(false)
    }
    load()
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          {/* Skeleton hero */}
          <div className="bg-surface rounded-2xl p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-56 bg-surface-hover rounded-2xl" />
              <div className="h-8 bg-surface-hover rounded w-48" />
              <div className="h-6 bg-surface-hover rounded w-32" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const avatarConfig: AvatarConfig = {
    ...DEFAULT_AVATAR,
    ...(profile?.avatar_config ?? {}),
    beltRank: profile?.belt_rank,
  }

  const weekGoal = 3
  const weekProgress = Math.min((stats?.weekCount ?? 0) / weekGoal, 1)
  const circumference = 2 * Math.PI * 40

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Hero card */}
      <div className="relative bg-surface rounded-2xl overflow-hidden mb-6">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with progress ring */}
            {dashConfig.showAvatar && (
              <Link href={`/${locale}/profile/avatar`} className="group relative flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  {/* SVG progress ring around avatar */}
                  <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 100 200">
                    {/* Background ring */}
                    <ellipse cx="50" cy="100" rx="48" ry="98" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                    {/* Progress ring */}
                    <ellipse
                      cx="50" cy="100" rx="48" ry="98"
                      fill="none"
                      stroke="rgba(201,168,76,0.4)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${weekProgress * 300} 1000`}
                      transform="rotate(-90, 50, 100)"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="relative bg-background rounded-2xl p-3 border border-white/10 group-hover:border-primary/40 transition-all duration-300">
                    <AvatarSVG config={avatarConfig} size={110} />
                  </div>
                </div>
              </Link>
            )}

            {/* Welcome + belt + meta */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {t('welcome')}, {profile?.display_name || 'utøver'}!
              </h1>

              {dashConfig.showBelt && profile?.belt_rank && (
                <div className="mt-3 flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-36 sm:w-44">
                    <BeltDisplay rank={profile.belt_rank} degrees={profile.belt_degrees} size="md" />
                  </div>
                  <span className="text-xs text-muted">
                    {BELT_LABELS[profile.belt_rank] ?? profile.belt_rank}
                  </span>
                </div>
              )}

              {/* Meta tags */}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-muted">
                {profile?.academy_name && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {profile.academy_name}
                  </span>
                )}
                {profile?.training_since_year && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {new Date().getFullYear() - profile.training_since_year} år
                  </span>
                )}
              </div>
            </div>

            {/* Right side: settings + CTA */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 border border-white/10 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                title="Tilpass forside"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
              <Link
                href={`/${locale}/training/new`}
                className="px-5 py-2.5 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-all hover:scale-105 hover:shadow-[0_0_20px_-3px_rgba(201,168,76,0.4)] text-sm whitespace-nowrap"
              >
                + {tTraining('newSession')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Settings drawer */}
      {showSettings && (
        <div className="mb-6 bg-surface rounded-xl border border-white/5 p-5 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Tilpass forsiden</h2>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-sm text-muted hover:text-foreground"
            >
              Lukk
            </button>
          </div>
          <DashboardSettings config={dashConfig} onUpdate={setDashConfig} />
        </div>
      )}

      {/* Stats row */}
      {dashConfig.showTrainingStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Streak - special card */}
          <div className={`relative bg-surface rounded-xl p-4 text-center border overflow-hidden ${
            (stats?.streakDays ?? 0) > 0 ? 'border-orange-500/20' : 'border-white/5'
          }`}>
            {(stats?.streakDays ?? 0) > 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent" />
            )}
            <div className="relative">
              <div className="text-lg mb-1">🔥</div>
              <div className={`text-2xl sm:text-3xl font-bold ${(stats?.streakDays ?? 0) > 0 ? 'text-orange-400' : 'text-muted'}`}>
                {stats?.streakDays ?? 0}
              </div>
              <div className="text-xs text-muted mt-0.5">Streak</div>
            </div>
          </div>

          <Link href={`/${locale}/training`} className="bg-surface rounded-xl p-4 text-center border border-white/5 hover:border-primary/20 transition-colors">
            <div className="text-lg mb-1">📅</div>
            <div className="text-2xl sm:text-3xl font-bold">{stats?.weekCount ?? 0}<span className="text-sm font-normal text-muted">/{weekGoal}</span></div>
            <div className="text-xs text-muted mt-0.5">{tTraining('stats.thisWeek')}</div>
          </Link>

          <Link href={`/${locale}/training`} className="bg-surface rounded-xl p-4 text-center border border-white/5 hover:border-primary/20 transition-colors">
            <div className="text-lg mb-1">📊</div>
            <div className="text-2xl sm:text-3xl font-bold">{stats?.monthCount ?? 0}</div>
            <div className="text-xs text-muted mt-0.5">{tTraining('stats.thisMonth')}</div>
          </Link>

          <Link href={`/${locale}/training`} className="bg-surface rounded-xl p-4 text-center border border-white/5 hover:border-primary/20 transition-colors">
            <div className="text-lg mb-1">🥋</div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">{stats?.totalCount ?? 0}</div>
            <div className="text-xs text-muted mt-0.5">{tTraining('stats.total')}</div>
          </Link>
        </div>
      )}

      {/* Competition stats */}
      {dashConfig.showCompetitionStats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href={`/${locale}/competitions`} className="bg-surface rounded-xl p-4 text-center border border-white/5 hover:border-primary/20 transition-colors">
            <div className="text-lg mb-1">🏆</div>
            <div className="text-2xl font-bold">{stats?.competitionCount ?? 0}</div>
            <div className="text-xs text-muted mt-0.5">Konkurranser</div>
          </Link>
          <Link href={`/${locale}/competitions`} className="bg-surface rounded-xl p-4 text-center border border-white/5 hover:border-primary/20 transition-colors">
            <div className="text-lg mb-1">🥇</div>
            <div className="text-2xl font-bold text-yellow-400">{stats?.goldCount ?? 0}</div>
            <div className="text-xs text-muted mt-0.5">Gull</div>
          </Link>
        </div>
      )}

      {/* Favorites row */}
      {(dashConfig.showFavoriteSub || dashConfig.showFavoriteGuard) && (profile?.favorite_guard || profile?.favorite_submission) && (
        <div className="flex gap-3 mb-6">
          {dashConfig.showFavoriteGuard && profile?.favorite_guard && (
            <div className="flex-1 bg-surface rounded-xl px-4 py-3 border border-white/5">
              <span className="text-xs text-muted block mb-0.5">Favorittguard</span>
              <span className="text-sm font-semibold text-blue-400">{profile.favorite_guard}</span>
            </div>
          )}
          {dashConfig.showFavoriteSub && profile?.favorite_submission && (
            <div className="flex-1 bg-surface rounded-xl px-4 py-3 border border-white/5">
              <span className="text-xs text-muted block mb-0.5">Favoritt-sub</span>
              <span className="text-sm font-semibold text-red-400">{profile.favorite_submission}</span>
            </div>
          )}
        </div>
      )}

      {/* Active injuries alert */}
      {dashConfig.showActiveInjuries && (stats?.activeInjuries ?? 0) > 0 && (
        <Link
          href={`/${locale}/injuries`}
          className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 hover:bg-red-500/15 transition-colors"
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
      {dashConfig.showQuickActions && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Hurtigvalg</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {[
              { href: `/${locale}/training/new`, icon: '🥋', label: tTraining('newSession'), accent: 'hover:border-blue-500/30' },
              { href: `/${locale}/training`, icon: '📋', label: tTraining('title'), accent: 'hover:border-green-500/30' },
              { href: `/${locale}/competitions`, icon: '🏆', label: 'Konkurranser', accent: 'hover:border-yellow-500/30' },
              { href: `/${locale}/feed`, icon: '📰', label: 'Feed', accent: 'hover:border-purple-500/30' },
              { href: `/${locale}/gradings`, icon: '🏅', label: 'Graderinger', accent: 'hover:border-orange-500/30' },
              { href: `/${locale}/injuries`, icon: '🩹', label: 'Skader', accent: 'hover:border-red-500/30' },
            ].map(({ href, icon, label, accent }) => (
              <Link
                key={href}
                href={href}
                className={`bg-surface border border-white/5 rounded-xl p-3 text-center transition-all duration-200 hover:scale-[1.05] hover:shadow-lg ${accent}`}
              >
                <div className="text-xl sm:text-2xl mb-1">{icon}</div>
                <div className="text-[11px] sm:text-xs font-medium text-muted">{label}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent training */}
      {dashConfig.showRecentTraining && (
        <RecentTraining userId={userId} locale={locale} />
      )}

      {/* Active injuries detail */}
      {dashConfig.showActiveInjuries && (
        <ActiveInjuriesList userId={userId} locale={locale} />
      )}
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

  if (sessions.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Siste treninger</h2>
        <div className="bg-surface rounded-xl p-8 border border-white/5 text-center">
          <div className="text-3xl mb-3">🥋</div>
          <p className="text-muted text-sm">Ingen treninger ennå</p>
          <Link
            href={`/${locale}/training/new`}
            className="inline-block mt-3 px-4 py-2 bg-primary text-background font-semibold rounded-lg text-sm hover:bg-primary-hover transition-colors"
          >
            Logg din første trening
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Siste treninger</h2>
        <Link
          href={`/${locale}/training`}
          className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
        >
          Se alle →
        </Link>
      </div>
      <div className="space-y-2">
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/${locale}/training/${s.id}`}
            className="flex items-center justify-between bg-surface hover:bg-surface-hover border border-white/5 hover:border-primary/20 rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {s.type === 'gi' ? '🥋' : s.type === 'nogi' ? '💪' : s.type === 'competition' ? '🏆' : '🤸'}
              </span>
              <div>
                <span className="font-medium text-sm">
                  {new Date(s.date).toLocaleDateString('no-NO', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
                <span className="text-xs text-muted ml-2">
                  {tTraining(`types.${s.type}`)}
                </span>
              </div>
            </div>
            {s.duration_min && (
              <span className="text-xs text-muted bg-surface-hover px-2 py-1 rounded-lg">
                {s.duration_min} min
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

interface ActiveInjury {
  id: string
  body_part: string
  severity: string
  date_occurred: string
  training_impact: string
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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Aktive skader</h2>
        <Link
          href={`/${locale}/injuries`}
          className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
        >
          Se alle →
        </Link>
      </div>
      <div className="space-y-2">
        {injuries.map((i) => (
          <Link
            key={i.id}
            href={`/${locale}/injuries/${i.id}`}
            className="flex items-center justify-between bg-surface hover:bg-surface-hover border border-white/5 rounded-xl p-4 transition-colors border-l-4 border-l-red-400"
          >
            <div>
              <span className="font-medium text-sm">{i.body_part}</span>
              <span className={`text-xs ml-2 ${SEVERITY_COLORS[i.severity]}`}>
                {i.severity === 'mild' ? 'Mild' : i.severity === 'moderate' ? 'Moderat' : 'Alvorlig'}
              </span>
            </div>
            <span className="text-xs text-muted">
              {new Date(i.date_occurred).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
