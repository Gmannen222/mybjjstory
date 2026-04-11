import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import CompetitionForm from '@/components/competitions/CompetitionForm'
import type { Competition } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function EditCompetitionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data } = await supabase
    .from('competitions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!data) notFound()

  const competition = data as Competition

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rediger konkurranse</h1>
        <Link
          href={`/${locale}/competitions`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Tilbake
        </Link>
      </div>
      <CompetitionForm locale={locale} competition={competition} />
    </div>
  )
}
