import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import FeedbackForm from '@/components/feedback/FeedbackForm'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-400/20 text-blue-400',
  read: 'bg-yellow-400/20 text-yellow-400',
  resolved: 'bg-green-400/20 text-green-400',
}

const STATUS_KEYS: Record<string, string> = {
  new: 'statusNew',
  read: 'statusRead',
  resolved: 'statusResolved',
}

const TYPE_ICONS: Record<string, string> = {
  suggestion: '💡',
  wish: '🌟',
  bug: '🐛',
  other: '💬',
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('feedback')
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect(`/${locale}`)

  const { data: previousFeedback } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  const feedbackList = previousFeedback || []

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>

      <FeedbackForm userId={session.user.id} />

      {/* Previous feedback */}
      {feedbackList.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">{t('previous')}</h2>
          <div className="space-y-3">
            {feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="bg-surface rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{TYPE_ICONS[fb.type] || '💬'}</span>
                    <span className="font-medium capitalize">{t(STATUS_KEYS[fb.status] ? `type${fb.type.charAt(0).toUpperCase() + fb.type.slice(1)}` : 'typeOther')}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[fb.status] || ''}`}>
                    {t(STATUS_KEYS[fb.status] || 'statusNew')}
                  </span>
                </div>
                <p className="text-sm">{fb.message}</p>
                <p className="text-xs text-muted mt-2">
                  {new Date(fb.created_at).toLocaleDateString('nb-NO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
