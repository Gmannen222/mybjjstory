import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import UserList from '@/components/admin/UserList'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('admin.users')
  const supabase = await createClient()

  // Fetch all data in parallel
  const [
    { data: profiles },
    { data: academies },
    { data: sessionsRaw },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, display_name, username, belt_rank, belt_degrees, avatar_config, academy_id, role, is_banned, banned_at, ban_reason, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('academies')
      .select('id, name')
      .eq('is_active', true),
    supabase
      .from('training_sessions')
      .select('user_id, date'),
  ])

  // Build session count and last date maps
  const sessionCountMap: Record<string, number> = {}
  const lastSessionMap: Record<string, string> = {}

  for (const s of sessionsRaw || []) {
    sessionCountMap[s.user_id] = (sessionCountMap[s.user_id] || 0) + 1
    if (!lastSessionMap[s.user_id] || s.date > lastSessionMap[s.user_id]) {
      lastSessionMap[s.user_id] = s.date
    }
  }

  // Build academy name map
  const academyMap: Record<string, string> = {}
  for (const a of academies || []) {
    academyMap[a.id] = a.name
  }

  // Enrich profiles with session stats and academy names
  const enrichedProfiles = (profiles || []).map((p) => ({
    ...p,
    academy_name: p.academy_id ? academyMap[p.academy_id] || null : null,
    session_count: sessionCountMap[p.id] || 0,
    last_session: lastSessionMap[p.id] || null,
  }))

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">{t('title')}</h2>
      <UserList users={enrichedProfiles} locale={locale} />
    </div>
  )
}
