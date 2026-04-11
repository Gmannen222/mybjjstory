'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { createPost, type ActionResult } from '@/lib/actions/posts'
import SubmitButton from '@/components/ui/SubmitButton'

const initialState: ActionResult<{ id: string }> = { success: true }

export default function CreatePostForm({ locale }: { locale: string }) {
  const [state, formAction] = useActionState(createPost, initialState)
  const [content, setContent] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success && state.data) {
      setContent('')
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="bg-surface rounded-xl p-4">
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Del noe med fellesskapet..."
        rows={3}
        className="w-full bg-transparent border-none text-foreground resize-none focus:outline-none"
      />

      {!state.success && (
        <p className="text-red-400 text-sm mt-1">{state.error}</p>
      )}

      <div className="flex justify-end mt-2">
        <SubmitButton
          disabled={!content.trim()}
          pendingText="Publiserer..."
          className="text-sm py-2"
        >
          Publiser
        </SubmitButton>
      </div>
    </form>
  )
}
