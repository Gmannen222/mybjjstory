import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { TrainingSession, SessionTechnique } from '@/lib/types/database'
import MediaGallery from '@/components/media/MediaGallery'

export const dynamic = 'force-dynamic'

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const t = await getTranslations('training')
  const tCommon = await getTranslations('common')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}`)
  }

  const { data: trainingSession } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!trainingSession) {
    notFound()
  }

  const s = trainingSession as TrainingSession

  const [{ data: techniques }, { data: media }] = await Promise.all([
    supabase
      .from('session_techniques')
      .select('*')
      .eq('session_id', id),
    supabase
      .from('media')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href={`/${locale}/training`}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        ← {tCommon('back')}
      </Link>

      <div className="mt-6 bg-surface rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{s.date}</h1>
          <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
            {t(`types.${s.type}`)}
          </span>
        </div>

        {s.duration_min && (
          <p className="text-muted">
            {s.duration_min} {t('durationMin')}
          </p>
        )}

        {techniques && techniques.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-muted mb-2">
              {t('techniques')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(techniques as SessionTechnique[]).map((tech) => (
                <span
                  key={tech.id}
                  className="px-3 py-1 bg-surface-hover text-sm rounded-full"
                >
                  {tech.name}
                  {tech.category && (
                    <span className="text-muted ml-1">({tech.category})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {s.notes && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-muted mb-2">
              {t('notes')}
            </h2>
            <p className="whitespace-pre-wrap">{s.notes}</p>
          </div>
        )}
      </div>

      {media && media.length > 0 && (
        <div className="mt-6">
          <MediaGallery media={media} />
        </div>
      )}

      <div className="mt-6">
        <MediaUploadSection sessionId={id} locale={locale} />
      </div>
    </div>
  )
}

async function MediaUploadSection({
  sessionId,
  locale,
}: {
  sessionId: string
  locale: string
}) {
  return (
    <div className="bg-surface rounded-xl p-4">
      <h2 className="text-sm font-medium text-muted mb-3">Legg til media</h2>
      <MediaUploadForm sessionId={sessionId} bucket="training-media" locale={locale} />
    </div>
  )
}

// Client component import for the form
import MediaUploadForm from '@/components/media/MediaUploadForm'
