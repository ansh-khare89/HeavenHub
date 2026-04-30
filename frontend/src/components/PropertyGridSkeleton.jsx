/**
 * Skeleton grid: communicates loading state like a production app, not a tutorial.
 */
export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="h-56 animate-pulse bg-gray-200" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-[62%] animate-pulse rounded-lg bg-gray-200" />
            <div className="h-3 w-[38%] animate-pulse rounded-lg bg-gray-200" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
