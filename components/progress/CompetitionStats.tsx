'use client'

import { useTranslations } from 'next-intl'

interface CompetitionStatsProps {
  competitions: {
    result: string | null
    wins: number
    losses: number
  }[]
}

export default function CompetitionStats({ competitions }: CompetitionStatsProps) {
  const t = useTranslations('progress')

  if (competitions.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-4 border border-white/5">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
          {t('competitions')}
        </h3>
        <p className="text-sm text-muted text-center py-6">{t('noCompetitions')}</p>
      </div>
    )
  }

  const gold = competitions.filter((c) => c.result === 'gold').length
  const silver = competitions.filter((c) => c.result === 'silver').length
  const bronze = competitions.filter((c) => c.result === 'bronze').length
  const totalWins = competitions.reduce((sum, c) => sum + c.wins, 0)
  const totalLosses = competitions.reduce((sum, c) => sum + c.losses, 0)
  const winRate =
    totalWins + totalLosses > 0
      ? Math.round((totalWins / (totalWins + totalLosses)) * 100)
      : 0

  return (
    <div className="bg-surface rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        {t('competitions')}
      </h3>

      {/* Medals */}
      <div className="flex justify-center gap-6 mb-4">
        {[
          { emoji: '\uD83E\uDD47', count: gold, label: t('gold') },
          { emoji: '\uD83E\uDD48', count: silver, label: t('silver') },
          { emoji: '\uD83E\uDD49', count: bronze, label: t('bronze') },
        ].map(({ emoji, count, label }) => (
          <div key={label} className="text-center">
            <div className="text-3xl mb-1">{emoji}</div>
            <div className="text-xl font-bold text-foreground tabular-nums">{count}</div>
            <div className="text-[10px] text-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground tabular-nums">
            {competitions.length}
          </div>
          <div className="text-[10px] text-muted">{t('totalComps')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold tabular-nums">
            <span className="text-green-400">{totalWins}</span>
            <span className="text-muted mx-0.5">/</span>
            <span className="text-red-400">{totalLosses}</span>
          </div>
          <div className="text-[10px] text-muted">{t('winLoss')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground tabular-nums">{winRate}%</div>
          <div className="text-[10px] text-muted">{t('winRate')}</div>
        </div>
      </div>
    </div>
  )
}
