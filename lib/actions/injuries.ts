'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from './posts'
import type { InjuryType, Severity, TrainingImpact } from '@/lib/types/database'

const VALID_INJURY_TYPES: InjuryType[] = ['sprain', 'tear', 'fracture', 'bruise', 'dislocation', 'other']
const VALID_SEVERITIES: Severity[] = ['mild', 'moderate', 'severe']
const VALID_IMPACTS: TrainingImpact[] = ['none', 'modified', 'rest']

export async function createInjury(
  prevState: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å registrere skader.' }
  }

  const bodyPart = formData.get('body_part')
  if (typeof bodyPart !== 'string' || !bodyPart.trim()) {
    return { success: false, error: 'Kroppsdel er påkrevd.' }
  }

  const dateOccurred = formData.get('date_occurred')
  if (typeof dateOccurred !== 'string' || !dateOccurred) {
    return { success: false, error: 'Dato skadet er påkrevd.' }
  }

  const injuryType = formData.get('injury_type') as string
  const severity = (formData.get('severity') as string) || 'mild'
  const trainingImpact = (formData.get('training_impact') as string) || 'none'

  if (injuryType && !VALID_INJURY_TYPES.includes(injuryType as InjuryType)) {
    return { success: false, error: 'Ugyldig skadetype.' }
  }
  if (!VALID_SEVERITIES.includes(severity as Severity)) {
    return { success: false, error: 'Ugyldig alvorlighetsgrad.' }
  }
  if (!VALID_IMPACTS.includes(trainingImpact as TrainingImpact)) {
    return { success: false, error: 'Ugyldig treningspåvirkning.' }
  }

  const { data, error } = await supabase
    .from('injuries')
    .insert({
      user_id: user.id,
      body_part: bodyPart.trim(),
      injury_type: injuryType || null,
      description: (formData.get('description') as string) || null,
      date_occurred: dateOccurred,
      date_recovered: (formData.get('date_recovered') as string) || null,
      severity: severity as Severity,
      training_impact: trainingImpact as TrainingImpact,
      notes: (formData.get('notes') as string) || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create injury:', error)
    return { success: false, error: 'Kunne ikke lagre skaden. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true, data: { id: data.id } }
}

export async function updateInjury(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å oppdatere skader.' }
  }

  const injuryId = formData.get('injury_id')
  if (typeof injuryId !== 'string' || !injuryId) {
    return { success: false, error: 'Manglende skade-ID.' }
  }

  const bodyPart = formData.get('body_part')
  if (typeof bodyPart !== 'string' || !bodyPart.trim()) {
    return { success: false, error: 'Kroppsdel er påkrevd.' }
  }

  const severity = (formData.get('severity') as string) || 'mild'
  const trainingImpact = (formData.get('training_impact') as string) || 'none'

  const { error } = await supabase
    .from('injuries')
    .update({
      body_part: bodyPart.trim(),
      injury_type: (formData.get('injury_type') as string) || null,
      description: (formData.get('description') as string) || null,
      date_occurred: (formData.get('date_occurred') as string),
      date_recovered: (formData.get('date_recovered') as string) || null,
      severity: severity as Severity,
      training_impact: trainingImpact as TrainingImpact,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', injuryId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update injury:', error)
    return { success: false, error: 'Kunne ikke oppdatere skaden. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}

export async function deleteInjury(
  injuryId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette skader.' }
  }

  const { error } = await supabase
    .from('injuries')
    .delete()
    .eq('id', injuryId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete injury:', error)
    return { success: false, error: 'Kunne ikke slette skaden. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}

export async function markInjuryRecovered(
  injuryId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å oppdatere skader.' }
  }

  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('injuries')
    .update({ date_recovered: today })
    .eq('id', injuryId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to mark injury as recovered:', error)
    return { success: false, error: 'Kunne ikke oppdatere skaden. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
