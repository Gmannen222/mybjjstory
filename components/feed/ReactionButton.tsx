'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ReactionType } from '@/lib/types/database'

const REACTION_ICONS: Record<ReactionType, string> = {
  oss: '🥋',
  high_five: '🙏',
  fire: '🔥',
}

interface ReactionButtonProps {
  postId: string
  initialCount: number
  userReaction: ReactionType | null
}

export default function ReactionButton({
  postId,
  initialCount,
  userReaction,
}: ReactionButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [myReaction, setMyReaction] = useState<ReactionType | null>(userReaction)
  const supabase = createClient()

  const handleReaction = async (type: ReactionType) => {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) return

    if (myReaction === type) {
      await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', sessionData.session.user.id)
      setMyReaction(null)
      setCount((c) => c - 1)
    } else {
      if (myReaction) {
        await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', sessionData.session.user.id)
      } else {
        setCount((c) => c + 1)
      }
      await supabase.from('reactions').insert({
        post_id: postId,
        user_id: sessionData.session.user.id,
        type,
      })
      setMyReaction(type)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {(Object.keys(REACTION_ICONS) as ReactionType[]).map((type) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={`px-2 py-1 rounded-lg text-sm transition-all ${
            myReaction === type
              ? 'bg-primary/20 scale-110'
              : 'hover:bg-surface-hover'
          }`}
        >
          {REACTION_ICONS[type]}
        </button>
      ))}
      {count > 0 && <span className="text-xs text-muted ml-1">{count}</span>}
    </div>
  )
}
