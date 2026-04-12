'use client'

import { createContext, useContext, useMemo } from 'react'
import { usePresence, type PresenceUser } from '@/lib/hooks/usePresence'
import { useAuthProfile } from '@/lib/hooks/useAuthProfile'

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
  const { user, profile } = useAuthProfile()

  const currentUser = useMemo(() => {
    if (!user) return undefined
    return {
      id: user.id,
      display_name: profile?.display_name || 'Anonym',
      avatar_url: profile?.avatar_url ?? null,
    }
  }, [user, profile])

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
