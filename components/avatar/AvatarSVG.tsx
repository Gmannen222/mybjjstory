// SVG avatar renderer for BJJ practitioners
// Renders a customizable character with skin, hair, facial features, gi/nogi, belt, and optional injuries

export interface AvatarConfig {
  skinTone: string
  hairStyle: 'short' | 'medium' | 'long' | 'bun' | 'bald' | 'buzz' | 'curly' | 'mohawk' | 'ponytail' | 'braids'
  hairColor: string
  outfit: 'gi_white' | 'gi_blue' | 'gi_black' | 'nogi' | 'nogi_dark'
  beltRank?: string | null
  academyColor?: string | null
  showInjuries?: string[]
  gender: 'male' | 'female'
  // New customization options
  facialHair?: 'none' | 'stubble' | 'short_beard' | 'full_beard' | 'mustache' | 'goatee'
  glasses?: 'none' | 'round' | 'square' | 'sport'
  noseShape?: 'default' | 'small' | 'wide' | 'pointed'
  faceShape?: 'oval' | 'round' | 'square' | 'long'
  bodyType?: 'slim' | 'average' | 'athletic' | 'heavy'
  earType?: 'normal' | 'cauliflower'
  eyeColor?: string
  eyebrowStyle?: 'normal' | 'thick' | 'thin' | 'arched'
  mouthStyle?: 'smile' | 'neutral' | 'grin' | 'serious'
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
  facialHair: 'none',
  glasses: 'none',
  noseShape: 'default',
  faceShape: 'oval',
  bodyType: 'average',
  earType: 'normal',
  eyeColor: '#4A3728',
  eyebrowStyle: 'normal',
  mouthStyle: 'smile',
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

export const EYE_COLORS = [
  { name: 'Brun', value: '#4A3728' },
  { name: 'Mørk brun', value: '#2C1810' },
  { name: 'Grønn', value: '#4A7C59' },
  { name: 'Blå', value: '#4A7CB5' },
  { name: 'Grå', value: '#7B8B9A' },
  { name: 'Hasselfarget', value: '#8B7355' },
]

export const HAIR_STYLES = [
  { name: 'Kort', value: 'short' as const },
  { name: 'Buzz', value: 'buzz' as const },
  { name: 'Medium', value: 'medium' as const },
  { name: 'Langt', value: 'long' as const },
  { name: 'Knute', value: 'bun' as const },
  { name: 'Skallet', value: 'bald' as const },
  { name: 'Krøllete', value: 'curly' as const },
  { name: 'Mohawk', value: 'mohawk' as const },
  { name: 'Hestehale', value: 'ponytail' as const },
  { name: 'Flettet', value: 'braids' as const },
]

export const FACIAL_HAIR_STYLES = [
  { name: 'Ingen', value: 'none' as const },
  { name: 'Skjeggstubber', value: 'stubble' as const },
  { name: 'Kort skjegg', value: 'short_beard' as const },
  { name: 'Fullt skjegg', value: 'full_beard' as const },
  { name: 'Bart', value: 'mustache' as const },
  { name: 'Fippskjegg', value: 'goatee' as const },
]

export const GLASSES_OPTIONS = [
  { name: 'Ingen', value: 'none' as const },
  { name: 'Runde', value: 'round' as const },
  { name: 'Firkantede', value: 'square' as const },
  { name: 'Sport', value: 'sport' as const },
]

export const NOSE_SHAPES = [
  { name: 'Standard', value: 'default' as const },
  { name: 'Liten', value: 'small' as const },
  { name: 'Bred', value: 'wide' as const },
  { name: 'Spiss', value: 'pointed' as const },
]

export const FACE_SHAPES = [
  { name: 'Oval', value: 'oval' as const },
  { name: 'Rund', value: 'round' as const },
  { name: 'Firkantet', value: 'square' as const },
  { name: 'Lang', value: 'long' as const },
]

export const BODY_TYPES = [
  { name: 'Slank', value: 'slim' as const },
  { name: 'Normal', value: 'average' as const },
  { name: 'Atletisk', value: 'athletic' as const },
  { name: 'Kraftig', value: 'heavy' as const },
]

export const EAR_TYPES = [
  { name: 'Normal', value: 'normal' as const },
  { name: 'Blomkålører', value: 'cauliflower' as const },
]

export const EYEBROW_STYLES = [
  { name: 'Normal', value: 'normal' as const },
  { name: 'Tykke', value: 'thick' as const },
  { name: 'Tynne', value: 'thin' as const },
  { name: 'Buede', value: 'arched' as const },
]

export const MOUTH_STYLES = [
  { name: 'Smil', value: 'smile' as const },
  { name: 'Nøytral', value: 'neutral' as const },
  { name: 'Glis', value: 'grin' as const },
  { name: 'Seriøs', value: 'serious' as const },
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

const OUTFIT_COLORS: Record<string, { main: string; accent: string; sleeve?: string }> = {
  gi_white: { main: '#f0f0f0', accent: '#d8d8d8', sleeve: '#e8e8e8' },
  gi_blue: { main: '#2563eb', accent: '#1d4ed8', sleeve: '#3b82f6' },
  gi_black: { main: '#1a1a2e', accent: '#111122', sleeve: '#252540' },
  nogi: { main: '#374151', accent: '#4b5563', sleeve: '#4b5563' },
  nogi_dark: { main: '#1f2937', accent: '#111827', sleeve: '#374151' },
}

const INJURY_LOCATIONS: Record<string, { x: number; y: number }> = {
  'Kne': { x: 155, y: 520 },
  'Skulder': { x: 100, y: 270 },
  'Nakke': { x: 150, y: 210 },
  'Rygg': { x: 150, y: 330 },
  'Ankel': { x: 135, y: 600 },
  'Håndledd': { x: 65, y: 395 },
  'Albue': { x: 75, y: 345 },
  'Hofte': { x: 130, y: 420 },
  'Finger': { x: 55, y: 430 },
  'Tå': { x: 135, y: 640 },
  'Øre': { x: 118, y: 135 },
  'Ribben': { x: 110, y: 320 },
}

// Body dimension multipliers per body type
const BODY_DIMS: Record<string, { torsoW: number; armW: number; legW: number }> = {
  slim: { torsoW: 0.85, armW: 0.8, legW: 0.85 },
  average: { torsoW: 1, armW: 1, legW: 1 },
  athletic: { torsoW: 1.1, armW: 1.2, legW: 1.05 },
  heavy: { torsoW: 1.25, armW: 1.15, legW: 1.15 },
}

// Face shape dimensions
const FACE_DIMS: Record<string, { rx: number; ry: number }> = {
  oval: { rx: 52, ry: 62 },
  round: { rx: 58, ry: 58 },
  square: { rx: 50, ry: 56 },
  long: { rx: 46, ry: 68 },
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
  const body = BODY_DIMS[config.bodyType ?? 'average']
  const face = FACE_DIMS[config.faceShape ?? 'oval']
  const skinDarker = darkenColor(config.skinTone, 15)

  // viewBox is 300x680 for more detail
  return (
    <svg
      viewBox="0 0 300 680"
      width={size}
      height={size * 680 / 300}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={config.skinTone} />
          <stop offset="100%" stopColor={skinDarker} />
        </radialGradient>
        <linearGradient id="outfitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={outfit.main} />
          <stop offset="100%" stopColor={outfit.accent} />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="150" cy="340" r="145" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

      {/* === LEGS === */}
      <Legs config={config} body={body} outfit={outfit} isGi={isGi} />

      {/* === FEET === */}
      <ellipse cx="120" cy="640" rx="22" ry="12" fill="#374151" />
      <ellipse cx="180" cy="640" rx="22" ry="12" fill="#374151" />

      {/* === BODY / TORSO === */}
      <Torso config={config} body={body} outfit={outfit} isGi={isGi} />

      {/* === BELT === */}
      {beltColor && isGi && <Belt beltColor={beltColor} beltRank={config.beltRank!} body={body} />}

      {/* === ARMS === */}
      <Arms config={config} body={body} outfit={outfit} isGi={isGi} />

      {/* === NECK === */}
      <rect x={138} y={195} width={24} height={38} rx={10} fill="url(#skinGrad)" />

      {/* === HEAD === */}
      <Head config={config} face={face} />

      {/* === HAIR === */}
      {config.hairStyle !== 'bald' && (
        <HairSVG style={config.hairStyle} color={config.hairColor} face={face} />
      )}

      {/* === EARS === */}
      <Ears config={config} face={face} />

      {/* === EYES === */}
      <Eyes config={config} />

      {/* === EYEBROWS === */}
      <Eyebrows config={config} />

      {/* === NOSE === */}
      <Nose config={config} />

      {/* === MOUTH === */}
      <Mouth config={config} />

      {/* === FACIAL HAIR === */}
      {config.facialHair && config.facialHair !== 'none' && (
        <FacialHairSVG style={config.facialHair} color={config.hairColor} />
      )}

      {/* === GLASSES === */}
      {config.glasses && config.glasses !== 'none' && (
        <GlassesSVG style={config.glasses} />
      )}

      {/* === ACADEMY PATCH === */}
      {config.academyColor && (
        <rect x={125} y={295} width={50} height={28} rx={5} fill={config.academyColor} opacity={0.85} />
      )}

      {/* === INJURY INDICATORS === */}
      {injuries.map((part) => {
        const loc = INJURY_LOCATIONS[part]
        if (!loc) return null
        return (
          <g key={part}>
            <circle cx={loc.x} cy={loc.y} r="14" fill="rgba(239,68,68,0.25)" />
            <text x={loc.x} y={loc.y + 5} textAnchor="middle" fontSize="14">🩹</text>
          </g>
        )
      })}
    </svg>
  )
}

// === SUB-COMPONENTS ===

function Legs({ config, body, outfit, isGi }: { config: AvatarConfig; body: typeof BODY_DIMS['average']; outfit: typeof OUTFIT_COLORS['gi_white']; isGi: boolean }) {
  const legW = 32 * body.legW
  const leftX = 150 - legW - 5
  const rightX = 150 + 5

  if (isGi) {
    return (
      <>
        <rect x={leftX} y={430} width={legW + 4} height={195} rx={14} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
        <rect x={rightX} y={430} width={legW + 4} height={195} rx={14} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
        {/* Gi pants fold lines */}
        <line x1={leftX + 8} y1={480} x2={leftX + 8} y2={560} stroke={outfit.accent} strokeWidth="0.8" opacity="0.5" />
        <line x1={rightX + legW - 4} y1={480} x2={rightX + legW - 4} y2={560} stroke={outfit.accent} strokeWidth="0.8" opacity="0.5" />
      </>
    )
  }
  return (
    <>
      {/* Shorts */}
      <rect x={leftX} y={430} width={legW + 4} height={80} rx={14} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
      <rect x={rightX} y={430} width={legW + 4} height={80} rx={14} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
      {/* Bare legs */}
      <rect x={leftX + 3} y={505} width={legW - 2} height={125} rx={12} fill={config.skinTone} />
      <rect x={rightX + 3} y={505} width={legW - 2} height={125} rx={12} fill={config.skinTone} />
    </>
  )
}

function Torso({ config, body, outfit, isGi }: { config: AvatarConfig; body: typeof BODY_DIMS['average']; outfit: typeof OUTFIT_COLORS['gi_white']; isGi: boolean }) {
  const w = 120 * body.torsoW
  const x = 150 - w / 2

  return (
    <>
      <rect x={x} y={230} width={w} height={210} rx={24} fill="url(#outfitGrad)" stroke={outfit.accent} strokeWidth="1" />

      {/* Gi details */}
      {isGi && (
        <>
          {/* Lapel V */}
          <path d={`M ${130} 230 L 150 290 L 170 230`} fill="none" stroke={outfit.accent} strokeWidth="2.5" />
          {/* Collar fold left */}
          <path d={`M ${126} 232 Q 135 250 130 270`} fill="none" stroke={outfit.accent} strokeWidth="1.2" />
          {/* Collar fold right */}
          <path d={`M ${174} 232 Q 165 250 170 270`} fill="none" stroke={outfit.accent} strokeWidth="1.2" />
          {/* Gi overlap line */}
          <line x1={150} y1={290} x2={150} y2={400} stroke={outfit.accent} strokeWidth="0.8" opacity="0.4" />
        </>
      )}

      {/* Nogi rashguard details */}
      {!isGi && (
        <>
          <line x1={x + 10} y1={280} x2={x + w - 10} y2={280} stroke={outfit.accent} strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />
          <line x1={x + 10} y1={310} x2={x + w - 10} y2={310} stroke={outfit.accent} strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />
          {/* Side stripe */}
          <rect x={x + 2} y={240} width={4} height={190} rx={2} fill={outfit.sleeve} opacity="0.3" />
          <rect x={x + w - 6} y={240} width={4} height={190} rx={2} fill={outfit.sleeve} opacity="0.3" />
        </>
      )}
    </>
  )
}

function Belt({ beltColor, beltRank, body }: { beltColor: string; beltRank: string; body: typeof BODY_DIMS['average'] }) {
  const w = 120 * body.torsoW
  const x = 150 - w / 2

  return (
    <g>
      {/* Belt band */}
      <rect x={x} y={398} width={w} height={16} rx={4} fill={beltColor} />
      {/* Belt texture line */}
      <line x1={x + 5} y1={406} x2={x + w - 5} y2={406} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />

      {/* Belt knot */}
      <circle cx={150} cy={406} r={9} fill={beltColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

      {/* Belt tails */}
      <rect x={142} y={414} width={7} height={32} rx={3} fill={beltColor} transform="rotate(-10, 145, 414)" />
      <rect x={151} y={414} width={7} height={38} rx={3} fill={beltColor} transform="rotate(6, 154, 414)" />

      {/* Black bar (rank indicator) */}
      {beltRank !== 'white' && (
        <rect x={x + w - 28} y={398} width={24} height={16} rx={3} fill="#1a1a1a" />
      )}
      {beltRank === 'white' && (
        <rect x={x + w - 28} y={398} width={24} height={16} rx={3} fill="#1a1a1a" />
      )}
    </g>
  )
}

function Arms({ config, body, outfit, isGi }: { config: AvatarConfig; body: typeof BODY_DIMS['average']; outfit: typeof OUTFIT_COLORS['gi_white']; isGi: boolean }) {
  const armW = 38 * body.armW

  return (
    <>
      {/* Upper arms */}
      <rect x={48} y={238} width={armW} height={120} rx={16}
        fill={isGi ? outfit.main : outfit.main}
        stroke={isGi ? outfit.accent : 'none'} strokeWidth="1"
      />
      <rect x={300 - 48 - armW} y={238} width={armW} height={120} rx={16}
        fill={isGi ? outfit.main : outfit.main}
        stroke={isGi ? outfit.accent : 'none'} strokeWidth="1"
      />

      {/* Forearms (skin) */}
      <rect x={52} y={348} width={armW - 6} height={72} rx={12} fill={config.skinTone} />
      <rect x={300 - 48 - armW + 4} y={348} width={armW - 6} height={72} rx={12} fill={config.skinTone} />

      {/* Hands */}
      <ellipse cx={52 + (armW - 6) / 2} cy={425} rx={14} ry={12} fill={config.skinTone} />
      <ellipse cx={300 - 48 - armW + 4 + (armW - 6) / 2} cy={425} rx={14} ry={12} fill={config.skinTone} />

      {/* Gi sleeve cuff */}
      {isGi && (
        <>
          <rect x={50} y={342} width={armW - 2} height={10} rx={4} fill={outfit.accent} opacity="0.5" />
          <rect x={300 - 48 - armW + 2} y={342} width={armW - 2} height={10} rx={4} fill={outfit.accent} opacity="0.5" />
        </>
      )}
    </>
  )
}

function Head({ config, face }: { config: AvatarConfig; face: typeof FACE_DIMS['oval'] }) {
  return (
    <ellipse cx={150} cy={130} rx={face.rx} ry={face.ry} fill="url(#skinGrad)" />
  )
}

function Ears({ config, face }: { config: AvatarConfig; face: typeof FACE_DIMS['oval'] }) {
  const earX = face.rx
  const isCauli = config.earType === 'cauliflower'

  return (
    <>
      {/* Left ear */}
      <ellipse cx={150 - earX} cy={135} rx={isCauli ? 11 : 9} ry={isCauli ? 14 : 13} fill={config.skinTone} />
      {isCauli && (
        <>
          <ellipse cx={150 - earX - 2} cy={132} rx={5} ry={6} fill={darkenColor(config.skinTone, 20)} opacity="0.5" />
          <ellipse cx={150 - earX + 1} cy={138} rx={4} ry={5} fill={darkenColor(config.skinTone, 15)} opacity="0.4" />
        </>
      )}
      {!isCauli && (
        <ellipse cx={150 - earX + 2} cy={135} rx={4} ry={8} fill={darkenColor(config.skinTone, 10)} opacity="0.3" />
      )}

      {/* Right ear */}
      <ellipse cx={150 + earX} cy={135} rx={isCauli ? 11 : 9} ry={isCauli ? 14 : 13} fill={config.skinTone} />
      {isCauli && (
        <>
          <ellipse cx={150 + earX + 2} cy={132} rx={5} ry={6} fill={darkenColor(config.skinTone, 20)} opacity="0.5" />
          <ellipse cx={150 + earX - 1} cy={138} rx={4} ry={5} fill={darkenColor(config.skinTone, 15)} opacity="0.4" />
        </>
      )}
      {!isCauli && (
        <ellipse cx={150 + earX - 2} cy={135} rx={4} ry={8} fill={darkenColor(config.skinTone, 10)} opacity="0.3" />
      )}
    </>
  )
}

function Eyes({ config }: { config: AvatarConfig }) {
  const eyeColor = config.eyeColor ?? '#4A3728'

  return (
    <>
      {/* Eye whites */}
      <ellipse cx={130} cy={128} rx={10} ry={7} fill="white" />
      <ellipse cx={170} cy={128} rx={10} ry={7} fill="white" />
      {/* Iris */}
      <ellipse cx={130} cy={128} rx={6} ry={6.5} fill={eyeColor} />
      <ellipse cx={170} cy={128} rx={6} ry={6.5} fill={eyeColor} />
      {/* Pupil */}
      <circle cx={130} cy={128} r={3} fill="#111" />
      <circle cx={170} cy={128} r={3} fill="#111" />
      {/* Highlight */}
      <circle cx={133} cy={126} r={2} fill="white" opacity="0.7" />
      <circle cx={173} cy={126} r={2} fill="white" opacity="0.7" />
      {/* Eyelid line */}
      <path d="M 120 123 Q 130 119 140 123" fill="none" stroke={darkenColor(config.skinTone, 25)} strokeWidth="1" />
      <path d="M 160 123 Q 170 119 180 123" fill="none" stroke={darkenColor(config.skinTone, 25)} strokeWidth="1" />
    </>
  )
}

function Eyebrows({ config }: { config: AvatarConfig }) {
  const style = config.eyebrowStyle ?? 'normal'
  const w = style === 'thick' ? 3 : style === 'thin' ? 1.2 : 2

  if (style === 'arched') {
    return (
      <>
        <path d="M 120 113 Q 130 106 140 112" fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d="M 160 112 Q 170 106 180 113" fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      </>
    )
  }

  return (
    <>
      <line x1={120} y1={114} x2={140} y2={112} stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      <line x1={160} y1={112} x2={180} y2={114} stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
    </>
  )
}

function Nose({ config }: { config: AvatarConfig }) {
  const shape = config.noseShape ?? 'default'

  switch (shape) {
    case 'small':
      return <path d="M 148 140 Q 150 148 152 140" fill="none" stroke={darkenColor(config.skinTone, 20)} strokeWidth="1.5" strokeLinecap="round" />
    case 'wide':
      return (
        <g>
          <path d="M 145 138 Q 150 152 155 138" fill="none" stroke={darkenColor(config.skinTone, 20)} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={143} cy={148} r={3} fill={darkenColor(config.skinTone, 8)} />
          <circle cx={157} cy={148} r={3} fill={darkenColor(config.skinTone, 8)} />
        </g>
      )
    case 'pointed':
      return <path d="M 150 132 L 146 150 Q 150 153 154 150 Z" fill={darkenColor(config.skinTone, 6)} stroke={darkenColor(config.skinTone, 15)} strokeWidth="0.8" />
    default:
      return (
        <g>
          <path d="M 147 135 Q 150 152 153 135" fill="none" stroke={darkenColor(config.skinTone, 18)} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={145} cy={148} r={2.5} fill={darkenColor(config.skinTone, 6)} />
          <circle cx={155} cy={148} r={2.5} fill={darkenColor(config.skinTone, 6)} />
        </g>
      )
  }
}

function Mouth({ config }: { config: AvatarConfig }) {
  const style = config.mouthStyle ?? 'smile'

  switch (style) {
    case 'neutral':
      return <line x1={138} y1={164} x2={162} y2={164} stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
    case 'grin':
      return (
        <g>
          <path d="M 132 160 Q 150 178 168 160" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
          {/* Teeth */}
          <path d="M 138 162 Q 150 170 162 162" fill="white" opacity="0.8" />
        </g>
      )
    case 'serious':
      return <path d="M 136 166 Q 150 162 164 166" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
    default: // smile
      return <path d="M 136 160 Q 150 174 164 160" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
  }
}

function FacialHairSVG({ style, color }: { style: string; color: string }) {
  const c = darkenColor(color, 10)

  switch (style) {
    case 'stubble':
      return (
        <g opacity="0.35">
          {Array.from({ length: 30 }).map((_, i) => {
            const x = 130 + (i % 6) * 7 + Math.sin(i) * 3
            const y = 158 + Math.floor(i / 6) * 6 + Math.cos(i) * 2
            return <circle key={i} cx={x} cy={y} r={0.8} fill={c} />
          })}
        </g>
      )
    case 'short_beard':
      return (
        <path d="M 118 155 Q 115 175 125 185 Q 140 195 150 196 Q 160 195 175 185 Q 185 175 182 155"
          fill={c} opacity="0.6" />
      )
    case 'full_beard':
      return (
        <g>
          <path d="M 115 148 Q 110 175 120 200 Q 135 218 150 220 Q 165 218 180 200 Q 190 175 185 148"
            fill={c} opacity="0.7" />
          {/* Beard texture */}
          <path d="M 130 170 Q 140 178 150 170" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <path d="M 140 185 Q 150 192 160 185" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        </g>
      )
    case 'mustache':
      return (
        <path d="M 135 155 Q 140 150 150 153 Q 160 150 165 155 Q 160 160 150 158 Q 140 160 135 155 Z"
          fill={c} opacity="0.75" />
      )
    case 'goatee':
      return (
        <g>
          <path d="M 138 155 Q 142 152 150 154 Q 158 152 162 155 Q 158 160 150 158 Q 142 160 138 155 Z"
            fill={c} opacity="0.7" />
          <path d="M 142 168 Q 140 188 150 195 Q 160 188 158 168"
            fill={c} opacity="0.6" />
        </g>
      )
    default:
      return null
  }
}

function GlassesSVG({ style }: { style: string }) {
  const frameColor = '#333'

  switch (style) {
    case 'round':
      return (
        <g>
          <circle cx={130} cy={128} r={16} fill="none" stroke={frameColor} strokeWidth="2.5" />
          <circle cx={170} cy={128} r={16} fill="none" stroke={frameColor} strokeWidth="2.5" />
          <line x1={146} y1={128} x2={154} y2={128} stroke={frameColor} strokeWidth="2" />
          <line x1={114} y1={126} x2={105} y2={122} stroke={frameColor} strokeWidth="2" />
          <line x1={186} y1={126} x2={195} y2={122} stroke={frameColor} strokeWidth="2" />
          {/* Lens reflection */}
          <ellipse cx={124} cy={124} rx={6} ry={4} fill="rgba(150,200,255,0.1)" />
          <ellipse cx={164} cy={124} rx={6} ry={4} fill="rgba(150,200,255,0.1)" />
        </g>
      )
    case 'square':
      return (
        <g>
          <rect x={114} y={116} width={32} height={24} rx={4} fill="none" stroke={frameColor} strokeWidth="2.5" />
          <rect x={154} y={116} width={32} height={24} rx={4} fill="none" stroke={frameColor} strokeWidth="2.5" />
          <line x1={146} y1={128} x2={154} y2={128} stroke={frameColor} strokeWidth="2" />
          <line x1={114} y1={126} x2={105} y2={122} stroke={frameColor} strokeWidth="2" />
          <line x1={186} y1={126} x2={195} y2={122} stroke={frameColor} strokeWidth="2" />
        </g>
      )
    case 'sport':
      return (
        <g>
          <path d="M 108 124 Q 108 112 130 112 Q 146 112 148 124 Q 146 136 130 136 Q 108 136 108 124 Z"
            fill="rgba(150,200,255,0.15)" stroke={frameColor} strokeWidth="2" />
          <path d="M 192 124 Q 192 112 170 112 Q 154 112 152 124 Q 154 136 170 136 Q 192 136 192 124 Z"
            fill="rgba(150,200,255,0.15)" stroke={frameColor} strokeWidth="2" />
          <line x1={148} y1={124} x2={152} y2={124} stroke={frameColor} strokeWidth="2.5" />
        </g>
      )
    default:
      return null
  }
}

function HairSVG({ style, color, face }: { style: string; color: string; face: typeof FACE_DIMS['oval'] }) {
  const lighter = lightenColor(color, 15)

  switch (style) {
    case 'short':
      return (
        <g>
          <path d={`M ${150 - face.rx - 2} 125 Q ${150 - face.rx - 4} 72 150 ${130 - face.ry - 4} Q ${150 + face.rx + 4} 72 ${150 + face.rx + 2} 125 Q ${150 + face.rx - 5} 88 150 82 Q ${150 - face.rx + 5} 88 ${150 - face.rx - 2} 125 Z`}
            fill={color} />
          <path d={`M ${150 - face.rx + 10} 90 Q 150 78 ${150 + face.rx - 10} 90`} fill="none" stroke={lighter} strokeWidth="0.8" opacity="0.3" />
        </g>
      )
    case 'buzz':
      return (
        <path d={`M ${150 - face.rx} 130 Q ${150 - face.rx - 2} 75 150 ${130 - face.ry - 2} Q ${150 + face.rx + 2} 75 ${150 + face.rx} 130 Q ${150 + face.rx - 8} 95 150 90 Q ${150 - face.rx + 8} 95 ${150 - face.rx} 130 Z`}
          fill={color} opacity="0.65" />
      )
    case 'medium':
      return (
        <g>
          <path d={`M ${150 - face.rx - 6} 130 Q ${150 - face.rx - 8} 65 150 ${130 - face.ry - 8} Q ${150 + face.rx + 8} 65 ${150 + face.rx + 6} 130 Q ${150 + face.rx - 2} 80 150 75 Q ${150 - face.rx + 2} 80 ${150 - face.rx - 6} 130 Z`}
            fill={color} />
          {/* Side hair flowing down */}
          <path d={`M ${150 - face.rx - 4} 130 Q ${150 - face.rx - 12} 140 ${150 - face.rx - 8} 165 Q ${150 - face.rx - 2} 155 ${150 - face.rx} 138`} fill={color} />
          <path d={`M ${150 + face.rx + 4} 130 Q ${150 + face.rx + 12} 140 ${150 + face.rx + 8} 165 Q ${150 + face.rx + 2} 155 ${150 + face.rx} 138`} fill={color} />
        </g>
      )
    case 'long':
      return (
        <g>
          <path d={`M ${150 - face.rx - 8} 135 Q ${150 - face.rx - 10} 60 150 ${130 - face.ry - 10} Q ${150 + face.rx + 10} 60 ${150 + face.rx + 8} 135 Q ${150 + face.rx} 75 150 70 Q ${150 - face.rx} 75 ${150 - face.rx - 8} 135 Z`}
            fill={color} />
          <path d={`M ${150 - face.rx - 6} 135 Q ${150 - face.rx - 16} 160 ${150 - face.rx - 10} 210 Q ${150 - face.rx - 4} 200 ${150 - face.rx + 2} 150`} fill={color} />
          <path d={`M ${150 + face.rx + 6} 135 Q ${150 + face.rx + 16} 160 ${150 + face.rx + 10} 210 Q ${150 + face.rx + 4} 200 ${150 + face.rx - 2} 150`} fill={color} />
        </g>
      )
    case 'bun':
      return (
        <g>
          <path d={`M ${150 - face.rx - 2} 125 Q ${150 - face.rx - 4} 72 150 ${130 - face.ry - 4} Q ${150 + face.rx + 4} 72 ${150 + face.rx + 2} 125 Q ${150 + face.rx - 5} 88 150 82 Q ${150 - face.rx + 5} 88 ${150 - face.rx - 2} 125 Z`}
            fill={color} />
          <ellipse cx={150} cy={60} rx={22} ry={18} fill={color} />
          <ellipse cx={150} cy={58} rx={12} ry={8} fill={lighter} opacity="0.15" />
        </g>
      )
    case 'curly':
      return (
        <g>
          <path d={`M ${150 - face.rx - 6} 135 Q ${150 - face.rx - 10} 60 150 ${130 - face.ry - 8} Q ${150 + face.rx + 10} 60 ${150 + face.rx + 6} 135 Q ${150 + face.rx} 80 150 74 Q ${150 - face.rx} 80 ${150 - face.rx - 6} 135 Z`}
            fill={color} />
          {/* Curly texture */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const cx = 150 + Math.cos(angle) * (face.rx - 8)
            const cy = 95 + Math.sin(angle) * 25
            return <circle key={i} cx={cx} cy={cy} r={8} fill={color} />
          })}
        </g>
      )
    case 'mohawk':
      return (
        <path d={`M 140 ${130 - face.ry + 10} Q 142 50 150 40 Q 158 50 160 ${130 - face.ry + 10} Q 158 55 150 48 Q 142 55 140 ${130 - face.ry + 10} Z`}
          fill={color} />
      )
    case 'ponytail':
      return (
        <g>
          <path d={`M ${150 - face.rx - 2} 125 Q ${150 - face.rx - 4} 72 150 ${130 - face.ry - 4} Q ${150 + face.rx + 4} 72 ${150 + face.rx + 2} 125 Q ${150 + face.rx - 5} 88 150 82 Q ${150 - face.rx + 5} 88 ${150 - face.rx - 2} 125 Z`}
            fill={color} />
          {/* Ponytail going back */}
          <ellipse cx={150} cy={82} rx={14} ry={10} fill={color} />
          <path d="M 150 92 Q 155 120 152 160 Q 150 165 148 160 Q 145 120 150 92" fill={color} />
        </g>
      )
    case 'braids':
      return (
        <g>
          <path d={`M ${150 - face.rx - 4} 130 Q ${150 - face.rx - 6} 68 150 ${130 - face.ry - 6} Q ${150 + face.rx + 6} 68 ${150 + face.rx + 4} 130 Q ${150 + face.rx - 3} 85 150 78 Q ${150 - face.rx + 3} 85 ${150 - face.rx - 4} 130 Z`}
            fill={color} />
          {/* Braids */}
          <path d={`M ${150 - face.rx} 130 Q ${150 - face.rx - 8} 160 ${150 - face.rx - 4} 210`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <path d={`M ${150 + face.rx} 130 Q ${150 + face.rx + 8} 160 ${150 + face.rx + 4} 210`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
          {/* Braid texture */}
          {[0, 1, 2, 3].map(i => (
            <g key={i}>
              <line x1={150 - face.rx - 4 - 4} y1={145 + i * 16} x2={150 - face.rx - 4 + 4} y2={145 + i * 16} stroke={lighter} strokeWidth="1" opacity="0.3" />
              <line x1={150 + face.rx + 4 - 4} y1={145 + i * 16} x2={150 + face.rx + 4 + 4} y2={145 + i * 16} stroke={lighter} strokeWidth="1" opacity="0.3" />
            </g>
          ))}
        </g>
      )
    default:
      return null
  }
}

// Color utility functions
function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}
