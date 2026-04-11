'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/actions/posts'
import type { BeltRank, GradingType } from '@/lib/types/database'

const VALID_BELT_RANKS: BeltRank[] = [
  'white',
  'grey_white', 'grey', 'grey_black',
  'yellow_white', 'yellow', 'yellow_black',
  'orange_white', 'orange', 'orange_black',
  'green_white', 'green', 'green_black',
  'blue', 'purple', 'brown', 'black',
]

const VALID_GRADING_TYPES: GradingType[] = ['belt', 'stripe']

export async function createGrading(
  prevState: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å registrere en gradering.' }
  }

  const gradingType = formData.get('grading_type')
  const beltRank = formData.get('belt_rank')
  const degrees = formData.get('belt_degrees')
  const date = formData.get('date')
  const instructorName = formData.get('instructor_name')
  const academyName = formData.get('academy_name')
  const notes = formData.get('notes')
  const showKidsBelts = formData.get('show_kids_belts') === 'true'

  if (typeof gradingType !== 'string' || !VALID_GRADING_TYPES.includes(gradingType as GradingType)) {
    return { success: false, error: 'Ugyldig graderingstype.' }
  }

  if (typeof beltRank !== 'string' || !VALID_BELT_RANKS.includes(beltRank as BeltRank)) {
    return { success: false, error: 'Ugyldig beltgrad.' }
  }

  if (typeof date !== 'string' || !date.trim()) {
    return { success: false, error: 'Dato er påkrevd.' }
  }

  const beltDegrees = parseInt(String(degrees)) || 0

  const { data, error } = await supabase
    .from('gradings')
    .insert({
      user_id: user.id,
      belt_rank: beltRank as BeltRank,
      belt_degrees: beltDegrees,
      grading_type: gradingType as GradingType,
      date,
      instructor_name: typeof instructorName === 'string' && instructorName.trim() ? instructorName.trim() : null,
      academy_name: typeof academyName === 'string' && academyName.trim() ? academyName.trim() : null,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Failed to create grading:', error)
    return { success: false, error: 'Kunne ikke opprette graderingen. Prøv igjen.' }
  }

  // Update profile belt to latest
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      belt_rank: beltRank as BeltRank,
      belt_degrees: beltDegrees,
      show_kids_belts: showKidsBelts,
    })
    .eq('id', user.id)

  if (profileError) {
    console.error('Failed to update profile belt:', profileError)
  }

  revalidatePath('/')

  return { success: true, data: { id: data.id } }
}

export async function updateGrading(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å oppdatere en gradering.' }
  }

  const gradingId = formData.get('grading_id')
  const gradingType = formData.get('grading_type')
  const beltRank = formData.get('belt_rank')
  const degrees = formData.get('belt_degrees')
  const date = formData.get('date')
  const instructorName = formData.get('instructor_name')
  const academyName = formData.get('academy_name')
  const notes = formData.get('notes')
  const showKidsBelts = formData.get('show_kids_belts') === 'true'

  if (typeof gradingId !== 'string' || !gradingId.trim()) {
    return { success: false, error: 'Mangler graderings-ID.' }
  }

  if (typeof gradingType !== 'string' || !VALID_GRADING_TYPES.includes(gradingType as GradingType)) {
    return { success: false, error: 'Ugyldig graderingstype.' }
  }

  if (typeof beltRank !== 'string' || !VALID_BELT_RANKS.includes(beltRank as BeltRank)) {
    return { success: false, error: 'Ugyldig beltgrad.' }
  }

  if (typeof date !== 'string' || !date.trim()) {
    return { success: false, error: 'Dato er påkrevd.' }
  }

  const beltDegrees = parseInt(String(degrees)) || 0

  const { error } = await supabase
    .from('gradings')
    .update({
      belt_rank: beltRank as BeltRank,
      belt_degrees: beltDegrees,
      grading_type: gradingType as GradingType,
      date,
      instructor_name: typeof instructorName === 'string' && instructorName.trim() ? instructorName.trim() : null,
      academy_name: typeof academyName === 'string' && academyName.trim() ? academyName.trim() : null,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
    })
    .eq('id', gradingId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update grading:', error)
    return { success: false, error: 'Kunne ikke oppdatere graderingen. Prøv igjen.' }
  }

  // Update profile belt to latest
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      belt_rank: beltRank as BeltRank,
      belt_degrees: beltDegrees,
      show_kids_belts: showKidsBelts,
    })
    .eq('id', user.id)

  if (profileError) {
    console.error('Failed to update profile belt:', profileError)
  }

  revalidatePath('/')

  return { success: true }
}

export async function deleteGrading(gradingId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette en gradering.' }
  }

  if (!gradingId) {
    return { success: false, error: 'Mangler graderings-ID.' }
  }

  const { error } = await supabase
    .from('gradings')
    .delete()
    .eq('id', gradingId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete grading:', error)
    return { success: false, error: 'Kunne ikke slette graderingen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
