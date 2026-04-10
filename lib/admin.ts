const ADMIN_EMAILS = ['gmannen@gmail.com']

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
