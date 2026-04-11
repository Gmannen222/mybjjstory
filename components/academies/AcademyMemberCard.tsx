import Link from 'next/link'
import Image from 'next/image'
import { BeltBadge, getBeltColor } from '@/components/ui/BeltBadge'
import { isSafeUrl } from '@/lib/url'

interface MemberProfile {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  belt_rank: string | null
}

interface AcademyMemberCardProps {
  profile: MemberProfile
  locale: string
  isYou?: boolean
  youLabel?: string
}

export default function AcademyMemberCard({
  profile,
  locale,
  isYou,
  youLabel = 'Deg',
}: AcademyMemberCardProps) {
  const name = profile.display_name || profile.username || 'Ukjent'
  const initial = name.charAt(0).toUpperCase()
  const beltColor = getBeltColor(profile.belt_rank)

  const content = (
    <div className="relative bg-surface rounded-xl border border-white/10 p-4 hover:border-primary/40 transition-colors overflow-hidden">
      {/* Belt color strip at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: beltColor }}
      />

      <div className="flex items-center gap-3 pt-1">
        {/* Avatar */}
        {profile.avatar_url && isSafeUrl(profile.avatar_url) ? (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0 border-2 border-white/10"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold border-2 border-white/10"
            style={{ backgroundColor: `${beltColor}22`, color: beltColor }}
          >
            {initial}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">{name}</span>
            {isYou && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium flex-shrink-0">
                {youLabel}
              </span>
            )}
          </div>
          {profile.belt_rank && (
            <div className="mt-1">
              <BeltBadge rank={profile.belt_rank} />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (profile.username) {
    return (
      <Link href={`/${locale}/profile/${profile.username}`}>
        {content}
      </Link>
    )
  }

  return content
}
