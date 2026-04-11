import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import InjuryForm from '@/components/injuries/InjuryForm'
import type { Injury } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function EditInjuryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data } = await supabase
    .from('injuries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!data) notFound()

  const injury = data as Injury

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rediger skade</h1>
        <Link
          href={`/${locale}/injuries`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Tilbake
        </Link>
      </div>
      <InjuryForm locale={locale} injury={injury} />
    </div>
  )
}
