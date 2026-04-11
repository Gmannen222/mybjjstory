'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePresence, type PresenceUser } from '@/lib/hooks/usePresence'
import { createClient } from '@/lib/supabase/client'

interface OnlineStatusContextType {
  isOnline: (userId: string) => boolean
  onlineCount: number
  onlineUsers: Map<string, PresenceUser>
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  isOnline: () => false,
  onlineCount: 0,
  onlineUsers: new Map(),
})

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<{
    id: string
    display_name: string
    avatar_url: string | null
  } | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setCurrentUser({
              id: user.id,
              display_name: data.display_name || 'Anonym',
              avatar_url: data.avatar_url,
            })
          }
        })
    })
  }, [])

  const { onlineUsers, isOnline, onlineCount } = usePresence(currentUser)

  return (
    <OnlineStatusContext.Provider value={{ isOnline, onlineCount, onlineUsers }}>
      {children}
    </OnlineStatusContext.Provider>
  )
}

export function useOnlineStatus() {
  return useContext(OnlineStatusContext)
}
