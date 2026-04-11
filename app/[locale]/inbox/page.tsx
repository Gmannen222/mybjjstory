import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FeedbackInbox from '@/components/session-feedback/FeedbackInbox'

export const dynamic = 'force-dynamic'

export default async function InboxPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('sessionFeedback')
  const tCommon = await getTranslations('common')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('inbox')}</h1>
        <Link
          href={`/${locale}/profile`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          {tCommon('back')}
        </Link>
      </div>

      <FeedbackInbox />
    </div>
  )
}
