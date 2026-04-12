'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import type { ActionResult } from '@/lib/actions/posts'

export type ContentType = 'post' | 'comment' | 'media'
export type ReportReason = 'inappropriate' | 'spam' | 'harassment' | 'other'
export type ModerationStatus = 'active' | 'hidden' | 'removed'

const VALID_CONTENT_TYPES: ContentType[] = ['post', 'comment', 'media']
const VALID_REASONS: ReportReason[] = ['inappropriate', 'spam', 'harassment', 'other']
const VALID_MODERATION_STATUSES: ModerationStatus[] = ['active', 'hidden', 'removed']

export async function submitReport(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å rapportere innhold.' }
  }

  const contentType = formData.get('content_type') as string
  const contentId = formData.get('content_id') as string
  const reason = formData.get('reason') as string
  const description = (formData.get('description') as string) || null

  if (!VALID_CONTENT_TYPES.includes(contentType as ContentType)) {
    return { success: false, error: 'Ugyldig innholdstype.' }
  }

  if (!contentId) {
    return { success: false, error: 'Manglende innholds-ID.' }
  }

  if (!VALID_REASONS.includes(reason as ReportReason)) {
    return { success: false, error: 'Du må velge en grunn for rapporteringen.' }
  }

  const { error } = await supabase.from('content_reports').insert({
    reporter_id: user.id,
    content_type: contentType,
    content_id: contentId,
    reason,
    description: description?.trim() || null,
  })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Du har allerede rapportert dette innholdet.' }
    }
    console.error('Failed to submit report:', error)
    return { success: false, error: 'Kunne ikke sende rapporten. Prøv igjen.' }
  }

  return { success: true }
}

export async function moderateContent(
  contentType: ContentType,
  contentId: string,
  status: ModerationStatus
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user || !(await isAdmin(supabase, user.id))) {
    return { success: false, error: 'Ingen tilgang.' }
  }

  if (!VALID_CONTENT_TYPES.includes(contentType)) {
    return { success: false, error: 'Ugyldig innholdstype.' }
  }

  if (!VALID_MODERATION_STATUSES.includes(status)) {
    return { success: false, error: 'Ugyldig modereringsstatus.' }
  }

  const table = contentType === 'post' ? 'posts' : contentType === 'comment' ? 'comments' : 'media'

  const { error } = await supabase
    .from(table)
    .update({
      moderation_status: status,
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq('id', contentId)

  if (error) {
    console.error('Failed to moderate content:', error)
    return { success: false, error: 'Kunne ikke moderere innholdet. Prøv igjen.' }
  }

  // Update related reports to reviewed
  await supabase
    .from('content_reports')
    .update({
      status: status === 'active' ? 'dismissed' : 'reviewed',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('content_type', contentType)
    .eq('content_id', contentId)
    .eq('status', 'pending')

  revalidatePath('/[locale]/admin/moderation', 'page')
  revalidatePath('/[locale]/feed', 'page')

  return { success: true }
}

export async function reviewReport(
  reportId: string,
  newStatus: 'reviewed' | 'dismissed'
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user || !(await isAdmin(supabase, user.id))) {
    return { success: false, error: 'Ingen tilgang.' }
  }

  const { error } = await supabase
    .from('content_reports')
    .update({
      status: newStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  if (error) {
    console.error('Failed to review report:', error)
    return { success: false, error: 'Kunne ikke oppdatere rapporten.' }
  }

  revalidatePath('/[locale]/admin/moderation', 'page')

  return { success: true }
}
