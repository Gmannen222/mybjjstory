'use client'

import { useState, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import TechniquePicker from '@/components/training/TechniquePicker'
import SubmitButton from '@/components/ui/SubmitButton'
import { createSession, updateSession, deleteSession } from '@/lib/actions/training'
import type { TrainingSession, TrainingType, MoodType, TechniqueCategory } from '@/lib/types/database'
import type { ActionResult } from '@/lib/actions/posts'

const TRAINING_TYPES: TrainingType[] = [
  'gi',
  'nogi',
  'open_mat',
  'private',
  'competition',
  'seminar',
  'competition_prep',
]

const MOOD_OPTIONS: { value: MoodType; emoji: string }[] = [
  { value: 'great', emoji: '😄' },
  { value: 'good', emoji: '🙂' },
  { value: 'neutral', emoji: '😐' },
  { value: 'tired', emoji: '😴' },
  { value: 'bad', emoji: '😣' },
]

interface SelectedTechnique {
  name: string
  category: TechniqueCategory | null
}

export default function SessionForm({
  locale,
  session: existingSession,
  existingTechniques,
}: {
  locale: string
  session?: TrainingSession
  existingTechniques?: SelectedTechnique[]
}) {
  const isEdit = !!existingSession
  const [type, setType] = useState<TrainingType>(existingSession?.type ?? 'gi')
  const [effortRpe, setEffortRpe] = useState(existingSession?.effort_rpe?.toString() ?? '')
  const [rpeSelected, setRpeSelected] = useState(!!existingSession?.effort_rpe)
  const [moodBefore, setMoodBefore] = useState<MoodType | ''>(existingSession?.mood_before ?? '')
  const [moodAfter, setMoodAfter] = useState<MoodType | ''>(existingSession?.mood_after ?? '')
  const [techniques, setTechniques] = useState<SelectedTechnique[]>(existingTechniques ?? [])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const router = useRouter()
  const t = useTranslations('training')
  const tCommon = useTranslations('common')

  const action = isEdit ? updateSession : createSession

  const [state, formAction] = useActionState<ActionResult<{ id: string }>, FormData>(
    action,
    { success: false, error: '' }
  )

  // Handle successful save — navigate and trigger achievements
  useEffect(() => {
    if (state.success) {
      fetch('/api/achievements', { method: 'POST' }).catch(console.error)
      router.push(`/${locale}/training?saved=true`)
      router.refresh()
    }
  }, [state, locale, router])

  const handleDelete = async () => {
    if (!existingSession) return
    setDeleting(true)
    setDeleteError(null)

    const result = await deleteSession(existingSession.id)

    if (!result.success) {
      setDeleteError(result.error)
      setDeleting(false)
      return
    }

    router.push(`/${locale}/training`)
    router.refresh()
  }

  const error = (!state.success && state.error) ? state.error : deleteError

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields for server action */}
      {isEdit && <input type="hidden" name="session_id" value={existingSession.id} />}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="mood_before" value={moodBefore} />
      <input type="hidden" name="mood_after" value={moodAfter} />
      <input type="hidden" name="effort_rpe" value={rpeSelected ? effortRpe : ''} />
      <input type="hidden" name="techniques" value={JSON.stringify(techniques)} />

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('date')}
        </label>
        <input
          type="date"
          name="date"
          defaultValue={existingSession?.date ?? new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('type')}
        </label>
        <div className="flex flex-wrap gap-2">
          {TRAINING_TYPES.map((tt) => (
            <button
              key={tt}
              type="button"
              onClick={() => setType(tt)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === tt
                  ? 'bg-primary text-background'
                  : 'bg-surface text-muted hover:text-foreground'
              }`}
            >
              {t(`types.${tt}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('duration')} ({t('durationMin')})
        </label>
        <input
          type="number"
          name="duration_min"
          defaultValue={existingSession?.duration_min?.toString() ?? ''}
          placeholder="60"
          min="1"
          max="480"
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('techniques')}
        </label>
        <TechniquePicker selected={techniques} onChange={setTechniques} />
      </div>

      <details className="group" open={isEdit || undefined}>
        <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-hover transition-colors list-none flex items-center gap-2 py-2">
          <span className="transition-transform group-open:rotate-90">&#9654;</span>
          Flere detaljer
        </summary>
        <div className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              {t('effortRpe')} {rpeSelected ? <span className="text-primary">{effortRpe || 5}/10</span> : <span className="text-muted italic">Ikke valgt</span>}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={effortRpe || 5}
              onChange={(e) => { setEffortRpe(e.target.value); setRpeSelected(true) }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>{t('effortLight')}</span>
              <span>{t('effortMax')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                {t('moodBefore')}
              </label>
              <div className="flex gap-1">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMoodBefore(moodBefore === m.value ? '' : m.value)}
                    className={`flex-1 py-2 rounded-lg text-lg transition-colors ${
                      moodBefore === m.value
                        ? 'bg-primary/20 ring-1 ring-primary'
                        : 'bg-surface hover:bg-surface-hover'
                    }`}
                    title={t(`moods.${m.value}`)}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                {t('moodAfter')}
              </label>
              <div className="flex gap-1">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMoodAfter(moodAfter === m.value ? '' : m.value)}
                    className={`flex-1 py-2 rounded-lg text-lg transition-colors ${
                      moodAfter === m.value
                        ? 'bg-primary/20 ring-1 ring-primary'
                        : 'bg-surface hover:bg-surface-hover'
                    }`}
                    title={t(`moods.${m.value}`)}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              {t('bodyWeight')} (kg)
            </label>
            <input
              type="number"
              name="body_weight_kg"
              defaultValue={existingSession?.body_weight_kg?.toString() ?? ''}
              placeholder="75.0"
              min="30"
              max="200"
              step="0.1"
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              {t('notes')}
            </label>
            <textarea
              name="notes"
              defaultValue={existingSession?.notes ?? ''}
              rows={4}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>
      </details>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <SubmitButton
        pendingText={tCommon('saving')}
        className="w-full"
      >
        {isEdit ? 'Oppdater trening' : t('save')}
      </SubmitButton>

      {isEdit && !showDeleteConfirm && (
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          Slett treningsøkt
        </button>
      )}

      {isEdit && showDeleteConfirm && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-3">
          <p className="text-sm text-red-400 font-medium">Er du sikker på at du vil slette denne treningsøkten?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2.5 border border-white/20 rounded-lg text-sm font-medium hover:bg-surface transition-colors"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? tCommon('deleting') : 'Ja, slett'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
