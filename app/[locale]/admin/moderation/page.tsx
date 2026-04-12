import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminModerationList from '@/components/admin/AdminModerationList'

export const dynamic = 'force-dynamic'

export default async function AdminModerationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { locale } = await params
  const { tab } = await searchParams
  const activeTab = tab || 'pending'
  const supabase = await createClient()

  // Count reports by status
  const [
    { count: countPending },
    { count: countReviewed },
    { count: countDismissed },
  ] = await Promise.all([
    supabase.from('content_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('content_reports').select('*', { count: 'exact', head: true }).eq('status', 'reviewed'),
    supabase.from('content_reports').select('*', { count: 'exact', head: true }).eq('status', 'dismissed'),
  ])

  // Fetch reports based on active tab
  const statusFilter = activeTab === 'reviewed' ? 'reviewed' : activeTab === 'dismissed' ? 'dismissed' : 'pending'

  const { data: rawReports } = await supabase
    .from('content_reports')
    .select('*, reporter:reporter_id(display_name)')
    .eq('status', statusFilter)
    .order('created_at', { ascending: false })

  // Enrich reports with content preview and author
  const reports = await Promise.all(
    (rawReports || []).map(async (report) => {
      let contentPreview: string | null = null
      let contentAuthor: string | null = null
      let contentModerationStatus: string = 'active'

      const table = report.content_type === 'post' ? 'posts'
        : report.content_type === 'comment' ? 'comments'
        : 'media'

      const contentField = report.content_type === 'media' ? 'caption' : 'content'

      const { data: content } = await supabase
        .from(table)
        .select(`${contentField}, moderation_status, profiles:user_id(display_name)`)
        .eq('id', report.content_id)
        .single()

      if (content) {
        const c = content as unknown as Record<string, unknown>
        contentPreview = c[contentField] as string || null
        contentModerationStatus = (c.moderation_status as string) || 'active'
        const profiles = c.profiles as { display_name: string | null } | null
        contentAuthor = profiles?.display_name || null
      }

      // Count total reports for this content
      const { count: reportCount } = await supabase
        .from('content_reports')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', report.content_type)
        .eq('content_id', report.content_id)

      return {
        id: report.id,
        content_type: report.content_type,
        content_id: report.content_id,
        reason: report.reason,
        description: report.description,
        status: report.status,
        created_at: report.created_at,
        reporter: report.reporter,
        content_preview: contentPreview,
        content_author: contentAuthor,
        content_moderation_status: contentModerationStatus as 'active' | 'hidden' | 'removed',
        report_count: reportCount || 1,
      }
    })
  )

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Innholdsmoderering</h2>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <TabLink
          href={`/${locale}/admin/moderation`}
          label="Ventende"
          count={countPending || 0}
          active={activeTab === 'pending'}
          color="red"
        />
        <TabLink
          href={`/${locale}/admin/moderation?tab=reviewed`}
          label="Behandlet"
          count={countReviewed || 0}
          active={activeTab === 'reviewed'}
          color="green"
        />
        <TabLink
          href={`/${locale}/admin/moderation?tab=dismissed`}
          label="Avvist"
          count={countDismissed || 0}
          active={activeTab === 'dismissed'}
          color="yellow"
        />
      </div>

      <AdminModerationList reports={reports} />
    </div>
  )
}

const TAB_COLORS: Record<string, string> = {
  red: 'bg-red-400/20 text-red-400',
  green: 'bg-green-400/20 text-green-400',
  yellow: 'bg-yellow-400/20 text-yellow-400',
}

function TabLink({
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
  color: string
}) {
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
      <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${TAB_COLORS[color]}`}>
        {count}
      </span>
    </Link>
  )
}
