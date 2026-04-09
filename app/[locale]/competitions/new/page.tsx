import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CompetitionForm from '@/components/competitions/CompetitionForm'

export const dynamic = 'force-dynamic'

export default async function NewCompetitionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect(`/${locale}`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Registrer konkurranse</h1>
      <CompetitionForm locale={locale} />
    </div>
  )
}
