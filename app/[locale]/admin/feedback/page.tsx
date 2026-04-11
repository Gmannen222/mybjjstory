import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import AdminFeedbackList from '@/components/admin/AdminFeedbackList'

export const dynamic = 'force-dynamic'

export default async function AdminFeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ status?: string; type?: string }>
}) {
  const { locale } = await params
  const filters = await searchParams
  const t = await getTranslations('admin.feedback')
  const supabase = await createClient()

  let query = supabase
    .from('feedback')
    .select('*, profiles:user_id(display_name, belt_rank)')
    .order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  const { data: feedbackList } = await query

  // Count by status
  const [
    { count: countAll },
    { count: countNew },
    { count: countRead },
    { count: countResolved },
  ] = await Promise.all([
    supabase.from('feedback').select('*', { count: 'exact', head: true }),
    supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'read'),
    supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
  ])

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">{t('title')}</h2>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <FilterTab
          href={`/${locale}/admin/feedback`}
          label={t('all')}
          count={countAll || 0}
          active={!filters.status || filters.status === 'all'}
        />
        <FilterTab
          href={`/${locale}/admin/feedback?status=new`}
          label={t('new')}
          count={countNew || 0}
          active={filters.status === 'new'}
          color="blue"
        />
        <FilterTab
          href={`/${locale}/admin/feedback?status=read`}
          label={t('read')}
          count={countRead || 0}
          active={filters.status === 'read'}
          color="yellow"
        />
        <FilterTab
          href={`/${locale}/admin/feedback?status=resolved`}
          label={t('resolved')}
          count={countResolved || 0}
          active={filters.status === 'resolved'}
          color="green"
        />
      </div>

      {(feedbackList || []).length === 0 ? (
        <p className="text-muted text-center py-12">{t('noFeedback')}</p>
      ) : (
        <AdminFeedbackList feedback={feedbackList || []} locale={locale} />
      )}
    </div>
  )
}

const BADGE_COLORS: Record<string, string> = {
  blue: 'bg-blue-400/20 text-blue-400',
  yellow: 'bg-yellow-400/20 text-yellow-400',
  green: 'bg-green-400/20 text-green-400',
}

function FilterTab({
  href,
  label,
  count,
  active,
  color,
}: {
  href: string
  label: string
  count: number
  active: boolean
  color?: string
}) {
  const colorClass = color ? BADGE_COLORS[color] || 'bg-white/10 text-muted' : 'bg-white/10 text-muted'

  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary/20 text-primary border border-primary/40'
          : 'bg-surface text-muted hover:text-foreground border border-white/5'
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${colorClass}`}>
        {count}
      </span>
    </Link>
  )
}
