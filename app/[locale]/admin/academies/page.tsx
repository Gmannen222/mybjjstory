import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import AcademyApproval from '@/components/admin/AcademyApproval'

export const dynamic = 'force-dynamic'

export default async function AdminAcademiesPage() {
  const t = await getTranslations('admin.academies')
  const supabase = await createClient()

  // Check if submitted_by column exists by trying to select it
  let hasSubmittedBy = false
  const { error: colCheck } = await supabase
    .from('academies')
    .select('submitted_by')
    .limit(0)
  if (!colCheck) {
    hasSubmittedBy = true
  }

  // Fetch pending academies
  const pendingQuery = hasSubmittedBy
    ? supabase
        .from('academies')
        .select('id, name, city, region, website_url, created_at, submitted_by, profiles!academies_submitted_by_fkey(display_name)')
        .eq('is_active', false)
        .order('created_at', { ascending: false })
    : supabase
        .from('academies')
        .select('id, name, city, region, website_url, created_at')
        .eq('is_active', false)
        .order('created_at', { ascending: false })

  const { data: pendingAcademies } = await pendingQuery

  // Fetch active academies
  const { data: activeAcademies } = await supabase
    .from('academies')
    .select('id, name, city, region, website_url, created_at')
    .eq('is_active', true)
    .order('name')

  // Get member counts for active academies
  const memberCounts: Record<string, number> = {}
  if (activeAcademies && activeAcademies.length > 0) {
    const academyIds = activeAcademies.map((a) => a.id)
    const { data: members } = await supabase
      .from('profiles')
      .select('academy_id')
      .in('academy_id', academyIds)

    for (const m of members || []) {
      if (m.academy_id) {
        memberCounts[m.academy_id] = (memberCounts[m.academy_id] || 0) + 1
      }
    }
  }

  // Map pending academies to props
  const pendingItems = (pendingAcademies || []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    name: a.name as string,
    city: a.city as string | null,
    region: a.region as string | null,
    website_url: a.website_url as string | null,
    created_at: a.created_at as string,
    submitted_by_name: hasSubmittedBy
      ? ((a.profiles as Record<string, unknown> | null)?.display_name as string | null) || null
      : null,
  }))

  // Map active academies to props
  const activeItems = (activeAcademies || []).map((a) => ({
    id: a.id,
    name: a.name,
    city: a.city,
    region: a.region,
    website_url: a.website_url,
    created_at: a.created_at,
    member_count: memberCounts[a.id] || 0,
  }))

  return (
    <div>
      {/* Pending academies */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold">{t('pending')}</h2>
          {pendingItems.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-medium">
              {pendingItems.length}
            </span>
          )}
        </div>

        {pendingItems.length === 0 ? (
          <p className="text-sm text-muted bg-surface rounded-xl p-5">
            {t('noPending')}
          </p>
        ) : (
          <div className="space-y-3">
            {pendingItems.map((academy) => (
              <AcademyApproval
                key={academy.id}
                academy={academy}
                type="pending"
              />
            ))}
          </div>
        )}
      </section>

      {/* Active academies */}
      <section>
        <h2 className="text-lg font-bold mb-4">{t('approved')}</h2>

        {activeItems.length === 0 ? (
          <p className="text-sm text-muted bg-surface rounded-xl p-5">
            Ingen aktive akademier.
          </p>
        ) : (
          <div className="space-y-3">
            {activeItems.map((academy) => (
              <AcademyApproval
                key={academy.id}
                academy={academy}
                type="active"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
