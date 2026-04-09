'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { BeltRank } from '@/lib/types/database'
import { BELT_COLORS } from '@/components/ui/BeltBadge'

const BELT_RANKS: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black']

export default function GradingForm({ locale }: { locale: string }) {
  const [beltRank, setBeltRank] = useState<BeltRank>('white')
  const [degrees, setDegrees] = useState('0')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [instructorName, setInstructorName] = useState('')
  const [academyName, setAcademyName] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
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

    const { error: insertError } = await supabase.from('gradings').insert({
      user_id: session.session.user.id,
      belt_rank: beltRank,
      belt_degrees: parseInt(degrees),
      date,
      instructor_name: instructorName || null,
      academy_name: academyName || null,
      notes: notes || null,
    })

    if (insertError) {
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
        {saving ? tCommon('loading') : tCommon('save')}
      </button>
    </form>
  )
}
