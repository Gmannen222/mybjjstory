// SVG avatar renderer for BJJ practitioners — chibi/cartoon style
// Large head, compressed body, expressive anime eyes, BJJ accessories

import { useId } from 'react'

export interface AvatarConfig {
  skinTone: string
  hairStyle: 'short' | 'medium' | 'long' | 'bun' | 'bald' | 'buzz' | 'curly' | 'mohawk' | 'ponytail' | 'braids'
  hairColor: string
  outfit: 'gi_white' | 'gi_blue' | 'gi_black' | 'nogi' | 'nogi_dark'
  beltRank?: string | null
  beltDegrees?: number
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
  beltDegrees: 0,
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

// Change 1: HEAD MUCH LARGER — chibi proportions
const FACE_DIMS: Record<string, { rx: number; ry: number; jawY: number }> = {
  oval:   { rx: 102, ry: 118, jawY: 12 },
  round:  { rx: 108, ry: 108, jawY: 6 },
  square: { rx: 98,  ry: 108, jawY: 18 },
  long:   { rx: 92,  ry: 128, jawY: 10 },
}

const INJURY_LOCATIONS: Record<string, { x: number; y: number }> = {
  'Kne': { x: 220, y: 630 }, 'Skulder': { x: 130, y: 345 }, 'Nakke': { x: 200, y: 320 },
  'Rygg': { x: 200, y: 410 }, 'Ankel': { x: 185, y: 700 }, 'Håndledd': { x: 85, y: 490 },
  'Albue': { x: 95, y: 440 }, 'Hofte': { x: 170, y: 510 }, 'Finger': { x: 70, y: 530 },
  'Tå': { x: 185, y: 715 }, 'Øre': { x: 105, y: 200 }, 'Ribben': { x: 145, y: 400 },
}

// === MAIN COMPONENT ===
// ViewBox: 400 x 850 — chibi style (head ~50% of height)
// Layout: head center cy=200, neck y=318-336, torso y=336-510, legs y=510-690, feet y=690-720

export default function AvatarSVG({
  config,
  size = 200,
  className = '',
}: {
  config: AvatarConfig
  size?: number
  className?: string
}) {
  // Unique gradient IDs to prevent collision when multiple avatars render on same page
  const rawId = useId()
  const uid = rawId.replace(/:/g, '')

  const outfit = OUTFIT_COLORS[config.outfit] ?? OUTFIT_COLORS.gi_white
  const beltColor = config.beltRank ? BELT_COLOR_MAP[config.beltRank] ?? '#4b5563' : null
  const isGi = config.outfit.startsWith('gi')
  const injuries = config.showInjuries ?? []
  const body = BODY_DIMS[config.bodyType ?? 'average']
  const face = FACE_DIMS[config.faceShape ?? 'oval']
  const sd = darken(config.skinTone, 15)
  const sl = lighten(config.skinTone, 10)

  // Center points — chibi layout
  const cx = 200   // head center X
  const hcy = 200  // head center Y (moved down for larger head)

  return (
    <svg viewBox="0 0 400 850" width={size} height={size * 850 / 400} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${uid}-sg`} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor={sl} />
          <stop offset="70%" stopColor={config.skinTone} />
          <stop offset="100%" stopColor={sd} />
        </radialGradient>
        <linearGradient id={`${uid}-og`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={outfit.main} />
          <stop offset="100%" stopColor={outfit.accent} />
        </linearGradient>
        <linearGradient id={`${uid}-og2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={outfit.accent} />
          <stop offset="100%" stopColor={outfit.dark} />
        </linearGradient>
      </defs>

      {/* === LEGS === */}
      <LegsComp isGi={isGi} outfit={outfit} body={body} skinTone={config.skinTone} kneePads={config.kneePads} uid={uid} />

      {/* === BARE FEET === */}
      <BareFeetComp skinTone={config.skinTone} />

      {/* === TORSO === */}
      <TorsoComp isGi={isGi} outfit={outfit} body={body} academyColor={config.academyColor} uid={uid} />

      {/* === BELT === */}
      {beltColor && isGi && <BeltComp beltColor={beltColor} beltRank={config.beltRank!} beltDegrees={config.beltDegrees ?? 0} body={body} />}

      {/* === ARMS + HANDS === */}
      <ArmsComp isGi={isGi} outfit={outfit} body={body} skinTone={config.skinTone} fingerTape={config.fingerTape} uid={uid} />

      {/* === NECK — minimal chibi neck === */}
      {/* Change 8: neck almost gone — 18px height, 40px wide */}
      <rect x={180} y={310} width={40} height={18} rx={10} fill={`url(#${uid}-sg)`} />

      {/* === HEAD === */}
      <ellipse cx={cx} cy={hcy} rx={face.rx} ry={face.ry} fill={`url(#${uid}-sg)`} />
      {/* Jaw definition */}
      {config.faceShape === 'square' && (
        <path d={`M ${cx - face.rx + 10} ${hcy + 20} Q ${cx - face.rx + 5} ${hcy + face.ry - 10} ${cx - 30} ${hcy + face.ry + face.jawY} L ${cx + 30} ${hcy + face.ry + face.jawY} Q ${cx + face.rx - 5} ${hcy + face.ry - 10} ${cx + face.rx - 10} ${hcy + 20}`}
          fill={`url(#${uid}-sg)`} />
      )}
      {/* Cheek blush */}
      <ellipse cx={cx - 62} cy={hcy + 28} rx={20} ry={13} fill="#e8a090" opacity="0.18" />
      <ellipse cx={cx + 62} cy={hcy + 28} rx={20} ry={13} fill="#e8a090" opacity="0.18" />
      {/* Face highlight — forehead sheen */}
      <ellipse cx={cx - 15} cy={hcy - 50} rx={38} ry={24} fill="white" opacity="0.07" />
      {/* Chin highlight */}
      <ellipse cx={cx} cy={hcy + face.ry - 18} rx={22} ry={10} fill="white" opacity="0.04" />

      {/* === FRECKLES === */}
      {config.freckles && <Freckles cx={cx} cy={hcy} />}

      {/* === SCARS === */}
      {config.scar && config.scar !== 'none' && <Scar type={config.scar} cx={cx} cy={hcy} skinTone={config.skinTone} />}

      {/* === EARS === */}
      <EarsComp config={config} cx={cx} cy={hcy} face={face} />

      {/* === HEADBAND === */}
      {config.headband && (
        <g>
          <path d={`M ${cx - face.rx + 2} ${hcy - 50} Q ${cx} ${hcy - 65} ${cx + face.rx - 2} ${hcy - 50}`}
            fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
          <path d={`M ${cx - face.rx + 2} ${hcy - 50} Q ${cx} ${hcy - 61} ${cx + face.rx - 2} ${hcy - 50}`}
            fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
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
        <path d={`M ${cx - 22} ${hcy + 58} Q ${cx} ${hcy + 72} ${cx + 22} ${hcy + 58}`}
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

// Change 2: BODY COMPRESSED — legs span ~180px, feet at y=690-720
function LegsComp({ isGi, outfit, body, skinTone, kneePads, uid }: { isGi: boolean; outfit: typeof OUTFIT_COLORS['gi_white']; body: typeof BODY_DIMS['average']; skinTone: string; kneePads?: boolean; uid: string }) {
  const hw = 28 * body.hipW
  const lx = 200 - hw - 10
  const rx = 200 + 10

  return (
    <g>
      {isGi ? (
        <>
          {/* Gi pants — wider, looser fit, legs end at y=690 */}
          <rect x={lx - 4} y={510} width={hw + 12} height={182} rx={18} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          <rect x={rx - 4} y={510} width={hw + 12} height={182} rx={18} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          {/* Drawstring at waist */}
          <path d={`M ${192} ${515} Q ${194} ${525} ${190} ${537}`} fill="none" stroke={outfit.accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d={`M ${208} ${515} Q ${206} ${525} ${210} ${537}`} fill="none" stroke={outfit.accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          {/* Drawstring tips */}
          <circle cx={190} cy={539} r={2} fill={outfit.accent} opacity="0.4" />
          <circle cx={210} cy={539} r={2} fill={outfit.accent} opacity="0.4" />
          {/* Knee crease — bunching of fabric */}
          <path d={`M ${lx + 2} ${600} Q ${lx + hw / 2 + 2} ${610} ${lx + hw + 6} ${600}`} fill="none" stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
          <path d={`M ${lx + 4} ${606} Q ${lx + hw / 2} ${613} ${lx + hw + 4} ${606}`} fill="none" stroke={outfit.accent} strokeWidth="0.5" opacity="0.15" />
          <path d={`M ${rx + 2} ${600} Q ${rx + hw / 2 + 2} ${610} ${rx + hw + 6} ${600}`} fill="none" stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
          {/* Thick reinforced cuffs at ankles */}
          <rect x={lx - 3} y={676} width={hw + 10} height={14} rx={5} fill={outfit.accent} opacity="0.25" />
          <rect x={rx - 3} y={676} width={hw + 10} height={14} rx={5} fill={outfit.accent} opacity="0.25" />
          {/* Cuff edge */}
          <line x1={lx - 1} y1={689} x2={lx + hw + 5} y2={689} stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
          <line x1={rx - 1} y1={689} x2={rx + hw + 5} y2={689} stroke={outfit.accent} strokeWidth="1" opacity="0.2" />
        </>
      ) : (
        <>
          {/* Shorts */}
          <rect x={lx - 2} y={510} width={hw + 8} height={90} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          <rect x={rx - 2} y={510} width={hw + 8} height={90} rx={16} fill={outfit.main} stroke={outfit.accent} strokeWidth="1" />
          {/* Drawstring */}
          <path d={`M ${195} ${515} Q ${197} ${523} ${194} ${530}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M ${205} ${515} Q ${203} ${523} ${206} ${530}`} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Side vent detail */}
          <line x1={lx - 1} y1={585} x2={lx + 3} y2={595} stroke={outfit.dark} strokeWidth="1" opacity="0.3" />
          <line x1={rx + hw + 5} y1={585} x2={rx + hw + 1} y2={595} stroke={outfit.dark} strokeWidth="1" opacity="0.3" />
          {/* Bare legs — 95px height to y=690 */}
          <rect x={lx + 2} y={598} width={hw} height={92} rx={14} fill={skinTone} />
          <rect x={rx + 2} y={598} width={hw} height={92} rx={14} fill={skinTone} />
        </>
      )}
      {/* Knee pads */}
      {kneePads && (
        <>
          <ellipse cx={lx + hw / 2 + 2} cy={isGi ? 608 : 600} rx={18} ry={22} fill="rgba(30,30,30,0.7)" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
          <ellipse cx={rx + hw / 2 + 2} cy={isGi ? 608 : 600} rx={18} ry={22} fill="rgba(30,30,30,0.7)" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
        </>
      )}
    </g>
  )
}

// Change 6: LAPELS WIDER, SHORTER V-OPENING
function TorsoComp({ isGi, outfit, body, academyColor, uid }: { isGi: boolean; outfit: typeof OUTFIT_COLORS['gi_white']; body: typeof BODY_DIMS['average']; academyColor?: string | null; uid: string }) {
  const sw = 75 * body.shoulderW
  const hw = 60 * body.hipW
  const tw = 65 * body.torsoW

  return (
    <g>
      {/* Torso — tapered shape, starts y=330, ends y=510 */}
      <path d={`M ${200 - sw} 330 Q ${200 - sw - 5} 420 ${200 - hw} 510 L ${200 + hw} 510 Q ${200 + sw + 5} 420 ${200 + sw} 330 Z`}
        fill={`url(#${uid}-og)`} stroke={outfit.accent} strokeWidth="1" />

      {/* Shoulder roundness */}
      <ellipse cx={200 - sw + 5} cy={335} rx={20} ry={12} fill={outfit.main} />
      <ellipse cx={200 + sw - 5} cy={335} rx={20} ry={12} fill={outfit.main} />

      {isGi ? (
        <>
          {/* === GI JACKET === */}
          {/* Black undershirt visible in V-opening — shorter, only to y=380 */}
          <path d="M 178 328 L 200 380 L 222 328 Z" fill="#1a1a1a" />
          {/* Undershirt neckline — rounded */}
          <path d="M 182 332 Q 200 350 218 332" fill="none" stroke="#2a2a2a" strokeWidth="2" />

          {/* Right lapel (wider, shorter V) */}
          <path d="M 222 328 L 222 330 L 202 382 L 214 387 L 234 332 Z" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          {/* Right lapel fabric shadow */}
          <path d="M 220 334 L 204 378 L 210 381" fill="none" stroke={outfit.dark} strokeWidth="1.2" opacity="0.15" />

          {/* Left lapel (wider, on top) */}
          <path d="M 178 328 L 166 330 L 198 392 L 186 387 Z" fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          {/* Left lapel highlight */}
          <path d="M 174 332 L 196 387" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          {/* Left lapel shadow */}
          <path d="M 180 334 L 198 384" fill="none" stroke={outfit.dark} strokeWidth="1.5" opacity="0.12" />

          {/* Thicker collar wrapping around neck */}
          <path d={`M 160 328 Q 165 310 180 305 Q 200 300 220 305 Q 235 310 240 328`}
            fill={outfit.main} stroke={outfit.accent} strokeWidth="2" />
          {/* Collar inner edge */}
          <path d={`M 168 326 Q 178 312 200 308 Q 222 312 232 326`}
            fill="none" stroke={outfit.dark} strokeWidth="2" opacity="0.2" />
          {/* Collar thickness — top fold */}
          <path d={`M 160 328 Q 165 318 180 314 Q 200 310 220 314 Q 235 318 240 328`}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

          {/* Center closure line */}
          <line x1={200} y1={392} x2={200} y2={502} stroke={outfit.accent} strokeWidth="1" opacity="0.2" />

          {/* Shoulder seam lines */}
          <path d={`M ${200 - sw + 12} 332 L ${200 - sw + 14} 360`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.25" />
          <path d={`M ${200 + sw - 12} 332 L ${200 + sw - 14} 360`} fill="none" stroke={outfit.accent} strokeWidth="0.8" opacity="0.25" />

          {/* Stitching along lapel edges */}
          <path d="M 171 332 L 197 384" fill="none" stroke={outfit.accent} strokeWidth="0.6" strokeDasharray="2,3" opacity="0.25" />
          <path d="M 229 332 L 203 384" fill="none" stroke={outfit.accent} strokeWidth="0.6" strokeDasharray="2,3" opacity="0.2" />

          {/* Back of gi hint — collar shadow on body */}
          <ellipse cx={200} cy={340} rx={30} ry={8} fill={outfit.dark} opacity="0.08" />

          {/* === DIAGONAL PATCH STRIPE === */}
          <path d={`M ${200 - sw + 20} 330 L ${200 - sw + 28} 330 L 210 387 L 202 387 Z`}
            fill="#2a2a2a" opacity="0.85" />
          <path d={`M ${200 - sw + 20} 330 L ${200 - sw + 28} 330 L 210 387 L 202 387 Z`}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <path d={`M ${200 - sw + 23} 334 L 205 385`}
            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </>
      ) : (
        <>
          {/* === RASHGUARD === */}
          {/* Neckline — rounded */}
          <path d="M 172 332 Q 200 350 228 332" fill="none" stroke={outfit.accent} strokeWidth="2.5" />
          {/* Side panel stripes */}
          <path d={`M ${200 - sw + 3} 335 L ${200 - hw + 3} 505`} fill="none" stroke={outfit.dark} strokeWidth="6" opacity="0.35" />
          <path d={`M ${200 + sw - 3} 335 L ${200 + hw - 3} 505`} fill="none" stroke={outfit.dark} strokeWidth="6" opacity="0.35" />
          {/* Inner accent stripe */}
          <path d={`M ${200 - sw + 8} 338 L ${200 - hw + 8} 503`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <path d={`M ${200 + sw - 8} 338 L ${200 + hw - 8} 503`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          {/* Center logo placeholder */}
          <rect x={187} y={380} width={26} height={26} rx={4} fill={outfit.dark} opacity="0.3" />
          <line x1={193} y1={393} x2={207} y2={393} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        </>
      )}

      {/* Academy patch */}
      {academyColor && (
        <g>
          {isGi ? (
            <>
              <rect x={210} y={395} width={42} height={28} rx={4} fill={academyColor} opacity="0.85" />
              <rect x={210} y={395} width={42} height={28} rx={4} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <rect x={212} y={397} width={38} height={24} rx={3} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="2,2" />
            </>
          ) : (
            <>
              <rect x={175} y={405} width={50} height={30} rx={5} fill={academyColor} opacity="0.85" />
              <rect x={175} y={405} width={50} height={30} rx={5} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            </>
          )}
        </g>
      )}
    </g>
  )
}

// Change 5: BELT 50% LARGER — height 28px, bigger knot, longer tails
function BeltComp({ beltColor, beltRank, beltDegrees, body }: { beltColor: string; beltRank: string; beltDegrees: number; body: typeof BODY_DIMS['average'] }) {
  const hw = 60 * body.hipW
  const w = hw * 2 + 10
  const barX = 200 + hw - 22
  const barW = 26
  const degrees = Math.min(beltDegrees, 4)

  return (
    <g>
      {/* Belt band — 28px height */}
      <rect x={200 - hw - 5} y={486} width={w} height={28} rx={6} fill={beltColor} />
      {/* Belt sheen */}
      <rect x={200 - hw - 5} y={486} width={w} height={12} rx={6} fill="rgba(255,255,255,0.12)" />

      {/* Knot — rx=18, ry=14 */}
      <ellipse cx={200} cy={500} rx={18} ry={14} fill={beltColor} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      {/* Knot highlight */}
      <ellipse cx={197} cy={496} rx={8} ry={5} fill="rgba(255,255,255,0.15)" />

      {/* Tails — strokeWidth 18, ~100px longer */}
      <path d="M 189 514 Q 178 555 181 595 Q 183 635 179 670" fill="none" stroke={beltColor} strokeWidth="18" strokeLinecap="round" />
      <path d="M 211 514 Q 222 560 218 600 Q 215 640 219 675" fill="none" stroke={beltColor} strokeWidth="18" strokeLinecap="round" />
      {/* Tail sheen */}
      <path d="M 191 516 Q 182 552 184 590 Q 186 628 182 662" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 209 516 Q 219 556 216 594 Q 213 632 216 666" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeLinecap="round" />
      {/* Tail tips — 16x7 */}
      <rect x={172} y={665} width={16} height={7} rx={3} fill={beltColor} transform="rotate(-8, 180, 669)" />
      <rect x={212} y={670} width={16} height={7} rx={3} fill={beltColor} transform="rotate(6, 220, 674)" />

      {/* Black bar (red for black belt) */}
      <rect x={barX} y={486} width={barW} height={28} rx={4}
        fill={beltRank === 'black' ? '#8b0000' : '#1a1a1a'} />
      {/* Bar sheen */}
      <rect x={barX} y={486} width={barW} height={12} rx={4} fill="rgba(255,255,255,0.1)" />

      {/* Degree stripes on black bar */}
      {degrees > 0 && Array.from({ length: degrees }).map((_, i) => (
        <rect key={i}
          x={barX + 4 + i * 5}
          y={489}
          width={3}
          height={22}
          rx={1}
          fill="white"
          opacity="0.9"
        />
      ))}
    </g>
  )
}

// Change 3: EYES MUCH LARGER, Change 10: no micro-textures on arms
function ArmsComp({ isGi, outfit, body, skinTone, fingerTape, uid }: { isGi: boolean; outfit: typeof OUTFIT_COLORS['gi_white']; body: typeof BODY_DIMS['average']; skinTone: string; fingerTape?: boolean; uid: string }) {
  const sw = 75 * body.shoulderW
  const armW = 32 * (body.shoulderW * 0.5 + 0.5)
  const lx = 200 - sw - armW + 5
  const rx = 200 + sw - 5

  return (
    <g>
      {/* Upper arms (sleeves) */}
      <rect x={lx} y={330} width={armW} height={isGi ? 125 : 115} rx={16}
        fill={outfit.main} stroke={isGi ? outfit.accent : 'none'} strokeWidth={isGi ? 1 : 0} />
      <rect x={rx} y={330} width={armW} height={isGi ? 125 : 115} rx={16}
        fill={outfit.main} stroke={isGi ? outfit.accent : 'none'} strokeWidth={isGi ? 1 : 0} />

      {isGi ? (
        <>
          {/* Gi sleeve widening at cuff */}
          <path d={`M ${lx - 2} 430 Q ${lx + armW / 2} 460 ${lx + armW + 2} 430`}
            fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          <path d={`M ${rx - 2} 430 Q ${rx + armW / 2} 460 ${rx + armW + 2} 430`}
            fill={outfit.main} stroke={outfit.accent} strokeWidth="0.8" />
          {/* Thick sleeve cuff */}
          <rect x={lx - 2} y={448} width={armW + 4} height={14} rx={6} fill={outfit.accent} opacity="0.35" />
          <rect x={rx - 2} y={448} width={armW + 4} height={14} rx={6} fill={outfit.accent} opacity="0.35" />
          {/* Cuff edge line */}
          <line x1={lx} y1={461} x2={lx + armW} y2={461} stroke={outfit.accent} strokeWidth="1" opacity="0.3" />
          <line x1={rx} y1={461} x2={rx + armW} y2={461} stroke={outfit.accent} strokeWidth="1" opacity="0.3" />
          {/* Shoulder seam on sleeve */}
          <line x1={lx + armW / 2} y1={330} x2={lx + armW / 2} y2={345} stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
          <line x1={rx + armW / 2} y1={330} x2={rx + armW / 2} y2={345} stroke={outfit.accent} strokeWidth="0.6" opacity="0.2" />
        </>
      ) : (
        <>
          {/* Nogi sleeve end */}
          <rect x={lx + 1} y={440} width={armW - 2} height={8} rx={4} fill={outfit.dark} opacity="0.3" />
          <rect x={rx + 1} y={440} width={armW - 2} height={8} rx={4} fill={outfit.dark} opacity="0.3" />
        </>
      )}

      {/* Forearms (skin) — no muscle highlight micro-texture */}
      <rect x={lx + 4} y={isGi ? 460 : 446} width={armW - 8} height={isGi ? 55 : 68} rx={12} fill={skinTone} />
      <rect x={rx + 4} y={isGi ? 460 : 446} width={armW - 8} height={isGi ? 55 : 68} rx={12} fill={skinTone} />

      {/* Hands */}
      <HandComp x={lx + armW / 2 + 1} y={isGi ? 518 : 516} skinTone={skinTone} fingerTape={fingerTape} mirror={false} />
      <HandComp x={rx + armW / 2 - 1} y={isGi ? 518 : 516} skinTone={skinTone} fingerTape={fingerTape} mirror={true} />
    </g>
  )
}

// Change 4: HANDS 50% LARGER — chibi fists
function HandComp({ x, y, skinTone, fingerTape, mirror }: { x: number; y: number; skinTone: string; fingerTape?: boolean; mirror: boolean }) {
  const dir = mirror ? -1 : 1
  const sd = darken(skinTone, 12)
  const sl = lighten(skinTone, 8)

  return (
    <g>
      {/* Closed fist — main shape, 42x34 */}
      <rect x={x - 21} y={y - 12} width={42} height={34} rx={13} fill={skinTone} />
      {/* Fist bottom shadow */}
      <rect x={x - 18} y={y + 14} width={36} height={7} rx={5} fill={sd} opacity="0.2" />

      {/* Knuckle bumps — 4 larger bumps across top of fist */}
      {[-11, -4, 4, 11].map((dx, i) => (
        <g key={i}>
          <ellipse cx={x + dx} cy={y - 12} rx={7} ry={5.5} fill={skinTone} />
          <ellipse cx={x + dx} cy={y - 13} rx={4.5} ry={3} fill={sl} opacity="0.15" />
        </g>
      ))}

      {/* Thumb — bigger, tucked against side of fist */}
      <ellipse cx={x + dir * 21} cy={y + 3} rx={9} ry={14} fill={skinTone}
        transform={`rotate(${mirror ? 10 : -10}, ${x + dir * 21}, ${y + 3})`} />
      {/* Thumb nail hint */}
      <ellipse cx={x + dir * 24} cy={y - 4} rx={4.5} ry={3.5} fill={sl} opacity="0.15" />

      {/* Finger tape wrapped around fist */}
      {fingerTape && (
        <>
          <rect x={x - 20} y={y - 5} width={40} height={9} rx={4} fill="white" opacity="0.85" />
          <rect x={x - 20} y={y + 6} width={40} height={7} rx={3.5} fill="white" opacity="0.75" />
          <line x1={x - 17} y1={y + 3} x2={x + 17} y2={y + 3} stroke="#d4d4d4" strokeWidth="0.4" />
        </>
      )}
    </g>
  )
}

// Change 9: FEET SIMPLER — only 3 toe bumps, no ankle bone, no highlights
function BareFeetComp({ skinTone }: { skinTone: string }) {
  const sd = darken(skinTone, 12)

  return (
    <g>
      {[{ fx: 163, dir: -1 }, { fx: 237, dir: 1 }].map(({ fx, dir }) => (
        <g key={fx}>
          {/* Main foot shape — at y=690-712 */}
          <path d={`M ${fx - 18} ${690} Q ${fx - 22} ${704} ${fx - 18} ${712} Q ${fx} ${718} ${fx + 20} ${712} Q ${fx + 24} ${704} ${fx + 20} ${690} Z`}
            fill={skinTone} />
          {/* Ankle connection */}
          <rect x={fx - 12} y={686} width={24} height={10} rx={8} fill={skinTone} />

          {/* Toes — only 3 visible bumps (simplified chibi) */}
          {[
            { dx: dir * -12, dy: 0, r: 5.5 },    // big toe
            { dx: dir * -1,  dy: -2, r: 4.5 },   // middle
            { dx: dir * 10,  dy: 0, r: 3.8 },    // outer
          ].map((toe, i) => (
            <ellipse key={i} cx={fx + toe.dx} cy={714 + toe.dy} rx={toe.r} ry={toe.r * 0.8} fill={skinTone} />
          ))}

          {/* Foot sole shadow */}
          <ellipse cx={fx + dir * 2} cy={715} rx={22} ry={6} fill={sd} opacity="0.1" />
        </g>
      ))}
    </g>
  )
}

function EarsComp({ config, cx, cy, face }: { config: AvatarConfig; cx: number; cy: number; face: typeof FACE_DIMS['oval'] }) {
  const ex = face.rx - 2
  const isCauli = config.earType === 'cauliflower'

  return (
    <g>
      {/* Left */}
      <ellipse cx={cx - ex} cy={cy + 5} rx={isCauli ? 16 : 13} ry={isCauli ? 22 : 20} fill={config.skinTone} />
      {isCauli ? (
        <>
          <ellipse cx={cx - ex - 3} cy={cy + 1} rx={7} ry={9} fill={darken(config.skinTone, 22)} opacity="0.45" />
          <ellipse cx={cx - ex + 1} cy={cy + 10} rx={5} ry={7} fill={darken(config.skinTone, 18)} opacity="0.35" />
          <ellipse cx={cx - ex - 1} cy={cy + 6} rx={3} ry={4} fill={darken(config.skinTone, 30)} opacity="0.25" />
        </>
      ) : (
        <ellipse cx={cx - ex + 4} cy={cy + 5} rx={6} ry={12} fill={darken(config.skinTone, 10)} opacity="0.25" />
      )}
      {/* Right */}
      <ellipse cx={cx + ex} cy={cy + 5} rx={isCauli ? 16 : 13} ry={isCauli ? 22 : 20} fill={config.skinTone} />
      {isCauli ? (
        <>
          <ellipse cx={cx + ex + 3} cy={cy + 1} rx={7} ry={9} fill={darken(config.skinTone, 22)} opacity="0.45" />
          <ellipse cx={cx + ex - 1} cy={cy + 10} rx={5} ry={7} fill={darken(config.skinTone, 18)} opacity="0.35" />
          <ellipse cx={cx + ex + 1} cy={cy + 6} rx={3} ry={4} fill={darken(config.skinTone, 30)} opacity="0.25" />
        </>
      ) : (
        <ellipse cx={cx + ex - 4} cy={cy + 5} rx={6} ry={12} fill={darken(config.skinTone, 10)} opacity="0.25" />
      )}
    </g>
  )
}

// Change 3: EYES MUCH LARGER — anime style
function EyesComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const eyeColor = config.eyeColor ?? '#4A3728'
  const shape = config.eyeShape ?? 'default'

  const dims = {
    default: { rx: 28, ry: 22, irisR: 17 },
    round:   { rx: 28, ry: 26, irisR: 18 },
    almond:  { rx: 32, ry: 16, irisR: 15 },
    narrow:  { rx: 30, ry: 12, irisR: 11 },
  }[shape]

  const ex = 42 // eye distance from center (wider than before)
  const ey = cy - 5

  return (
    <g>
      {[cx - ex, cx + ex].map((eyeX, i) => (
        <g key={i}>
          {/* Eye white */}
          <ellipse cx={eyeX} cy={ey} rx={dims.rx} ry={dims.ry} fill="white" />
          <ellipse cx={eyeX} cy={ey + dims.ry * 0.3} rx={dims.rx - 1} ry={dims.ry * 0.5} fill="#f0f0f0" opacity="0.3" />
          {/* Upper eyelid line — thicker, strokeWidth 3.5 */}
          <path d={`M ${eyeX - dims.rx} ${ey} Q ${eyeX} ${ey - dims.ry - 3} ${eyeX + dims.rx} ${ey}`}
            fill="none" stroke={darken(config.skinTone, 35)} strokeWidth="3.5" strokeLinecap="round" />
          {/* Iris — larger, richer */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR} fill={eyeColor} />
          {/* Iris outer ring */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR} fill="none" stroke={darken(eyeColor, 30)} strokeWidth="1.5" />
          {/* Iris inner ring */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR * 0.65} fill="none" stroke={lighten(eyeColor, 20)} strokeWidth="0.8" opacity="0.5" />
          {/* Iris radial lines */}
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
          {/* Pupil */}
          <circle cx={eyeX} cy={ey + 1} r={dims.irisR * 0.38} fill="#0a0a0a" />
          {/* Big highlight — r=6 */}
          <circle cx={eyeX + 5} cy={ey - 4} r={6} fill="white" opacity="0.9" />
          {/* Secondary highlight — r=3 */}
          <circle cx={eyeX - 4} cy={ey + 5} r={3} fill="white" opacity="0.5" />
          {/* Tiny extra sparkle */}
          <circle cx={eyeX + 8} cy={ey - 1} r={1.5} fill="white" opacity="0.6" />
          {/* Lower eyelid */}
          <path d={`M ${eyeX - dims.rx + 3} ${ey + dims.ry - 2} Q ${eyeX} ${ey + dims.ry + 2} ${eyeX + dims.rx - 3} ${ey + dims.ry - 2}`}
            fill="none" stroke={darken(config.skinTone, 15)} strokeWidth="1" opacity="0.35" />
          {/* Eyelashes (female) */}
          {config.gender === 'female' && (
            <>
              <line x1={eyeX - dims.rx + 1} y1={ey - dims.ry + 4} x2={eyeX - dims.rx - 4} y2={ey - dims.ry - 2} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
              <line x1={eyeX - dims.rx + 9} y1={ey - dims.ry + 1} x2={eyeX - dims.rx + 6} y2={ey - dims.ry - 5} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
              <line x1={eyeX} y1={ey - dims.ry} x2={eyeX} y2={ey - dims.ry - 5} stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
              <line x1={eyeX + dims.rx - 9} y1={ey - dims.ry + 1} x2={eyeX + dims.rx - 6} y2={ey - dims.ry - 5} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
              <line x1={eyeX + dims.rx - 1} y1={ey - dims.ry + 4} x2={eyeX + dims.rx + 4} y2={ey - dims.ry - 2} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
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
  const ey = cy - 38  // adjusted for larger eyes / larger head
  const ex = 42       // matches eye distance

  if (style === 'arched') {
    return (
      <g>
        <path d={`M ${cx - ex - 20} ${ey + 4} Q ${cx - ex - 2} ${ey - 10} ${cx - ex + 20} ${ey + 2}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${cx + ex - 20} ${ey + 2} Q ${cx + ex + 2} ${ey - 10} ${cx + ex + 20} ${ey + 4}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      </g>
    )
  }

  if (style === 'thick') {
    return (
      <g>
        <path d={`M ${cx - ex - 20} ${ey + 3} Q ${cx - ex} ${ey - 4} ${cx - ex + 20} ${ey}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${cx - ex - 20} ${ey + 5} Q ${cx - ex} ${ey - 2} ${cx - ex + 20} ${ey + 2}`} fill="none" stroke={config.hairColor} strokeWidth={1.5} strokeLinecap="round" opacity="0.3" />
        <path d={`M ${cx + ex - 20} ${ey} Q ${cx + ex} ${ey - 4} ${cx + ex + 20} ${ey + 3}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${cx + ex - 20} ${ey + 2} Q ${cx + ex} ${ey - 2} ${cx + ex + 20} ${ey + 5}`} fill="none" stroke={config.hairColor} strokeWidth={1.5} strokeLinecap="round" opacity="0.3" />
      </g>
    )
  }

  return (
    <g>
      <path d={`M ${cx - ex - 20} ${ey + 3} Q ${cx - ex} ${ey - 3} ${cx - ex + 20} ${ey}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${cx + ex - 20} ${ey} Q ${cx + ex} ${ey - 3} ${cx + ex + 20} ${ey + 3}`} fill="none" stroke={config.hairColor} strokeWidth={w} strokeLinecap="round" />
    </g>
  )
}

// Change 7: NOSE SIMPLIFIED — minimal chibi, no nostrils, no bridge highlights
function NoseComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const ny = cy + 25  // adjusted for larger head
  const sd = darken(config.skinTone, 20)

  switch (config.noseShape ?? 'default') {
    case 'small':
      // Tiny dot
      return (
        <g>
          <circle cx={cx} cy={ny} r={3} fill={sd} opacity="0.35" />
        </g>
      )
    case 'wide':
      // Simple wider inverted U curve
      return (
        <g>
          <path d={`M ${cx - 10} ${ny - 6} Q ${cx - 12} ${ny + 4} ${cx - 8} ${ny + 6} Q ${cx} ${ny + 10} ${cx + 8} ${ny + 6} Q ${cx + 12} ${ny + 4} ${cx + 10} ${ny - 6}`}
            fill="none" stroke={sd} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
    case 'pointed':
      // Small triangle
      return (
        <g>
          <path d={`M ${cx} ${ny - 10} L ${cx - 5} ${ny + 6} L ${cx + 5} ${ny + 6} Z`}
            fill={sd} opacity="0.3" />
        </g>
      )
    default:
      // Simple inverted U curve — no nostrils, no bridge
      return (
        <g>
          <path d={`M ${cx - 7} ${ny - 6} Q ${cx - 9} ${ny + 4} ${cx - 5} ${ny + 6} Q ${cx} ${ny + 8} ${cx + 5} ${ny + 6} Q ${cx + 9} ${ny + 4} ${cx + 7} ${ny - 6}`}
            fill="none" stroke={sd} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )
  }
}

function MouthComp({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const my = cy + 60  // adjusted for larger head
  const isFemale = config.gender === 'female'
  const lipColor = isFemale ? '#c27068' : '#9e6b5a'
  const lipDark = darken(lipColor, 15)

  switch (config.mouthStyle ?? 'smile') {
    case 'neutral':
      return (
        <g>
          <line x1={cx - 22} y1={my} x2={cx + 22} y2={my} stroke={lipDark} strokeWidth="2.8" strokeLinecap="round" />
          <path d={`M ${cx - 20} ${my - 1} Q ${cx - 6} ${my - 4} ${cx} ${my - 2} Q ${cx + 6} ${my - 4} ${cx + 20} ${my - 1}`}
            fill="none" stroke={lipColor} strokeWidth="1.5" opacity="0.4" />
          <ellipse cx={cx} cy={my + 4} rx={13} ry={3} fill={lipColor} opacity={isFemale ? 0.25 : 0.12} />
        </g>
      )
    case 'grin':
      return (
        <g>
          <path d={`M ${cx - 28} ${my - 4} Q ${cx} ${my + 24} ${cx + 28} ${my - 4}`} fill="#5a2d1a" stroke={lipDark} strokeWidth="2.5" strokeLinecap="round" />
          <path d={`M ${cx - 22} ${my - 1} L ${cx + 22} ${my - 1} L ${cx + 20} ${my + 7} Q ${cx} ${my + 11} ${cx - 20} ${my + 7} Z`} fill="white" opacity="0.92" />
          {[-13, -4, 4, 13].map(dx => (
            <line key={dx} x1={cx + dx} y1={my - 1} x2={cx + dx} y2={my + 6} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          ))}
          <ellipse cx={cx} cy={my + 15} rx={11} ry={5} fill="#d45a5a" opacity="0.5" />
          <path d={`M ${cx - 28} ${my - 4} Q ${cx - 9} ${my - 9} ${cx} ${my - 6} Q ${cx + 9} ${my - 9} ${cx + 28} ${my - 4}`}
            fill="none" stroke={lipColor} strokeWidth="1.5" opacity="0.5" />
        </g>
      )
    case 'serious':
      return (
        <g>
          <path d={`M ${cx - 22} ${my + 2} Q ${cx} ${my - 4} ${cx + 22} ${my + 2}`} fill="none" stroke={lipDark} strokeWidth="2.8" strokeLinecap="round" />
          <path d={`M ${cx - 18} ${my + 3} Q ${cx} ${my + 9} ${cx + 18} ${my + 3}`} fill={lipColor} opacity={isFemale ? 0.2 : 0.1} />
          <ellipse cx={cx} cy={my + 15} rx={15} ry={4} fill="rgba(0,0,0,0.04)" />
        </g>
      )
    default: // smile
      return (
        <g>
          <path d={`M ${cx - 26} ${my - 2} Q ${cx} ${my + 20} ${cx + 26} ${my - 2}`} fill="none" stroke={lipDark} strokeWidth="2.8" strokeLinecap="round" />
          <path d={`M ${cx - 24} ${my - 1} Q ${cx - 8} ${my - 6} ${cx} ${my - 4} Q ${cx + 8} ${my - 6} ${cx + 24} ${my - 1}`}
            fill="none" stroke={lipColor} strokeWidth="1.5" opacity="0.5" />
          <path d={`M ${cx - 20} ${my + 2} Q ${cx} ${my + 15} ${cx + 20} ${my + 2}`} fill={lipColor} opacity={isFemale ? 0.25 : 0.15} />
          <circle cx={cx - 28} cy={my} r={2} fill="rgba(0,0,0,0.06)" />
          <circle cx={cx + 28} cy={my} r={2} fill="rgba(0,0,0,0.06)" />
        </g>
      )
  }
}

function Freckles({ cx, cy }: { cx: number; cy: number }) {
  const spots = [
    { dx: -45, dy: 16 }, { dx: -36, dy: 24 }, { dx: -52, dy: 30 },
    { dx: -42, dy: 34 }, { dx: -32, dy: 18 },
    { dx: 45, dy: 16 }, { dx: 36, dy: 24 }, { dx: 52, dy: 30 },
    { dx: 42, dy: 34 }, { dx: 32, dy: 18 },
    { dx: -6, dy: 28 }, { dx: 6, dy: 30 },
  ]
  return (
    <g>
      {spots.map((s, i) => (
        <circle key={i} cx={cx + s.dx} cy={cy + s.dy} r={1.8} fill="#8B6B4F" opacity="0.35" />
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
          <line x1={cx - 45} y1={cy - 38} x2={cx - 32} y2={cy - 24} stroke={sc} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1={cx - 44} y1={cy - 36} x2={cx - 33} y2={cy - 25} stroke={lighten(skinTone, 5)} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </g>
      )
    case 'cheek':
      return (
        <g>
          <line x1={cx + 38} y1={cy + 14} x2={cx + 56} y2={cy + 28} stroke={sc} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <line x1={cx + 39} y1={cy + 16} x2={cx + 55} y2={cy + 27} stroke={lighten(skinTone, 5)} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
        </g>
      )
    case 'chin':
      return (
        <g>
          <line x1={cx - 9} y1={cy + 72} x2={cx + 9} y2={cy + 75} stroke={sc} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <line x1={cx - 7} y1={cy + 73} x2={cx + 7} y2={cy + 75} stroke={lighten(skinTone, 5)} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
        </g>
      )
    default:
      return null
  }
}

function FacialHairComp({ style, color, cx, cy, face }: { style: string; color: string; cx: number; cy: number; face: typeof FACE_DIMS['oval'] }) {
  const c = darken(color, 10)
  const my = cy + 55  // adjusted for larger head

  switch (style) {
    case 'stubble':
      return (
        <g opacity="0.3">
          {Array.from({ length: 45 }).map((_, i) => {
            const x = cx - 40 + (i % 8) * 10 + Math.sin(i * 7) * 4
            const y = my - 10 + Math.floor(i / 8) * 8 + Math.cos(i * 5) * 3
            return <circle key={i} cx={x} cy={y} r={1.1} fill={c} />
          })}
        </g>
      )
    case 'short_beard':
      return (
        <path d={`M ${cx - 52} ${my - 10} Q ${cx - 58} ${my + 18} ${cx - 32} ${my + 38} Q ${cx} ${my + 48} ${cx + 32} ${my + 38} Q ${cx + 58} ${my + 18} ${cx + 52} ${my - 10}`}
          fill={c} opacity="0.55" />
      )
    case 'full_beard':
      return (
        <g>
          <path d={`M ${cx - 64} ${my - 18} Q ${cx - 70} ${my + 25} ${cx - 32} ${my + 62} Q ${cx} ${my + 75} ${cx + 32} ${my + 62} Q ${cx + 70} ${my + 25} ${cx + 64} ${my - 18}`}
            fill={c} opacity="0.65" />
          <path d={`M ${cx - 25} ${my + 12} Q ${cx} ${my + 25} ${cx + 25} ${my + 12}`} fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
          <path d={`M ${cx - 20} ${my + 32} Q ${cx} ${my + 44} ${cx + 20} ${my + 32}`} fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
        </g>
      )
    case 'mustache':
      return (
        <path d={`M ${cx - 26} ${my - 13} Q ${cx - 13} ${my - 19} ${cx} ${my - 15} Q ${cx + 13} ${my - 19} ${cx + 26} ${my - 13} Q ${cx + 13} ${my - 4} ${cx} ${my - 7} Q ${cx - 13} ${my - 4} ${cx - 26} ${my - 13} Z`}
          fill={c} opacity="0.7" />
      )
    case 'goatee':
      return (
        <g>
          <path d={`M ${cx - 24} ${my - 13} Q ${cx - 10} ${my - 18} ${cx} ${my - 15} Q ${cx + 10} ${my - 18} ${cx + 24} ${my - 13} Q ${cx + 10} ${my - 5} ${cx} ${my - 8} Q ${cx - 10} ${my - 5} ${cx - 24} ${my - 13} Z`}
            fill={c} opacity="0.65" />
          <path d={`M ${cx - 15} ${my + 10} Q ${cx - 19} ${my + 38} ${cx} ${my + 48} Q ${cx + 19} ${my + 38} ${cx + 15} ${my + 10}`}
            fill={c} opacity="0.55" />
        </g>
      )
    default:
      return null
  }
}

function GlassesComp({ style, cx, cy }: { style: string; cx: number; cy: number }) {
  const ey = cy - 5   // eye Y — matches EyesComp
  const ex = 40       // matches eye distance
  const fc = '#2a2a2a'

  switch (style) {
    case 'round':
      return (
        <g>
          <circle cx={cx - ex} cy={ey} r={24} fill="none" stroke={fc} strokeWidth="3" />
          <circle cx={cx + ex} cy={ey} r={24} fill="none" stroke={fc} strokeWidth="3" />
          <line x1={cx - ex + 24} y1={ey} x2={cx + ex - 24} y2={ey} stroke={fc} strokeWidth="2.5" />
          <line x1={cx - ex - 24} y1={ey - 2} x2={cx - ex - 36} y2={ey - 7} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + ex + 24} y1={ey - 2} x2={cx + ex + 36} y2={ey - 7} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx={cx - ex - 6} cy={ey - 6} rx={9} ry={6} fill="rgba(150,200,255,0.08)" />
          <ellipse cx={cx + ex - 6} cy={ey - 6} rx={9} ry={6} fill="rgba(150,200,255,0.08)" />
        </g>
      )
    case 'square':
      return (
        <g>
          <rect x={cx - ex - 24} y={ey - 18} width={46} height={34} rx={5} fill="none" stroke={fc} strokeWidth="3" />
          <rect x={cx + ex - 22} y={ey - 18} width={46} height={34} rx={5} fill="none" stroke={fc} strokeWidth="3" />
          <line x1={cx - ex + 22} y1={ey} x2={cx + ex - 22} y2={ey} stroke={fc} strokeWidth="2.5" />
          <line x1={cx - ex - 24} y1={ey - 5} x2={cx - ex - 36} y2={ey - 10} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx + ex + 24} y1={ey - 5} x2={cx + ex + 36} y2={ey - 10} stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
    case 'sport':
      return (
        <g>
          <path d={`M ${cx - ex - 28} ${ey} Q ${cx - ex - 28} ${ey - 18} ${cx - ex} ${ey - 18} Q ${cx - 6} ${ey - 18} ${cx - 6} ${ey} Q ${cx - 6} ${ey + 16} ${cx - ex} ${ey + 16} Q ${cx - ex - 28} ${ey + 16} ${cx - ex - 28} ${ey} Z`}
            fill="rgba(150,200,255,0.12)" stroke={fc} strokeWidth="2.5" />
          <path d={`M ${cx + ex + 28} ${ey} Q ${cx + ex + 28} ${ey - 18} ${cx + ex} ${ey - 18} Q ${cx + 6} ${ey - 18} ${cx + 6} ${ey} Q ${cx + 6} ${ey + 16} ${cx + ex} ${ey + 16} Q ${cx + ex + 28} ${ey + 16} ${cx + ex + 28} ${ey} Z`}
            fill="rgba(150,200,255,0.12)" stroke={fc} strokeWidth="2.5" />
          <line x1={cx - 6} y1={ey} x2={cx + 6} y2={ey} stroke={fc} strokeWidth="3" />
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
          <path d={`M ${cx - rx - 4} ${cy - 10} Q ${cx - rx - 8} ${topY - 18} ${cx - 10} ${topY - 24} Q ${cx + 15} ${topY - 28} ${cx + rx + 6} ${topY - 12} Q ${cx + rx + 4} ${topY + 5} ${cx + rx + 2} ${cy - 12} Q ${cx + rx - 15} ${topY + 12} ${cx} ${topY + 8} Q ${cx - rx + 15} ${topY + 12} ${cx - rx - 4} ${cy - 10} Z`}
            fill={color} />
          <path d={`M ${cx - rx + 10} ${topY + 5} Q ${cx - 5} ${topY - 18} ${cx + rx - 10} ${topY - 5}`}
            fill="none" stroke={dk} strokeWidth="8" opacity="0.15" strokeLinecap="round" />
          <ellipse cx={cx + 8} cy={topY - 8} rx={32} ry={12} fill={lt2} opacity="0.12" />
          {strand(cx - 30, topY + 2, cx - 10, topY - 12, cx + 25, topY - 2)}
          {strand(cx - 20, topY + 6, cx, topY - 8, cx + 35, topY + 2, 1, 0.1)}
          {strand(cx - 35, topY + 10, cx - 15, topY - 4, cx + 15, topY + 8, 1, 0.08)}
        </g>
      )
    case 'buzz':
      return (
        <g>
          <path d={`M ${cx - rx} ${cy - 5} Q ${cx - rx - 3} ${topY - 10} ${cx} ${topY - 14} Q ${cx + rx + 3} ${topY - 10} ${cx + rx} ${cy - 5} Q ${cx + rx - 12} ${topY + 8} ${cx} ${topY + 5} Q ${cx - rx + 12} ${topY + 8} ${cx - rx} ${cy - 5} Z`}
            fill={color} opacity="0.5" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI
            const pr = rx - 15 + (i % 3) * 5
            const px = cx + Math.cos(a) * pr * 0.7
            const py = topY + 10 - Math.sin(a) * (face.ry * 0.5 + (i % 4) * 3)
            return <circle key={i} cx={px} cy={py} r={1.4} fill={color} opacity={0.3 + (i % 3) * 0.1} />
          })}
          <path d={`M ${cx - rx + 15} ${topY + 8} Q ${cx} ${topY - 6} ${cx + rx - 15} ${topY + 8}`}
            fill="none" stroke={dk} strokeWidth="1.5" opacity="0.2" />
        </g>
      )
    case 'medium':
      return (
        <g>
          <path d={`M ${cx - rx - 10} ${cy + 5} Q ${cx - rx - 14} ${topY - 22} ${cx} ${topY - 28} Q ${cx + rx + 14} ${topY - 22} ${cx + rx + 10} ${cy + 5}`}
            fill={dk} />
          <path d={`M ${cx - rx - 8} ${cy} Q ${cx - rx - 12} ${topY - 20} ${cx} ${topY - 25} Q ${cx + rx + 12} ${topY - 20} ${cx + rx + 8} ${cy} Q ${cx + rx - 5} ${topY + 5} ${cx} ${topY} Q ${cx - face.rx + 5} ${topY + 5} ${cx - rx - 8} ${cy} Z`}
            fill={color} />
          <path d={`M ${cx - rx - 6} ${cy - 5} Q ${cx - rx - 20} ${cy + 12} ${cx - rx - 14} ${cy + 55}`} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
          <path d={`M ${cx + rx + 6} ${cy - 5} Q ${cx + rx + 20} ${cy + 12} ${cx + rx + 14} ${cy + 55}`} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
          <path d={`M ${cx - rx - 6} ${cy - 5} Q ${cx - rx - 16} ${cy + 10} ${cx - rx - 10} ${cy + 50}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          <path d={`M ${cx + rx + 6} ${cy - 5} Q ${cx + rx + 16} ${cy + 10} ${cx + rx + 10} ${cy + 50}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          <ellipse cx={cx - 8} cy={topY - 8} rx={34} ry={14} fill={lt2} opacity="0.12" />
          {strand(cx - 40, topY + 5, cx - 10, topY - 15, cx + 30, topY, 2, 0.1)}
          {strand(cx - 30, topY + 10, cx, topY - 10, cx + 40, topY + 5, 1.5, 0.08)}
        </g>
      )
    case 'long':
      return (
        <g>
          <path d={`M ${cx - rx - 14} ${cy + 15} Q ${cx - rx - 18} ${topY - 30} ${cx} ${topY - 38} Q ${cx + rx + 18} ${topY - 30} ${cx + rx + 14} ${cy + 15}`}
            fill={dk} />
          <path d={`M ${cx - rx - 10} ${cy + 10} Q ${cx - rx - 15} ${topY - 25} ${cx} ${topY - 30} Q ${cx + rx + 15} ${topY - 25} ${cx + rx + 10} ${cy + 10} Q ${cx + rx} ${topY} ${cx} ${topY - 5} Q ${cx - rx} ${topY} ${cx - rx - 10} ${cy + 10} Z`}
            fill={color} />
          <path d={`M ${cx - rx - 8} ${cy + 10} Q ${cx - rx - 24} ${cy + 45} ${cx - rx - 16} ${cy + 110}`} fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />
          <path d={`M ${cx - rx - 5} ${cy + 15} Q ${cx - rx - 18} ${cy + 40} ${cx - rx - 10} ${cy + 105}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          <path d={`M ${cx + rx + 8} ${cy + 10} Q ${cx + rx + 24} ${cy + 45} ${cx + rx + 16} ${cy + 110}`} fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />
          <path d={`M ${cx + rx + 5} ${cy + 15} Q ${cx + rx + 18} ${cy + 40} ${cx + rx + 10} ${cy + 105}`} fill="none" stroke={dk} strokeWidth="6" strokeLinecap="round" opacity="0.2" />
          <ellipse cx={cx + 5} cy={topY - 10} rx={40} ry={14} fill={lt2} opacity="0.1" />
          {strand(cx - 45, topY + 8, cx - 15, topY - 18, cx + 35, topY + 3, 2, 0.08)}
          {strand(cx - rx - 10, cy + 25, cx - rx - 20, cy + 60, cx - rx - 14, cy + 95, 1.5, 0.1)}
          {strand(cx + rx + 10, cy + 25, cx + rx + 20, cy + 60, cx + rx + 14, cy + 95, 1.5, 0.1)}
        </g>
      )
    case 'bun':
      return (
        <g>
          <path d={`M ${cx - rx - 3} ${cy - 10} Q ${cx - rx - 6} ${topY - 15} ${cx} ${topY - 20} Q ${cx + rx + 6} ${topY - 15} ${cx + rx + 3} ${cy - 10} Q ${cx + rx - 10} ${topY + 10} ${cx} ${topY + 5} Q ${cx - rx + 10} ${topY + 10} ${cx - rx - 3} ${cy - 10} Z`}
            fill={color} />
          <ellipse cx={cx} cy={topY - 22} rx={34} ry={27} fill={dk} />
          <ellipse cx={cx} cy={topY - 22} rx={32} ry={25} fill={color} />
          <path d={`M ${cx - 9} ${topY - 32} Q ${cx + 6} ${topY - 40} ${cx + 14} ${topY - 26} Q ${cx + 9} ${topY - 15} ${cx - 6} ${topY - 18} Q ${cx - 14} ${topY - 26} ${cx - 9} ${topY - 32}`}
            fill="none" stroke={dk} strokeWidth="1.5" opacity="0.25" />
          <ellipse cx={cx - 6} cy={topY - 30} rx={14} ry={9} fill={lt2} opacity="0.12" />
          <ellipse cx={cx} cy={topY - 4} rx={20} ry={6} fill={dk} opacity="0.4" />
          {strand(cx - 30, topY + 10, cx - 15, topY - 5, cx, topY - 2, 1, 0.12)}
          {strand(cx + 30, topY + 10, cx + 15, topY - 5, cx, topY - 2, 1, 0.12)}
        </g>
      )
    case 'curly':
      return (
        <g>
          <path d={`M ${cx - rx - 16} ${cy + 10} Q ${cx - rx - 20} ${topY - 28} ${cx} ${topY - 35} Q ${cx + rx + 20} ${topY - 28} ${cx + rx + 16} ${cy + 10} Q ${cx + rx + 5} ${topY} ${cx} ${topY + 5} Q ${cx - rx - 5} ${topY} ${cx - rx - 16} ${cy + 10} Z`}
            fill={color} />
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2
            const radius = rx + 6 + (i % 2) * 6
            const puffCx = cx + Math.cos(angle) * radius * 0.85
            const puffCy = cy - 25 + Math.sin(angle) * 52
            const r = 13 + (i % 3) * 3
            return <circle key={`o${i}`} cx={puffCx} cy={puffCy} r={r} fill={color} />
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const puffCx = cx + Math.cos(angle) * (rx - 20)
            const puffCy = cy - 30 + Math.sin(angle) * 38
            return <circle key={`i${i}`} cx={puffCx} cy={puffCy} r={9} fill={dk} opacity="0.15" />
          })}
          <ellipse cx={cx - 10} cy={topY - 10} rx={22} ry={16} fill={lt2} opacity="0.1" />
          {[[-28, -16], [22, -11], [-12, 6], [34, 1], [-38, 12]].map(([dx, dy], i) => (
            <circle key={`s${i}`} cx={cx + dx} cy={topY + dy} r={4.5} fill="none" stroke={lt} strokeWidth="1" opacity="0.15" />
          ))}
        </g>
      )
    case 'mohawk':
      return (
        <g>
          <path d={`M ${cx - rx} ${cy - 5} Q ${cx - rx - 2} ${topY} ${cx - 22} ${topY + 5} L ${cx + 22} ${topY + 5} Q ${cx + rx + 2} ${topY} ${cx + rx} ${cy - 5}`}
            fill={color} opacity="0.15" />
          <path d={`M ${cx - 20} ${topY + 10} Q ${cx - 24} ${topY - 50} ${cx} ${topY - 65} Q ${cx + 24} ${topY - 50} ${cx + 20} ${topY + 10} Z`}
            fill={color} />
          <path d={`M ${cx - 13} ${topY + 8} Q ${cx - 17} ${topY - 42} ${cx} ${topY - 54} Q ${cx + 17} ${topY - 42} ${cx + 13} ${topY + 8}`}
            fill={dk} opacity="0.2" />
          <path d={`M ${cx - 5} ${topY - 50} Q ${cx} ${topY - 60} ${cx + 5} ${topY - 50}`}
            fill="none" stroke={lt2} strokeWidth="3" opacity="0.2" strokeLinecap="round" />
          {[-9, -3, 2, 8].map((dx, i) => (
            <line key={i} x1={cx + dx} y1={topY + 5} x2={cx + dx + 1} y2={topY - 44 - i * 5} stroke={lt} strokeWidth="1" opacity="0.12" />
          ))}
        </g>
      )
    case 'ponytail':
      return (
        <g>
          <path d={`M ${cx - rx - 3} ${cy - 10} Q ${cx - rx - 6} ${topY - 15} ${cx} ${topY - 20} Q ${cx + rx + 6} ${topY - 15} ${cx + rx + 3} ${cy - 10} Q ${cx + rx - 10} ${topY + 10} ${cx} ${topY + 5} Q ${cx - rx + 10} ${topY + 10} ${cx - rx - 3} ${cy - 10} Z`}
            fill={color} />
          <ellipse cx={cx} cy={topY + 8} rx={20} ry={16} fill={color} />
          <ellipse cx={cx} cy={topY + 20} rx={12} ry={5} fill={dk} opacity="0.5" />
          <path d={`M ${cx - 9} ${topY + 25} Q ${cx + 12} ${cy + 12} ${cx + 9} ${cy + 58} Q ${cx + 4} ${cy + 74} ${cx + 6} ${cy + 68}`}
            fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
          <path d={`M ${cx - 4} ${topY + 27} Q ${cx + 7} ${cy + 14} ${cx + 5} ${cy + 54}`}
            fill="none" stroke={dk} strokeWidth="5" opacity="0.15" strokeLinecap="round" />
          <ellipse cx={cx + 5} cy={topY - 5} rx={26} ry={10} fill={lt2} opacity="0.1" />
          {strand(cx - 35, topY + 10, cx - 15, topY, cx, topY + 10, 1, 0.1)}
          {strand(cx + 35, topY + 10, cx + 15, topY, cx, topY + 10, 1, 0.1)}
        </g>
      )
    case 'braids':
      return (
        <g>
          <path d={`M ${cx - rx - 5} ${cy} Q ${cx - rx - 8} ${topY - 18} ${cx} ${topY - 22} Q ${cx + rx + 8} ${topY - 18} ${cx + rx + 5} ${cy} Q ${cx + rx - 5} ${topY + 5} ${cx} ${topY} Q ${cx - rx + 5} ${topY + 5} ${cx - rx - 5} ${cy} Z`}
            fill={color} />
          <line x1={cx} y1={topY - 18} x2={cx} y2={topY + 10} stroke={dk} strokeWidth="1.5" opacity="0.3" />
          <path d={`M ${cx - rx + 2} ${cy + 5} Q ${cx - rx - 14} ${cy + 38} ${cx - rx - 8} ${cy + 90}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
          <path d={`M ${cx - rx + 2} ${cy + 5} Q ${cx - rx - 12} ${cy + 36} ${cx - rx - 6} ${cy + 88}`} fill="none" stroke={dk} strokeWidth="4" opacity="0.15" strokeLinecap="round" />
          <path d={`M ${cx + rx - 2} ${cy + 5} Q ${cx + rx + 14} ${cy + 38} ${cx + rx + 8} ${cy + 90}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
          <path d={`M ${cx + rx - 2} ${cy + 5} Q ${cx + rx + 12} ${cy + 36} ${cx + rx + 6} ${cy + 88}`} fill="none" stroke={dk} strokeWidth="4" opacity="0.15" strokeLinecap="round" />
          {[0, 1, 2, 3, 4, 5].map(i => {
            const y = cy + 14 + i * 14
            const bx = cx - rx - 3 - i * 1.8
            return <path key={`l${i}`} d={`M ${bx - 6} ${y - 3} L ${bx + 6} ${y + 3} M ${bx + 6} ${y - 3} L ${bx - 6} ${y + 3}`}
              stroke={lt} strokeWidth="1" opacity="0.2" />
          })}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const y = cy + 14 + i * 14
            const bx = cx + rx + 3 + i * 1.8
            return <path key={`r${i}`} d={`M ${bx - 6} ${y - 3} L ${bx + 6} ${y + 3} M ${bx + 6} ${y - 3} L ${bx - 6} ${y + 3}`}
              stroke={lt} strokeWidth="1" opacity="0.2" />
          })}
          <circle cx={cx - rx - 8} cy={cy + 92} r={4.5} fill={dk} opacity="0.4" />
          <circle cx={cx + rx + 8} cy={cy + 92} r={4.5} fill={dk} opacity="0.4" />
          <ellipse cx={cx} cy={topY - 8} rx={28} ry={9} fill={lt2} opacity="0.08" />
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
