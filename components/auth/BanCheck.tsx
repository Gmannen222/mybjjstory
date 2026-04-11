'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BanCheck({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Skip check on the banned page itself, auth routes, and the landing page
    if (
      pathname.includes('/banned') ||
      pathname.includes('/auth') ||
      pathname === `/${locale}` ||
      pathname === '/'
    ) {
      return
    }

    async function checkBan() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', user.id)
        .single()

      if (profile?.is_banned) {
        router.replace(`/${locale}/banned`)
      }
    }

    checkBan()
  }, [pathname, locale, router])

  return null
}
