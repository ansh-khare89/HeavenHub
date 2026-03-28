/**
 * Stylized India explorer: approximate lat/lng → SVG coords for interactive city dots.
 */
function project(lat, lng) {
  const minLng = 68;
  const maxLng = 97.5;
  const minLat = 6.5;
  const maxLat = 35.5;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return { x: Math.min(96, Math.max(4, x)), y: Math.min(92, Math.max(8, y)) };
}

/** Simplified silhouette + Andaman inset for visual polish (not cartographic). */
function IndiaSilhouette() {
  return (
    <g opacity={0.35}>
      <path
        fill="url(#hh-india-fill)"
        stroke="rgba(56, 189, 248, 0.35)"
        strokeWidth={0.35}
        d="M46 8 L58 10 L66 18 L72 28 L74 40 L70 52 L62 62 L52 68 L42 72 L32 68 L24 58 L18 46 L16 32 L20 20 L28 12 Z M78 58 L84 62 L88 70 L86 78 L80 82 L74 78 L72 70 Z"
      />
      <ellipse cx={88} cy={72} rx={4} ry={2.2} fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.25)" strokeWidth={0.2} />
    </g>
  );
}

export function IndiaExplorerMap({ properties, activeCity, onSelectCity }) {
  const withCoords = (properties || []).filter((p) => p.latitude != null && p.longitude != null);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#0a1628] via-[#050b14] to-[#0a1628] p-4 shadow-2xl shadow-sky-900/30 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/90">Live atlas</p>
          <h3 className="font-display text-lg font-bold text-white md:text-xl">Tap a glow — jump to that city</h3>
          <p className="mt-1 text-xs text-slate-500">Coordinates match each listing; filters apply below.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
          {withCoords.length} pinned stays
        </div>
      </div>

      <div className="relative mx-auto aspect-[16/9] max-h-[280px] w-full md:max-h-[320px]">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          role="img"
          aria-label="India explorer map with stay locations"
        >
          <defs>
            <linearGradient id="hh-india-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.02)" />
            </linearGradient>
            <filter id="hh-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width={100} height={100} fill="rgba(5, 11, 20, 0.6)" rx={2} />
          <IndiaSilhouette />
          {withCoords.map((p) => {
            const lat = Number(p.latitude);
            const lng = Number(p.longitude);
            const { x, y } = project(lat, lng);
            const on = activeCity && p.city && activeCity.toLowerCase() === p.city.toLowerCase();
            return (
              <g key={p.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={on ? 4.5 : 3}
                  fill={on ? 'rgba(56, 189, 248, 0.95)' : 'rgba(56, 189, 248, 0.55)'}
                  filter="url(#hh-glow)"
                  className="cursor-pointer transition-all duration-300 hover:opacity-100"
                  onClick={() => onSelectCity?.(p.city)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectCity?.(p.city);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Filter by ${p.city}`}
                />
                <circle cx={x} cy={y} r={on ? 8 : 6} fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth={0.4} />
              </g>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-lg bg-black/40 px-2 py-1 text-[10px] text-slate-500 backdrop-blur-sm">
          Illustrative projection · listings are real
        </div>
      </div>
    </div>
  );
}
