'use client'

import { useState, useEffect, useOptimistic, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createComment, deleteComment } from '@/lib/actions/comments'
import { compressImage } from '@/lib/image'
import { Lightbox } from '@/components/ui/Lightbox'
import SubmitButton from '@/components/ui/SubmitButton'
import { useTranslations } from 'next-intl'
import { useRealtimeInserts } from '@/lib/hooks/useRealtimeInserts'

interface CommentData {
  id: string
  content: string
  image_url?: string | null
  created_at: string
  sending?: boolean
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default function CommentSection({
  postId,
  initialCount,
}: {
  postId: string
  initialCount: number
}) {
  const [comments, setComments] = useState<CommentData[]>([])
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<{
    display_name: string | null
    avatar_url: string | null
  } | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const t = useTranslations('feed')

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state: CommentData[], newComment: CommentData) => [...state, newComment]
  )

  useEffect(() => {
    if (!expanded) return

    setLoading(true)
    supabase
      .from('comments')
      .select('id, content, image_url, created_at, profiles:user_id (display_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setComments((data as unknown as CommentData[]) || [])
        setLoading(false)
      })
  }, [expanded, postId, supabase])

  // Fetch current user's profile for optimistic updates
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      currentUserIdRef.current = user.id
      supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setUserProfile(data)
        })
    })
  }, [supabase])

  // Realtime: auto-append new comments from other users
  const currentUserIdRef = useRef<string | null>(null)
  const handleRealtimeComment = useCallback(
    (payload: Record<string, unknown>) => {
      if (!expanded) return
      // Skip own comments (already handled by optimistic updates)
      if (payload.user_id === currentUserIdRef.current) return

      // Fetch full comment with profile
      const supabaseClient = createClient()
      supabaseClient
        .from('comments')
        .select('id, content, image_url, created_at, profiles:user_id (display_name, avatar_url)')
        .eq('id', payload.id as string)
        .single()
        .then(({ data }) => {
          if (data) {
            setComments((prev) => {
              // Avoid duplicates
              if (prev.some((c) => c.id === data.id)) return prev
              return [...prev, data as unknown as CommentData]
            })
          }
        })
    },
    [expanded]
  )

  useRealtimeInserts(
    'comments',
    expanded ? { column: 'post_id', value: postId } : null,
    expanded ? handleRealtimeComment : undefined
  )

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function clearSelectedImage() {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleCreateComment(formData: FormData) {
    const content = formData.get('content')
    if (typeof content !== 'string' || !content.trim()) return

    setError(null)

    // Add optimistic comment immediately
    const optimistic: CommentData = {
      id: `optimistic-${Date.now()}`,
      content: content.trim(),
      image_url: imagePreview,
      created_at: new Date().toISOString(),
      sending: true,
      profiles: userProfile,
    }
    addOptimisticComment(optimistic)
    formRef.current?.reset()

    // Upload image if selected
    let uploadedImageUrl: string | null = null
    if (selectedImage) {
      setUploading(true)
      try {
        const compressed = await compressImage(selectedImage, 1200, 0.8)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setError('Du må være innlogget for å laste opp bilder.')
          setUploading(false)
          return
        }

        const ext = selectedImage.name.split('.').pop() || 'jpg'
        const fileName = `${user.id}/${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('comment-media')
          .upload(fileName, compressed, { contentType: compressed.type })

        if (uploadError) {
          console.error('Failed to upload comment image:', uploadError)
          setError('Kunne ikke laste opp bildet. Prøv igjen.')
          setUploading(false)
          return
        }

        const { data: urlData } = supabase.storage
          .from('comment-media')
          .getPublicUrl(fileName)

        uploadedImageUrl = urlData.publicUrl
      } catch (err) {
        console.error('Image compression/upload failed:', err)
        setError('Kunne ikke behandle bildet. Prøv igjen.')
        setUploading(false)
        return
      }
      setUploading(false)
    }

    // Add image_url to form data if uploaded
    if (uploadedImageUrl) {
      formData.set('image_url', uploadedImageUrl)
    }

    clearSelectedImage()

    const result = await createComment(formData)

    if (result.success && result.data) {
      setComments((prev) => [...prev, result.data as unknown as CommentData])
    } else if (!result.success) {
      setError(result.error)
    }
  }

  async function handleDeleteComment(commentId: string) {
    setError(null)
    const result = await deleteComment(commentId)

    if (result.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } else if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        {initialCount} {t('comments')}
        {expanded ? ' ▴' : ' ▾'}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {loading ? (
            <p className="text-xs text-muted">Laster...</p>
          ) : (
            optimisticComments.map((c) => (
              <div
                key={c.id}
                className={`flex gap-2 ${c.sending ? 'opacity-60' : ''}`}
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {(c.profiles?.display_name || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold">
                    {c.profiles?.display_name || 'Anonym'}
                  </span>
                  <p className="text-sm">{c.content}</p>
                  {c.image_url && (
                    <button
                      type="button"
                      onClick={() => setLightboxUrl(c.image_url!)}
                      className="mt-1 block"
                    >
                      <img
                        src={c.image_url}
                        alt="Kommentarbilde"
                        className="max-w-[200px] max-h-[150px] rounded-md object-cover border border-white/10 hover:opacity-80 transition-opacity"
                      />
                    </button>
                  )}
                </div>
                {!c.sending && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-xs text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Slett kommentar"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          )}

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Forhåndsvisning"
                className="max-w-[120px] max-h-[90px] rounded-md object-cover border border-white/10"
              />
              <button
                type="button"
                onClick={clearSelectedImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                x
              </button>
            </div>
          )}

          <form ref={formRef} action={handleCreateComment} className="flex gap-2 items-center">
            <input type="hidden" name="post_id" value={postId} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              title="Legg til bilde"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909a.75.75 0 0 1-1.06 0L6.53 7.53a.75.75 0 0 0-1.06 0L2.5 11.06Zm10-3.56a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="text"
              name="content"
              placeholder={`${t('comment')}...`}
              className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
            />
            <SubmitButton
              pendingText=""
              className="!px-3 !py-2 text-sm"
              disabled={uploading}
            >
              {uploading ? '...' : '↑'}
            </SubmitButton>
          </form>
        </div>
      )}

      {lightboxUrl && (
        <Lightbox
          images={[lightboxUrl]}
          initialIndex={0}
          onClose={() => setLightboxUrl(null)}
        />
      )}
    </div>
  )
}
