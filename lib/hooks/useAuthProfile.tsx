'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface AuthProfile {
  display_name: string | null
  avatar_url: string | null
  belt_rank: string | null
  belt_degrees: number
  username: string | null
  academy_name: string | null
}

interface AuthProfileContextType {
  user: User | null
  profile: AuthProfile | null
  loading: boolean
  isAuthenticated: boolean
  refreshProfile: () => Promise<void>
}

const AuthProfileContext = createContext<AuthProfileContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  refreshProfile: async () => {},
})

export function AuthProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, belt_rank, belt_degrees, username, academy_name')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as AuthProfile)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null)
      if (u) {
        fetchProfile(u.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  return (
    <AuthProfileContext.Provider value={{
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      refreshProfile,
    }}>
      {children}
    </AuthProfileContext.Provider>
  )
}

export function useAuthProfile() {
  return useContext(AuthProfileContext)
}
