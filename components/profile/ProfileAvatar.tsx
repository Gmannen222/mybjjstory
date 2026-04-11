'use client'

import Image from 'next/image'
import OnlineDot from '@/components/ui/OnlineDot'
import { useOnlineStatus } from '@/components/realtime/RealtimeProvider'

interface ProfileAvatarProps {
  userId: string
  avatarUrl: string | null
  displayName: string | null
  size?: 'sm' | 'md' | 'lg'
}

export default function ProfileAvatar({
  userId,
  avatarUrl,
  displayName,
  size = 'md',
}: ProfileAvatarProps) {
  const { isOnline } = useOnlineStatus()

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  }

  const imageSizes = {
    sm: 40,
    md: 64,
    lg: 80,
  }

  const dotSize = size === 'sm' ? 'sm' : 'md'

  return (
    <div className="relative inline-block">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt=""
          width={imageSizes[size]}
          height={imageSizes[size]}
          className={`${sizeClasses[size]} rounded-full`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary`}
        >
          {(displayName || '?')[0].toUpperCase()}
        </div>
      )}
      <OnlineDot isOnline={isOnline(userId)} size={dotSize} />
    </div>
  )
}
