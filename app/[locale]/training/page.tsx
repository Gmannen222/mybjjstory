import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { TrainingSession } from '@/lib/types/database'
import ShareButton from '@/components/training/ShareButton'
import TrainingFilter from '@/components/training/TrainingFilter'

export const dynamic = 'force-dynamic'

export default async function TrainingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string; month?: string }>
}) {
  const { locale } = await params
  const filters = await searchParams
  const t = await getTranslations('training')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect(`/${locale}`)

  let query = supabase
    .from('training_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: false })
    .limit(100)

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  if (filters.month) {
    const start = `${filters.month}-01`
    const [y, m] = filters.month.split('-').map(Number)
    const end = new Date(y, m, 0).toISOString().split('T')[0]
    query = query.gte('date', start).lte('date', end)
  }

  const { data: sessions } = await query

  const allSessions = (sessions || []) as TrainingSession[]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link
          href={`/${locale}/training/new`}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          + {t('newSession')}
        </Link>
      </div>

      <TrainingFilter
        locale={locale}
        currentType={filters.type ?? ''}
        currentMonth={filters.month ?? ''}
      />

      {/* Stats bar */}
      {allSessions.length > 0 && (
        <div className="flex gap-3 mb-6 text-sm">
          <span className="px-3 py-1 bg-surface rounded-lg text-muted">
            {allSessions.length} {t('stats.sessions')}
          </span>
          {allSessions.some((s) => s.duration_min) && (
            <span className="px-3 py-1 bg-surface rounded-lg text-muted">
              {allSessions.reduce((sum, s) => sum + (s.duration_min ?? 0), 0)} min totalt
            </span>
          )}
        </div>
      )}

      {allSessions.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">{filters.type || filters.month ? 'Ingen treninger med dette filteret' : t('noSessions')}</p>
          {!filters.type && !filters.month && (
            <Link
              href={`/${locale}/training/new`}
              className="inline-block mt-4 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors"
            >
              {t('newSession')}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {allSessions.map((s) => (
            <Link
              key={s.id}
              href={`/${locale}/training/${s.id}`}
              className="block bg-surface hover:bg-surface-hover rounded-xl p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{s.date}</div>
                  <div className="text-sm text-muted mt-0.5">
                    {t(`types.${s.type}`)}
                    {s.duration_min && ` · ${s.duration_min} ${t('durationMin')}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShareButton
                    sessionId={s.id}
                    sessionDate={s.date}
                    sessionType={s.type}
                  />
                  <span className="text-muted text-sm">→</span>
                </div>
              </div>
              {s.notes && (
                <p className="text-sm text-muted mt-2 line-clamp-2">
                  {s.notes}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
