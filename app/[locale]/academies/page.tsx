import { createStaticClient } from '@/lib/supabase/static'
import { getTranslations } from 'next-intl/server'
import type { Academy } from '@/lib/types/database'
import AcademyListClient from '@/components/academies/AcademyListClient'

export default async function AcademiesPage() {
  const t = await getTranslations('academies')
  const supabase = createStaticClient()

  const { data: academies } = await supabase
    .from('academies')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  // Fetch member counts per academy (only visible members)
  const { data: memberRows } = await supabase
    .from('profiles')
    .select('academy_id')
    .not('academy_id', 'is', null)
    .in('profile_visibility', ['public', 'academy'])
    .eq('show_in_academy_list', true)

  const memberCounts: Record<string, number> = {}
  for (const row of memberRows || []) {
    if (row.academy_id) {
      memberCounts[row.academy_id] = (memberCounts[row.academy_id] || 0) + 1
    }
  }

  const regions = [...new Set((academies || []).map((a: Academy) => a.region).filter(Boolean))] as string[]
  const affiliations = [...new Set((academies || []).map((a: Academy) => a.affiliation).filter(Boolean))] as string[]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted mt-1">{t('description')}</p>
        </div>

        <AcademyListClient
          academies={(academies || []) as Academy[]}
          regions={regions.sort()}
          affiliations={affiliations.sort()}
          memberCounts={memberCounts}
        />
      </div>
    </div>
  )
}
