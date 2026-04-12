'use client'

import { BeltBadge } from '@/components/ui/BeltBadge'

export interface TopTrainerData {
  top_user_id: string | null
  top_display_name: string | null
  top_belt_rank: string | null
  top_count: number
  is_current_user: boolean
  user_was_top_before: boolean
}

export default function TopTrainerBadge({ data }: { data: TopTrainerData }) {
  if (!data.top_user_id && !data.user_was_top_before) return null

  return (
    <div className="mb-6">
      {data.top_user_id && (
        <div className={`relative overflow-hidden rounded-xl p-4 flex items-center gap-4 border ${
          data.is_current_user
            ? 'bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/15 border-yellow-500/30'
            : 'bg-gradient-to-r from-yellow-500/8 via-amber-500/5 to-yellow-500/8 border-yellow-500/20'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />

          <div className="text-3xl relative">👑</div>

          <div className="flex-1 relative">
            <div className="text-[10px] text-yellow-500/80 uppercase tracking-widest font-semibold mb-0.5">
              Ukens treningskonge
            </div>
            <div className="font-bold text-lg leading-tight">
              {data.is_current_user ? 'Du!' : data.top_display_name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted">
                {data.top_count} {data.top_count === 1 ? 'trening' : 'treninger'} denne uken
              </span>
              {data.top_belt_rank && (
                <BeltBadge rank={data.top_belt_rank} />
              )}
            </div>
          </div>

          {data.is_current_user && (
            <div className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider relative">
              Nåværende
            </div>
          )}
        </div>
      )}

      {data.user_was_top_before && !data.is_current_user && (
        <div className={`flex items-center gap-2 text-xs text-muted ${data.top_user_id ? 'mt-2' : ''}`}>
          <span className="text-yellow-600/60">👑</span>
          Du har vært ukens treningskonge tidligere!
        </div>
      )}
    </div>
  )
}
