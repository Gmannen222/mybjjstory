'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { SparringRound } from '@/lib/types/database'

const DIMENSION_ICONS: Record<string, string[]> = {
  intensity: ['💤', '😌', '😤', '💪', '🔥'],
  technique_rating: ['🤷', '🙂', '👍', '🎯', '⚡'],
  flow_rating: ['🧱', '🌊', '🏄', '🎶', '✨'],
  learning_rating: ['😶', '🤔', '📝', '💡', '🧠'],
  mood_rating: ['😣', '😕', '😐', '😊', '😄'],
}

function getAvgRating(round: SparringRound): number | null {
  const values = [
    round.intensity,
    round.technique_rating,
    round.flow_rating,
    round.learning_rating,
    round.mood_rating,
  ].filter((v): v is number => v !== null)

  if (values.length === 0) return null
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

function RatingIcon({ field, value }: { field: string; value: number | null }) {
  if (value === null) return null
  const icons = DIMENSION_ICONS[field]
  if (!icons) return null
  return (
    <span title={`${value}/5`} className="text-sm">
      {icons[value - 1]}
    </span>
  )
}

export default function SparringRoundList({
  rounds,
  isOwner,
}: {
  rounds: SparringRound[]
  isOwner: boolean
}) {
  const t = useTranslations('sparring')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const supabase = createClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return
    setDeletingId(id)

    const { error } = await supabase.from('sparring_rounds').delete().eq('id', id)

    if (error) {
      console.error('Failed to delete sparring round:', error)
      setDeletingId(null)
      return
    }

    setDeletingId(null)
    router.refresh()
  }

  if (rounds.length === 0) {
    return <p className="text-sm text-muted">{t('noRounds')}</p>
  }

  return (
    <div className="space-y-3">
      {rounds.map((round) => {
        const avg = getAvgRating(round)
        return (
          <div
            key={round.id}
            className="bg-surface-hover rounded-lg p-4 flex items-start justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium truncate">{round.partner_name}</span>
                {avg !== null && (
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                    {avg}/5
                  </span>
                )}
                <span className="text-xs text-muted">
                  {round.is_shared ? t('shared') : t('private')}
                </span>
              </div>

              {/* Individual ratings */}
              <div className="flex gap-1.5 mt-2">
                <RatingIcon field="intensity" value={round.intensity} />
                <RatingIcon field="technique_rating" value={round.technique_rating} />
                <RatingIcon field="flow_rating" value={round.flow_rating} />
                <RatingIcon field="learning_rating" value={round.learning_rating} />
                <RatingIcon field="mood_rating" value={round.mood_rating} />
              </div>

              {round.notes && (
                <p className="text-sm text-muted mt-2 line-clamp-2">{round.notes}</p>
              )}
            </div>

            {isOwner && (
              <button
                onClick={() => handleDelete(round.id)}
                disabled={deletingId === round.id}
                className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 shrink-0"
              >
                {deletingId === round.id ? tCommon('deleting') : tCommon('delete')}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
