// SVG avatar renderer for BJJ practitioners — Bitmoji-inspired cartoon style
// Large head, expressive features, BJJ accessories, detailed clothing

export interface AvatarConfig {
  skinTone: string
  hairStyle: 'short' | 'medium' | 'long' | 'bun' | 'bald' | 'buzz' | 'curly' | 'mohawk' | 'ponytail' | 'braids'
  hairColor: string
  outfit: 'gi_white' | 'gi_blue' | 'gi_black' | 'nogi' | 'nogi_dark'
  beltRank?: string | null
  academyColor?: string | null
  showInjuries?: string[]
  gender: 'male' | 'female'
  facialHair?: 'none' | 'stubble' | 'short_beard' | 'full_beard' | 'mustache' | 'goatee'
  glasses?: 'none' | 'round' | 'square' | 'sport'
  noseShape?: 'default' | 'small' | 'wide' | 'pointed'
  faceShape?: 'oval' | 'round' | 'square' | 'long'
  bodyType?: 'slim' | 'average' | 'athletic' | 'heavy'
  earType?: 'normal' | 'cauliflower'
  eyeColor?: string
  eyeShape?: 'default' | 'round' | 'almond' | 'narrow'
  eyebrowStyle?: 'normal' | 'thick' | 'thin' | 'arched'
  mouthStyle?: 'smile' | 'neutral' | 'grin' | 'serious'
  // BJJ accessories
  fingerTape?: boolean
  headband?: boolean
  mouthguard?: boolean
  kneePads?: boolean
  // Skin details
  freckles?: boolean
  scar?: 'none' | 'eyebrow' | 'cheek' | 'chin'
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
  eyeShape: 'default',
  eyebrowStyle: 'normal',
  mouthStyle: 'smile',
  fingerTape: false,
  headband: false,
  mouthguard: false,
  kneePads: false,
  freckles: false,
  scar: 'none',
}

// === OPTION CONSTANTS ===

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
  { name: 'Hassel', value: '#8B7355' },
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

export const EYE_SHAPES = [
  { name: 'Standard', value: 'default' as const },
  { name: 'Runde', value: 'round' as const },
  { name: 'Mandelformet', value: 'almond' as const },
  { name: 'Smale', value: 'narrow' as const },
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

export const SCAR_OPTIONS = [
  { name: 'Ingen', value: 'none' as const },
  { name: 'Øyenbryn', value: 'eyebrow' as const },
  { name: 'Kinn', value: 'cheek' as const },
  { name: 'Hake', value: 'chin' as const },
]

export const OUTFIT_OPTIONS = [
  { name: 'Hvit Gi', value: 'gi_white' as const },
  { name: 'Blå Gi', value: 'gi_blue' as const },
  { name: 'Svart Gi', value: 'gi_black' as const },
  { name: 'No-Gi (lys)', value: 'nogi' as const },
  { name: 'No-Gi (mørk)', value: 'nogi_dark' as const },
]

// === INTERNAL MAPS ===

const BELT_COLOR_MAP: Record<string, string> = {
  white: '#ffffff', grey_white: '#9ca3af', grey: '#9ca3af', grey_black: '#9ca3af',
  yellow_white: '#eab308', yellow: '#eab308', yellow_black: '#eab308',
  orange_white: '#f97316', orange: '#f97316', orange_black: '#f97316',
  green_white: '#22c55e', green: '#22c55e', green_black: '#22c55e',
  blue: '#3b82f6', purple: '#9333ea', brown: '#92400e', black: '#1a1a1a',
}

const OUTFIT_COLORS: Record<string, { main: string; accent: string; dark: string }> = {
  gi_white: { main: '#f0f0f0', accent: '#d8d8d8', dark: '#c0c0c0' },
  gi_blue: { main: '#2563eb', accent: '#1d4ed8', dark: '#1e40af' },
  gi_black: { main: '#1a1a2e', accent: '#111122', dark: '#0a0a18' },
  nogi: { main: '#374151', accent: '#4b5563', dark: '#1f2937' },
  nogi_dark: { main: '#1f2937', accent: '#111827', dark: '#0f172a' },
}

const BODY_DIMS: Record<string, { torsoW: number; shoulderW: number; hipW: number }> = {
  slim:     { torsoW: 0.85, shoulderW: 0.9,  hipW: 0.85 },
  average:  { torsoW: 1,    shoulderW: 1,    hipW: 1 },
  athletic: { torsoW: 1.05, shoulderW: 1.15, hipW: 0.95 },
  heavy:    { torsoW: 1.2,  shoulderW: 1.1,  hipW: 1.15 },
}

const FACE_DIMS: Record<string, { rx: number; ry: number; jawY: number }> = {
  oval:   { rx: 75, ry: 85, jawY: 10 },
  round:  { rx: 80, ry: 80, jawY: 5 },
  square: { rx: 72, ry: 80, jawY: 15 },
  long:   { rx: 68, ry: 92, jawY: 8 },
}

const INJURY_LOCATIONS: Record<string, { x: number; y: number }> = {
  'Kne': { x: 220, y: 670 }, 'Skulder': { x: 130, y: 360 }, 'Nakke': { x: 200, y: 280 },
  'Rygg': { x: 200, y: 420 }, 'Ankel': { x: 185, y: 770 }, 'Håndledd': { x: 85, y: 520 },
  'Albue': { x: 95, y: 460 }, 'Hofte': { x: 170, y: 540 }, 'Finger': { x: 70, y: 560 },
  'Tå': { x: 185, y: 810 }, 'Øre': { x: 130, y: 155 }, 'Ribben': { x: 145, y: 410 },
}

// === MAIN COMPONENT ===
// ViewBox: 400 x 850 — large head cartoon style (head ~45% of height)

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
  const sd = darken(config.skinTone, 15)
  const sl = lighten(config.skinTone, 10)

  // Center points
  const cx = 200  // head center X
  const hcy = 155 // head center Y
  const bcy = 420 // body center Y

  return (
    <svg viewBox="0 0 400 850" width={size} height={size * 850 / 400} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sg" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor={sl} />
          <stop offset="70%" stopColor={config.skinTone} />
          <stop offset="100%" stopColor={sd} />
        </radialGradient>
        <linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={outfit.main} />
          <stop offset="100%" stopColor={outfit.accent} />
        </linearGradient>
        <linearGradient id="og2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={outfit.accent} />
          <stop offset="100%" stopColor={outfit.dark} />
        </linearGradient>
      </defs>

      {/* === LEGS === */}
      <LegsComp isGi={isGi} outfit={outfit} body={body} skinTone={config.skinTone} kneePads={config.kneePads} />

      {/* === FEET === */}
      <ellipse cx={165} cy={810} rx={28} ry={14} fill="#374151" />
      <ellipse cx={235} cy={810} rx={28} ry={14} fill="#374151" />
      {/* Shoe highlights */}
      <ellipse cx={162} cy={807} rx={16} ry={6} fill="rgba(255,255,255,0.08)" />
      <ellipse cx={232} cy={807} rx={16} ry={6} fill="rgba(255,255,255,0.08)" />

      {/* === TORSO === */}
      <TorsoComp isGi={isGi} outfit={outfit} body={body} academyColor={config.academyColor} />

      {/* === BELT === */}
      {beltColor && isGi && <BeltComp beltColor={beltColor} beltRank={config.beltRank!} body={body} />}

      {/* === ARMS + HANDS === */}
      <ArmsComp isGi={isGi} outfit={outfit} body={body} skinTone={config.skinTone} fingerTape={config.fingerTape} />

      {/* === NECK === */}
      <rect x={185} y={262} width={30} height={48} rx={12} fill="url(#sg)" />
      {/* Neck shadow */}
      <rect x={185} y={290} width={30} height={18} rx={8} fill="rgba(0,0,0,0.08)" />

      {/* === HEAD === */}
      <ellipse cx={cx} cy={hcy} rx={face.rx} ry={face.ry} fill="url(#sg)" />
      {/* Jaw definition */}
      {config.faceShape === 'square' && (
        <path d={`M ${cx - face.rx + 10} ${hcy + 20} Q ${cx - face.rx + 5} ${hcy + face.ry - 10} ${cx - 30} ${hcy + face.ry + face.jawY} L ${cx + 30} ${hcy + face.ry + face.jawY} Q ${cx + face.rx - 5} ${hcy + face.ry - 10} ${cx + face.rx - 10} ${hcy + 20}`}
          fill="url(#sg)" />
      )}
      {/* Cheek blush */}
      <ellipse cx={cx - 45} cy={hcy + 20} rx={14} ry={8} fill="#e8a090" opacity="0.15" />
      <ellipse cx={cx + 45} cy={hcy + 20} rx={14} ry={8} fill="#e8a090" opacity="0.15" />
      {/* Face highlight */}
      <ellipse cx={cx - 15} cy={hcy - 35} rx={28} ry={18} fill="white" opacity="0.06" />

      {/* === FRECKLES === */}
      {config.freckles && <Freckles cx={cx} cy={hcy} />}

      {/* === SCARS === */}
      {config.scar && config.scar !== 'none' && <Scar type={config.scar} cx={cx} cy={hcy} skinTone={config.skinTone} />}

      {/* === EARS === */}
      <EarsComp config={config} cx={cx} cy={hcy} face={face} />

      {/* === HEADBAND === */}
      {config.headband && (
        <g>
          <path d={`M ${cx - face.rx + 2} ${hcy - 35} Q ${cx} ${hcy - 48} ${cx + face.rx - 2} ${hcy - 35}`}
            fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
          <path d={`M ${cx - face.rx + 2} ${hcy - 35} Q ${cx} ${hcy - 44} ${cx + face.rx - 2} ${hcy - 35}`}
            fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* === EYES === */}
      <EyesComp config={config} cx={cx} cy={hcy} />

      {/* === EYEBROWS === */}
      <EyebrowsComp config={config} cx={cx} cy={hcy} />

      {/* === NOSE === */}
      <NoseComp config={config} cx={cx} cy={hcy} />

      {/* === MOUTH === */}
      <MouthComp config={config} cx={cx} cy={hcy} />

      {/* === MOUTHGUARD === */}
      {config.mouthguard && (
        <path d={`M ${cx - 18} ${hcy + 42} Q ${cx} ${hcy + 55} ${cx + 18} ${hcy + 42}`}
          fill="#60a5fa" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="1" />
      )}

      {/* === FACIAL HAIR === */}
      {config.facialHair && config.facialHair !== 'none' && (
        <FacialHairComp style={config.facialHair} color={config.hairColor} cx={cx} cy={hcy} face={face} />
      )}

      {/* === HAIR === */}
      {config.hairStyle !== 'bald' && (
        <HairComp style={config.hairStyle} color={config.hairColor} cx={cx} cy={hcy} face={face} />
      )}

      {/* === GLASSES === */}
      {config.glasses && config.glasses !== 'none' && (
        <GlassesComp style={config.glasses} cx={cx} cy={hcy} />
      )}

      {/* === INJURY INDICATORS === */}
      {injuries.map((part) => {
        const loc = INJURY_LOCATIONS[part]
        if (!loc) return null
        return (
          <g key={part}>
            <circle cx={loc.x} cy={loc.y} r={16} fill="rgba(239,68,68,0.25)" />
            <text x={loc.x} y={loc.y + 5} textAnchor="middle" fontSize="15">🩹</text>
          </g>
        )
      })}
    </svg>
  )
}

// === SUB-COMPONENTS ===

function LegsComp({ isGi, outfit, body, skinTone, kneePads }: { isGi: boolean; outfit: typeof OUTFIT_COLORS['gi_white']; body: typeof BODY_DIMS['average']; skinTone: string; kneePads?: boolean }) {
  const hw = 28 * body.hipW
  const lx = 200 - hw - 10
  const rx = 200 + 10

  return (
    <g>
      {isGi ? (
        <>
          <rect x={lx - 2} y={545} width={hw + 8} height={250} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          <rect x={rx - 2} y={545} width={hw + 8} height={250} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          {/* Gi pant creases */}
          <path d={`M ${lx + 8} ${620} Q ${lx + 12} ${660} ${lx + 6} ${700}`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.4" />
          <path d={`M ${rx + hw - 4} ${620} Q ${rx + hw - 8} ${660} ${rx + hw - 2} ${700}`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.4" />
        </>
      ) : (
        <>
          {/* Shorts */}
          <rect x={lx - 2} y={545} width={hw + 8} height={100} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          <rect x={rx - 2} y={545} width={hw + 8} height={100} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          {/* Bare legs */}
          <rect x={lx + 2} y={640} width={hw} height={155} rx={14} fill={skinTone} />
          <rect x={rx + 2} y={640} width={hw} height={155} rx={14} fill={skinTone} />
          {/* Leg muscle definition */}
          <path d={`M ${lx + 8} ${670} Q ${lx + hw / 2} ${690} ${lx + hw - 4} ${670}`} fill="none" stroke={darken(skinTone, 12)} strokeWidth="0.8" opacity="0.3" />
          <path d={`M ${rx + 8} ${670} Q ${rx + hw / 2} ${690} ${rx + hw - 4} ${670}`} fill="none" stroke={darken(skinTone, 12)} strokeWidth="0.8" opacity="0.3" />
        </>
      )}
      {/* Knee pads */}
      {kneePads && (
        <>
          <ellipse cx={lx + hw / 2 + 2} cy={isGi ? 650 : 638} rx={18} ry={22} fill="rgba(30,30,30,0.7)" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
          <ellipse cx={rx + hw / 2 + 2} cy={isGi ? 650 : 638} rx={18} ry={22} fill="rgba(30,30,30,0.7)" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
        </>
      )}
    </g>
  )
}

function TorsoComp({ isGi, outfit, body, academyColor }: { isGi: boolean; outfit: typeof OUTFIT_COLORS['gi_white']; body: typeof BODY_DIMS['average']; academyColor?: string | null }) {
  const sw = 75 * body.shoulderW
  const hw = 60 * body.hipW
  const tw = 65 * body.torsoW

  return (
    <g>
      {/* Torso - tapered shape using path */}
      <path d={`M ${200 - sw} 310 Q ${200 - sw - 5} 380 ${200 - hw} 550 L ${200 + hw} 550 Q ${200 + sw + 5} 380 ${200 + sw} 310 Z`}
        fill="url(#og)" stroke={outfit.accent} strokeWidth="1" />

      {/* Shoulder roundness */}
      <ellipse cx={200 - sw + 5} cy={315} rx={20} ry={12} fill={outfit.main} />
      <ellipse cx={200 + sw - 5} cy={315} rx={20} ry={12} fill={outfit.main} />

      {isGi ? (
        <>
          {/* Gi lapel V-shape */}
          <path d="M 175 310 L 200 380 L 225 310" fill="none" stroke={outfit.accent} strokeWidth="3" />
          {/* Collar lines */}
          <path d="M 172 312 Q 180 340 176 365" fill="none" stroke={outfit.accent} strokeWidth="1.5" opacity="0.6" />
          <path d="M 228 312 Q 220 340 224 365" fill="none" stroke={outfit.accent} strokeWidth="1.5" opacity="0.6" />
          {/* Center seam */}
          <line x1={200} y1={380} x2={200} y2={530} stroke={outfit.accent} strokeWidth="0.8" opacity="0.3" />
          {/* Gi texture */}
          <line x1={200 - tw} y1={400} x2={200 + tw} y2={400} stroke={outfit.accent} strokeWidth="0.5" opacity="0.15" />
          <line x1={200 - tw + 5} y1={440} x2={200 + tw - 5} y2={440} stroke={outfit.accent} strokeWidth="0.5" opacity="0.15" />
        </>
      ) : (
        <>
          {/* Rashguard neckline */}
          <path d="M 175 310 Q 200 325 225 310" fill="none" stroke={outfit.accent} strokeWidth="2" />
          {/* Side stripes */}
          <path d={`M ${200 - sw + 3} 315 L ${200 - hw + 3} 545`} fill="none" stroke={outfit.dark} strokeWidth="5" opacity="0.3" />
          <path d={`M ${200 + sw - 3} 315 L ${200 + hw - 3} 545`} fill="none" stroke={outfit.dark} strokeWidth="5" opacity="0.3" />
          {/* Pattern lines */}
          <line x1={200 - tw + 10} y1={380} x2={200 + tw - 10} y2={380} stroke={outfit.dark} strokeWidth="1" strokeDasharray="5,4" opacity="0.25" />
          <line x1={200 - tw + 10} y1={420} x2={200 + tw - 10} y2={420} stroke={outfit.dark} strokeWidth="1" strokeDasharray="5,4" opacity="0.25" />
        </>
      )}

      {/* Academy patch */}
      {academyColor && (
        <g>
          <rect x={175} y={390} width={50} height={30} rx={5} fill={academyColor} opacity="0.85" />
          {/* Patch border */}
          <rect x={175} y={390} width={50} height={30} rx={5} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        </g>
      )}
    </g>
  )
}

function BeltComp({ beltColor, beltRank, body }: { beltColor: string; beltRank: string; body: typeof BODY_DIMS['average'] }) {
  const hw = 60 * body.hipW
  const w = hw * 2 + 10

  return (
    <g>
      {/* Belt band */}
      <rect x={200 - hw - 5} y={520} width={w} height={18} rx={5} fill={beltColor} />
      {/* Belt sheen */}
      <rect x={200 - hw - 5} y={520} width={w} height={8} rx={5} fill="rgba(255,255,255,0.12)" />

      {/* Knot */}
      <ellipse cx={200} cy={529} rx={11} ry={9} fill={beltColor} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      {/* Knot highlight */}
      <ellipse cx={198} cy={527} rx={5} ry={3} fill="rgba(255,255,255,0.15)" />

      {/* Tails */}
      <path d="M 195 538 Q 190 560 192 575" fill="none" stroke={beltColor} strokeWidth="8" strokeLinecap="round" />
      <path d="M 205 538 Q 212 565 208 582" fill="none" stroke={beltColor} strokeWidth="8" strokeLinecap="round" />
      {/* Tail tips */}
      <rect x={189} y={570} width={8} height={4} rx={2} fill={beltColor} transform="rotate(-5, 193, 572)" />
      <rect x={204} y={578} width={8} height={4} rx={2} fill={beltColor} transform="rotate(4, 208, 580)" />

      {/* Black bar */}
      <rect x={200 + hw - 22} y={520} width={26} height={18} rx={4}
        fill={beltRank === 'black' ? '#8b0000' : '#1a1a1a'} />
      {/* Bar sheen */}
      <rect x={200 + hw - 22} y={520} width={26} height={8} rx={4} fill="rgba(255,255,255,0.1)" />
    </g>
  )
}

function ArmsComp({ isGi, outfit, body, skinTone, fingerTape }: { isGi: boolean; outfit: typeof OUTFIT_COLORS['gi_white']; body: typeof BODY_DIMS['average']; skinTone: string; fingerTape?: boolean }) {
  const sw = 75 * body.shoulderW
  const armW = 32 * (body.shoulderW * 0.5 + 0.5)

  return (
    <g>
      {/* Upper arms (sleeve) */}
      <rect x={200 - sw - armW + 5} y={310} width={armW} height={130} rx={16}
        fill={isGi ? outfit.main : outfit.main} stroke={isGi ? outfit.accent : 'none'} strokeWidth="1" />
      <rect x={200 + sw - 5} y={310} width={armW} height={130} rx={16}
        fill={isGi ? outfit.main : outfit.main} stroke={isGi ? outfit.accent : 'none'} strokeWidth="1" />

      {/* Gi sleeve cuff */}
      {isGi && (
        <>
          <rect x={200 - sw - armW + 4} y={430} width={armW + 2} height={12} rx={5} fill={outfit.accent} opacity="0.5" />
          <rect x={200 + sw - 6} y={430} width={armW + 2} height={12} rx={5} fill={outfit.accent} opacity="0.5" />
        </>
      )}

      {/* Forearms (skin) */}
      <rect x={200 - sw - armW + 9} y={435} width={armW - 8} height={80} rx={12} fill={skinTone} />
      <rect x={200 + sw - 1} y={435} width={armW - 8} height={80} rx={12} fill={skinTone} />
      {/* Forearm muscle */}
      <ellipse cx={200 - sw - armW / 2 + 9} cy={460} rx={8} ry={14} fill="rgba(255,255,255,0.04)" />
      <ellipse cx={200 + sw + armW / 2 - 5} cy={460} rx={8} ry={14} fill="rgba(255,255,255,0.04)" />

      {/* Hands */}
      <HandComp x={200 - sw - armW / 2 + 8} y={518} skinTone={skinTone} fingerTape={fingerTape} mirror={false} />
      <HandComp x={200 + sw + armW / 2 - 8} y={518} skinTone={skinTone} fingerTape={fingerTape} mirror={true} />
    </g>
  )
}

function HandComp({ x, y, skinTone, fingerTape, mirror }: { x: number; y: number; skinTone: string; fingerTape?: boolean; mirror: boolean }) {
  const dir = mirror ? -1 : 1

  return (
    <g>
      {/* Palm */}
      <ellipse cx={x} cy={y} rx={16} ry={14} fill={skinTone} />
      {/* Thumb */}
      <ellipse cx={x + dir * 14} cy={y - 6} rx={6} ry={5} fill={skinTone} />
      {/* Fingers hint */}
      <ellipse cx={x - dir * 4} cy={y + 12} rx={12} ry={5} fill={skinTone} />

      {/* Finger tape */}
      {fingerTape && (
        <>
          <rect x={x - dir * 10 - 3} y={y + 8} width={7} height={8} rx={2} fill="white" opacity="0.85" />
          <rect x={x - dir * 2 - 3} y={y + 9} width={7} height={7} rx={2} fill="white" opacity="0.85" />
          {/* Tape texture */}
          <line x1={x - dir * 10 - 1} y1={y + 12} x2={x - dir * 10 + 4} y2={y + 12} stroke="#d4d4d4" strokeWidth="0.5" />
          <line x1={x - dir * 2 - 1} y1={y + 12} x2={x - dir * 2 + 4} y2={y + 12} stroke="#d4d4d4" strokeWidth="0.5" />
        </>
      )}
    </g>
  )
}

function EarsComp({ config, cx, cy, face }: { config: AvatarConfig; cx: number; cy: number; face: typeof FACE_DIMS['oval'] }) {
  const ex = face.rx - 2
  const isCauli = config.earType === 'cauliflower'

  return (
    <g>
      {/* Left */}
      <ellipse cx={cx - ex} cy={cy + 5} rx={isCauli ? 14 : 11} ry={isCauli ? 18 : 16} fill={config.skinTone} />
      {isCauli ? (
        <>
          <ellipse cx={cx - ex - 3} cy={cy + 1} rx={6} ry={8} fill={darken(config.skinTone, 22)} opacity="0.45" />
          <ellipse cx={cx - ex + 1} cy={cy + 9} rx={5} ry={7} fill={darken(config.skinTone, 18)} opacity="0.35" />
          <ellipse cx={cx - ex - 1} cy={cy + 5} rx={3} ry={4} fill={darken(config.skinTone, 30)} opacity="0.25" />
        </>
      ) : (
        <ellipse cx={cx - ex + 3} cy={cy + 5} rx={5} ry={10} fill={darken(config.skinTone, 10)} opacity="0.25" />
      )}
      {/* Right */}
      <ellipse cx={cx + ex} cy={cy + 5} rx={isCauli ? 14 : 11} ry={isCauli ? 18 : 16} fill={config.skinTone} />
      {isCauli ? (
        <>
          <ellipse cx={cx + ex + 3} cy={cy + 1} rx={6} ry={8} fill={darken(config.skinTone, 22)} opacity="0.45" />
          <ellipse cx={cx + ex - 1} cy={cy + 9} rx={5} ry={7} fill={darken(config.skinTone, 18)} opacity="0.35" />
          <ellipse cx={cx + ex + 1} cy={cy + 5} rx={3} ry={4} fill={darken(config.skinTone, 30)} opacity="0.25" />
        </>
      ) : (
        <ellipse cx={cx + ex - 3} cy={cy + 5} rx={5} ry={10} fill={darken(config.skinTone, 10)} opacity="0.25" />
      )}
    </g>
  )
}

function EyesComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const eyeColor = config.eyeColor ?? '#4A3728'
  const shape = config.eyeShape ?? 'default'

  // Eye dimensions per shape
  const dims = {
    default: { rx: 13, ry: 10, irisR: 8 },
    round:   { rx: 13, ry: 12, irisR: 9 },
    almond:  { rx: 15, ry: 8,  irisR: 7 },
    narrow:  { rx: 14, ry: 6,  irisR: 6 },
  }[shape]

  const ex = 30 // eye distance from center
  const ey = cy - 5

  return (
    <g>
      {[cx - ex, cx + ex].map((eyeX, i) => (
        <g key={i}>
          {/* Eye white */}
          <ellipse cx={eyeX} cy={ey} rx={dims.rx} ry={dims.ry} fill="white" />
          {/* Eye shadow (upper) */}
          <path d={`M ${eyeX - dims.rx} ${ey} Q ${eyeX} ${ey - dims.ry - 2} ${eyeX + dims.rx} ${ey}`}
            fill="none" stroke={darken(config.skinTone, 30)} strokeWidth="1.5" />
          {/* Iris */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR} fill={eyeColor} />
          {/* Iris detail ring */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR} fill="none" stroke={darken(eyeColor, 20)} strokeWidth="1" />
          {/* Iris radial lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
            const rad = angle * Math.PI / 180
            const ir = dims.irisR * 0.4
            const or = dims.irisR * 0.9
            return (
              <line key={angle}
                x1={eyeX + Math.cos(rad) * ir} y1={ey + 1 + Math.sin(rad) * ir}
                x2={eyeX + Math.cos(rad) * or} y2={ey + 1 + Math.sin(rad) * or}
                stroke={lighten(eyeColor, 15)} strokeWidth="0.5" opacity="0.4"
              />
            )
          })}
          {/* Pupil */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR * 0.4} fill="#111" />
          {/* Big highlight */}
          <circle cx={eyeX + 3} cy={ey - 2} r={3} fill="white" opacity="0.85" />
          {/* Small highlight */}
          <circle cx={eyeX - 2} cy={ey + 3} r={1.5} fill="white" opacity="0.5" />
          {/* Lower eyelid hint */}
          <path d={`M ${eyeX - dims.rx + 3} ${ey + dims.ry - 2} Q ${eyeX} ${ey + dims.ry + 1} ${eyeX + dims.rx - 3} ${ey + dims.ry - 2}`}
            fill="none" stroke={darken(config.skinTone, 12)} strokeWidth="0.8" opacity="0.4" />
          {/* Eyelashes (female) */}
          {config.gender === 'female' && (
            <>
              <line x1={eyeX - dims.rx + 1} y1={ey - dims.ry + 3} x2={eyeX - dims.rx - 2} y2={ey - dims.ry} stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={eyeX - dims.rx + 6} y1={ey - dims.ry + 1} x2={eyeX - dims.rx + 4} y2={ey - dims.ry - 3} stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={eyeX + dims.rx - 1} y1={ey - dims.ry + 3} x2={eyeX + dims.rx + 2} y2={ey - dims.ry} stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </g>
      ))}
    </g>
  )
}

function EyebrowsComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const style = config.eyebrowStyle ?? 'normal'
  const w = style === 'thick' ? 3.5 : style === 'thin' ? 1.5 : 2.5
  const ey = cy - 25
  const ex = 30

  if (style === 'arched') {
    return (
      <g>
        <path d={`M ${cx - ex - 14} ${ey + 3} Q ${cx - ex} ${ey - 8} ${cx - ex + 14} ${ey + 1}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${cx + ex - 14} ${ey + 1} Q ${cx + ex} ${ey - 8} ${cx + ex + 14} ${ey + 3}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      </g>
    )
  }

  return (
    <g>
      <line x1={cx - ex - 14} y1={ey + 2} x2={cx - ex + 14} y2={ey - 1} stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      <line x1={cx + ex - 14} y1={ey - 1} x2={cx + ex + 14} y2={ey + 2} stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
    </g>
  )
}

function NoseComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const ny = cy + 15
  const sd = darken(config.skinTone, 18)
  const sl = darken(config.skinTone, 8)

  switch (config.noseShape ?? 'default') {
    case 'small':
      return <path d={`M ${cx - 3} ${ny - 5} Q ${cx} ${ny + 5} ${cx + 3} ${ny - 5}`} fill="none" stroke={sd} strokeWidth="1.8" strokeLinecap="round" />
    case 'wide':
      return (
        <g>
          <path d={`M ${cx - 6} ${ny - 8} Q ${cx} ${ny + 6} ${cx + 6} ${ny - 8}`} fill="none" stroke={sd} strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx={cx - 8} cy={ny + 1} rx={5} ry={4} fill={sl} />
          <ellipse cx={cx + 8} cy={ny + 1} rx={5} ry={4} fill={sl} />
        </g>
      )
    case 'pointed':
      return <path d={`M ${cx} ${ny - 12} L ${cx - 5} ${ny + 4} Q ${cx} ${ny + 7} ${cx + 5} ${ny + 4} Z`} fill={sl} stroke={sd} strokeWidth="0.8" />
    default:
      return (
        <g>
          <path d={`M ${cx - 4} ${ny - 10} Q ${cx} ${ny + 4} ${cx + 4} ${ny - 10}`} fill="none" stroke={sd} strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx={cx - 6} cy={ny} rx={4} ry={3} fill={sl} />
          <ellipse cx={cx + 6} cy={ny} rx={4} ry={3} fill={sl} />
        </g>
      )
  }
}

function MouthComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const my = cy + 40

  switch (config.mouthStyle ?? 'smile') {
    case 'neutral':
      return <line x1={cx - 16} y1={my} x2={cx + 16} y2={my} stroke="#9e6b5a" strokeWidth="2.5" strokeLinecap="round" />
    case 'grin':
      return (
        <g>
          <path d={`M ${cx - 22} ${my - 4} Q ${cx} ${my + 18} ${cx + 22} ${my - 4}`} fill="#8B4513" opacity="0.3" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
          {/* Teeth */}
          <path d={`M ${cx - 16} ${my - 1} Q ${cx} ${my + 6} ${cx + 16} ${my - 1}`} fill="white" opacity="0.9" />
          <line x1={cx} y1={my - 1} x2={cx} y2={my + 4} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        </g>
      )
    case 'serious':
      return <path d={`M ${cx - 16} ${my + 2} Q ${cx} ${my - 3} ${cx + 16} ${my + 2}`} fill="none" stroke="#9e6b5a" strokeWidth="2.5" strokeLinecap="round" />
    default: // smile
      return (
        <g>
          <path d={`M ${cx - 18} ${my - 2} Q ${cx} ${my + 14} ${cx + 18} ${my - 2}`} fill="none" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lip color hint */}
          <path d={`M ${cx - 14} ${my} Q ${cx} ${my + 10} ${cx + 14} ${my}`} fill="#c27a68" opacity="0.2" />
        </g>
      )
  }
}

function Freckles({ cx, cy }: { cx: number; cy: number }) {
  const spots = [
    { dx: -35, dy: 12 }, { dx: -28, dy: 18 }, { dx: -40, dy: 22 },
    { dx: -32, dy: 26 }, { dx: -25, dy: 14 },
    { dx: 35, dy: 12 }, { dx: 28, dy: 18 }, { dx: 40, dy: 22 },
    { dx: 32, dy: 26 }, { dx: 25, dy: 14 },
    { dx: -5, dy: 22 }, { dx: 5, dy: 24 },
  ]
  return (
    <g>
      {spots.map((s, i) => (
        <circle key={i} cx={cx + s.dx} cy={cy + s.dy} r={1.5} fill="#8B6B4F" opacity="0.35" />
      ))}
    </g>
  )
}

function Scar({ type, cx, cy, skinTone }: { type: string; cx: number; cy: number; skinTone: string }) {
  const sc = darken(skinTone, 25)
  switch (type) {
    case 'eyebrow':
      return (
        <g>
          <line x1={cx - 35} y1={cy - 28} x2={cx - 25} y2={cy - 18} stroke={sc} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1={cx - 34} y1={cy - 26} x2={cx - 26} y2={cy - 19} stroke={lighten(skinTone, 5)} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </g>
      )
    case 'cheek':
      return (
        <g>
          <line x1={cx + 30} y1={cy + 10} x2={cx + 45} y2={cy + 22} stroke={sc} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <line x1={cx + 31} y1={cy + 12} x2={cx + 44} y2={cy + 21} stroke={lighten(skinTone, 5)} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
        </g>
      )
    case 'chin':
      return (
        <g>
          <line x1={cx - 8} y1={cy + 55} x2={cx + 8} y2={cy + 58} stroke={sc} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <line x1={cx - 6} y1={cy + 56} x2={cx + 6} y2={cy + 58} stroke={lighten(skinTone, 5)} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
        </g>
      )
    default:
      return null
  }
}

function FacialHairComp({ style, color, cx, cy, face }: { style: string; color: string; cx: number; cy: number; face: typeof FACE_DIMS['oval'] }) {
  const c = darken(color, 10)
  const my = cy + 40

  switch (style) {
    case 'stubble':
      return (
        <g opacity="0.3">
          {Array.from({ length: 45 }).map((_, i) => {
            const x = cx - 30 + (i % 8) * 8 + Math.sin(i * 7) * 3
            const y = my - 10 + Math.floor(i / 8) * 7 + Math.cos(i * 5) * 2
            return <circle key={i} cx={x} cy={y} r={0.9} fill={c} />
          })}
        </g>
      )
    case 'short_beard':
      return (
        <path d={`M ${cx - 40} ${my - 8} Q ${cx - 45} ${my + 15} ${cx - 25} ${my + 30} Q ${cx} ${my + 38} ${cx + 25} ${my + 30} Q ${cx + 45} ${my + 15} ${cx + 40} ${my - 8}`}
          fill={c} opacity="0.55" />
      )
    case 'full_beard':
      return (
        <g>
          <path d={`M ${cx - 50} ${my - 15} Q ${cx - 55} ${my + 20} ${cx - 25} ${my + 50} Q ${cx} ${my + 60} ${cx + 25} ${my + 50} Q ${cx + 55} ${my + 20} ${cx + 50} ${my - 15}`}
            fill={c} opacity="0.65" />
          <path d={`M ${cx - 20} ${my + 10} Q ${cx} ${my + 20} ${cx + 20} ${my + 10}`} fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
          <path d={`M ${cx - 15} ${my + 25} Q ${cx} ${my + 34} ${cx + 15} ${my + 25}`} fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
        </g>
      )
    case 'mustache':
      return (
        <path d={`M ${cx - 20} ${my - 10} Q ${cx - 10} ${my - 15} ${cx} ${my - 12} Q ${cx + 10} ${my - 15} ${cx + 20} ${my - 10} Q ${cx + 10} ${my - 3} ${cx} ${my - 5} Q ${cx - 10} ${my - 3} ${cx - 20} ${my - 10} Z`}
          fill={c} opacity="0.7" />
      )
    case 'goatee':
      return (
        <g>
          <path d={`M ${cx - 18} ${my - 10} Q ${cx - 8} ${my - 14} ${cx} ${my - 12} Q ${cx + 8} ${my - 14} ${cx + 18} ${my - 10} Q ${cx + 8} ${my - 4} ${cx} ${my - 6} Q ${cx - 8} ${my - 4} ${cx - 18} ${my - 10} Z`}
            fill={c} opacity="0.65" />
          <path d={`M ${cx - 12} ${my + 8} Q ${cx - 15} ${my + 30} ${cx} ${my + 38} Q ${cx + 15} ${my + 30} ${cx + 12} ${my + 8}`}
            fill={c} opacity="0.55" />
        </g>
      )
    default:
      return null
  }
}

function GlassesComp({ style, cx, cy }: { style: string; cx: number; cy: number }) {
  const ey = cy - 5
  const ex = 30
  const fc = '#2a2a2a'

  switch (style) {
    case 'round':
      return (
        <g>
          <circle cx={cx - ex} cy={ey} r={20} fill="none" stroke={fc} strokeWidth="3" />
          <circle cx={cx + ex} cy={ey} r={20} fill="none" stroke={fc} strokeWidth="3" />
          <line x1={cx - ex + 20} y1={ey} x2={cx + ex - 20} y2={ey} stroke={fc} strokeWidth="2.5" />
          <line x1={cx - ex - 20} y1={ey - 2} x2={cx - ex - 30} y2={ey - 6} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + ex + 20} y1={ey - 2} x2={cx + ex + 30} y2={ey - 6} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx={cx - ex - 5} cy={ey - 5} rx={8} ry={5} fill="rgba(150,200,255,0.08)" />
          <ellipse cx={cx + ex - 5} cy={ey - 5} rx={8} ry={5} fill="rgba(150,200,255,0.08)" />
        </g>
      )
    case 'square':
      return (
        <g>
          <rect x={cx - ex - 20} y={ey - 16} width={40} height={30} rx={5} fill="none" stroke={fc} strokeWidth="3" />
          <rect x={cx + ex - 20} y={ey - 16} width={40} height={30} rx={5} fill="none" stroke={fc} strokeWidth="3" />
          <line x1={cx - ex + 20} y1={ey} x2={cx + ex - 20} y2={ey} stroke={fc} strokeWidth="2.5" />
          <line x1={cx - ex - 20} y1={ey - 4} x2={cx - ex - 30} y2={ey - 8} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + ex + 20} y1={ey - 4} x2={cx + ex + 30} y2={ey - 8} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
    case 'sport':
      return (
        <g>
          <path d={`M ${cx - ex - 24} ${ey} Q ${cx - ex - 24} ${ey - 16} ${cx - ex} ${ey - 16} Q ${cx - 5} ${ey - 16} ${cx - 5} ${ey} Q ${cx - 5} ${ey + 14} ${cx - ex} ${ey + 14} Q ${cx - ex - 24} ${ey + 14} ${cx - ex - 24} ${ey} Z`}
            fill="rgba(150,200,255,0.12)" stroke={fc} strokeWidth="2.5" />
          <path d={`M ${cx + ex + 24} ${ey} Q ${cx + ex + 24} ${ey - 16} ${cx + ex} ${ey - 16} Q ${cx + 5} ${ey - 16} ${cx + 5} ${ey} Q ${cx + 5} ${ey + 14} ${cx + ex} ${ey + 14} Q ${cx + ex + 24} ${ey + 14} ${cx + ex + 24} ${ey} Z`}
            fill="rgba(150,200,255,0.12)" stroke={fc} strokeWidth="2.5" />
          <line x1={cx - 5} y1={ey} x2={cx + 5} y2={ey} stroke={fc} strokeWidth="3" />
        </g>
      )
    default:
      return null
  }
}

function HairComp({ style, color, cx, cy, face }: { style: string; color: string; cx: number; cy: number; face: typeof FACE_DIMS['oval'] }) {
  const lt = lighten(color, 15)
  const topY = cy - face.ry

  switch (style) {
    case 'short':
      return (
        <g>
          <path d={`M ${cx - face.rx - 3} ${cy - 10} Q ${cx - face.rx - 6} ${topY - 15} ${cx} ${topY - 20} Q ${cx + face.rx + 6} ${topY - 15} ${cx + face.rx + 3} ${cy - 10} Q ${cx + face.rx - 10} ${topY + 10} ${cx} ${topY + 5} Q ${cx - face.rx + 10} ${topY + 10} ${cx - face.rx - 3} ${cy - 10} Z`}
            fill={color} />
          {/* Hair volume highlight */}
          <ellipse cx={cx - 10} cy={topY - 5} rx={25} ry={10} fill={lt} opacity="0.12" />
        </g>
      )
    case 'buzz':
      return (
        <path d={`M ${cx - face.rx} ${cy - 5} Q ${cx - face.rx - 3} ${topY - 8} ${cx} ${topY - 12} Q ${cx + face.rx + 3} ${topY - 8} ${cx + face.rx} ${cy - 5} Q ${cx + face.rx - 12} ${topY + 8} ${cx} ${topY + 5} Q ${cx - face.rx + 12} ${topY + 8} ${cx - face.rx} ${cy - 5} Z`}
          fill={color} opacity="0.6" />
      )
    case 'medium':
      return (
        <g>
          <path d={`M ${cx - face.rx - 8} ${cy} Q ${cx - face.rx - 12} ${topY - 20} ${cx} ${topY - 25} Q ${cx + face.rx + 12} ${topY - 20} ${cx + face.rx + 8} ${cy} Q ${cx + face.rx - 5} ${topY + 5} ${cx} ${topY} Q ${cx - face.rx + 5} ${topY + 5} ${cx - face.rx - 8} ${cy} Z`}
            fill={color} />
          {/* Side hair */}
          <path d={`M ${cx - face.rx - 6} ${cy} Q ${cx - face.rx - 18} ${cy + 15} ${cx - face.rx - 12} ${cy + 50}`} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
          <path d={`M ${cx + face.rx + 6} ${cy} Q ${cx + face.rx + 18} ${cy + 15} ${cx + face.rx + 12} ${cy + 50}`} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
          <ellipse cx={cx - 8} cy={topY - 8} rx={30} ry={12} fill={lt} opacity="0.1" />
        </g>
      )
    case 'long':
      return (
        <g>
          <path d={`M ${cx - face.rx - 10} ${cy + 10} Q ${cx - face.rx - 15} ${topY - 25} ${cx} ${topY - 30} Q ${cx + face.rx + 15} ${topY - 25} ${cx + face.rx + 10} ${cy + 10} Q ${cx + face.rx} ${topY} ${cx} ${topY - 5} Q ${cx - face.rx} ${topY} ${cx - face.rx - 10} ${cy + 10} Z`}
            fill={color} />
          <path d={`M ${cx - face.rx - 8} ${cy + 10} Q ${cx - face.rx - 22} ${cy + 40} ${cx - face.rx - 14} ${cy + 100}`} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
          <path d={`M ${cx + face.rx + 8} ${cy + 10} Q ${cx + face.rx + 22} ${cy + 40} ${cx + face.rx + 14} ${cy + 100}`} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
        </g>
      )
    case 'bun':
      return (
        <g>
          <path d={`M ${cx - face.rx - 3} ${cy - 10} Q ${cx - face.rx - 6} ${topY - 15} ${cx} ${topY - 20} Q ${cx + face.rx + 6} ${topY - 15} ${cx + face.rx + 3} ${cy - 10} Q ${cx + face.rx - 10} ${topY + 10} ${cx} ${topY + 5} Q ${cx - face.rx + 10} ${topY + 10} ${cx - face.rx - 3} ${cy - 10} Z`}
            fill={color} />
          <ellipse cx={cx} cy={topY - 18} rx={28} ry={22} fill={color} />
          <ellipse cx={cx - 5} cy={topY - 22} rx={14} ry={10} fill={lt} opacity="0.1" />
        </g>
      )
    case 'curly':
      return (
        <g>
          <path d={`M ${cx - face.rx - 10} ${cy + 5} Q ${cx - face.rx - 14} ${topY - 20} ${cx} ${topY - 25} Q ${cx + face.rx + 14} ${topY - 20} ${cx + face.rx + 10} ${cy + 5} Q ${cx + face.rx} ${topY + 5} ${cx} ${topY} Q ${cx - face.rx} ${topY + 5} ${cx - face.rx - 10} ${cy + 5} Z`}
            fill={color} />
          {/* Curly volume puffs */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2
            const puffCx = cx + Math.cos(angle) * (face.rx - 5)
            const puffCy = cy - 30 + Math.sin(angle) * 40
            return <circle key={i} cx={puffCx} cy={puffCy} r={12} fill={color} />
          })}
        </g>
      )
    case 'mohawk':
      return (
        <path d={`M ${cx - 15} ${topY + 15} Q ${cx - 18} ${topY - 40} ${cx} ${topY - 55} Q ${cx + 18} ${topY - 40} ${cx + 15} ${topY + 15} Q ${cx + 10} ${topY - 20} ${cx} ${topY - 25} Q ${cx - 10} ${topY - 20} ${cx - 15} ${topY + 15} Z`}
          fill={color} />
      )
    case 'ponytail':
      return (
        <g>
          <path d={`M ${cx - face.rx - 3} ${cy - 10} Q ${cx - face.rx - 6} ${topY - 15} ${cx} ${topY - 20} Q ${cx + face.rx + 6} ${topY - 15} ${cx + face.rx + 3} ${cy - 10} Q ${cx + face.rx - 10} ${topY + 10} ${cx} ${topY + 5} Q ${cx - face.rx + 10} ${topY + 10} ${cx - face.rx - 3} ${cy - 10} Z`}
            fill={color} />
          <ellipse cx={cx} cy={topY + 5} rx={16} ry={12} fill={color} />
          <path d={`M ${cx} ${topY + 17} Q ${cx + 5} ${cy + 20} ${cx + 3} ${cy + 60}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
        </g>
      )
    case 'braids':
      return (
        <g>
          <path d={`M ${cx - face.rx - 5} ${cy} Q ${cx - face.rx - 8} ${topY - 18} ${cx} ${topY - 22} Q ${cx + face.rx + 8} ${topY - 18} ${cx + face.rx + 5} ${cy} Q ${cx + face.rx - 5} ${topY + 5} ${cx} ${topY} Q ${cx - face.rx + 5} ${topY + 5} ${cx - face.rx - 5} ${cy} Z`}
            fill={color} />
          <path d={`M ${cx - face.rx + 2} ${cy + 5} Q ${cx - face.rx - 12} ${cy + 35} ${cx - face.rx - 6} ${cy + 85}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
          <path d={`M ${cx + face.rx - 2} ${cy + 5} Q ${cx + face.rx + 12} ${cy + 35} ${cx + face.rx + 6} ${cy + 85}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
          {/* Braid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i}>
              <line x1={cx - face.rx - 10} y1={cy + 15 + i * 16} x2={cx - face.rx} y2={cy + 15 + i * 16} stroke={lt} strokeWidth="1" opacity="0.25" />
              <line x1={cx + face.rx} y1={cy + 15 + i * 16} x2={cx + face.rx + 10} y2={cy + 15 + i * 16} stroke={lt} strokeWidth="1" opacity="0.25" />
            </g>
          ))}
        </g>
      )
    default:
      return null
  }
}

// === COLOR UTILS ===

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}
