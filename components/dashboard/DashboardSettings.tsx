'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DashboardConfig } from '@/lib/types/database'

const SECTIONS: { key: keyof DashboardConfig; label: string; desc: string }[] = [
  { key: 'showAvatar', label: 'Avatar', desc: 'Vis din BJJ-avatar' },
  { key: 'showBelt', label: 'Belte', desc: 'Vis nåværende belte' },
  { key: 'showTrainingStats', label: 'Treningsstatistikk', desc: 'Uke, måned, totalt' },
  { key: 'showCompetitionStats', label: 'Konkurransestatistikk', desc: 'Antall, gull-medaljer' },
  { key: 'showActiveInjuries', label: 'Aktive skader', desc: 'Varsling om pågående skader' },
  { key: 'showRecentTraining', label: 'Siste treninger', desc: 'Dine siste 5 økter' },
  { key: 'showQuickActions', label: 'Hurtigvalg', desc: 'Snarvei-knapper' },
  { key: 'showFavoriteSub', label: 'Favoritt-submission', desc: 'Vis på forsiden' },
  { key: 'showFavoriteGuard', label: 'Favorittguard', desc: 'Vis på forsiden' },
]

export default function DashboardSettings({
  config,
  onUpdate,
}: {
  config: DashboardConfig
  onUpdate: (config: DashboardConfig) => void
}) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const toggle = async (key: keyof DashboardConfig) => {
    const updated = { ...config, [key]: !config[key] }
    onUpdate(updated)

    setSaving(true)
    const { data: session } = await supabase.auth.getSession()
    if (session.session) {
      await supabase
        .from('profiles')
        .update({ dashboard_config: updated })
        .eq('id', session.session.user.id)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-1">
      {SECTIONS.map(({ key, label, desc }) => (
        <label
          key={key}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
        >
          <div>
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-muted">{desc}</div>
          </div>
          <input
            type="checkbox"
            checked={config[key]}
            onChange={() => toggle(key)}
            className="w-5 h-5 rounded accent-primary"
          />
        </label>
      ))}
      {saving && <p className="text-xs text-muted text-center pt-2">Lagrer...</p>}
    </div>
  )
}
