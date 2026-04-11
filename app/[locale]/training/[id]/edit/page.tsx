import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import SessionForm from '@/components/training/SessionForm'
import type { TrainingSession, SessionTechnique } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function EditTrainingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const [{ data: trainingSession }, { data: techniques }] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('session_techniques')
      .select('name, category')
      .eq('session_id', id),
  ])

  if (!trainingSession) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rediger trening</h1>
        <Link
          href={`/${locale}/training/${id}`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Tilbake
        </Link>
      </div>
      <SessionForm
        locale={locale}
        session={trainingSession as TrainingSession}
        existingTechniques={(techniques as SessionTechnique[] | null)?.map((t) => ({ name: t.name, category: t.category })) ?? []}
      />
    </div>
  )
}
