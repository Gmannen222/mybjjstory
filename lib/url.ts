const ALLOWED_SCHEMES = ['http:', 'https:']

/** Returns true if the URL has a safe scheme (http/https). Rejects javascript:, data:, etc. */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return ALLOWED_SCHEMES.includes(parsed.protocol)
  } catch {
    return false
  }
}

/** Returns the URL if safe, otherwise null */
export function getSafeUrl(url: string | null | undefined): string | null {
  return isSafeUrl(url) ? url! : null
}
