'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ShareButton({
  sessionId,
  sessionDate,
  sessionType,
}: {
  sessionId: string
  sessionDate: string
  sessionType: string
}) {
  const [shared, setShared] = useState(false)
  const [sharing, setSharing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleShare = async () => {
    setSharing(true)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setSharing(false)
      return
    }

    await supabase.from('posts').insert({
      user_id: sessionData.session.user.id,
      content: `Trente ${sessionType} den ${sessionDate} 🥋`,
      post_type: 'training',
      session_id: sessionId,
    })

    // Mark session as public
    await supabase
      .from('training_sessions')
      .update({ is_public: true })
      .eq('id', sessionId)

    setShared(true)
    setSharing(false)
    router.refresh()
  }

  if (shared) {
    return <span className="text-xs text-primary">Delt!</span>
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleShare()
      }}
      disabled={sharing}
      className="text-xs text-muted hover:text-primary transition-colors disabled:opacity-50"
    >
      {sharing ? '...' : 'Del'}
    </button>
  )
}
