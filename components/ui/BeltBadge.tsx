import type { BeltRank } from '@/lib/types/database'

// Full belt color config including kids belts
export const BELT_COLORS: Record<string, { bg: string; text: string; stripe?: string }> = {
  white: { bg: '#ffffff', text: '#111111' },
  grey_white: { bg: '#9ca3af', text: '#ffffff', stripe: '#ffffff' },
  grey: { bg: '#9ca3af', text: '#ffffff' },
  grey_black: { bg: '#9ca3af', text: '#ffffff', stripe: '#1a1a1a' },
  yellow_white: { bg: '#eab308', text: '#111111', stripe: '#ffffff' },
  yellow: { bg: '#eab308', text: '#111111' },
  yellow_black: { bg: '#eab308', text: '#111111', stripe: '#1a1a1a' },
  orange_white: { bg: '#f97316', text: '#ffffff', stripe: '#ffffff' },
  orange: { bg: '#f97316', text: '#ffffff' },
  orange_black: { bg: '#f97316', text: '#ffffff', stripe: '#1a1a1a' },
  green_white: { bg: '#22c55e', text: '#ffffff', stripe: '#ffffff' },
  green: { bg: '#22c55e', text: '#ffffff' },
  green_black: { bg: '#22c55e', text: '#ffffff', stripe: '#1a1a1a' },
  blue: { bg: '#3b82f6', text: '#ffffff' },
  purple: { bg: '#9333ea', text: '#ffffff' },
  brown: { bg: '#92400e', text: '#ffffff' },
  black: { bg: '#1a1a1a', text: '#ffffff' },
}

export const BELT_LABELS: Record<string, string> = {
  white: 'Hvitt',
  grey_white: 'Grå/Hvit',
  grey: 'Grå',
  grey_black: 'Grå/Svart',
  yellow_white: 'Gul/Hvit',
  yellow: 'Gul',
  yellow_black: 'Gul/Svart',
  orange_white: 'Oransje/Hvit',
  orange: 'Oransje',
  orange_black: 'Oransje/Svart',
  green_white: 'Grønn/Hvit',
  green: 'Grønn',
  green_black: 'Grønn/Svart',
  blue: 'Blått',
  purple: 'Lilla',
  brown: 'Brunt',
  black: 'Svart',
}

export const ADULT_BELTS: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black']

export const KIDS_BELTS: BeltRank[] = [
  'white',
  'grey_white', 'grey', 'grey_black',
  'yellow_white', 'yellow', 'yellow_black',
  'orange_white', 'orange', 'orange_black',
  'green_white', 'green', 'green_black',
]

export const ALL_BELTS: BeltRank[] = [...KIDS_BELTS, 'blue', 'purple', 'brown', 'black']

export function getBeltColor(rank?: string | null): string {
  if (!rank) return '#4b5563'
  return BELT_COLORS[rank]?.bg ?? '#4b5563'
}

export function isKidsBelt(rank: string): boolean {
  return KIDS_BELTS.includes(rank as BeltRank) && rank !== 'white'
}

// Simple badge
export function BeltBadge({
  rank,
  degrees,
}: {
  rank?: string | null
  degrees?: number
}) {
  if (!rank) return null
  const colors = BELT_COLORS[rank] ?? { bg: '#6b7280', text: '#ffffff' }
  const label = BELT_LABELS[rank] ?? rank

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
      {degrees !== undefined && degrees > 0 && (
        <span className="opacity-80">&middot; {degrees} stripe{degrees > 1 ? 's' : ''}</span>
      )}
    </span>
  )
}

// Visual belt display (inspired by physical belt look)
export function BeltDisplay({
  rank,
  degrees = 0,
  size = 'md',
}: {
  rank: string
  degrees?: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const colors = BELT_COLORS[rank] ?? { bg: '#6b7280', text: '#ffffff' }
  const hasMiddleStripe = colors.stripe !== undefined

  const heights = { sm: 'h-5', md: 'h-8', lg: 'h-12' }
  const stripeW = { sm: 'w-0.5', md: 'w-1', lg: 'w-1.5' }
  const stripeH = { sm: 'h-5', md: 'h-8', lg: 'h-12' }
  const barW = { sm: 'w-6', md: 'w-10', lg: 'w-14' }

  return (
    <div className={`flex items-center rounded-sm overflow-hidden ${heights[size]}`}>
      {/* Belt body */}
      <div
        className={`flex-1 ${heights[size]} min-w-16 relative`}
        style={{ backgroundColor: colors.bg }}
      >
        {/* Middle stripe for combo belts (kids) */}
        {hasMiddleStripe && (
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px]"
            style={{ backgroundColor: colors.stripe }}
          />
        )}
      </div>

      {/* Black bar / rank bar */}
      <div
        className={`${barW[size]} ${heights[size]} flex items-center justify-end gap-px pr-1`}
        style={{ backgroundColor: rank === 'white' ? '#1a1a1a' : rank === 'black' ? '#8b0000' : '#1a1a1a' }}
      >
        {/* Degree stripes */}
        {Array.from({ length: Math.min(degrees, 4) }).map((_, i) => (
          <div
            key={i}
            className={`${stripeW[size]} ${stripeH[size]}`}
            style={{ backgroundColor: rank === 'black' ? '#ffffff' : '#ffffff' }}
          />
        ))}
      </div>
    </div>
  )
}
