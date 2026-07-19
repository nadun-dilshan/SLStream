function SkeletonCard() {
  return <div className="shimmer h-40 w-full rounded-lg sm:h-44" />
}

function SkeletonRow() {
  return (
    <div>
      <div className="shimmer mb-3 h-5 w-40 rounded" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Netflix-style loading skeleton — shown while a route chunk loads
 * instead of a blank screen or spinner.
 */
export default function PageSkeleton() {
  return (
    <div className="animate-fade-in space-y-8" aria-hidden="true">
      {/* Billboard */}
      <div className="shimmer h-64 w-full rounded-2xl sm:h-72" />
      {/* Search bar */}
      <div className="shimmer h-12 w-full rounded-lg" />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  )
}
