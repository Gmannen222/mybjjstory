// SVG avatar renderer for BJJ practitioners
// Renders a customizable character with skin, hair, gi/nogi, belt, and optional injuries

export interface AvatarConfig {
  skinTone: string
  hairStyle: 'short' | 'medium' | 'long' | 'bun' | 'bald' | 'buzz'
  hairColor: string
  outfit: 'gi_white' | 'gi_blue' | 'gi_black' | 'nogi' | 'nogi_dark'
  beltRank?: string | null
  academyColor?: string | null  // color for academy logo patch
  showInjuries?: string[]  // body parts with active injuries
  gender: 'male' | 'female'
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: '#D4A574',
  hairStyle: 'short',
  hairColor: '#2C1810',
  outfit: 'gi_white',
  beltRank: null,
  academyColor: null,
  showInjuries: [],
  gender: 'male',
}

export const SKIN_TONES = [
  { name: 'Lys', value: '#FADCBC' },
  { name: 'Lys medium', value: '#D4A574' },
  { name: 'Medium', value: '#C68642' },
  { name: 'Mørk medium', value: '#8D5524' },
  { name: 'Mørk', value: '#5C3310' },
]

export const HAIR_COLORS = [
  { name: 'Svart', value: '#1a1a1a' },
  { name: 'Mørk brun', value: '#2C1810' },
  { name: 'Brun', value: '#6B3A2A' },
  { name: 'Lys brun', value: '#A0522D' },
  { name: 'Blond', value: '#D4A76A' },
  { name: 'Rød', value: '#B24513' },
  { name: 'Grå', value: '#888888' },
  { name: 'Hvit', value: '#D4D4D4' },
]

export const HAIR_STYLES = [
  { name: 'Kort', value: 'short' as const },
  { name: 'Buzz', value: 'buzz' as const },
  { name: 'Medium', value: 'medium' as const },
  { name: 'Langt', value: 'long' as const },
  { name: 'Knute', value: 'bun' as const },
  { name: 'Skallet', value: 'bald' as const },
]

export const OUTFIT_OPTIONS = [
  { name: 'Hvit Gi', value: 'gi_white' as const },
  { name: 'Blå Gi', value: 'gi_blue' as const },
  { name: 'Svart Gi', value: 'gi_black' as const },
  { name: 'No-Gi (lys)', value: 'nogi' as const },
  { name: 'No-Gi (mørk)', value: 'nogi_dark' as const },
]

const BELT_COLOR_MAP: Record<string, string> = {
  white: '#ffffff',
  grey_white: '#9ca3af', grey: '#9ca3af', grey_black: '#9ca3af',
  yellow_white: '#eab308', yellow: '#eab308', yellow_black: '#eab308',
  orange_white: '#f97316', orange: '#f97316', orange_black: '#f97316',
  green_white: '#22c55e', green: '#22c55e', green_black: '#22c55e',
  blue: '#3b82f6',
  purple: '#9333ea',
  brown: '#92400e',
  black: '#1a1a1a',
}

const OUTFIT_COLORS: Record<string, { main: string; accent: string }> = {
  gi_white: { main: '#f0f0f0', accent: '#e0e0e0' },
  gi_blue: { main: '#2563eb', accent: '#1d4ed8' },
  gi_black: { main: '#1a1a2e', accent: '#111122' },
  nogi: { main: '#374151', accent: '#4b5563' },
  nogi_dark: { main: '#1f2937', accent: '#111827' },
}

const INJURY_LOCATIONS: Record<string, { x: number; y: number }> = {
  'Kne': { x: 62, y: 210 },
  'Skulder': { x: 40, y: 115 },
  'Nakke': { x: 60, y: 88 },
  'Rygg': { x: 60, y: 140 },
  'Ankel': { x: 55, y: 245 },
  'Håndledd': { x: 28, y: 165 },
  'Albue': { x: 32, y: 145 },
  'Hofte': { x: 52, y: 175 },
  'Finger': { x: 24, y: 178 },
  'Tå': { x: 55, y: 260 },
  'Øre': { x: 48, y: 60 },
  'Ribben': { x: 45, y: 135 },
}

export default function AvatarSVG({
  config,
  size = 200,
  className = '',
}: {
  config: AvatarConfig
  size?: number
  className?: string
}) {
  const outfit = OUTFIT_COLORS[config.outfit] ?? OUTFIT_COLORS.gi_white
  const beltColor = config.beltRank ? BELT_COLOR_MAP[config.beltRank] ?? '#4b5563' : null
  const isGi = config.outfit.startsWith('gi')
  const injuries = config.showInjuries ?? []

  return (
    <svg
      viewBox="0 0 120 280"
      width={size}
      height={size * 280 / 120}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="60" cy="140" r="58" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Legs */}
      <rect x="42" y="190" width="14" height="65" rx="6" fill={isGi ? outfit.main : config.skinTone} />
      <rect x="64" y="190" width="14" height="65" rx="6" fill={isGi ? outfit.main : config.skinTone} />

      {/* Pants (gi) or shorts (nogi) */}
      {isGi ? (
        <>
          <rect x="40" y="175" width="18" height="70" rx="6" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.5" />
          <rect x="62" y="175" width="18" height="70" rx="6" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.5" />
        </>
      ) : (
        <>
          <rect x="40" y="175" width="18" height="35" rx="6" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.5" />
          <rect x="62" y="175" width="18" height="35" rx="6" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.5" />
          {/* Bare legs below shorts */}
          <rect x="43" y="208" width="12" height="47" rx="5" fill={config.skinTone} />
          <rect x="65" y="208" width="12" height="47" rx="5" fill={config.skinTone} />
        </>
      )}

      {/* Feet */}
      <ellipse cx="49" cy="257" rx="9" ry="5" fill="#374151" />
      <ellipse cx="71" cy="257" rx="9" ry="5" fill="#374151" />

      {/* Body / Torso */}
      <rect x="36" y="95" width="48" height="85" rx="10" fill={isGi ? outfit.main : outfit.main} stroke={outfit.accent} strokeWidth="0.5" />

      {/* Gi lapel / collar */}
      {isGi && (
        <>
          <path d="M 52 95 L 60 120 L 68 95" fill="none" stroke={outfit.accent} strokeWidth="1.5" />
          {/* Collar folds */}
          <path d="M 50 96 Q 55 102 52 108" fill="none" stroke={outfit.accent} strokeWidth="0.8" />
          <path d="M 70 96 Q 65 102 68 108" fill="none" stroke={outfit.accent} strokeWidth="0.8" />
        </>
      )}

      {/* Nogi rashguard pattern */}
      {!isGi && (
        <>
          <line x1="36" y1="115" x2="84" y2="115" stroke={outfit.accent} strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="36" y1="130" x2="84" y2="130" stroke={outfit.accent} strokeWidth="0.5" strokeDasharray="2,2" />
        </>
      )}

      {/* Academy color patch */}
      {config.academyColor && (
        <rect
          x="50" y="120" width="20" height="12" rx="2"
          fill={config.academyColor}
          opacity="0.8"
        />
      )}

      {/* Belt */}
      {beltColor && isGi && (
        <>
          <rect x="36" y="162" width="48" height="6" rx="2" fill={beltColor} />
          {/* Belt knot */}
          <circle cx="60" cy="165" r="3.5" fill={beltColor} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
          {/* Belt tails */}
          <rect x="56" y="168" width="3" height="12" rx="1" fill={beltColor} transform="rotate(-8, 57, 168)" />
          <rect x="61" y="168" width="3" height="14" rx="1" fill={beltColor} transform="rotate(5, 62, 168)" />
          {/* Black bar on belt */}
          {config.beltRank !== 'white' && (
            <rect x="73" y="162" width="8" height="6" rx="1" fill="#1a1a1a" />
          )}
        </>
      )}

      {/* Arms */}
      <rect x="20" y="98" width="16" height="50" rx="7"
        fill={isGi ? outfit.main : config.skinTone}
        stroke={isGi ? outfit.accent : 'none'} strokeWidth="0.5"
      />
      <rect x="84" y="98" width="16" height="50" rx="7"
        fill={isGi ? outfit.main : config.skinTone}
        stroke={isGi ? outfit.accent : 'none'} strokeWidth="0.5"
      />

      {/* Forearms/hands */}
      <rect x="22" y="142" width="12" height="30" rx="5" fill={config.skinTone} />
      <rect x="86" y="142" width="12" height="30" rx="5" fill={config.skinTone} />

      {/* Hands */}
      <ellipse cx="28" cy="175" rx="6" ry="5" fill={config.skinTone} />
      <ellipse cx="92" cy="175" rx="6" ry="5" fill={config.skinTone} />

      {/* Neck */}
      <rect x="52" y="80" width="16" height="18" rx="5" fill={config.skinTone} />

      {/* Head */}
      <ellipse cx="60" cy="55" rx="22" ry="28" fill={config.skinTone} />

      {/* Ears */}
      <ellipse cx="38" cy="57" rx="4" ry="6" fill={config.skinTone} />
      <ellipse cx="82" cy="57" rx="4" ry="6" fill={config.skinTone} />

      {/* Hair */}
      {config.hairStyle !== 'bald' && (
        <HairSVG style={config.hairStyle} color={config.hairColor} />
      )}

      {/* Eyes */}
      <ellipse cx="51" cy="53" rx="3" ry="2.5" fill="#1a1a1a" />
      <ellipse cx="69" cy="53" rx="3" ry="2.5" fill="#1a1a1a" />
      {/* Eye highlights */}
      <circle cx="52" cy="52" r="1" fill="white" opacity="0.6" />
      <circle cx="70" cy="52" r="1" fill="white" opacity="0.6" />

      {/* Eyebrows */}
      <line x1="47" y1="46" x2="55" y2="46" stroke={config.hairColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="65" y1="46" x2="73" y2="46" stroke={config.hairColor} strokeWidth="1.5" strokeLinecap="round" />

      {/* Mouth - slight smile */}
      <path d="M 54 64 Q 60 69 66 64" fill="none" stroke="#8B4513" strokeWidth="1.2" strokeLinecap="round" />

      {/* Injury indicators */}
      {injuries.map((part) => {
        const loc = INJURY_LOCATIONS[part]
        if (!loc) return null
        return (
          <g key={part}>
            <circle cx={loc.x} cy={loc.y} r="6" fill="rgba(239,68,68,0.3)" />
            <text x={loc.x} y={loc.y + 3.5} textAnchor="middle" fontSize="8">🩹</text>
          </g>
        )
      })}
    </svg>
  )
}

function HairSVG({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'short':
      return (
        <path
          d="M 38 50 Q 38 24 60 22 Q 82 24 82 50 Q 80 38 60 35 Q 40 38 38 50 Z"
          fill={color}
        />
      )
    case 'buzz':
      return (
        <path
          d="M 39 55 Q 39 26 60 24 Q 81 26 81 55 Q 79 42 60 39 Q 41 42 39 55 Z"
          fill={color}
          opacity="0.7"
        />
      )
    case 'medium':
      return (
        <>
          <path
            d="M 36 55 Q 35 22 60 20 Q 85 22 84 55 Q 82 35 60 32 Q 38 35 36 55 Z"
            fill={color}
          />
          {/* Side hair */}
          <path d="M 36 55 Q 32 55 34 70 Q 36 65 38 58 Z" fill={color} />
          <path d="M 84 55 Q 88 55 86 70 Q 84 65 82 58 Z" fill={color} />
        </>
      )
    case 'long':
      return (
        <>
          <path
            d="M 34 55 Q 33 20 60 18 Q 87 20 86 55 Q 84 32 60 28 Q 36 32 34 55 Z"
            fill={color}
          />
          {/* Long sides */}
          <path d="M 34 55 Q 28 60 30 90 Q 34 85 36 62 Z" fill={color} />
          <path d="M 86 55 Q 92 60 90 90 Q 86 85 84 62 Z" fill={color} />
        </>
      )
    case 'bun':
      return (
        <>
          <path
            d="M 38 50 Q 38 24 60 22 Q 82 24 82 50 Q 80 38 60 35 Q 40 38 38 50 Z"
            fill={color}
          />
          {/* Bun on top */}
          <ellipse cx="60" cy="22" rx="10" ry="8" fill={color} />
        </>
      )
    default:
      return null
  }
}
