'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface PresenceUser {
  user_id: string
  display_name: string
  avatar_url: string | null
}

export function usePresence(currentUser?: {
  id: string
  display_name: string
  avatar_url: string | null
}) {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, PresenceUser>>(
    new Map()
  )

  useEffect(() => {
    if (!currentUser) return

    const supabase = createClient()
    const channel = supabase.channel('online-users')

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceUser>()
        const users = new Map<string, PresenceUser>()
        Object.values(state).forEach((presences) => {
          presences.forEach((p) => users.set(p.user_id, p))
        })
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUser.id,
            display_name: currentUser.display_name,
            avatar_url: currentUser.avatar_url,
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const isOnline = (userId: string) => onlineUsers.has(userId)
  const onlineCount = onlineUsers.size

  return { onlineUsers, isOnline, onlineCount }
}
