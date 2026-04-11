'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/actions/posts'
import type { TrainingType, MoodType, TechniqueCategory } from '@/lib/types/database'

const VALID_TRAINING_TYPES: TrainingType[] = [
  'gi', 'nogi', 'open_mat', 'private', 'competition', 'seminar', 'competition_prep',
]

const VALID_MOOD_TYPES: MoodType[] = ['great', 'good', 'neutral', 'tired', 'bad']

interface SessionTechniqueInput {
  name: string
  category: TechniqueCategory | null
}

function parseTechniques(formData: FormData): SessionTechniqueInput[] {
  const raw = formData.get('techniques')
  if (typeof raw !== 'string' || !raw.trim()) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t: unknown): t is SessionTechniqueInput =>
        typeof t === 'object' && t !== null && typeof (t as Record<string, unknown>).name === 'string'
    )
  } catch {
    return []
  }
}

export async function createSession(
  prevState: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å registrere trening.' }
  }

  const date = formData.get('date')
  if (typeof date !== 'string' || !date.trim()) {
    return { success: false, error: 'Dato er påkrevd.' }
  }

  const type = formData.get('type') as string
  if (!VALID_TRAINING_TYPES.includes(type as TrainingType)) {
    return { success: false, error: 'Ugyldig treningstype.' }
  }

  const durationRaw = formData.get('duration_min')
  const durationMin = durationRaw && String(durationRaw).trim() ? parseInt(String(durationRaw)) : null

  const effortRaw = formData.get('effort_rpe')
  const effortRpe = effortRaw && String(effortRaw).trim() ? parseInt(String(effortRaw)) : null

  const moodBefore = formData.get('mood_before') as string | null
  const moodAfter = formData.get('mood_after') as string | null

  const bodyWeightRaw = formData.get('body_weight_kg')
  const bodyWeightKg = bodyWeightRaw && String(bodyWeightRaw).trim() ? parseFloat(String(bodyWeightRaw)) : null

  const notes = formData.get('notes')
  const notesValue = typeof notes === 'string' && notes.trim() ? notes.trim() : null

  const payload = {
    user_id: user.id,
    date: date.trim(),
    type: type as TrainingType,
    duration_min: durationMin,
    notes: notesValue,
    effort_rpe: effortRpe,
    mood_before: (moodBefore && VALID_MOOD_TYPES.includes(moodBefore as MoodType) ? moodBefore : null) as MoodType | null,
    mood_after: (moodAfter && VALID_MOOD_TYPES.includes(moodAfter as MoodType) ? moodAfter : null) as MoodType | null,
    body_weight_kg: bodyWeightKg,
  }

  const { data: newSession, error: insertError } = await supabase
    .from('training_sessions')
    .insert(payload)
    .select('id')
    .single()

  if (insertError || !newSession) {
    console.error('Failed to create training session:', insertError)
    return { success: false, error: 'Kunne ikke lagre treningsøkten. Prøv igjen.' }
  }

  // Insert techniques
  const techniques = parseTechniques(formData)
  if (techniques.length > 0) {
    const { error: techError } = await supabase
      .from('session_techniques')
      .insert(techniques.map((t) => ({
        session_id: newSession.id,
        name: t.name,
        category: t.category,
      })))

    if (techError) {
      console.error('Failed to insert session techniques:', techError)
      // Session was created, techniques failed — not a full failure
    }
  }

  revalidatePath('/')

  return { success: true, data: { id: newSession.id } }
}

export async function updateSession(
  prevState: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å oppdatere trening.' }
  }

  const sessionId = formData.get('session_id')
  if (typeof sessionId !== 'string' || !sessionId.trim()) {
    return { success: false, error: 'Manglende treningsøkt-ID.' }
  }

  const date = formData.get('date')
  if (typeof date !== 'string' || !date.trim()) {
    return { success: false, error: 'Dato er påkrevd.' }
  }

  const type = formData.get('type') as string
  if (!VALID_TRAINING_TYPES.includes(type as TrainingType)) {
    return { success: false, error: 'Ugyldig treningstype.' }
  }

  const durationRaw = formData.get('duration_min')
  const durationMin = durationRaw && String(durationRaw).trim() ? parseInt(String(durationRaw)) : null

  const effortRaw = formData.get('effort_rpe')
  const effortRpe = effortRaw && String(effortRaw).trim() ? parseInt(String(effortRaw)) : null

  const moodBefore = formData.get('mood_before') as string | null
  const moodAfter = formData.get('mood_after') as string | null

  const bodyWeightRaw = formData.get('body_weight_kg')
  const bodyWeightKg = bodyWeightRaw && String(bodyWeightRaw).trim() ? parseFloat(String(bodyWeightRaw)) : null

  const notes = formData.get('notes')
  const notesValue = typeof notes === 'string' && notes.trim() ? notes.trim() : null

  const payload = {
    date: date.trim(),
    type: type as TrainingType,
    duration_min: durationMin,
    notes: notesValue,
    effort_rpe: effortRpe,
    mood_before: (moodBefore && VALID_MOOD_TYPES.includes(moodBefore as MoodType) ? moodBefore : null) as MoodType | null,
    mood_after: (moodAfter && VALID_MOOD_TYPES.includes(moodAfter as MoodType) ? moodAfter : null) as MoodType | null,
    body_weight_kg: bodyWeightKg,
  }

  const { error: updateError } = await supabase
    .from('training_sessions')
    .update(payload)
    .eq('id', sessionId)

  if (updateError) {
    console.error('Failed to update training session:', updateError)
    return { success: false, error: 'Kunne ikke oppdatere treningsøkten. Prøv igjen.' }
  }

  // Replace techniques: delete old, insert new
  const { error: deleteError } = await supabase
    .from('session_techniques')
    .delete()
    .eq('session_id', sessionId)

  if (deleteError) {
    console.error('Failed to delete old techniques:', deleteError)
  }

  const techniques = parseTechniques(formData)
  if (techniques.length > 0) {
    const { error: techError } = await supabase
      .from('session_techniques')
      .insert(techniques.map((t) => ({
        session_id: sessionId,
        name: t.name,
        category: t.category,
      })))

    if (techError) {
      console.error('Failed to insert updated techniques:', techError)
    }
  }

  revalidatePath('/')

  return { success: true, data: { id: sessionId } }
}

export async function deleteSession(sessionId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette trening.' }
  }

  if (!sessionId) {
    return { success: false, error: 'Manglende treningsøkt-ID.' }
  }

  // Delete related data first (techniques, media)
  await supabase.from('session_techniques').delete().eq('session_id', sessionId)
  await supabase.from('media').delete().eq('session_id', sessionId)

  const { error } = await supabase
    .from('training_sessions')
    .delete()
    .eq('id', sessionId)

  if (error) {
    console.error('Failed to delete training session:', error)
    return { success: false, error: 'Kunne ikke slette treningsøkten. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
