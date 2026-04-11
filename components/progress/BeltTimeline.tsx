'use client'

import { useTranslations } from 'next-intl'
import type { BeltRank } from '@/lib/types/database'

interface GradingEntry {
  id: string
  belt_rank: BeltRank
  belt_degrees: number
  grading_type: 'belt' | 'stripe'
  date: string
  instructor_name: string | null
  academy_name: string | null
}

interface BeltTimelineProps {
  gradings: GradingEntry[]
  currentBelt: BeltRank | null
}

const BELT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  white: { bg: '#ffffff', border: '#e5e7eb', text: '#111827' },
  blue: { bg: '#2563eb', border: '#3b82f6', text: '#ffffff' },
  purple: { bg: '#7c3aed', border: '#8b5cf6', text: '#ffffff' },
  brown: { bg: '#92400e', border: '#a16207', text: '#ffffff' },
  black: { bg: '#111827', border: '#374151', text: '#ffffff' },
  grey_white: { bg: '#9ca3af', border: '#d1d5db', text: '#111827' },
  grey: { bg: '#6b7280', border: '#9ca3af', text: '#ffffff' },
  grey_black: { bg: '#4b5563', border: '#6b7280', text: '#ffffff' },
  yellow_white: { bg: '#fef08a', border: '#fde047', text: '#111827' },
  yellow: { bg: '#eab308', border: '#facc15', text: '#111827' },
  yellow_black: { bg: '#a16207', border: '#ca8a04', text: '#ffffff' },
  orange_white: { bg: '#fdba74', border: '#fb923c', text: '#111827' },
  orange: { bg: '#f97316', border: '#fb923c', text: '#111827' },
  orange_black: { bg: '#c2410c', border: '#ea580c', text: '#ffffff' },
  green_white: { bg: '#86efac', border: '#4ade80', text: '#111827' },
  green: { bg: '#22c55e', border: '#4ade80', text: '#111827' },
  green_black: { bg: '#15803d', border: '#16a34a', text: '#ffffff' },
}

export default function BeltTimeline({ gradings, currentBelt }: BeltTimelineProps) {
  const t = useTranslations('progress')
  const tBelts = useTranslations('belts')

  if (gradings.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-4 border border-white/5">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
          {t('beltTimeline')}
        </h3>
        <p className="text-sm text-muted text-center py-6">{t('noGradings')}</p>
      </div>
    )
  }

  const sorted = [...gradings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="bg-surface rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        {t('beltTimeline')}
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-white/10" />

        <div className="space-y-4">
          {sorted.map((g, i) => {
            const colors = BELT_COLORS[g.belt_rank] || BELT_COLORS.white
            const isCurrent = i === sorted.length - 1 && g.belt_rank === currentBelt
            const dateFormatted = new Date(g.date + 'T00:00:00').toLocaleDateString(
              'no-NO',
              { day: 'numeric', month: 'long', year: 'numeric' }
            )

            return (
              <div key={g.id} className="relative flex items-start gap-4 pl-1">
                {/* Belt dot */}
                <div
                  className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${
                    isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''
                  }`}
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                >
                  {g.grading_type === 'stripe' && (
                    <div className="flex gap-px">
                      {Array.from({ length: Math.min(g.belt_degrees, 4) }).map((_, si) => (
                        <div
                          key={si}
                          className="w-0.5 h-3 rounded-full"
                          style={{ backgroundColor: colors.text }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`pb-1 ${isCurrent ? 'text-foreground' : 'text-muted'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {tBelts(g.belt_rank)}
                      {g.grading_type === 'stripe' && ` - ${g.belt_degrees} ${g.belt_degrees === 1 ? 'stripe' : 'striper'}`}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-full font-medium">
                        {t('current')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{dateFormatted}</div>
                  {(g.instructor_name || g.academy_name) && (
                    <div className="text-xs text-muted mt-0.5">
                      {g.instructor_name && <span>{g.instructor_name}</span>}
                      {g.instructor_name && g.academy_name && <span> - </span>}
                      {g.academy_name && <span>{g.academy_name}</span>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
