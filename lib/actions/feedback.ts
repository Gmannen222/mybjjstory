'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from './posts'
import type { FeedbackType, SessionFeedbackType } from '@/lib/types/database'

const VALID_FEEDBACK_TYPES: FeedbackType[] = ['suggestion', 'wish', 'bug', 'other']
const VALID_SESSION_FEEDBACK_TYPES: SessionFeedbackType[] = ['tip', 'encouragement', 'observation', 'question']

export async function submitFeedback(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å sende tilbakemeldinger.' }
  }

  const message = formData.get('message')
  if (typeof message !== 'string' || !message.trim()) {
    return { success: false, error: 'Meldingen kan ikke være tom.' }
  }

  const type = (formData.get('type') as string) || 'suggestion'
  if (!VALID_FEEDBACK_TYPES.includes(type as FeedbackType)) {
    return { success: false, error: 'Ugyldig tilbakemeldingstype.' }
  }

  const { error } = await supabase.from('feedback').insert({
    user_id: user.id,
    type: type as FeedbackType,
    message: message.trim(),
    contact_email: (formData.get('contact_email') as string) || null,
  })

  if (error) {
    console.error('Failed to submit feedback:', error)
    return { success: false, error: 'Kunne ikke sende tilbakemeldingen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}

export async function submitSessionFeedback(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å sende tilbakemeldinger.' }
  }

  const sessionId = formData.get('session_id')
  if (typeof sessionId !== 'string' || !sessionId) {
    return { success: false, error: 'Manglende økt-ID.' }
  }

  const recipientId = formData.get('recipient_id')
  if (typeof recipientId !== 'string' || !recipientId) {
    return { success: false, error: 'Du må velge en mottaker.' }
  }

  const message = formData.get('message')
  if (typeof message !== 'string' || !message.trim()) {
    return { success: false, error: 'Meldingen kan ikke være tom.' }
  }

  const feedbackType = (formData.get('feedback_type') as string) || 'encouragement'
  if (!VALID_SESSION_FEEDBACK_TYPES.includes(feedbackType as SessionFeedbackType)) {
    return { success: false, error: 'Ugyldig tilbakemeldingstype.' }
  }

  const { error } = await supabase.from('session_feedback').insert({
    session_id: sessionId,
    sender_id: user.id,
    recipient_id: recipientId,
    message: message.trim(),
    feedback_type: feedbackType as SessionFeedbackType,
  })

  if (error) {
    console.error('Failed to send session feedback:', error)
    return { success: false, error: 'Kunne ikke sende tilbakemeldingen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
