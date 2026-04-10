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

  const regions = [...new Set((academies || []).map((a: Academy) => a.region).filter(Boolean))] as string[]
  const affiliations = [...new Set((academies || []).map((a: Academy) => a.affiliation).filter(Boolean))] as string[]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted mt-1">{t('description')}</p>
        </div>

        <AcademyListClient
          academies={(academies || []) as Academy[]}
          regions={regions.sort()}
          affiliations={affiliations.sort()}
        />
      </div>
    </div>
  )
}
