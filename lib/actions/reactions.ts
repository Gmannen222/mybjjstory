'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendPushNotification } from '@/lib/push'
import type { ReactionType } from '@/lib/types/database'
import type { ActionResult } from './posts'

const VALID_REACTION_TYPES: ReactionType[] = ['oss', 'high_five', 'fire']

export async function toggleReaction(
  formData: FormData
): Promise<ActionResult<{ action: 'added' | 'removed' }>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å reagere på innlegg.' }
  }

  const postId = formData.get('post_id')
  const type = formData.get('type')

  if (typeof postId !== 'string' || !postId.trim()) {
    return { success: false, error: 'Manglende innleggs-ID.' }
  }

  if (typeof type !== 'string' || !VALID_REACTION_TYPES.includes(type as ReactionType)) {
    return { success: false, error: 'Ugyldig reaksjonstype.' }
  }

  // Check if user already has this exact reaction on this post
  const { data: existing, error: fetchError } = await supabase
    .from('reactions')
    .select('id, type')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchError) {
    console.error('Failed to check existing reaction:', fetchError)
    return { success: false, error: 'Kunne ikke sjekke eksisterende reaksjon. Prøv igjen.' }
  }

  if (existing && existing.type === type) {
    // Same reaction exists — toggle off (remove)
    const { error: deleteError } = await supabase
      .from('reactions')
      .delete()
      .eq('id', existing.id)

    if (deleteError) {
      console.error('Failed to remove reaction:', deleteError)
      return { success: false, error: 'Kunne ikke fjerne reaksjonen. Prøv igjen.' }
    }

    revalidatePath('/')

    return { success: true, data: { action: 'removed' } }
  }

  if (existing) {
    // Different reaction exists — remove old one first
    const { error: deleteError } = await supabase
      .from('reactions')
      .delete()
      .eq('id', existing.id)

    if (deleteError) {
      console.error('Failed to remove old reaction:', deleteError)
      return { success: false, error: 'Kunne ikke oppdatere reaksjonen. Prøv igjen.' }
    }
  }

  // Insert new reaction
  const { error: insertError } = await supabase
    .from('reactions')
    .insert({
      post_id: postId,
      user_id: user.id,
      type: type as ReactionType,
    })

  if (insertError) {
    console.error('Failed to add reaction:', insertError)
    return { success: false, error: 'Kunne ikke legge til reaksjonen. Prøv igjen.' }
  }

  revalidatePath('/')

  // Fire-and-forget push notification to the post author
  void (async () => {
    try {
      const [postRes, profileRes] = await Promise.all([
        supabase.from('posts').select('user_id').eq('id', postId).single(),
        supabase.from('profiles').select('display_name').eq('id', user.id).single(),
      ])
      const postAuthorId = postRes.data?.user_id
      if (postAuthorId && postAuthorId !== user.id) {
        const displayName = profileRes.data?.display_name || 'Noen'
        await sendPushNotification(
          postAuthorId,
          'Ny reaksjon',
          `${displayName} reagerte på innlegget ditt`,
          { url: '/feed', type: 'reactions' }
        )
      }
    } catch { /* push failure must not affect response */ }
  })()

  return { success: true, data: { action: 'added' } }
}
