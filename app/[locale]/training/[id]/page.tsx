import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { TrainingSession, SessionTechnique, SparringRound } from '@/lib/types/database'
import MediaGallery from '@/components/media/MediaGallery'
import MediaUploadForm from '@/components/media/MediaUploadForm'
import SparringSection from '@/components/sparring/SparringSection'
import SessionFeedbackForm from '@/components/session-feedback/SessionFeedbackForm'
import SessionFeedbackList from '@/components/session-feedback/SessionFeedbackList'

export const dynamic = 'force-dynamic'

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const t = await getTranslations('training')
  const tCommon = await getTranslations('common')
  const tFeedback = await getTranslations('sessionFeedback')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data: trainingSession } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!trainingSession) notFound()

  const s = trainingSession as TrainingSession
  const isOwner = s.user_id === user.id

  const [{ data: techniques }, { data: media }, { data: sparringRounds }] = await Promise.all([
    supabase.from('session_techniques').select('*').eq('session_id', id),
    supabase.from('media').select('*').eq('session_id', id).order('created_at', { ascending: false }),
    supabase.from('sparring_rounds').select('*').eq('session_id', id).order('created_at', { ascending: true }),
  ])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/training`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← {tCommon('back')}
        </Link>
        {isOwner && (
          <Link
            href={`/${locale}/training/${id}/edit`}
            className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
          >
            {tCommon('edit')}
          </Link>
        )}
      </div>

      <div className="mt-6 bg-surface rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{new Date(s.date + 'T00:00:00').toLocaleDateString('no-NO', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}</h1>
          <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
            {t(`types.${s.type}`)}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-muted">
          {s.duration_min && (
            <span>{s.duration_min} {t('durationMin')}</span>
          )}
          {s.effort_rpe && (
            <span>RPE {s.effort_rpe}/10</span>
          )}
          {s.body_weight_kg && (
            <span>{s.body_weight_kg} kg</span>
          )}
        </div>

        {(s.mood_before || s.mood_after) && (
          <div className="flex gap-4 mt-3">
            {s.mood_before && (
              <span className="text-sm text-muted">
                {t('moodBefore')}: {t(`moods.${s.mood_before}`)}
              </span>
            )}
            {s.mood_after && (
              <span className="text-sm text-muted">
                {t('moodAfter')}: {t(`moods.${s.mood_after}`)}
              </span>
            )}
          </div>
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

      {/* Sparring section */}
      <SparringSection
        sessionId={id}
        rounds={(sparringRounds ?? []) as SparringRound[]}
        isOwner={isOwner}
      />

      {/* Session feedback section */}
      {isOwner && (sparringRounds ?? []).length > 0 && (
        <div className="mt-6 bg-surface rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">{tFeedback('title')}</h2>
          <SessionFeedbackList sessionId={id} currentUserId={user.id} />
          <div className="mt-4 pt-4 border-t border-white/10">
            <SessionFeedbackForm
              sessionId={id}
              sessionDate={s.date}
            />
          </div>
        </div>
      )}

      {media && media.length > 0 && (
        <div className="mt-6">
          <MediaGallery media={media} />
        </div>
      )}

      {isOwner && (
        <div className="mt-6 bg-surface rounded-xl p-4">
          <h2 className="text-sm font-medium text-muted mb-3">Legg til media</h2>
          <MediaUploadForm sessionId={id} bucket="training-media" locale={locale} />
        </div>
      )}
    </div>
  )
}
