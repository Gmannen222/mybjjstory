import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import FeedbackForm from '@/components/feedback/FeedbackForm'
import MyFeedbackList from '@/components/feedback/MyFeedbackList'

export const dynamic = 'force-dynamic'

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('feedback')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data: previousFeedback } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>

      <FeedbackForm userId={user.id} />

      {/* Previous feedback with replies */}
      <section className="mt-10">
        <h2 className="text-lg font-bold mb-4">{t('previous')}</h2>
        <MyFeedbackList feedback={previousFeedback || []} />
      </section>
    </div>
  )
}
