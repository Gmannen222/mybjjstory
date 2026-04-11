'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import TechniquePicker from '@/components/training/TechniquePicker'
import type { TrainingSession, TrainingType, MoodType, TechniqueCategory } from '@/lib/types/database'

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
  const [date, setDate] = useState(existingSession?.date ?? new Date().toISOString().split('T')[0])
  const [type, setType] = useState<TrainingType>(existingSession?.type ?? 'gi')
  const [durationMin, setDurationMin] = useState(existingSession?.duration_min?.toString() ?? '')
  const [notes, setNotes] = useState(existingSession?.notes ?? '')
  const [effortRpe, setEffortRpe] = useState(existingSession?.effort_rpe?.toString() ?? '')
  const [moodBefore, setMoodBefore] = useState<MoodType | ''>(existingSession?.mood_before ?? '')
  const [moodAfter, setMoodAfter] = useState<MoodType | ''>(existingSession?.mood_after ?? '')
  const [bodyWeightKg, setBodyWeightKg] = useState(existingSession?.body_weight_kg?.toString() ?? '')
  const [techniques, setTechniques] = useState<SelectedTechnique[]>(existingTechniques ?? [])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('training')
  const tCommon = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data: authSession } = await supabase.auth.getSession()
    if (!authSession.session) return

    const payload = {
      date,
      type,
      duration_min: durationMin ? parseInt(durationMin) : null,
      notes: notes || null,
      effort_rpe: effortRpe ? parseInt(effortRpe) : null,
      mood_before: moodBefore || null,
      mood_after: moodAfter || null,
      body_weight_kg: bodyWeightKg ? parseFloat(bodyWeightKg) : null,
    }

    if (isEdit) {
      const { error: updateError } = await supabase
        .from('training_sessions')
        .update(payload)
        .eq('id', existingSession.id)

      if (updateError) {
        setError(tCommon('error'))
        setSaving(false)
        return
      }

      // Update techniques: delete old, insert new
      await supabase.from('session_techniques').delete().eq('session_id', existingSession.id)

      if (techniques.length > 0) {
        await supabase.from('session_techniques').insert(
          techniques.map((t) => ({ session_id: existingSession.id, name: t.name, category: t.category }))
        )
      }
    } else {
      const { data: newSession, error: sessionError } = await supabase
        .from('training_sessions')
        .insert({ ...payload, user_id: authSession.session.user.id })
        .select('id')
        .single()

      if (sessionError || !newSession) {
        setError(tCommon('error'))
        setSaving(false)
        return
      }

      if (techniques.length > 0) {
        await supabase.from('session_techniques').insert(
          techniques.map((t) => ({ session_id: newSession.id, name: t.name, category: t.category }))
        )
      }
    }

    // Check achievements after saving (via API route with service role)
    fetch('/api/achievements', { method: 'POST' })

    router.push(`/${locale}/training?saved=true`)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!existingSession || !confirm('Er du sikker på at du vil slette denne treningsøkten?')) return
    setDeleting(true)

    await supabase.from('session_techniques').delete().eq('session_id', existingSession.id)
    await supabase.from('media').delete().eq('session_id', existingSession.id)
    const { error: dbError } = await supabase.from('training_sessions').delete().eq('id', existingSession.id)

    if (dbError) {
      setError(tCommon('deleteError'))
      setDeleting(false)
      return
    }

    router.push(`/${locale}/training`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('date')}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
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

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('effortRpe')} {effortRpe && <span className="text-primary">{effortRpe}/10</span>}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={effortRpe || 5}
          onChange={(e) => setEffortRpe(e.target.value)}
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
          value={bodyWeightKg}
          onChange={(e) => setBodyWeightKg(e.target.value)}
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
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? tCommon('saving') : isEdit ? 'Oppdater trening' : t('save')}
      </button>

      {isEdit && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {deleting ? tCommon('deleting') : 'Slett treningsøkt'}
        </button>
      )}
    </form>
  )
}
