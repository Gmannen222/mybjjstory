'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendPushNotification } from '@/lib/push'
import type { ActionResult } from '@/lib/actions/posts'

interface CommentWithProfile {
  id: string
  post_id: string
  user_id: string
  content: string
  image_url: string | null
  created_at: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

export async function createComment(
  formData: FormData
): Promise<ActionResult<CommentWithProfile>> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å kommentere.' }
  }

  const postId = formData.get('post_id')
  const content = formData.get('content')
  const imageUrl = formData.get('image_url')

  if (typeof postId !== 'string' || !postId.trim()) {
    return { success: false, error: 'Mangler innleggs-ID.' }
  }

  if (typeof content !== 'string' || !content.trim()) {
    return { success: false, error: 'Kommentaren kan ikke være tom.' }
  }

  const insertData: Record<string, string> = {
    user_id: user.id,
    post_id: postId,
    content: content.trim(),
  }

  if (typeof imageUrl === 'string' && imageUrl.trim()) {
    insertData.image_url = imageUrl.trim()
  }

  const { data: inserted, error: insertError } = await supabase
    .from('comments')
    .insert(insertData)
    .select('id')
    .single()

  if (insertError || !inserted) {
    console.error('Failed to create comment:', insertError)
    return { success: false, error: 'Kunne ikke opprette kommentaren. Prøv igjen.' }
  }

  // Fetch the created comment with profile data for immediate UI update
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select(
      'id, post_id, user_id, content, image_url, created_at, profiles:user_id (display_name, avatar_url)'
    )
    .eq('id', inserted.id)
    .single()

  if (fetchError || !comment) {
    console.error('Failed to fetch created comment:', fetchError)
    return { success: false, error: 'Kommentaren ble opprettet, men kunne ikke hentes.' }
  }

  revalidatePath('/')

  // Fire-and-forget push notification to the post author
  const castComment = comment as unknown as CommentWithProfile
  void (async () => {
    try {
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single()
      if (post && post.user_id !== user.id) {
        const displayName = castComment.profiles?.display_name || 'Noen'
        await sendPushNotification(
          post.user_id,
          'Ny kommentar',
          `${displayName} kommenterte på innlegget ditt`,
          { url: '/feed', type: 'comments' }
        )
      }
    } catch { /* push failure must not affect response */ }
  })()

  return { success: true, data: castComment }
}

export async function deleteComment(
  commentId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette kommentarer.' }
  }

  if (!commentId) {
    return { success: false, error: 'Mangler kommentar-ID.' }
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('Failed to delete comment:', error)
    return { success: false, error: 'Kunne ikke slette kommentaren. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
