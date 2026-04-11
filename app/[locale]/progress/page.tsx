import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TrainingFrequencyChart from '@/components/progress/TrainingFrequencyChart'
import TechniqueChart from '@/components/progress/TechniqueChart'
import BeltTimeline from '@/components/progress/BeltTimeline'
import StreakCounter from '@/components/progress/StreakCounter'
import MonthComparison from '@/components/progress/MonthComparison'
import CompetitionStats from '@/components/progress/CompetitionStats'
import EmptyState from '@/components/ui/EmptyState'
import type { BeltRank } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('progress')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  const twelveMonthsAgoStr = twelveMonthsAgo.toISOString().split('T')[0]

  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`

  // First batch: all independent queries
  const [
    { data: sessions },
    { data: allSessions },
    { data: allSessionIds },
    { data: thisMonthSessionIds },
    { data: lastMonthSessionIds },
    { data: gradings },
    { data: competitions },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('date, duration_min, type, effort_rpe')
      .eq('user_id', user.id)
      .gte('date', twelveMonthsAgoStr)
      .order('date'),
    supabase
      .from('training_sessions')
      .select('date')
      .eq('user_id', user.id)
      .order('date'),
    supabase
      .from('training_sessions')
      .select('id')
      .eq('user_id', user.id),
    supabase
      .from('training_sessions')
      .select('id')
      .eq('user_id', user.id)
      .gte('date', `${thisMonthKey}-01`)
      .lte('date', `${thisMonthKey}-31`),
    supabase
      .from('training_sessions')
      .select('id')
      .eq('user_id', user.id)
      .gte('date', `${lastMonthKey}-01`)
      .lte('date', `${lastMonthKey}-31`),
    supabase
      .from('gradings')
      .select('id, belt_rank, belt_degrees, grading_type, date, instructor_name, academy_name')
      .eq('user_id', user.id)
      .order('date'),
    supabase
      .from('competitions')
      .select('result, wins, losses')
      .eq('user_id', user.id),
    supabase
      .from('profiles')
      .select('belt_rank')
      .eq('id', user.id)
      .single(),
  ])

  // Second batch: technique queries that depend on session IDs
  const allIds = (allSessionIds || []).map((s) => s.id)
  const thisMonthIds = (thisMonthSessionIds || []).map((s) => s.id)
  const lastMonthIds = (lastMonthSessionIds || []).map((s) => s.id)

  const [
    { data: techniques },
    { data: thisMonthTechniques },
    { data: lastMonthTechniques },
  ] = await Promise.all([
    allIds.length > 0
      ? supabase
          .from('session_techniques')
          .select('category')
          .in('session_id', allIds)
      : Promise.resolve({ data: [] as { category: string | null }[] }),
    thisMonthIds.length > 0
      ? supabase
          .from('session_techniques')
          .select('id')
          .in('session_id', thisMonthIds)
      : Promise.resolve({ data: [] as { id: string }[] }),
    lastMonthIds.length > 0
      ? supabase
          .from('session_techniques')
          .select('id')
          .in('session_id', lastMonthIds)
      : Promise.resolve({ data: [] as { id: string }[] }),
  ])

  const sessionData = sessions || []
  const allSessionDates = (allSessions || []).map((s) => s.date)
  const techniqueData = (techniques || []).map((t) => ({
    category: t.category as string | null,
  }))
  const gradingData = (gradings || []) as {
    id: string
    belt_rank: string
    belt_degrees: number
    grading_type: 'belt' | 'stripe'
    date: string
    instructor_name: string | null
    academy_name: string | null
  }[]
  const competitionData = (competitions || []) as {
    result: string | null
    wins: number
    losses: number
  }[]
  const currentBelt = (profile?.belt_rank as BeltRank) || null

  const hasAnyData =
    sessionData.length > 0 ||
    gradingData.length > 0 ||
    competitionData.length > 0

  if (!hasAnyData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>
        <EmptyState
          icon="📊"
          title={t('empty.title')}
          description={t('empty.description')}
          ctaText={t('empty.cta')}
          ctaHref={`/${locale}/training/new`}
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

      {/* Sub-navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { href: `/${locale}/gradings`, icon: '🎖️', label: 'Graderinger' },
          { href: `/${locale}/competitions`, icon: '🏆', label: 'Konkurranser' },
          { href: `/${locale}/sparring`, icon: '🤼', label: 'Sparring' },
        ].map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm text-muted hover:text-foreground hover:border-primary/30 transition-colors whitespace-nowrap"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="space-y-6">
        {/* Streak + Month comparison row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StreakCounter sessionDates={allSessionDates} />
          <MonthComparison
            sessions={sessionData.map((s) => ({
              date: s.date,
              duration_min: s.duration_min,
              effort_rpe: s.effort_rpe,
            }))}
            techniqueCount={{
              thisMonth: thisMonthTechniques?.length || 0,
              lastMonth: lastMonthTechniques?.length || 0,
            }}
          />
        </div>

        {/* Training frequency */}
        <TrainingFrequencyChart
          sessions={sessionData.map((s) => ({ date: s.date, type: s.type }))}
        />

        {/* Technique distribution */}
        <TechniqueChart techniques={techniqueData} />

        {/* Belt timeline + Competition stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <BeltTimeline
            gradings={gradingData.map((g) => ({
              ...g,
              belt_rank: g.belt_rank as BeltRank,
            }))}
            currentBelt={currentBelt}
          />
          <CompetitionStats competitions={competitionData} />
        </div>
      </div>
    </div>
  )
}
