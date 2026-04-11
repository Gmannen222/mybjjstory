import Skeleton from './Skeleton'

interface ListSkeletonProps {
  count?: number
  showHeader?: boolean
  headerWidth?: string
}

export default function ListSkeleton({
  count = 4,
  showHeader = true,
  headerWidth = '8rem',
}: ListSkeletonProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <Skeleton shape="line" width={headerWidth} height="2rem" />
          <Skeleton shape="line" width="7rem" height="2.25rem" className="rounded-lg" />
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton shape="line" width="60%" height="1.125rem" className="mb-2" />
                <Skeleton shape="line" width="40%" height="0.875rem" />
              </div>
              <Skeleton shape="line" width="1.5rem" height="1rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      <div className="bg-surface rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex justify-end gap-2 mb-4">
          <Skeleton shape="line" width="5rem" height="2.25rem" className="rounded-lg" />
          <Skeleton shape="line" width="2.5rem" height="2.25rem" className="rounded-lg" />
        </div>
        <div className="flex flex-col items-center">
          <Skeleton shape="line" width="140px" height="140px" className="rounded-2xl mb-5" />
          <Skeleton shape="line" width="12rem" height="1.75rem" className="mb-2" />
          <Skeleton shape="line" width="6rem" height="0.875rem" className="mb-4" />
          <Skeleton shape="line" width="16rem" height="2rem" className="rounded-lg mb-4" />
          <Skeleton shape="line" width="20rem" height="0.875rem" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-4 text-center">
            <Skeleton shape="line" width="2rem" height="1.5rem" className="mx-auto mb-1" />
            <Skeleton shape="line" width="3rem" height="2rem" className="mx-auto mb-1" />
            <Skeleton shape="line" width="4rem" height="0.75rem" className="mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Skeleton shape="line" width="4rem" height="2rem" className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton shape="avatar" />
              <div className="flex-1">
                <Skeleton shape="line" width="8rem" height="0.875rem" className="mb-1" />
                <Skeleton shape="line" width="5rem" height="0.75rem" />
              </div>
            </div>
            <Skeleton shape="line" width="100%" height="0.875rem" className="mb-2" />
            <Skeleton shape="line" width="80%" height="0.875rem" className="mb-4" />
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <Skeleton shape="line" width="4rem" height="1.5rem" />
              <Skeleton shape="line" width="4rem" height="1.5rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AchievementsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Skeleton shape="line" width="8rem" height="2rem" className="mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" width="3rem" height="3rem" />
              <div className="flex-1">
                <Skeleton shape="line" width="70%" height="1rem" className="mb-2" />
                <Skeleton shape="line" width="50%" height="0.75rem" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AcademiesSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        <div className="mb-6">
          <Skeleton shape="line" width="8rem" height="2rem" className="mb-2" />
          <Skeleton shape="line" width="16rem" height="1rem" />
        </div>
        <Skeleton shape="line" width="100%" height="2.75rem" className="rounded-lg mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-5">
              <Skeleton shape="line" width="70%" height="1.125rem" className="mb-2" />
              <Skeleton shape="line" width="90%" height="0.875rem" className="mb-1" />
              <Skeleton shape="line" width="50%" height="0.875rem" className="mb-3" />
              <Skeleton shape="line" width="6rem" height="1.75rem" className="rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
