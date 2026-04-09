'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { TrainingType } from '@/lib/types/database'

const TRAINING_TYPES: TrainingType[] = [
  'gi',
  'nogi',
  'open_mat',
  'private',
  'competition',
]

export default function SessionForm({ locale }: { locale: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<TrainingType>('gi')
  const [durationMin, setDurationMin] = useState('')
  const [notes, setNotes] = useState('')
  const [techniques, setTechniques] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('training')
  const tCommon = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data: session } = await supabase.auth.getSession()
    if (!session.session) return

    const { data: newSession, error: sessionError } = await supabase
      .from('training_sessions')
      .insert({
        user_id: session.session.user.id,
        date,
        type,
        duration_min: durationMin ? parseInt(durationMin) : null,
        notes: notes || null,
      })
      .select('id')
      .single()

    if (sessionError || !newSession) {
      setError(tCommon('error'))
      setSaving(false)
      return
    }

    if (techniques.trim()) {
      const techniqueList = techniques
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      if (techniqueList.length > 0) {
        await supabase.from('session_techniques').insert(
          techniqueList.map((name) => ({
            session_id: newSession.id,
            name,
          }))
        )
      }
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
        <input
          type="text"
          value={techniques}
          onChange={(e) => setTechniques(e.target.value)}
          placeholder="armbar, triangle, sweep..."
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
        <p className="text-xs text-muted mt-1">Separer med komma</p>
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
        {saving ? tCommon('loading') : t('save')}
      </button>
    </form>
  )
}
