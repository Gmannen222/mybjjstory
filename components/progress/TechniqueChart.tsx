'use client'

import { useTranslations } from 'next-intl'

interface TechniqueChartProps {
  techniques: { category: string | null }[]
}

const CATEGORY_COLORS: Record<string, string> = {
  guard: '#c9a84c',
  pass: '#6366f1',
  sweep: '#22c55e',
  submission: '#ef4444',
  takedown: '#f59e0b',
  escape: '#8b5cf6',
  other: '#64748b',
}

export default function TechniqueChart({ techniques }: TechniqueChartProps) {
  const t = useTranslations('progress')

  const counts: Record<string, number> = {}
  for (const tech of techniques) {
    const cat = tech.category || 'other'
    counts[cat] = (counts[cat] || 0) + 1
  }

  const total = techniques.length
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a)
  const maxCount = sorted.length > 0 ? sorted[0][1] : 1

  if (total === 0) {
    return (
      <div className="bg-surface rounded-xl p-4 border border-white/5">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
          {t('techniques')}
        </h3>
        <p className="text-sm text-muted text-center py-6">{t('noData')}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        {t('techniques')}
      </h3>

      <div className="space-y-2.5">
        {sorted.map(([category, count]) => {
          const pct = Math.round((count / total) * 100)
          const barWidth = (count / maxCount) * 100
          const color = CATEGORY_COLORS[category] || '#64748b'

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">
                  {t(`categories.${category}`)}
                </span>
                <span className="text-xs text-muted">
                  {count} ({pct}%)
                </span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-xs text-muted mt-3 pt-3 border-t border-white/5">
        {t('total')}: {total} {t('techniquesLogged')}
      </div>
    </div>
  )
}
