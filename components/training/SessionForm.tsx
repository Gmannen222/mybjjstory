'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import TechniquePicker from '@/components/training/TechniquePicker'
import type { TrainingSession, TrainingType, TechniqueCategory } from '@/lib/types/database'

const TRAINING_TYPES: TrainingType[] = [
  'gi',
  'nogi',
  'open_mat',
  'private',
  'competition',
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

    router.push(`/${locale}/training`)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!existingSession || !confirm('Er du sikker på at du vil slette denne treningsøkten?')) return
    setDeleting(true)

    await supabase.from('session_techniques').delete().eq('session_id', existingSession.id)
    await supabase.from('media').delete().eq('session_id', existingSession.id)
    const { error: dbError } = await supabase.from('training_sessions').delete().eq('id', existingSession.id)

    if (dbError) {
      setError('Kunne ikke slette')
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
        {saving ? tCommon('loading') : isEdit ? 'Oppdater trening' : t('save')}
      </button>

      {isEdit && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Sletter...' : 'Slett treningsøkt'}
        </button>
      )}
    </form>
  )
}
