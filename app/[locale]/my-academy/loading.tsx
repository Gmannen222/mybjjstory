import Skeleton from '@/components/ui/Skeleton'

export default function MyAcademyLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      {/* Academy header skeleton */}
      <div className="bg-surface rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-start gap-4">
          <Skeleton shape="line" width="4rem" height="4rem" className="rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <Skeleton shape="line" width="12rem" height="1.75rem" className="mb-2" />
            <Skeleton shape="line" width="8rem" height="0.875rem" />
          </div>
        </div>
      </div>

      {/* Members header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton shape="line" width="7rem" height="1.25rem" />
        <Skeleton shape="line" width="5rem" height="0.875rem" />
      </div>

      {/* Member cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" width="2.75rem" height="2.75rem" />
              <div className="flex-1">
                <Skeleton shape="line" width="60%" height="1rem" className="mb-2" />
                <Skeleton shape="line" width="4rem" height="1.5rem" className="rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
