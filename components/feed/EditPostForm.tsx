'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { updatePost, type ActionResult } from '@/lib/actions/posts'
import SubmitButton from '@/components/ui/SubmitButton'

const initialState: ActionResult = { success: true }

interface EditPostFormProps {
  postId: string
  currentContent: string
  onCancel: () => void
  onSaved: () => void
}

export default function EditPostForm({
  postId,
  currentContent,
  onCancel,
  onSaved,
}: EditPostFormProps) {
  const t = useTranslations('feed')
  const [content, setContent] = useState(currentContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const boundUpdatePost = updatePost.bind(null, postId)
  const [state, formAction] = useActionState(boundUpdatePost, initialState)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    if (state.success && state !== initialState) {
      onSaved()
    }
  }, [state, onSaved])

  return (
    <form action={formAction} className="mb-4">
      <label className="sr-only" htmlFor={`edit-post-${postId}`}>
        {t('editing')}
      </label>
      <textarea
        id={`edit-post-${postId}`}
        ref={textareaRef}
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={2000}
        className="w-full bg-background border border-white/10 rounded-lg p-3 text-foreground resize-none focus:outline-none focus:border-primary/50"
      />

      {!state.success && (
        <p className="text-red-400 text-sm mt-1">{state.error}</p>
      )}

      <div className="flex items-center gap-2 mt-2">
        <SubmitButton
          disabled={!content.trim() || content.trim() === currentContent}
          pendingText="Lagrer..."
          className="text-sm py-2"
        >
          {t('saveEdit')}
        </SubmitButton>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          {t('cancelEdit')}
        </button>
      </div>
    </form>
  )
}
