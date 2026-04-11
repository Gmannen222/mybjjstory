'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { isAdmin } from '@/lib/admin'

export default function AdminLink() {
  const [show, setShow] = useState(false)
  const locale = useLocale()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        isAdmin(supabase, user.id).then(setShow)
      }
    })
  }, [])

  if (!show) return null

  return (
    <Link
      href={`/${locale}/admin`}
      className="hover:text-foreground transition-colors text-primary/80"
    >
      Admin
    </Link>
  )
}
