'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import AchievementBadge from './AchievementBadge'

interface AchievementWithStatus {
  id: string
  name: string
  description: string
  icon: string
  category: string
  earned: boolean
  earned_at: string | null
}

const CATEGORY_LABELS: Record<string, string> = {
  training: 'Trening',
  streak: 'Streaks',
  belt: 'Belter',
  competition: 'Konkurranser',
  social: 'Sosialt',
  special: 'Spesielt',
}

export default function AchievementsList({ compact = false }: { compact?: boolean }) {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const t = useTranslations('achievements')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [allRes, earnedRes] = await Promise.all([
        supabase.from('achievements').select('*').order('sort_order'),
        supabase.from('user_achievements').select('achievement_id, earned_at').eq('user_id', session.user.id),
      ])

      const earnedMap = new Map(
        (earnedRes.data || []).map((e: { achievement_id: string; earned_at: string }) => [e.achievement_id, e.earned_at])
      )

      const merged: AchievementWithStatus[] = (allRes.data || []).map((a: { id: string; name: string; description: string; icon: string; category: string }) => ({
        ...a,
        earned: earnedMap.has(a.id),
        earned_at: earnedMap.get(a.id) ?? null,
      }))

      // Sort earned first
      merged.sort((a, b) => {
        if (a.earned && !b.earned) return -1
        if (!a.earned && b.earned) return 1
        return 0
      })

      setAchievements(merged)
      setLoading(false)
    }
    load()
  }, [supabase])

  if (loading) {
    return (
      <div className="space-y-8" aria-busy="true" aria-label="Laster achievements">
        <div className="bg-surface rounded-xl p-4 border border-white/5 animate-pulse">
          <div className="h-4 bg-surface-hover rounded w-1/3 mb-3" />
          <div className="h-2 bg-surface-hover rounded-full" />
        </div>
        <div>
          <div className="h-3 bg-surface-hover rounded w-1/4 mb-3 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-hover rounded-xl h-16" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const earnedCount = achievements.filter((a) => a.earned).length

  if (compact) {
    const shown = achievements.filter((a) => a.earned).slice(0, 6)
    if (shown.length === 0) return null

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
            {t('title')} ({t('progress', { earned: earnedCount, total: achievements.length })})
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {shown.map((a) => (
            <AchievementBadge
              key={a.id}
              name={a.name}
              description={a.description}
              icon={a.icon}
              earned={a.earned}
              earnedAt={a.earned_at}
              size="sm"
            />
          ))}
        </div>
      </div>
    )
  }

  // Full view — group by category
  const categories = [...new Set(achievements.map((a) => a.category))]

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="bg-surface rounded-xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Fremgang</span>
          <span className="text-sm text-primary font-bold">{earnedCount}/{achievements.length}</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${achievements.length > 0 ? (earnedCount / achievements.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {categories.map((cat) => {
        const items = achievements.filter((a) => a.category === cat)
        return (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
              {CATEGORY_LABELS[cat] || cat}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((a) => (
                <AchievementBadge
                  key={a.id}
                  name={a.name}
                  description={a.description}
                  icon={a.icon}
                  earned={a.earned}
                  earnedAt={a.earned_at}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
