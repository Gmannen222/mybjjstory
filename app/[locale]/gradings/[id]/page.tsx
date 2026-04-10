import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import GradingForm from '@/components/gradings/GradingForm'
import type { Grading } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function EditGradingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect(`/${locale}`)

  const { data } = await supabase
    .from('gradings')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (!data) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rediger gradering</h1>
        <Link
          href={`/${locale}/gradings`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Tilbake
        </Link>
      </div>
      <GradingForm locale={locale} grading={data as Grading} />
    </div>
  )
}
