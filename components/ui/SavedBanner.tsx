'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SavedBannerProps {
  message: string
}

export default function SavedBanner({ message }: SavedBannerProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('saved') === 'true') {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        // Remove the query param without a full navigation
        const url = new URL(window.location.href)
        url.searchParams.delete('saved')
        router.replace(url.pathname + (url.search || ''), { scroll: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  if (!visible) return null

  return (
    <div className="mb-6 bg-primary/10 text-primary border border-primary/20 rounded-lg p-3 text-sm font-medium text-center">
      {message}
    </div>
  )
}
