import type { SupabaseClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['gmannen@gmail.com']

/** Quick email-based check (use as fallback only) */
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/** Proper admin check via profiles.role in database */
export async function isAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return data?.role === 'admin'
}
