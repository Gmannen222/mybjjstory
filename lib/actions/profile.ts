'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/actions/posts'
import type { BeltRank, ProfileVisibility } from '@/lib/types/database'

/**
 * Update profile metadata (display_name, bio, belt, academy, visibility, etc.)
 *
 * NOTE: Avatar upload stays client-side (direct to Supabase Storage via browser client).
 * Vercel Server Actions have a 4.5 MB FormData limit, so file uploads go through the
 * browser Supabase client instead. The avatar_url is passed as a hidden form field
 * after the client-side upload completes.
 */
export async function updateProfile(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å oppdatere profilen.' }
  }

  // Extract form fields
  const displayName = formData.get('display_name') as string | null
  const username = formData.get('username') as string | null
  const bio = formData.get('bio') as string | null
  const beltRank = (formData.get('belt_rank') as string) || null
  const beltDegrees = parseInt(formData.get('belt_degrees') as string) || 0
  const academyName = formData.get('academy_name') as string | null
  const academyId = (formData.get('academy_id') as string) || null
  const avatarUrl = (formData.get('avatar_url') as string) || null
  const weightClass = (formData.get('weight_class') as string) || null
  const favoriteGuard = (formData.get('favorite_guard') as string) || null
  const favoriteSubmission = (formData.get('favorite_submission') as string) || null
  const trainingSinceYearRaw = formData.get('training_since_year') as string | null
  const trainingSinceYear = trainingSinceYearRaw ? parseInt(trainingSinceYearRaw) : null

  // Boolean fields (checkboxes send "on" when checked, absent when unchecked)
  const isPublic = formData.get('is_public') === 'on'
  const showKidsBelts = formData.get('show_kids_belts') === 'on'
  const showBelt = formData.get('show_belt') === 'on'
  const showAcademy = formData.get('show_academy') === 'on'
  const showTrainingSince = formData.get('show_training_since') === 'on'
  const showFavoriteGuard = formData.get('show_favorite_guard') === 'on'
  const showFavoriteSubmission = formData.get('show_favorite_submission') === 'on'
  const showInjuries = formData.get('show_injuries') === 'on'
  const showCompetitions = formData.get('show_competitions') === 'on'
  const showStats = formData.get('show_stats') === 'on'
  const showFeed = formData.get('show_feed') === 'on'
  const showInAcademyList = formData.get('show_in_academy_list') === 'on'

  const profileVisibility = (formData.get('profile_visibility') as ProfileVisibility) || 'private'
  const publicDisplayName = (formData.get('public_display_name') as string) || null

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName || null,
      username: username || null,
      bio: bio || null,
      belt_rank: (beltRank as BeltRank) || null,
      belt_degrees: beltDegrees,
      academy_name: academyName || null,
      academy_id: academyId || null,
      avatar_url: avatarUrl,
      weight_class: weightClass,
      favorite_guard: favoriteGuard,
      favorite_submission: favoriteSubmission,
      training_since_year: trainingSinceYear,
      is_public: isPublic,
      show_belt: showBelt,
      show_academy: showAcademy,
      show_training_since: showTrainingSince,
      show_favorite_guard: showFavoriteGuard,
      show_favorite_submission: showFavoriteSubmission,
      show_injuries: showInjuries,
      show_competitions: showCompetitions,
      show_stats: showStats,
      show_feed: showFeed,
      show_kids_belts: showKidsBelts,
      show_in_academy_list: showInAcademyList,
      profile_visibility: profileVisibility,
      public_display_name: publicDisplayName,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Failed to update profile:', error)
    if (error.code === '23505') {
      return { success: false, error: 'Brukernavnet er allerede tatt.' }
    }
    return { success: false, error: 'Kunne ikke oppdatere profilen. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
