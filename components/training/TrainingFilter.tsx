'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { TrainingType } from '@/lib/types/database'

const TRAINING_TYPES: TrainingType[] = ['gi', 'nogi', 'open_mat', 'private', 'competition']

export default function TrainingFilter({
  locale,
  currentType,
  currentMonth,
}: {
  locale: string
  currentType: string
  currentMonth: string
}) {
  const router = useRouter()
  const t = useTranslations('training')

  const buildUrl = (type: string, month: string) => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (month) params.set('month', month)
    const qs = params.toString()
    return `/${locale}/training${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Type filter */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => router.push(buildUrl('', currentMonth))}
          className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] ${
            !currentType ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-foreground'
          }`}
        >
          Alle
        </button>
        {TRAINING_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => router.push(buildUrl(currentType === type ? '' : type, currentMonth))}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] ${
              currentType === type ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            {t(`types.${type}`)}
          </button>
        ))}
      </div>

      {/* Month filter */}
      <input
        type="month"
        value={currentMonth}
        onChange={(e) => router.push(buildUrl(currentType, e.target.value))}
        className="px-3 py-2.5 bg-surface border border-white/10 rounded-lg text-xs text-foreground focus:outline-none focus:border-primary min-h-[44px]"
      />

      {/* Clear filters */}
      {(currentType || currentMonth) && (
        <button
          onClick={() => router.push(`/${locale}/training`)}
          className="px-4 py-2.5 text-xs text-red-400 hover:text-red-300 transition-colors min-h-[44px]"
        >
          Nullstill
        </button>
      )}
    </div>
  )
}
