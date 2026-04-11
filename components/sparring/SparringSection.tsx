'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { SparringRound } from '@/lib/types/database'
import SparringRoundForm from './SparringRoundForm'
import SparringRoundList from './SparringRoundList'

export default function SparringSection({
  sessionId,
  rounds,
  isOwner,
}: {
  sessionId: string
  rounds: SparringRound[]
  isOwner: boolean
}) {
  const t = useTranslations('sparring')
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="mt-6 bg-surface rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{t('title')}</h2>
        {isOwner && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="px-3 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-lg hover:bg-primary/30 transition-colors"
          >
            {showForm ? '−' : '+'} {t('addRound')}
          </button>
        )}
      </div>

      {showForm && isOwner && (
        <div className="mb-6 pb-6 border-b border-white/10">
          <SparringRoundForm
            sessionId={sessionId}
            onSaved={() => setShowForm(false)}
          />
        </div>
      )}

      <SparringRoundList rounds={rounds} isOwner={isOwner} />
    </div>
  )
}
