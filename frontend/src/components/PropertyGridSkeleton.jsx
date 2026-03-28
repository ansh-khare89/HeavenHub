/**
 * Skeleton grid: communicates loading state like a production app, not a tutorial.
 */
export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="h-56 animate-shimmer bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06] bg-[length:200%_100%]" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-[62%] animate-shimmer rounded-lg bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06] bg-[length:200%_100%]" />
            <div className="h-3 w-[38%] animate-shimmer rounded-lg bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06] bg-[length:200%_100%]" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-14 animate-shimmer rounded-xl bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06] bg-[length:200%_100%]" />
              <div className="h-14 animate-shimmer rounded-xl bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06] bg-[length:200%_100%]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
