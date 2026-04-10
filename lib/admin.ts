const ADMIN_EMAILS = ['glenn@mybjjstory.no']

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
