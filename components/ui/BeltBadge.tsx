export const BELT_COLORS: Record<string, { bg: string; text: string }> = {
  white: { bg: '#ffffff', text: '#111111' },
  blue: { bg: '#3b82f6', text: '#ffffff' },
  purple: { bg: '#9333ea', text: '#ffffff' },
  brown: { bg: '#92400e', text: '#ffffff' },
  black: { bg: '#1a1a1a', text: '#ffffff' },
}

export function getBeltColor(rank?: string | null): string {
  if (!rank) return '#4b5563'
  return BELT_COLORS[rank]?.bg ?? '#4b5563'
}

export function BeltBadge({
  rank,
  degrees,
}: {
  rank?: string | null
  degrees?: number
}) {
  if (!rank) return null
  const colors = BELT_COLORS[rank] ?? { bg: '#6b7280', text: '#ffffff' }
  const label = rank.charAt(0).toUpperCase() + rank.slice(1)

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
      {degrees !== undefined && degrees > 0 && (
        <span className="opacity-80">&middot; {degrees}&deg;</span>
      )}
    </span>
  )
}
