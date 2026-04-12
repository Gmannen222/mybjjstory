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
        <span className="opacity-80">&middot; {degrees} {degrees > 1 ? 'striper' : 'stripe'}</span>
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
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const colors = BELT_COLORS[rank] ?? { bg: '#6b7280', text: '#ffffff' }
  const hasMiddleStripe = colors.stripe !== undefined

  const heights = { sm: 'h-5', md: 'h-8', lg: 'h-12', xl: 'h-16' }
  const barW = { sm: 'w-6', md: 'w-10', lg: 'w-16', xl: 'w-20' }
  const stripePx = { sm: 2, md: 3, lg: 4, xl: 5 }
  const stripeGap = { sm: 1, md: 2, lg: 3, xl: 3 }
  const middleStripeW = { sm: 3, md: 4, lg: 5, xl: 6 }

  const numStripes = Math.min(degrees, 4)

  return (
    <div className={`flex items-center rounded-sm overflow-hidden ${heights[size]} shadow-md`}>
      {/* Belt body */}
      <div
        className={`flex-1 ${heights[size]} min-w-16 relative`}
        style={{ backgroundColor: colors.bg }}
      >
        {/* Belt texture - subtle horizontal line */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 40%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.3) 42%, transparent 42%)` }}
        />
        {/* Subtle sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

        {/* Middle stripe for combo belts (kids) */}
        {hasMiddleStripe && (
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
            style={{ backgroundColor: colors.stripe, width: `${middleStripeW[size]}px` }}
          />
        )}
      </div>

      {/* Black bar / rank bar */}
      <div
        className={`${barW[size]} ${heights[size]} flex items-center justify-end pr-1.5 relative`}
        style={{
          backgroundColor: rank === 'white' ? '#1a1a1a' : rank === 'black' ? '#8b0000' : '#1a1a1a',
          gap: `${stripeGap[size]}px`,
        }}
      >
        {/* Bar sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        {/* Degree stripes - clearly visible */}
        {Array.from({ length: numStripes }).map((_, i) => (
          <div
            key={i}
            className={`${heights[size]} relative z-10`}
            style={{
              width: `${stripePx[size]}px`,
              backgroundColor: '#ffffff',
              boxShadow: '0 0 2px rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
