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
      {/* Left foot */}
      <ellipse cx={163} cy={812} rx={30} ry={15} fill="#2d2d3e" />
      <ellipse cx={160} cy={809} rx={26} ry={12} fill="#374151" />
      <ellipse cx={158} cy={806} rx={18} ry={7} fill="rgba(255,255,255,0.06)" />
      {/* Toe cap */}
      <path d="M 135 812 Q 140 805 150 804" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Right foot */}
      <ellipse cx={237} cy={812} rx={30} ry={15} fill="#2d2d3e" />
      <ellipse cx={240} cy={809} rx={26} ry={12} fill="#374151" />
      <ellipse cx={242} cy={806} rx={18} ry={7} fill="rgba(255,255,255,0.06)" />
      <path d="M 265 812 Q 260 805 250 804" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

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
      <ellipse cx={cx - 48} cy={hcy + 22} rx={16} ry={10} fill="#e8a090" opacity="0.18" />
      <ellipse cx={cx + 48} cy={hcy + 22} rx={16} ry={10} fill="#e8a090" opacity="0.18" />
      {/* Face highlight — forehead sheen */}
      <ellipse cx={cx - 12} cy={hcy - 38} rx={32} ry={20} fill="white" opacity="0.07" />
      {/* Chin highlight */}
      <ellipse cx={cx} cy={hcy + face.ry - 15} rx={18} ry={8} fill="white" opacity="0.04" />

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
          {/* Gi pants — wider, looser fit */}
          <rect x={lx - 4} y={545} width={hw + 12} height={250} rx={18} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          <rect x={rx - 4} y={545} width={hw + 12} height={250} rx={18} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          {/* Drawstring at waist */}
          <path d={`M ${192} ${550} Q ${194} ${560} ${190} ${572}`} fill="none" stroke={outfit.accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M ${208} ${550} Q ${206} ${560} ${210} ${572}`} fill="none" stroke={outfit.accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          {/* Drawstring tips */}
          <circle cx={190} cy={574} r={2} fill={outfit.accent} opacity="0.4" />
          <circle cx={210} cy={574} r={2} fill={outfit.accent} opacity="0.4" />
          {/* Gi pant creases — fabric fold lines */}
          <path d={`M ${lx + 6} ${600} Q ${lx + 14} ${660} ${lx + 4} ${720}`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.3" />
          <path d={`M ${lx + hw + 2} ${605} Q ${lx + hw - 4} ${660} ${lx + hw + 4} ${710}`} fill="none" stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
          <path d={`M ${rx + 2} ${605} Q ${rx + 8} ${660} ${rx} ${710}`} fill="none" stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
          <path d={`M ${rx + hw + 2} ${600} Q ${rx + hw - 6} ${660} ${rx + hw + 4} ${720}`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.3" />
          {/* Knee crease — bunching of fabric */}
          <path d={`M ${lx + 2} ${642} Q ${lx + hw / 2 + 2} ${652} ${lx + hw + 6} ${642}`} fill="none" stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
          <path d={`M ${lx + 4} ${648} Q ${lx + hw / 2} ${655} ${lx + hw + 4} ${648}`} fill="none" stroke={outfit.accent} strokeWidth="0.5" opacity="0.15" />
          <path d={`M ${rx + 2} ${642} Q ${rx + hw / 2 + 2} ${652} ${rx + hw + 6} ${642}`} fill="none" stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
          {/* Thick reinforced cuffs at ankles */}
          <rect x={lx - 3} y={778} width={hw + 10} height={14} rx={5} fill={outfit.accent} opacity="0.25" />
          <rect x={rx - 3} y={778} width={hw + 10} height={14} rx={5} fill={outfit.accent} opacity="0.25" />
          {/* Cuff edge */}
          <line x1={lx - 1} y1={791} x2={lx + hw + 5} y2={791} stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
          <line x1={rx - 1} y1={791} x2={rx + hw + 5} y2={791} stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
          {/* Pearl weave texture on pants */}
          {[580, 610, 640, 670, 700, 730, 760].map(y => (
            <g key={y}>
              <line x1={lx + 4} y1={y} x2={lx + hw + 4} y2={y} stroke={outfit.accent} strokeWidth="0.3" opacity="0.08" />
              <line x1={rx + 4} y1={y} x2={rx + hw + 4} y2={y} stroke={outfit.accent} strokeWidth="0.3" opacity="0.08" />
            </g>
          ))}
        </>
      ) : (
        <>
          {/* Shorts — with drawstring and side vents */}
          <rect x={lx - 2} y={545} width={hw + 8} height={105} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          <rect x={rx - 2} y={545} width={hw + 8} height={105} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          {/* Drawstring */}
          <path d={`M ${195} ${550} Q ${197} ${558} ${194} ${565}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M ${205} ${550} Q ${203} ${558} ${206} ${565}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Side vent detail */}
          <line x1={lx - 1} y1={635} x2={lx + 3} y2={645} stroke={outfit.dark} strokeWidth="1" opacity="0.3" />
          <line x1={rx + hw + 5} y1={635} x2={rx + hw + 1} y2={645} stroke={outfit.dark} strokeWidth="1" opacity="0.3" />
          {/* Bare legs */}
          <rect x={lx + 2} y={645} width={hw} height={150} rx={14} fill={skinTone} />
          <rect x={rx + 2} y={645} width={hw} height={150} rx={14} fill={skinTone} />
          {/* Leg muscle — quad definition */}
          <path d={`M ${lx + 6} ${665} Q ${lx + hw / 2} ${685} ${lx + hw - 2} ${665}`} fill="none" stroke={darken(skinTone, 12)} strokeWidth="1" opacity="0.25" />
          <path d={`M ${rx + 6} ${665} Q ${rx + hw / 2} ${685} ${rx + hw - 2} ${665}`} fill="none" stroke={darken(skinTone, 12)} strokeWidth="1" opacity="0.25" />
          {/* Calf shape */}
          <path d={`M ${lx + 4} ${730} Q ${lx + hw / 2} ${745} ${lx + hw} ${730}`} fill="none" stroke={darken(skinTone, 8)} strokeWidth="0.8" opacity="0.2" />
          <path d={`M ${rx + 4} ${730} Q ${rx + hw / 2} ${745} ${rx + hw} ${730}`} fill="none" stroke={darken(skinTone, 8)} strokeWidth="0.8" opacity="0.2" />
          {/* Shin highlight */}
          <line x1={lx + hw / 2 + 1} y1={665} x2={lx + hw / 2 + 1} y2={775} stroke={lighten(skinTone, 10)} strokeWidth="2" opacity="0.08" strokeLinecap="round" />
          <line x1={rx + hw / 2 + 1} y1={665} x2={rx + hw / 2 + 1} y2={775} stroke={lighten(skinTone, 10)} strokeWidth="2" opacity="0.08" strokeLinecap="round" />
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
      {/* Torso - tapered shape */}
      <path d={`M ${200 - sw} 310 Q ${200 - sw - 5} 380 ${200 - hw} 550 L ${200 + hw} 550 Q ${200 + sw + 5} 380 ${200 + sw} 310 Z`}
        fill="url(#og)" stroke={outfit.accent} strokeWidth="1" />

      {/* Shoulder roundness */}
      <ellipse cx={200 - sw + 5} cy={315} rx={20} ry={12} fill={outfit.main} />
      <ellipse cx={200 + sw - 5} cy={315} rx={20} ry={12} fill={outfit.main} />

      {isGi ? (
        <>
          {/* === GI JACKET === */}
          {/* Exposed chest/skin in V-opening */}
          <path d="M 176 308 L 200 400 L 224 308 Z" fill="url(#sg)" />

          {/* Right lapel (underneath — goes from right shoulder to center) */}
          <path d="M 218 306 L 218 308 L 196 410 L 208 415 L 228 310 Z" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          {/* Right lapel fabric shadow */}
          <path d="M 216 312 L 198 405 L 204 408" fill="none" stroke={outfit.dark} strokeWidth="1.2" opacity="0.15" />

          {/* Left lapel (on top — overlaps right, traditional left-over-right) */}
          <path d="M 182 306 L 172 308 L 204 420 L 192 415 Z" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          {/* Left lapel highlight — raised edge */}
          <path d="M 178 310 L 200 415" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          {/* Left lapel shadow — depth */}
          <path d="M 184 312 L 204 410" fill="none" stroke={outfit.dark} strokeWidth="1.5" opacity="0.12" />

          {/* Thick collar wrapping around neck */}
          <path d={`M 165 305 Q 170 290 185 285 Q 200 282 215 285 Q 230 290 235 305`}
            fill={outfit.main} stroke={outfit.accent} strokeWidth="1.5" />
          {/* Collar inner edge */}
          <path d={`M 172 303 Q 180 293 200 290 Q 220 293 228 303`}
            fill="none" stroke={outfit.dark} strokeWidth="1.5" opacity="0.2" />
          {/* Collar thickness — top fold */}
          <path d={`M 165 305 Q 170 298 185 294 Q 200 291 215 294 Q 230 298 235 305`}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

          {/* Gi fabric weave texture — pearl weave pattern */}
          {[400, 420, 440, 460, 480, 500, 520].map(y => (
            <g key={y}>
              <line x1={200 - tw + 10} y1={y} x2={200 + tw - 10} y2={y} stroke={outfit.accent} strokeWidth="0.4" opacity="0.1" />
              <line x1={200 - tw + 10} y1={y + 10} x2={200 + tw - 10} y2={y + 10} stroke={outfit.accent} strokeWidth="0.3" opacity="0.06" strokeDasharray="4,6" />
            </g>
          ))}

          {/* Center closure line (where lapels meet below belt) */}
          <line x1={200} y1={420} x2={200} y2={540} stroke={outfit.accent} strokeWidth="1" opacity="0.2" />

          {/* Shoulder seam lines */}
          <path d={`M ${200 - sw + 12} 312 L ${200 - sw + 14} 340`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.25" />
          <path d={`M ${200 + sw - 12} 312 L ${200 + sw - 14} 340`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.25" />

          {/* Stitching along lapel edges — reinforcement stitching */}
          <path d="M 175 310 L 201 412" fill="none" stroke={outfit.accent} strokeWidth="0.6" strokeDasharray="2,3" opacity="0.25" />
          <path d="M 225 310 L 199 412" fill="none" stroke={outfit.accent} strokeWidth="0.6" strokeDasharray="2,3" opacity="0.2" />

          {/* Back of gi hint — collar shadow on body */}
          <ellipse cx={200} cy={318} rx={30} ry={8} fill={outfit.dark} opacity="0.08" />
        </>
      ) : (
        <>
          {/* === RASHGUARD === */}
          {/* Neckline — rounded */}
          <path d="M 172 310 Q 200 328 228 310" fill="none" stroke={outfit.accent} strokeWidth="2.5" />
          {/* Side panel stripes */}
          <path d={`M ${200 - sw + 3} 315 L ${200 - hw + 3} 545`} fill="none" stroke={outfit.dark} strokeWidth="6" opacity="0.35" />
          <path d={`M ${200 + sw - 3} 315 L ${200 + hw - 3} 545`} fill="none" stroke={outfit.dark} strokeWidth="6" opacity="0.35" />
          {/* Inner accent stripe */}
          <path d={`M ${200 - sw + 8} 318 L ${200 - hw + 8} 543`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <path d={`M ${200 + sw - 8} 318 L ${200 + hw - 8} 543`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          {/* Center logo placeholder */}
          <rect x={187} y={365} width={26} height={26} rx={4} fill={outfit.dark} opacity="0.3" />
          <line x1={193} y1={378} x2={207} y2={378} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          {/* Sublimation pattern */}
          {[395, 425, 455, 485, 515].map(y => (
            <line key={y} x1={200 - tw + 12} y1={y} x2={200 + tw - 12} y2={y} stroke={outfit.dark} strokeWidth="0.8" strokeDasharray="6,5" opacity="0.18" />
          ))}
        </>
      )}

      {/* Academy patch — on chest for gi, on shoulder for nogi */}
      {academyColor && (
        <g>
          {isGi ? (
            <>
              {/* Gi chest patch — left side */}
              <rect x={210} y={380} width={42} height={28} rx={4} fill={academyColor} opacity="0.85" />
              <rect x={210} y={380} width={42} height={28} rx={4} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              {/* Patch stitching */}
              <rect x={212} y={382} width={38} height={24} rx={3} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,2" />
            </>
          ) : (
            <>
              <rect x={175} y={390} width={50} height={30} rx={5} fill={academyColor} opacity="0.85" />
              <rect x={175} y={390} width={50} height={30} rx={5} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            </>
          )}
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
  const lx = 200 - sw - armW + 5  // left sleeve x
  const rx = 200 + sw - 5          // right sleeve x

  return (
    <g>
      {/* Upper arms (sleeves) */}
      <rect x={lx} y={310} width={armW} height={isGi ? 140 : 130} rx={16}
        fill={outfit.main} stroke={isGi ? outfit.accent : 'none'} strokeWidth={isGi ? 1 : 0} />
      <rect x={rx} y={310} width={armW} height={isGi ? 140 : 130} rx={16}
        fill={outfit.main} stroke={isGi ? outfit.accent : 'none'} strokeWidth={isGi ? 1 : 0} />

      {isGi ? (
        <>
          {/* Gi sleeve is wider and longer — thick fabric look */}
          {/* Sleeve widening at cuff (flared) */}
          <path d={`M ${lx - 2} 420 Q ${lx + armW / 2} 458 ${lx + armW + 2} 420`}
            fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          <path d={`M ${rx - 2} 420 Q ${rx + armW / 2} 458 ${rx + armW + 2} 420`}
            fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          {/* Thick sleeve cuff — reinforced hem */}
          <rect x={lx - 2} y={440} width={armW + 4} height={14} rx={6} fill={outfit.accent} opacity="0.35" />
          <rect x={rx - 2} y={440} width={armW + 4} height={14} rx={6} fill={outfit.accent} opacity="0.35" />
          {/* Cuff edge line */}
          <line x1={lx} y1={453} x2={lx + armW} y2={453} stroke={outfit.accent} strokeWidth="1" opacity="0.3" />
          <line x1={rx} y1={453} x2={rx + armW} y2={453} stroke={outfit.accent} strokeWidth="1" opacity="0.3" />
          {/* Sleeve crease lines — fabric folds */}
          <path d={`M ${lx + 8} 340 Q ${lx + 12} 380 ${lx + 6} 430`} fill="none" stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
          <path d={`M ${rx + armW - 8} 340 Q ${rx + armW - 12} 380 ${rx + armW - 6} 430`} fill="none" stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
          {/* Shoulder seam on sleeve */}
          <line x1={lx + armW / 2} y1={310} x2={lx + armW / 2} y2={325} stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
          <line x1={rx + armW / 2} y1={310} x2={rx + armW / 2} y2={325} stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
        </>
      ) : (
        <>
          {/* Nogi sleeve end — tight fit */}
          <rect x={lx + 1} y={430} width={armW - 2} height={8} rx={4} fill={outfit.dark} opacity="0.3" />
          <rect x={rx + 1} y={430} width={armW - 2} height={8} rx={4} fill={outfit.dark} opacity="0.3" />
        </>
      )}

      {/* Forearms (skin) */}
      <rect x={lx + 4} y={isGi ? 452 : 435} width={armW - 8} height={isGi ? 65 : 80} rx={12} fill={skinTone} />
      <rect x={rx + 4} y={isGi ? 452 : 435} width={armW - 8} height={isGi ? 65 : 80} rx={12} fill={skinTone} />
      {/* Forearm muscle highlight */}
      <ellipse cx={lx + armW / 2 + 1} cy={isGi ? 470 : 460} rx={8} ry={14} fill="rgba(255,255,255,0.04)" />
      <ellipse cx={rx + armW / 2 - 1} cy={isGi ? 470 : 460} rx={8} ry={14} fill="rgba(255,255,255,0.04)" />

      {/* Hands */}
      <HandComp x={lx + armW / 2 + 1} y={isGi ? 520 : 518} skinTone={skinTone} fingerTape={fingerTape} mirror={false} />
      <HandComp x={rx + armW / 2 - 1} y={isGi ? 520 : 518} skinTone={skinTone} fingerTape={fingerTape} mirror={true} />
    </g>
  )
}

function HandComp({ x, y, skinTone, fingerTape, mirror }: { x: number; y: number; skinTone: string; fingerTape?: boolean; mirror: boolean }) {
  const dir = mirror ? -1 : 1
  const sd = darken(skinTone, 10)

  // Finger positions (4 fingers fanning from palm)
  const fingers = [
    { dx: -dir * 10, dy: 10, len: 16, w: 5.5 },
    { dx: -dir * 4,  dy: 12, len: 18, w: 5.5 },
    { dx: dir * 2,   dy: 12, len: 17, w: 5.5 },
    { dx: dir * 8,   dy: 10, len: 14, w: 5 },
  ]

  return (
    <g>
      {/* Palm */}
      <ellipse cx={x} cy={y} rx={16} ry={13} fill={skinTone} />
      {/* Palm crease */}
      <path d={`M ${x - 8} ${y - 2} Q ${x} ${y + 4} ${x + 8} ${y - 2}`} fill="none" stroke={sd} strokeWidth="0.6" opacity="0.2" />

      {/* Thumb */}
      <ellipse cx={x + dir * 16} cy={y - 5} rx={5} ry={8} fill={skinTone} transform={`rotate(${mirror ? 20 : -20}, ${x + dir * 16}, ${y - 5})`} />
      <ellipse cx={x + dir * 16} cy={y - 10} rx={4} ry={4} fill={skinTone} />

      {/* Fingers */}
      {fingers.map((f, i) => (
        <g key={i}>
          <line x1={x + f.dx} y1={y + f.dy - 2} x2={x + f.dx} y2={y + f.dy + f.len}
            stroke={skinTone} strokeWidth={f.w} strokeLinecap="round" />
          {/* Knuckle line */}
          <line x1={x + f.dx - f.w * 0.35} y1={y + f.dy + f.len * 0.45} x2={x + f.dx + f.w * 0.35} y2={y + f.dy + f.len * 0.45}
            stroke={sd} strokeWidth="0.5" opacity="0.25" />
        </g>
      ))}

      {/* Finger tape */}
      {fingerTape && (
        <>
          {/* Tape on index and middle finger */}
          <rect x={x + fingers[0].dx - 3.5} y={y + fingers[0].dy + 4} width={7} height={8} rx={2.5} fill="white" opacity="0.9" />
          <rect x={x + fingers[1].dx - 3.5} y={y + fingers[1].dy + 5} width={7} height={8} rx={2.5} fill="white" opacity="0.9" />
          {/* Tape edge lines */}
          <line x1={x + fingers[0].dx - 2} y1={y + fingers[0].dy + 8} x2={x + fingers[0].dx + 2} y2={y + fingers[0].dy + 8} stroke="#d4d4d4" strokeWidth="0.5" />
          <line x1={x + fingers[1].dx - 2} y1={y + fingers[1].dy + 9} x2={x + fingers[1].dx + 2} y2={y + fingers[1].dy + 9} stroke="#d4d4d4" strokeWidth="0.5" />
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

  // Larger eye dimensions for Bitmoji expressiveness
  const dims = {
    default: { rx: 18, ry: 14, irisR: 11 },
    round:   { rx: 18, ry: 17, irisR: 12 },
    almond:  { rx: 21, ry: 11, irisR: 10 },
    narrow:  { rx: 20, ry: 9,  irisR: 8 },
  }[shape]

  const ex = 32 // eye distance from center
  const ey = cy - 5

  return (
    <g>
      {[cx - ex, cx + ex].map((eyeX, i) => (
        <g key={i}>
          {/* Eye white with subtle gradient */}
          <ellipse cx={eyeX} cy={ey} rx={dims.rx} ry={dims.ry} fill="white" />
          <ellipse cx={eyeX} cy={ey + dims.ry * 0.3} rx={dims.rx - 1} ry={dims.ry * 0.5} fill="#f0f0f0" opacity="0.3" />
          {/* Upper eyelid line — thicker, more defined */}
          <path d={`M ${eyeX - dims.rx} ${ey} Q ${eyeX} ${ey - dims.ry - 3} ${eyeX + dims.rx} ${ey}`}
            fill="none" stroke={darken(config.skinTone, 35)} strokeWidth="2.5" strokeLinecap="round" />
          {/* Iris — larger, richer */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR} fill={eyeColor} />
          {/* Iris outer ring — darker */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR} fill="none" stroke={darken(eyeColor, 30)} strokeWidth="1.5" />
          {/* Iris inner ring — lighter accent */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR * 0.65} fill="none" stroke={lighten(eyeColor, 20)} strokeWidth="0.8" opacity="0.5" />
          {/* Iris radial lines — more detail */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => {
            const rad = angle * Math.PI / 180
            const ir = dims.irisR * 0.35
            const or = dims.irisR * 0.92
            return (
              <line key={angle}
                x1={eyeX + Math.cos(rad) * ir} y1={ey + 1 + Math.sin(rad) * ir}
                x2={eyeX + Math.cos(rad) * or} y2={ey + 1 + Math.sin(rad) * or}
                stroke={lighten(eyeColor, 18)} strokeWidth="0.6" opacity="0.35"
              />
            )
          })}
          {/* Pupil — larger */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR * 0.38} fill="#0a0a0a" />
          {/* Big highlight — signature Bitmoji sparkle */}
          <circle cx={eyeX + 4} cy={ey - 3} r={4} fill="white" opacity="0.9" />
          {/* Secondary highlight */}
          <circle cx={eyeX - 3} cy={ey + 4} r={2} fill="white" opacity="0.5" />
          {/* Tiny extra sparkle */}
          <circle cx={eyeX + 6} cy={ey - 1} r={1.2} fill="white" opacity="0.6" />
          {/* Lower eyelid */}
          <path d={`M ${eyeX - dims.rx + 3} ${ey + dims.ry - 2} Q ${eyeX} ${ey + dims.ry + 2} ${eyeX + dims.rx - 3} ${ey + dims.ry - 2}`}
            fill="none" stroke={darken(config.skinTone, 15)} strokeWidth="1" opacity="0.35" />
          {/* Eyelashes (female) — more lashes, thicker */}
          {config.gender === 'female' && (
            <>
              <line x1={eyeX - dims.rx + 1} y1={ey - dims.ry + 4} x2={eyeX - dims.rx - 3} y2={ey - dims.ry - 1} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={eyeX - dims.rx + 7} y1={ey - dims.ry + 1} x2={eyeX - dims.rx + 5} y2={ey - dims.ry - 4} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={eyeX} y1={ey - dims.ry} x2={eyeX} y2={ey - dims.ry - 4} stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
              <line x1={eyeX + dims.rx - 7} y1={ey - dims.ry + 1} x2={eyeX + dims.rx - 5} y2={ey - dims.ry - 4} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={eyeX + dims.rx - 1} y1={ey - dims.ry + 4} x2={eyeX + dims.rx + 3} y2={ey - dims.ry - 1} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </g>
      ))}
    </g>
  )
}

function EyebrowsComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const style = config.eyebrowStyle ?? 'normal'
  const w = style === 'thick' ? 4.5 : style === 'thin' ? 2 : 3.2
  const ey = cy - 28
  const ex = 32

  if (style === 'arched') {
    return (
      <g>
        <path d={`M ${cx - ex - 16} ${ey + 4} Q ${cx - ex - 2} ${ey - 10} ${cx - ex + 16} ${ey + 2}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${cx + ex - 16} ${ey + 2} Q ${cx + ex + 2} ${ey - 10} ${cx + ex + 16} ${ey + 4}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      </g>
    )
  }

  if (style === 'thick') {
    return (
      <g>
        <path d={`M ${cx - ex - 16} ${ey + 3} Q ${cx - ex} ${ey - 4} ${cx - ex + 16} ${ey}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${cx - ex - 16} ${ey + 5} Q ${cx - ex} ${ey - 2} ${cx - ex + 16} ${ey + 2}`} fill="none" stroke={config.hairColor} strokeWidth={1.5} strokeLinecap="round" opacity="0.3" />
        <path d={`M ${cx + ex - 16} ${ey} Q ${cx + ex} ${ey - 4} ${cx + ex + 16} ${ey + 3}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${cx + ex - 16} ${ey + 2} Q ${cx + ex} ${ey - 2} ${cx + ex + 16} ${ey + 5}`} fill="none" stroke={config.hairColor} strokeWidth={1.5} strokeLinecap="round" opacity="0.3" />
      </g>
    )
  }

  return (
    <g>
      <path d={`M ${cx - ex - 16} ${ey + 3} Q ${cx - ex} ${ey - 3} ${cx - ex + 16} ${ey}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${cx + ex - 16} ${ey} Q ${cx + ex} ${ey - 3} ${cx + ex + 16} ${ey + 3}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
    </g>
  )
}

function NoseComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const ny = cy + 18
  const sd = darken(config.skinTone, 20)
  const sl = darken(config.skinTone, 8)
  const hl = lighten(config.skinTone, 8)

  switch (config.noseShape ?? 'default') {
    case 'small':
      return (
        <g>
          <path d={`M ${cx - 5} ${ny - 6} Q ${cx} ${ny + 6} ${cx + 5} ${ny - 6}`} fill="none" stroke={sd} strokeWidth="2" strokeLinecap="round" />
          {/* Small nostrils */}
          <ellipse cx={cx - 5} cy={ny + 1} rx={3} ry={2.5} fill={sl} opacity="0.5" />
          <ellipse cx={cx + 5} cy={ny + 1} rx={3} ry={2.5} fill={sl} opacity="0.5" />
          {/* Nose bridge highlight */}
          <line x1={cx} y1={ny - 8} x2={cx} y2={ny - 2} stroke={hl} strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
        </g>
      )
    case 'wide':
      return (
        <g>
          {/* Bridge */}
          <path d={`M ${cx - 4} ${ny - 14} Q ${cx} ${ny - 4} ${cx + 4} ${ny - 14}`} fill="none" stroke={sd} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
          {/* Nose outline */}
          <path d={`M ${cx - 8} ${ny - 10} Q ${cx} ${ny + 8} ${cx + 8} ${ny - 10}`} fill="none" stroke={sd} strokeWidth="2.2" strokeLinecap="round" />
          {/* Wide nostrils */}
          <ellipse cx={cx - 10} cy={ny + 2} rx={7} ry={5} fill={sl} />
          <ellipse cx={cx + 10} cy={ny + 2} rx={7} ry={5} fill={sl} />
          {/* Nostril inner */}
          <ellipse cx={cx - 9} cy={ny + 3} rx={3} ry={2.5} fill={sd} opacity="0.3" />
          <ellipse cx={cx + 9} cy={ny + 3} rx={3} ry={2.5} fill={sd} opacity="0.3" />
          {/* Bridge highlight */}
          <line x1={cx} y1={ny - 12} x2={cx} y2={ny - 3} stroke={hl} strokeWidth="2" opacity="0.12" strokeLinecap="round" />
        </g>
      )
    case 'pointed':
      return (
        <g>
          <path d={`M ${cx} ${ny - 16} L ${cx - 7} ${ny + 5} Q ${cx} ${ny + 9} ${cx + 7} ${ny + 5} Z`} fill={sl} stroke={sd} strokeWidth="1" />
          {/* Nostril shadows */}
          <ellipse cx={cx - 6} cy={ny + 4} rx={3} ry={2} fill={sd} opacity="0.25" />
          <ellipse cx={cx + 6} cy={ny + 4} rx={3} ry={2} fill={sd} opacity="0.25" />
          {/* Bridge highlight */}
          <line x1={cx} y1={ny - 14} x2={cx} y2={ny} stroke={hl} strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
        </g>
      )
    default:
      return (
        <g>
          {/* Nose bridge */}
          <path d={`M ${cx - 3} ${ny - 14} Q ${cx} ${ny - 2} ${cx + 3} ${ny - 14}`} fill="none" stroke={sd} strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
          {/* Nose bottom curve */}
          <path d={`M ${cx - 6} ${ny - 12} Q ${cx} ${ny + 6} ${cx + 6} ${ny - 12}`} fill="none" stroke={sd} strokeWidth="2" strokeLinecap="round" />
          {/* Nostrils */}
          <ellipse cx={cx - 8} cy={ny + 1} rx={5} ry={4} fill={sl} />
          <ellipse cx={cx + 8} cy={ny + 1} rx={5} ry={4} fill={sl} />
          {/* Nostril inner shadow */}
          <ellipse cx={cx - 7} cy={ny + 2} rx={2.5} ry={2} fill={sd} opacity="0.2" />
          <ellipse cx={cx + 7} cy={ny + 2} rx={2.5} ry={2} fill={sd} opacity="0.2" />
          {/* Bridge highlight */}
          <line x1={cx} y1={ny - 12} x2={cx} y2={ny - 3} stroke={hl} strokeWidth="2" opacity="0.12" strokeLinecap="round" />
        </g>
      )
  }
}

function MouthComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const my = cy + 45
  const isFemale = config.gender === 'female'
  const lipColor = isFemale ? '#c27068' : '#9e6b5a'
  const lipDark = darken(lipColor, 15)

  switch (config.mouthStyle ?? 'smile') {
    case 'neutral':
      return (
        <g>
          <line x1={cx - 20} y1={my} x2={cx + 20} y2={my} stroke={lipDark} strokeWidth="2.8" strokeLinecap="round" />
          {/* Upper lip shape */}
          <path d={`M ${cx - 18} ${my - 1} Q ${cx - 6} ${my - 4} ${cx} ${my - 2} Q ${cx + 6} ${my - 4} ${cx + 18} ${my - 1}`}
            fill="none" stroke={lipColor} strokeWidth="1.5" opacity="0.4" />
          {/* Lower lip hint */}
          <ellipse cx={cx} cy={my + 4} rx={12} ry={3} fill={lipColor} opacity={isFemale ? 0.25 : 0.12} />
        </g>
      )
    case 'grin':
      return (
        <g>
          {/* Mouth opening */}
          <path d={`M ${cx - 26} ${my - 4} Q ${cx} ${my + 22} ${cx + 26} ${my - 4}`} fill="#5a2d1a" stroke={lipDark} strokeWidth="2.5" strokeLinecap="round" />
          {/* Upper teeth row */}
          <path d={`M ${cx - 20} ${my - 1} L ${cx + 20} ${my - 1} L ${cx + 18} ${my + 6} Q ${cx} ${my + 10} ${cx - 18} ${my + 6} Z`} fill="white" opacity="0.92" />
          {/* Tooth lines */}
          {[-12, -4, 4, 12].map(dx => (
            <line key={dx} x1={cx + dx} y1={my - 1} x2={cx + dx} y2={my + 5} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          ))}
          {/* Tongue hint */}
          <ellipse cx={cx} cy={my + 14} rx={10} ry={5} fill="#d45a5a" opacity="0.5" />
          {/* Upper lip */}
          <path d={`M ${cx - 26} ${my - 4} Q ${cx - 8} ${my - 8} ${cx} ${my - 5} Q ${cx + 8} ${my - 8} ${cx + 26} ${my - 4}`}
            fill="none" stroke={lipColor} strokeWidth="1.5" opacity="0.5" />
        </g>
      )
    case 'serious':
      return (
        <g>
          <path d={`M ${cx - 20} ${my + 2} Q ${cx} ${my - 4} ${cx + 20} ${my + 2}`} fill="none" stroke={lipDark} strokeWidth="2.8" strokeLinecap="round" />
          {/* Lip definition */}
          <path d={`M ${cx - 16} ${my + 3} Q ${cx} ${my + 8} ${cx + 16} ${my + 3}`} fill={lipColor} opacity={isFemale ? 0.2 : 0.1} />
          {/* Chin shadow when serious */}
          <ellipse cx={cx} cy={my + 14} rx={14} ry={4} fill="rgba(0,0,0,0.04)" />
        </g>
      )
    default: // smile
      return (
        <g>
          {/* Smile curve */}
          <path d={`M ${cx - 24} ${my - 2} Q ${cx} ${my + 18} ${cx + 24} ${my - 2}`} fill="none" stroke={lipDark} strokeWidth="2.8" strokeLinecap="round" />
          {/* Upper lip — cupid's bow */}
          <path d={`M ${cx - 22} ${my - 1} Q ${cx - 7} ${my - 5} ${cx} ${my - 3} Q ${cx + 7} ${my - 5} ${cx + 22} ${my - 1}`}
            fill="none" stroke={lipColor} strokeWidth="1.5" opacity="0.5" />
          {/* Lower lip fill */}
          <path d={`M ${cx - 18} ${my + 1} Q ${cx} ${my + 14} ${cx + 18} ${my + 1}`} fill={lipColor} opacity={isFemale ? 0.25 : 0.15} />
          {/* Smile dimples */}
          <circle cx={cx - 26} cy={my} r={2} fill="rgba(0,0,0,0.06)" />
          <circle cx={cx + 26} cy={my} r={2} fill="rgba(0,0,0,0.06)" />
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
  const lt = lighten(color, 25)
  const lt2 = lighten(color, 40)
  const dk = darken(color, 20)
  const topY = cy - face.ry
  const rx = face.rx
  // Strand helper — draws a thin hair strand as a curved line
  const strand = (x1: number, y1: number, cpx: number, cpy: number, x2: number, y2: number, w = 1.5, o = 0.15) =>
    <path d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`} fill="none" stroke={lt2} strokeWidth={w} opacity={o} />

  switch (style) {
    case 'short':
      return (
        <g>
          {/* Base shape — combed to one side */}
          <path d={`M ${cx - rx - 4} ${cy - 10} Q ${cx - rx - 8} ${topY - 18} ${cx - 10} ${topY - 24} Q ${cx + 15} ${topY - 28} ${cx + rx + 6} ${topY - 12} Q ${cx + rx + 4} ${topY + 5} ${cx + rx + 2} ${cy - 12} Q ${cx + rx - 15} ${topY + 12} ${cx} ${topY + 8} Q ${cx - rx + 15} ${topY + 12} ${cx - rx - 4} ${cy - 10} Z`}
            fill={color} />
          {/* Volume layer */}
          <path d={`M ${cx - rx + 10} ${topY + 5} Q ${cx - 5} ${topY - 18} ${cx + rx - 10} ${topY - 5}`}
            fill="none" stroke={dk} strokeWidth="8" opacity="0.15" strokeLinecap="round" />
          {/* Highlight sheen */}
          <ellipse cx={cx + 8} cy={topY - 8} rx={28} ry={10} fill={lt2} opacity="0.12" />
          {/* Strand texture */}
          {strand(cx - 30, topY + 2, cx - 10, topY - 12, cx + 25, topY - 2)}
          {strand(cx - 20, topY + 6, cx, topY - 8, cx + 35, topY + 2, 1, 0.1)}
          {strand(cx - 35, topY + 10, cx - 15, topY - 4, cx + 15, topY + 8, 1, 0.08)}
        </g>
      )
    case 'buzz':
      return (
        <g>
          {/* Buzz base — thin, close to head */}
          <path d={`M ${cx - rx} ${cy - 5} Q ${cx - rx - 3} ${topY - 10} ${cx} ${topY - 14} Q ${cx + rx + 3} ${topY - 10} ${cx + rx} ${cy - 5} Q ${cx + rx - 12} ${topY + 8} ${cx} ${topY + 5} Q ${cx - rx + 12} ${topY + 8} ${cx - rx} ${cy - 5} Z`}
            fill={color} opacity="0.5" />
          {/* Stubble texture dots */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI
            const pr = rx - 15 + (i % 3) * 5
            const px = cx + Math.cos(a) * pr * 0.7
            const py = topY + 10 - Math.sin(a) * (face.ry * 0.5 + (i % 4) * 3)
            return <circle key={i} cx={px} cy={py} r={1.2} fill={color} opacity={0.3 + (i % 3) * 0.1} />
          })}
          {/* Hairline edge */}
          <path d={`M ${cx - rx + 15} ${topY + 8} Q ${cx} ${topY - 6} ${cx + rx - 15} ${topY + 8}`}
            fill="none" stroke={dk} strokeWidth="1.5" opacity="0.2" />
        </g>
      )
    case 'medium':
      return (
        <g>
          {/* Back volume */}
          <path d={`M ${cx - rx - 10} ${cy + 5} Q ${cx - rx - 14} ${topY - 22} ${cx} ${topY - 28} Q ${cx + rx + 14} ${topY - 22} ${cx + rx + 10} ${cy + 5}`}
            fill={dk} />
          {/* Main shape */}
          <path d={`M ${cx - rx - 8} ${cy} Q ${cx - rx - 12} ${topY - 20} ${cx} ${topY - 25} Q ${cx + rx + 12} ${topY - 20} ${cx + rx + 8} ${cy} Q ${cx + rx - 5} ${topY + 5} ${cx} ${topY} Q ${cx - face.rx + 5} ${topY + 5} ${cx - rx - 8} ${cy} Z`}
            fill={color} />
          {/* Side hair that frames face */}
          <path d={`M ${cx - rx - 6} ${cy - 5} Q ${cx - rx - 20} ${cy + 12} ${cx - rx - 14} ${cy + 55}`} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
          <path d={`M ${cx + rx + 6} ${cy - 5} Q ${cx + rx + 20} ${cy + 12} ${cx + rx + 14} ${cy + 55}`} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
          {/* Side hair inner edge */}
          <path d={`M ${cx - rx - 6} ${cy - 5} Q ${cx - rx - 16} ${cy + 10} ${cx - rx - 10} ${cy + 50}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          <path d={`M ${cx + rx + 6} ${cy - 5} Q ${cx + rx + 16} ${cy + 10} ${cx + rx + 10} ${cy + 50}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          {/* Highlight */}
          <ellipse cx={cx - 8} cy={topY - 8} rx={30} ry={12} fill={lt2} opacity="0.12" />
          {/* Strand texture across top */}
          {strand(cx - 40, topY + 5, cx - 10, topY - 15, cx + 30, topY, 2, 0.1)}
          {strand(cx - 30, topY + 10, cx, topY - 10, cx + 40, topY + 5, 1.5, 0.08)}
        </g>
      )
    case 'long':
      return (
        <g>
          {/* Back volume behind head */}
          <path d={`M ${cx - rx - 14} ${cy + 15} Q ${cx - rx - 18} ${topY - 30} ${cx} ${topY - 38} Q ${cx + rx + 18} ${topY - 30} ${cx + rx + 14} ${cy + 15}`}
            fill={dk} />
          {/* Main top shape */}
          <path d={`M ${cx - rx - 10} ${cy + 10} Q ${cx - rx - 15} ${topY - 25} ${cx} ${topY - 30} Q ${cx + rx + 15} ${topY - 25} ${cx + rx + 10} ${cy + 10} Q ${cx + rx} ${topY} ${cx} ${topY - 5} Q ${cx - rx} ${topY} ${cx - rx - 10} ${cy + 10} Z`}
            fill={color} />
          {/* Flowing side hair — left */}
          <path d={`M ${cx - rx - 8} ${cy + 10} Q ${cx - rx - 24} ${cy + 45} ${cx - rx - 16} ${cy + 110}`} fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />
          <path d={`M ${cx - rx - 5} ${cy + 15} Q ${cx - rx - 18} ${cy + 40} ${cx - rx - 10} ${cy + 105}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          {/* Flowing side hair — right */}
          <path d={`M ${cx + rx + 8} ${cy + 10} Q ${cx + rx + 24} ${cy + 45} ${cx + rx + 16} ${cy + 110}`} fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />
          <path d={`M ${cx + rx + 5} ${cy + 15} Q ${cx + rx + 18} ${cy + 40} ${cx + rx + 10} ${cy + 105}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          {/* Highlight sheen */}
          <ellipse cx={cx + 5} cy={topY - 10} rx={35} ry={12} fill={lt2} opacity="0.1" />
          {/* Strand lines */}
          {strand(cx - 45, topY + 8, cx - 15, topY - 18, cx + 35, topY + 3, 2, 0.08)}
          {strand(cx - rx - 10, cy + 25, cx - rx - 20, cy + 60, cx - rx - 14, cy + 95, 1.5, 0.1)}
          {strand(cx + rx + 10, cy + 25, cx + rx + 20, cy + 60, cx + rx + 14, cy + 95, 1.5, 0.1)}
        </g>
      )
    case 'bun':
      return (
        <g>
          {/* Hair pulled back across head */}
          <path d={`M ${cx - rx - 3} ${cy - 10} Q ${cx - rx - 6} ${topY - 15} ${cx} ${topY - 20} Q ${cx + rx + 6} ${topY - 15} ${cx + rx + 3} ${cy - 10} Q ${cx + rx - 10} ${topY + 10} ${cx} ${topY + 5} Q ${cx - rx + 10} ${topY + 10} ${cx - rx - 3} ${cy - 10} Z`}
            fill={color} />
          {/* Bun shape */}
          <ellipse cx={cx} cy={topY - 20} rx={30} ry={24} fill={dk} />
          <ellipse cx={cx} cy={topY - 20} rx={28} ry={22} fill={color} />
          {/* Bun spiral detail */}
          <path d={`M ${cx - 8} ${topY - 28} Q ${cx + 5} ${topY - 35} ${cx + 12} ${topY - 22} Q ${cx + 8} ${topY - 12} ${cx - 5} ${topY - 15} Q ${cx - 12} ${topY - 22} ${cx - 8} ${topY - 28}`}
            fill="none" stroke={dk} strokeWidth="1.5" opacity="0.25" />
          {/* Bun highlight */}
          <ellipse cx={cx - 5} cy={topY - 26} rx={12} ry={8} fill={lt2} opacity="0.12" />
          {/* Hair band */}
          <ellipse cx={cx} cy={topY - 4} rx={18} ry={5} fill={dk} opacity="0.4" />
          {/* Pull-back texture lines */}
          {strand(cx - 30, topY + 10, cx - 15, topY - 5, cx, topY - 2, 1, 0.12)}
          {strand(cx + 30, topY + 10, cx + 15, topY - 5, cx, topY - 2, 1, 0.12)}
        </g>
      )
    case 'curly':
      return (
        <g>
          {/* Large voluminous base shape */}
          <path d={`M ${cx - rx - 16} ${cy + 10} Q ${cx - rx - 20} ${topY - 28} ${cx} ${topY - 35} Q ${cx + rx + 20} ${topY - 28} ${cx + rx + 16} ${cy + 10} Q ${cx + rx + 5} ${topY} ${cx} ${topY + 5} Q ${cx - rx - 5} ${topY} ${cx - rx - 16} ${cy + 10} Z`}
            fill={color} />
          {/* Curly puffs — outer ring for volume */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2
            const radius = rx + 6 + (i % 2) * 6
            const puffCx = cx + Math.cos(angle) * radius * 0.85
            const puffCy = cy - 25 + Math.sin(angle) * 48
            const r = 11 + (i % 3) * 3
            return <circle key={`o${i}`} cx={puffCx} cy={puffCy} r={r} fill={color} />
          })}
          {/* Inner curls for texture */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const puffCx = cx + Math.cos(angle) * (rx - 20)
            const puffCy = cy - 30 + Math.sin(angle) * 35
            return <circle key={`i${i}`} cx={puffCx} cy={puffCy} r={8} fill={dk} opacity="0.15" />
          })}
          {/* Highlight */}
          <ellipse cx={cx - 10} cy={topY - 10} rx={20} ry={14} fill={lt2} opacity="0.1" />
          {/* Curl spirals detail */}
          {[[-25, -15], [20, -10], [-10, 5], [30, 0], [-35, 10]].map(([dx, dy], i) => (
            <circle key={`s${i}`} cx={cx + dx} cy={topY + dy} r={4} fill="none" stroke={lt} strokeWidth="1" opacity="0.15" />
          ))}
        </g>
      )
    case 'mohawk':
      return (
        <g>
          {/* Shaved sides — subtle shadow */}
          <path d={`M ${cx - rx} ${cy - 5} Q ${cx - rx - 2} ${topY} ${cx - 20} ${topY + 5} L ${cx + 20} ${topY + 5} Q ${cx + rx + 2} ${topY} ${cx + rx} ${cy - 5}`}
            fill={color} opacity="0.15" />
          {/* Mohawk body — tall center ridge */}
          <path d={`M ${cx - 18} ${topY + 10} Q ${cx - 22} ${topY - 45} ${cx} ${topY - 60} Q ${cx + 22} ${topY - 45} ${cx + 18} ${topY + 10} Z`}
            fill={color} />
          {/* Depth layer */}
          <path d={`M ${cx - 12} ${topY + 8} Q ${cx - 15} ${topY - 38} ${cx} ${topY - 50} Q ${cx + 15} ${topY - 38} ${cx + 12} ${topY + 8}`}
            fill={dk} opacity="0.2" />
          {/* Highlight on ridge */}
          <path d={`M ${cx - 4} ${topY - 45} Q ${cx} ${topY - 55} ${cx + 4} ${topY - 45}`}
            fill="none" stroke={lt2} strokeWidth="3" opacity="0.2" strokeLinecap="round" />
          {/* Texture spikes */}
          {[-8, -3, 2, 7].map((dx, i) => (
            <line key={i} x1={cx + dx} y1={topY + 5} x2={cx + dx + 1} y2={topY - 40 - i * 4} stroke={lt} strokeWidth="1" opacity="0.12" />
          ))}
        </g>
      )
    case 'ponytail':
      return (
        <g>
          {/* Hair pulled back across head */}
          <path d={`M ${cx - rx - 3} ${cy - 10} Q ${cx - rx - 6} ${topY - 15} ${cx} ${topY - 20} Q ${cx + rx + 6} ${topY - 15} ${cx + rx + 3} ${cy - 10} Q ${cx + rx - 10} ${topY + 10} ${cx} ${topY + 5} Q ${cx - rx + 10} ${topY + 10} ${cx - rx - 3} ${cy - 10} Z`}
            fill={color} />
          {/* Gathering point */}
          <ellipse cx={cx} cy={topY + 8} rx={18} ry={14} fill={color} />
          {/* Hair band */}
          <ellipse cx={cx} cy={topY + 18} rx={10} ry={4} fill={dk} opacity="0.5" />
          {/* Ponytail flowing down */}
          <path d={`M ${cx - 8} ${topY + 22} Q ${cx + 10} ${cy + 10} ${cx + 8} ${cy + 55} Q ${cx + 3} ${cy + 70} ${cx + 5} ${cy + 65}`}
            fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
          {/* Ponytail inner shadow */}
          <path d={`M ${cx - 4} ${topY + 24} Q ${cx + 6} ${cy + 12} ${cx + 4} ${cy + 52}`}
            fill="none" stroke={dk} strokeWidth="4" opacity="0.15" strokeLinecap="round" />
          {/* Highlight */}
          <ellipse cx={cx + 5} cy={topY - 5} rx={22} ry={8} fill={lt2} opacity="0.1" />
          {/* Pull-back texture */}
          {strand(cx - 35, topY + 10, cx - 15, topY, cx, topY + 10, 1, 0.1)}
          {strand(cx + 35, topY + 10, cx + 15, topY, cx, topY + 10, 1, 0.1)}
        </g>
      )
    case 'braids':
      return (
        <g>
          {/* Top hair shape */}
          <path d={`M ${cx - rx - 5} ${cy} Q ${cx - rx - 8} ${topY - 18} ${cx} ${topY - 22} Q ${cx + rx + 8} ${topY - 18} ${cx + rx + 5} ${cy} Q ${cx + rx - 5} ${topY + 5} ${cx} ${topY} Q ${cx - rx + 5} ${topY + 5} ${cx - rx - 5} ${cy} Z`}
            fill={color} />
          {/* Center part line */}
          <line x1={cx} y1={topY - 18} x2={cx} y2={topY + 10} stroke={dk} strokeWidth="1.5" opacity="0.3" />
          {/* Left braid */}
          <path d={`M ${cx - rx + 2} ${cy + 5} Q ${cx - rx - 14} ${cy + 38} ${cx - rx - 8} ${cy + 90}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
          <path d={`M ${cx - rx + 2} ${cy + 5} Q ${cx - rx - 12} ${cy + 36} ${cx - rx - 6} ${cy + 88}`} fill="none" stroke={dk} strokeWidth="4" opacity="0.15" strokeLinecap="round" />
          {/* Right braid */}
          <path d={`M ${cx + rx - 2} ${cy + 5} Q ${cx + rx + 14} ${cy + 38} ${cx + rx + 8} ${cy + 90}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
          <path d={`M ${cx + rx - 2} ${cy + 5} Q ${cx + rx + 12} ${cy + 36} ${cx + rx + 6} ${cy + 88}`} fill="none" stroke={dk} strokeWidth="4" opacity="0.15" strokeLinecap="round" />
          {/* Braid cross-hatching — left */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const y = cy + 14 + i * 14
            const bx = cx - rx - 3 - i * 1.8
            return <path key={`l${i}`} d={`M ${bx - 6} ${y - 3} L ${bx + 6} ${y + 3} M ${bx + 6} ${y - 3} L ${bx - 6} ${y + 3}`}
              stroke={lt} strokeWidth="1" opacity="0.2" />
          })}
          {/* Braid cross-hatching — right */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const y = cy + 14 + i * 14
            const bx = cx + rx + 3 + i * 1.8
            return <path key={`r${i}`} d={`M ${bx - 6} ${y - 3} L ${bx + 6} ${y + 3} M ${bx + 6} ${y - 3} L ${bx - 6} ${y + 3}`}
              stroke={lt} strokeWidth="1" opacity="0.2" />
          })}
          {/* Braid tips / hair ties */}
          <circle cx={cx - rx - 8} cy={cy + 92} r={4} fill={dk} opacity="0.4" />
          <circle cx={cx + rx + 8} cy={cy + 92} r={4} fill={dk} opacity="0.4" />
          {/* Highlight */}
          <ellipse cx={cx} cy={topY - 8} rx={25} ry={8} fill={lt2} opacity="0.08" />
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
