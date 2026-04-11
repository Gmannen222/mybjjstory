'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { BeltRank, Grading, GradingType } from '@/lib/types/database'
import { BELT_COLORS, BELT_LABELS, ADULT_BELTS, KIDS_BELTS, BeltDisplay } from '@/components/ui/BeltBadge'

export default function GradingForm({
  locale,
  grading,
  showKidsBeltsDefault = false,
}: {
  locale: string
  grading?: Grading
  showKidsBeltsDefault?: boolean
}) {
  const isEdit = !!grading
  const [gradingType, setGradingType] = useState<GradingType>(grading?.grading_type ?? 'belt')
  const [beltRank, setBeltRank] = useState<BeltRank>(grading?.belt_rank ?? 'white')
  const [degrees, setDegrees] = useState(String(grading?.belt_degrees ?? 0))
  const [date, setDate] = useState(grading?.date ?? new Date().toISOString().split('T')[0])
  const [instructorName, setInstructorName] = useState(grading?.instructor_name ?? '')
  const [academyName, setAcademyName] = useState(grading?.academy_name ?? '')
  const [notes, setNotes] = useState(grading?.notes ?? '')
  const [showKidsBelts, setShowKidsBelts] = useState(showKidsBeltsDefault)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('gradings')
  const tCommon = useTranslations('common')

  const availableBelts = showKidsBelts ? [...KIDS_BELTS, ...ADULT_BELTS.filter((b) => b !== 'white')] : ADULT_BELTS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data: session } = await supabase.auth.getSession()
    if (!session.session) return

    const beltDegrees = gradingType === 'stripe' ? parseInt(degrees) : parseInt(degrees)

    const payload = {
      belt_rank: beltRank,
      belt_degrees: beltDegrees,
      grading_type: gradingType,
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

    // Update profile belt to latest
    await supabase
      .from('profiles')
      .update({
        belt_rank: beltRank,
        belt_degrees: beltDegrees,
        show_kids_belts: showKidsBelts,
      })
      .eq('id', session.session.user.id)

    router.push(`/${locale}/gradings?saved=true`)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!grading || !confirm('Er du sikker på at du vil slette denne graderingen?')) return
    setDeleting(true)

    const { error: dbError } = await supabase.from('gradings').delete().eq('id', grading.id)

    if (dbError) {
      setError(tCommon('deleteError'))
      setDeleting(false)
      return
    }

    router.push(`/${locale}/gradings`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grading type toggle */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Type gradering
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGradingType('belt')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              gradingType === 'belt'
                ? 'bg-primary text-background'
                : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            Beltegradering
          </button>
          <button
            type="button"
            onClick={() => setGradingType('stripe')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              gradingType === 'stripe'
                ? 'bg-primary text-background'
                : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            Stripe
          </button>
        </div>
      </div>

      {/* Kids belts toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showKidsBelts}
          onChange={(e) => setShowKidsBelts(e.target.checked)}
          className="w-5 h-5 rounded accent-primary"
        />
        <span className="text-sm">Vis barnebelter</span>
        <span className="text-xs text-muted">(grå, gul, oransje, grønn)</span>
      </label>

      {/* Belt selection */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('belt')}
        </label>
        <div className="flex flex-wrap gap-2">
          {availableBelts.map((rank) => {
            const colors = BELT_COLORS[rank]
            const label = BELT_LABELS[rank] ?? rank
            return (
              <button
                key={rank}
                type="button"
                onClick={() => setBeltRank(rank)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  beltRank === rank
                    ? 'ring-2 ring-primary scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Belt preview */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">Forhåndsvisning</label>
        <div className="w-48">
          <BeltDisplay rank={beltRank} degrees={parseInt(degrees) || 0} size="lg" />
        </div>
        <p className="text-xs text-muted mt-1">
          {BELT_LABELS[beltRank]} {parseInt(degrees) > 0 ? `· ${degrees} stripe${parseInt(degrees) > 1 ? 'r' : ''}` : ''}
        </p>
      </div>

      {/* Degrees / stripes */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {gradingType === 'stripe' ? 'Stripe nummer' : 'Grader (striper)'}
        </label>
        <input
          type="number"
          value={degrees}
          onChange={(e) => setDegrees(e.target.value)}
          min="0"
          max={beltRank === 'black' ? '6' : '4'}
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
        {saving ? tCommon('saving') : isEdit ? 'Oppdater gradering' : tCommon('save')}
      </button>

      {isEdit && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {deleting ? tCommon('deleting') : 'Slett gradering'}
        </button>
      )}
    </form>
  )
}
