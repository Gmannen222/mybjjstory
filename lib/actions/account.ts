'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from './posts'

export async function deleteAllData(): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette data.' }
  }

  const userId = user.id

  // Delete all user data from every table (RLS ensures only own data)
  const tables = [
    'feedback',
    'reactions',
    'comments',
    'posts',
    'media',
    'session_techniques',
    'training_sessions',
    'gradings',
    'competitions',
    'injuries',
  ]

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId)
    if (error) {
      console.error(`Failed to delete from ${table}:`, error)
    }
  }

  // follows uses follower_id/following_id, handle separately
  await supabase.from('follows').delete().eq('follower_id', userId)
  await supabase.from('follows').delete().eq('following_id', userId)

  // Reset profile to defaults (don't delete -- it's auto-created by trigger)
  const { error: profileError } = await supabase.from('profiles').update({
    display_name: null,
    username: null,
    avatar_url: null,
    bio: null,
    belt_rank: 'white',
    belt_degrees: 0,
    academy_name: null,
    favorite_guard: null,
    favorite_submission: null,
    training_since_year: null,
    training_preference: null,
    passion_level: null,
    currently_training: true,
    heard_about_from: null,
    is_public: false,
    show_belt: true,
    show_academy: true,
    show_training_since: true,
    show_favorite_guard: true,
    show_favorite_submission: true,
    show_injuries: false,
    show_competitions: true,
    show_stats: true,
    show_feed: true,
  }).eq('id', userId)

  if (profileError) {
    console.error('Failed to reset profile:', profileError)
    return { success: false, error: 'Kunne ikke nullstille profilen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}

export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å slette kontoen.' }
  }

  // First delete all data
  const deleteResult = await deleteAllData()
  if (!deleteResult.success) {
    return deleteResult
  }

  // Sign out (actual account deletion requires admin API or Edge Function)
  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    console.error('Failed to sign out after account deletion:', signOutError)
  }

  return { success: true }
}
