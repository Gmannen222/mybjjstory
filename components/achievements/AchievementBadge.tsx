'use client'

const ICON_MAP: Record<string, string> = {
  trophy: '\u{1F3C6}',
  fire: '\u{1F525}',
  star: '\u2B50',
  crown: '\u{1F451}',
  gem: '\u{1F48E}',
  medal: '\u{1F3C5}',
  rocket: '\u{1F680}',
  flame: '\u{1F525}',
  lightning: '\u26A1',
  diamond: '\u{1F4A0}',
  clock: '\u23F0',
  calendar: '\u{1F4C5}',
  belt: '\u{1F94B}',
  gold_medal: '\u{1F947}',
}

interface AchievementBadgeProps {
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string | null
  size?: 'sm' | 'md'
}

export default function AchievementBadge({
  name,
  description,
  icon,
  earned,
  earnedAt,
  size = 'md',
}: AchievementBadgeProps) {
  const emoji = ICON_MAP[icon] || '\u{1F3C6}'

  return (
    <div
      className={`relative rounded-xl border transition-all ${
        earned
          ? 'bg-surface border-primary/30 shadow-[0_0_12px_-3px_rgba(201,168,76,0.3)]'
          : 'bg-surface/50 border-white/5 opacity-40 grayscale'
      } ${size === 'sm' ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center rounded-lg ${
          earned ? 'bg-primary/15' : 'bg-white/5'
        } ${size === 'sm' ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-2xl'}`}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold truncate ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {name}
          </div>
          <div className={`text-muted truncate ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
            {description}
          </div>
          {earned && earnedAt && (
            <div className="text-[10px] text-primary mt-0.5">
              {new Date(earnedAt).toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>
        {earned && (
          <div className="text-primary text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
