'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from './posts'

const RATING_KEYS = ['intensity', 'technique', 'flow', 'learning', 'mood'] as const
type RatingKey = typeof RATING_KEYS[number]

const DB_FIELD_MAP: Record<RatingKey, string> = {
  intensity: 'intensity',
  technique: 'technique_rating',
  flow: 'flow_rating',
  learning: 'learning_rating',
  mood: 'mood_rating',
}

export async function createRound(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å lagre sparringrunder.' }
  }

  const sessionId = formData.get('session_id')
  if (typeof sessionId !== 'string' || !sessionId) {
    return { success: false, error: 'Manglende økt-ID.' }
  }

  const partnerName = formData.get('partner_name')
  if (typeof partnerName !== 'string' || !partnerName.trim()) {
    return { success: false, error: 'Partnernavn er påkrevd.' }
  }

  const payload: Record<string, unknown> = {
    session_id: sessionId,
    user_id: user.id,
    partner_name: partnerName.trim(),
    notes: (formData.get('notes') as string)?.trim() || null,
    is_shared: formData.get('is_shared') === 'true',
  }

  for (const key of RATING_KEYS) {
    const val = formData.get(key)
    payload[DB_FIELD_MAP[key]] = val ? parseInt(val as string) : null
  }

  const { error } = await supabase.from('sparring_rounds').insert(payload)

  if (error) {
    console.error('Failed to save sparring round:', error)
    return { success: false, error: 'Kunne ikke lagre sparringrunden. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
