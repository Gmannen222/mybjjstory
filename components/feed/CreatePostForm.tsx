'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CreatePostForm({ locale }: { locale: string }) {
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setPosting(true)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setPosting(false)
      return
    }

    await supabase.from('posts').insert({
      user_id: sessionData.session.user.id,
      content: content.trim(),
      post_type: 'text',
    })

    setContent('')
    setPosting(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Del noe med fellesskapet..."
        rows={3}
        className="w-full bg-transparent border-none text-foreground resize-none focus:outline-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={posting || !content.trim()}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm disabled:opacity-50"
        >
          {posting ? 'Publiserer...' : 'Publiser'}
        </button>
      </div>
    </form>
  )
}
