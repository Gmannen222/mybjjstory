'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

export async function createPost(
  prevState: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å opprette innlegg.' }
  }

  const content = formData.get('content')
  if (typeof content !== 'string' || !content.trim()) {
    return { success: false, error: 'Innlegget kan ikke være tomt.' }
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: content.trim(),
      post_type: 'text',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create post:', error)
    return { success: false, error: 'Kunne ikke opprette innlegget. Prøv igjen.' }
  }

  revalidatePath('/[locale]/feed', 'page')

  return { success: true, data: { id: data.id } }
}

export async function deletePost(postId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette innlegg.' }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete post:', error)
    return { success: false, error: 'Kunne ikke slette innlegget. Prøv igjen.' }
  }

  revalidatePath('/[locale]/feed', 'page')

  return { success: true }
}
