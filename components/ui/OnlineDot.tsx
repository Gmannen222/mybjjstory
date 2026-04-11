'use client'

interface OnlineDotProps {
  isOnline: boolean
  size?: 'sm' | 'md'
}

export default function OnlineDot({ isOnline, size = 'sm' }: OnlineDotProps) {
  if (!isOnline) return null

  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'

  return (
    <span
      className={`absolute bottom-0 right-0 ${dotSize} rounded-full bg-[#22c55e] ring-2 ring-surface`}
    >
      <span
        className={`absolute inset-0 rounded-full bg-[#22c55e] animate-ping opacity-75`}
      />
    </span>
  )
}
