import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import GradingForm from '@/components/gradings/GradingForm'

export const dynamic = 'force-dynamic'

export default async function NewGradingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('gradings')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('show_kids_belts')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('newGrading')}</h1>
      <GradingForm locale={locale} showKidsBeltsDefault={profile?.show_kids_belts ?? false} />
    </div>
  )
}
