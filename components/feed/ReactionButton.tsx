'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleReaction } from '@/lib/actions/reactions'
import type { ReactionType } from '@/lib/types/database'

const REACTION_ICONS: Record<ReactionType, string> = {
  oss: '🥋',
  high_five: '🙏',
  fire: '🔥',
}

const REACTION_LABELS: Record<ReactionType, string> = {
  oss: 'Reager med Oss (kimono)',
  high_five: 'Reager med High Five',
  fire: 'Reager med Ild',
}

interface ReactionButtonProps {
  postId: string
  initialCount: number
  userReaction: ReactionType | null
}

interface ReactionState {
  myReaction: ReactionType | null
  count: number
}

export default function ReactionButton({
  postId,
  initialCount,
  userReaction,
}: ReactionButtonProps) {
  const [isPending, startTransition] = useTransition()

  const [optimistic, setOptimistic] = useOptimistic<ReactionState, ReactionType>(
    { myReaction: userReaction, count: initialCount },
    (state, clickedType) => {
      if (state.myReaction === clickedType) {
        // Toggling off the same reaction
        return { myReaction: null, count: state.count - 1 }
      }
      if (state.myReaction) {
        // Switching to a different reaction — count stays the same
        return { myReaction: clickedType, count: state.count }
      }
      // Adding a new reaction
      return { myReaction: clickedType, count: state.count + 1 }
    }
  )

  const handleReaction = (type: ReactionType) => {
    startTransition(async () => {
      setOptimistic(type)

      const formData = new FormData()
      formData.set('post_id', postId)
      formData.set('type', type)

      const result = await toggleReaction(formData)

      if (!result.success) {
        console.error('Reaksjonsfeil:', result.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      {(Object.keys(REACTION_ICONS) as ReactionType[]).map((type) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          disabled={isPending}
          aria-label={`${REACTION_LABELS[type]}${optimistic.myReaction === type ? ' (aktiv)' : ''}`}
          aria-pressed={optimistic.myReaction === type}
          className={`px-2.5 py-2.5 rounded-lg text-sm transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
            optimistic.myReaction === type
              ? 'bg-primary/20 scale-110'
              : 'hover:bg-surface-hover'
          } ${isPending ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {REACTION_ICONS[type]}
        </button>
      ))}
      {optimistic.count > 0 && (
        <span className="text-xs text-muted ml-1">{optimistic.count}</span>
      )}
    </div>
  )
}
