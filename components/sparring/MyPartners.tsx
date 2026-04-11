'use client'

import { useTranslations } from 'next-intl'
import type { SparringRound } from '@/lib/types/database'

interface PartnerStats {
  name: string
  totalRounds: number
  lastSparring: string
  avgRating: number | null
}

function computePartnerStats(rounds: SparringRound[]): PartnerStats[] {
  const map = new Map<string, SparringRound[]>()

  for (const round of rounds) {
    const key = round.partner_name.toLowerCase().trim()
    const existing = map.get(key) ?? []
    existing.push(round)
    map.set(key, existing)
  }

  const stats: PartnerStats[] = []

  for (const [, partnerRounds] of map) {
    const sorted = partnerRounds.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const allRatings: number[] = []
    for (const r of partnerRounds) {
      const values = [r.intensity, r.technique_rating, r.flow_rating, r.learning_rating, r.mood_rating]
      for (const v of values) {
        if (v !== null) allRatings.push(v)
      }
    }

    const avg =
      allRatings.length > 0
        ? Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10
        : null

    stats.push({
      name: sorted[0].partner_name,
      totalRounds: partnerRounds.length,
      lastSparring: sorted[0].created_at,
      avgRating: avg,
    })
  }

  return stats.sort(
    (a, b) => new Date(b.lastSparring).getTime() - new Date(a.lastSparring).getTime()
  )
}

export default function MyPartners({ rounds }: { rounds: SparringRound[] }) {
  const t = useTranslations('sparring')

  const partners = computePartnerStats(rounds)

  if (partners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🤼</p>
        <p className="text-muted">{t('noPartners')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {partners.map((partner) => (
        <div
          key={partner.name}
          className="bg-surface rounded-xl p-4 flex items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{partner.name}</p>
            <div className="flex items-center gap-3 text-sm text-muted mt-1">
              <span>
                {partner.totalRounds} {t('rounds')}
              </span>
              <span>
                {t('lastSparring')}:{' '}
                {new Date(partner.lastSparring).toLocaleDateString('nb-NO', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          </div>

          {partner.avgRating !== null && (
            <div className="text-center shrink-0">
              <span className="px-3 py-1.5 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                {partner.avgRating}/5
              </span>
              <p className="text-xs text-muted mt-1">{t('avgRating')}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
