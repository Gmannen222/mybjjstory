import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('home')
  const tAuth = await getTranslations('auth')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">
          {t('title')}
        </h1>
        <p className="text-xl text-muted">{t('subtitle')}</p>

        {session ? (
          <div className="space-y-4">
            <p className="text-lg">
              {t('welcome')},{' '}
              <span className="text-primary font-semibold">
                {session.user.user_metadata?.full_name ||
                  session.user.email}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/training/new`}
                className="px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                {t('logTraining')}
              </Link>
              <Link
                href={`/${locale}/feed`}
                className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-surface transition-colors"
              >
                {t('viewFeed')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted">
              {tAuth('loginRequired')}
            </p>
          </div>
        )}
      </div>

      {session && <DashboardStats locale={locale} />}
    </div>
  )
}

async function DashboardStats({ locale }: { locale: string }) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

  const [weekResult, monthResult, totalResult] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('date', weekAgo.toISOString().split('T')[0]),
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('date', monthAgo.toISOString().split('T')[0]),
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id),
  ])

  const stats = [
    { label: 'Denne uken', count: weekResult.count ?? 0 },
    { label: 'Denne måneden', count: monthResult.count ?? 0 },
    { label: 'Totalt', count: totalResult.count ?? 0 },
  ]

  return (
    <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
      {stats.map(({ label, count }) => (
        <div
          key={label}
          className="bg-surface rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-primary">{count}</div>
          <div className="text-sm text-muted mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
