'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface MediaUploadFormProps {
  sessionId?: string
  gradingId?: string
  bucket: string
  locale: string
}

export default function MediaUploadForm({
  sessionId,
  gradingId,
  bucket,
  locale,
}: MediaUploadFormProps) {
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) return

    setUploading(true)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setUploading(false)
      return
    }

    const userId = sessionData.session.user.id
    const ext = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${ext}`
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (uploadError) {
      setUploading(false)
      return
    }

    await supabase.from('media').insert({
      user_id: userId,
      storage_path: fileName,
      media_type: mediaType,
      caption: caption || null,
      session_id: sessionId || null,
      grading_id: gradingId || null,
      is_public: false,
    })

    setCaption('')
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-background file:font-semibold file:cursor-pointer hover:file:bg-primary-hover"
      />
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Bildetekst (valgfritt)"
        className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm disabled:opacity-50"
      >
        {uploading ? 'Laster opp...' : 'Last opp'}
      </button>
    </div>
  )
}
