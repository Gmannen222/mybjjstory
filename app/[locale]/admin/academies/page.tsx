import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import AcademyList from '@/components/admin/AcademyList'

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

  const allFields = 'id, name, slug, city, region, website_url, address, affiliation, description, head_instructor, is_active, created_at, visibility'

  // Fetch pending academies
  const pendingQuery = hasSubmittedBy
    ? supabase
        .from('academies')
        .select(`${allFields}, submitted_by, profiles!academies_submitted_by_fkey(display_name)`)
        .eq('is_active', false)
        .order('created_at', { ascending: false })
    : supabase
        .from('academies')
        .select(allFields)
        .eq('is_active', false)
        .order('created_at', { ascending: false })

  const { data: pendingAcademies } = await pendingQuery

  // Fetch active academies
  const { data: activeAcademies } = await supabase
    .from('academies')
    .select(allFields)
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
    slug: a.slug as string | null,
    city: a.city as string | null,
    region: a.region as string | null,
    website_url: a.website_url as string | null,
    address: a.address as string | null,
    affiliation: a.affiliation as string | null,
    description: a.description as string | null,
    head_instructor: a.head_instructor as string | null,
    created_at: a.created_at as string,
    submitted_by_name: hasSubmittedBy
      ? ((a.profiles as Record<string, unknown> | null)?.display_name as string | null) || null
      : null,
  }))

  // Map active academies to props
  const activeItems = (activeAcademies || []).map((a) => ({
    id: a.id,
    name: a.name,
    slug: (a as Record<string, unknown>).slug as string | null,
    city: a.city,
    region: a.region,
    website_url: a.website_url,
    address: (a as Record<string, unknown>).address as string | null,
    affiliation: (a as Record<string, unknown>).affiliation as string | null,
    description: (a as Record<string, unknown>).description as string | null,
    head_instructor: (a as Record<string, unknown>).head_instructor as string | null,
    created_at: a.created_at,
    member_count: memberCounts[a.id] || 0,
    visibility: ((a as Record<string, unknown>).visibility as string) || 'visible',
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
          <AcademyList academies={pendingItems} type="pending" />
        )}
      </section>

      {/* Active academies */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold">{t('approved')}</h2>
          {activeItems.filter((a) => a.visibility === 'hidden').length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/20 text-red-400 font-medium">
              {activeItems.filter((a) => a.visibility === 'hidden').length} skjult
            </span>
          )}
        </div>

        {activeItems.length === 0 ? (
          <p className="text-sm text-muted bg-surface rounded-xl p-5">
            Ingen aktive akademier.
          </p>
        ) : (
          <AcademyList academies={activeItems} type="active" />
        )}
      </section>
    </div>
  )
}
