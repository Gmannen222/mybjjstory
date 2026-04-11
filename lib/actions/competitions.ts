'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from './posts'
import type { CompetitionResult, CompetitionSource } from '@/lib/types/database'

const VALID_RESULTS: CompetitionResult[] = ['gold', 'silver', 'bronze', 'participant']
const VALID_SOURCES: CompetitionSource[] = ['manual', 'smoothcomp', 'ibjjf', 'adcc', 'other']

export async function createCompetition(
  prevState: ActionResult<{ id: string }>,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å registrere konkurranser.' }
  }

  const eventName = formData.get('event_name')
  if (typeof eventName !== 'string' || !eventName.trim()) {
    return { success: false, error: 'Arrangementnavn er påkrevd.' }
  }

  const result = formData.get('result') as string
  const source = (formData.get('source') as string) || 'manual'

  if (result && !VALID_RESULTS.includes(result as CompetitionResult)) {
    return { success: false, error: 'Ugyldig resultat.' }
  }
  if (!VALID_SOURCES.includes(source as CompetitionSource)) {
    return { success: false, error: 'Ugyldig kilde.' }
  }

  const { data, error } = await supabase
    .from('competitions')
    .insert({
      user_id: user.id,
      event_name: eventName.trim(),
      event_date: (formData.get('event_date') as string) || null,
      organization: (formData.get('organization') as string) || null,
      weight_class: (formData.get('weight_class') as string) || null,
      belt_division: (formData.get('belt_division') as string) || null,
      gi_nogi: (formData.get('gi_nogi') as string) || 'gi',
      result: result || null,
      wins: parseInt((formData.get('wins') as string) || '0'),
      losses: parseInt((formData.get('losses') as string) || '0'),
      source: source as CompetitionSource,
      source_url: (formData.get('source_url') as string) || null,
      verified: source !== 'manual',
      notes: (formData.get('notes') as string) || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create competition:', error)
    return { success: false, error: 'Kunne ikke lagre konkurransen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true, data: { id: data.id } }
}

export async function updateCompetition(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å oppdatere konkurranser.' }
  }

  const competitionId = formData.get('competition_id')
  if (typeof competitionId !== 'string' || !competitionId) {
    return { success: false, error: 'Manglende konkurranse-ID.' }
  }

  const eventName = formData.get('event_name')
  if (typeof eventName !== 'string' || !eventName.trim()) {
    return { success: false, error: 'Arrangementnavn er påkrevd.' }
  }

  const result = formData.get('result') as string
  const source = (formData.get('source') as string) || 'manual'

  const { error } = await supabase
    .from('competitions')
    .update({
      event_name: eventName.trim(),
      event_date: (formData.get('event_date') as string) || null,
      organization: (formData.get('organization') as string) || null,
      weight_class: (formData.get('weight_class') as string) || null,
      belt_division: (formData.get('belt_division') as string) || null,
      gi_nogi: (formData.get('gi_nogi') as string) || 'gi',
      result: result || null,
      wins: parseInt((formData.get('wins') as string) || '0'),
      losses: parseInt((formData.get('losses') as string) || '0'),
      source: source as CompetitionSource,
      source_url: (formData.get('source_url') as string) || null,
      verified: source !== 'manual',
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', competitionId)

  if (error) {
    console.error('Failed to update competition:', error)
    return { success: false, error: 'Kunne ikke oppdatere konkurransen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}

export async function deleteCompetition(
  competitionId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette konkurranser.' }
  }

  const { error } = await supabase
    .from('competitions')
    .delete()
    .eq('id', competitionId)

  if (error) {
    console.error('Failed to delete competition:', error)
    return { success: false, error: 'Kunne ikke slette konkurransen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
