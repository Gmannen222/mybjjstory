'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { BeltRank, Grading } from '@/lib/types/database'
import { BELT_COLORS } from '@/components/ui/BeltBadge'

const BELT_RANKS: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black']

export default function GradingForm({
  locale,
  grading,
}: {
  locale: string
  grading?: Grading
}) {
  const isEdit = !!grading
  const [beltRank, setBeltRank] = useState<BeltRank>(grading?.belt_rank ?? 'white')
  const [degrees, setDegrees] = useState(String(grading?.belt_degrees ?? 0))
  const [date, setDate] = useState(grading?.date ?? new Date().toISOString().split('T')[0])
  const [instructorName, setInstructorName] = useState(grading?.instructor_name ?? '')
  const [academyName, setAcademyName] = useState(grading?.academy_name ?? '')
  const [notes, setNotes] = useState(grading?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('gradings')
  const tBelts = useTranslations('belts')
  const tCommon = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data: session } = await supabase.auth.getSession()
    if (!session.session) return

    const payload = {
      belt_rank: beltRank,
      belt_degrees: parseInt(degrees),
      date,
      instructor_name: instructorName || null,
      academy_name: academyName || null,
      notes: notes || null,
    }

    const { error: dbError } = isEdit
      ? await supabase.from('gradings').update(payload).eq('id', grading.id)
      : await supabase.from('gradings').insert({ ...payload, user_id: session.session.user.id })

    if (dbError) {
      setError(tCommon('error'))
      setSaving(false)
      return
    }

    // Update profile belt
    await supabase
      .from('profiles')
      .update({
        belt_rank: beltRank,
        belt_degrees: parseInt(degrees),
      })
      .eq('id', session.session.user.id)

    router.push(`/${locale}/gradings`)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!grading || !confirm('Er du sikker på at du vil slette denne graderingen?')) return
    setDeleting(true)

    const { error: dbError } = await supabase.from('gradings').delete().eq('id', grading.id)

    if (dbError) {
      setError('Kunne ikke slette')
      setDeleting(false)
      return
    }

    router.push(`/${locale}/gradings`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('belt')}
        </label>
        <div className="flex flex-wrap gap-2">
          {BELT_RANKS.map((rank) => {
            const colors = BELT_COLORS[rank]
            return (
              <button
                key={rank}
                type="button"
                onClick={() => setBeltRank(rank)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  beltRank === rank
                    ? 'ring-2 ring-primary scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {tBelts(rank)}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Grader (striper)
        </label>
        <input
          type="number"
          value={degrees}
          onChange={(e) => setDegrees(e.target.value)}
          min="0"
          max="6"
          className="w-24 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

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
          {t('instructor')}
        </label>
        <input
          type="text"
          value={instructorName}
          onChange={(e) => setInstructorName(e.target.value)}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('academy')}
        </label>
        <input
          type="text"
          value={academyName}
          onChange={(e) => setAcademyName(e.target.value)}
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
          rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? tCommon('loading') : isEdit ? 'Oppdater gradering' : tCommon('save')}
      </button>

      {isEdit && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Sletter...' : 'Slett gradering'}
        </button>
      )}
    </form>
  )
}
