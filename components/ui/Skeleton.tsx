interface SkeletonProps {
  shape?: 'line' | 'circle' | 'card' | 'avatar'
  width?: string
  height?: string
  className?: string
}

export default function Skeleton({
  shape = 'line',
  width,
  height,
  className = '',
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-surface-hover'

  const shapeClasses: Record<string, string> = {
    line: 'rounded h-4 w-full',
    circle: 'rounded-full w-10 h-10',
    card: 'rounded-xl w-full h-32',
    avatar: 'rounded-full w-12 h-12',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div
      className={`${baseClasses} ${shapeClasses[shape]} ${className}`}
      style={style}
    />
  )
}
