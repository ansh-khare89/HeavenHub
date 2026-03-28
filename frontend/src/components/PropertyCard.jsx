import { Link } from 'react-router-dom';
import { formatInr } from '../utils/money.js';

export function PropertyCard({ property, wishlisted, onToggleWishlist, showWishlist, compareSelected, onToggleCompare }) {
  const rating = property.averageRating != null ? Number(property.averageRating) : null;
  const cleaning = property.cleaningFee != null ? Number(property.cleaningFee) : 0;
  const platformPct = property.platformFeePercent != null ? Number(property.platformFeePercent) : 12;
  const amenityList = (property.amenities || '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/85 to-navy-900 shadow-[0_20px_60px_-30px_rgba(56,189,248,0.35)] transition duration-500 [transform-style:preserve-3d] [perspective:1200px] hover:-translate-y-1.5 hover:border-sky-400/35 hover:shadow-[0_28px_80px_-24px_rgba(56,189,248,0.45)]">
      <Link
        to={`/property/${property.id}`}
        className="relative block h-56 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent opacity-90" />
        <img
          src={`https://picsum.photos/seed/hh-${property.id}/800/520`}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex max-w-[calc(100%-5rem)] flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-sky-100 backdrop-blur-md">
            {property.city}
            {property.state ? `, ${property.state}` : ''}
          </span>
          {property.superhost && (
            <span className="rounded-full bg-amber-500/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100 backdrop-blur-md">
              Superhost
            </span>
          )}
          {property.instantBook && (
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-100 backdrop-blur-md">
              Instant
            </span>
          )}
        </div>
        <div className="absolute right-4 top-4 z-[2] flex flex-col gap-2">
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare();
              }}
              className={`flex h-9 items-center justify-center rounded-full border px-3 text-[11px] font-semibold backdrop-blur-md transition hover:scale-105 ${
                compareSelected
                  ? 'border-amber-400/60 bg-amber-500/25 text-amber-100'
                  : 'border-white/20 bg-black/35 text-white/90 hover:border-amber-400/50'
              }`}
            >
              {compareSelected ? '✓ Compare' : 'Compare'}
            </button>
          )}
          {showWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWishlist?.();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/35 text-lg backdrop-blur-md transition hover:scale-110 hover:border-rose-400/60 hover:bg-rose-500/20"
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <span className={wishlisted ? 'text-rose-400' : 'text-white/80'}>{wishlisted ? '♥' : '♡'}</span>
            </button>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              {property.propertyType || 'Stay'}
              {property.region ? ` · ${property.region}` : ''}
            </p>
            <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-white">{property.title}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {property.bedrooms != null && property.bathrooms != null
                ? `${property.bedrooms} bd · ${property.bathrooms} ba · `
                : ''}
              up to {property.maxGuests} guests
              {property.petFriendly ? ' · Pet OK' : ''}
            </p>
          </div>
          {rating != null && (
            <div className="shrink-0 rounded-lg bg-sky-500/10 px-2 py-1 text-right text-sm font-semibold text-sky-200">
              <span className="block">★ {rating.toFixed(2)}</span>
              {property.reviewCount != null && (
                <span className="block text-[10px] font-normal text-slate-500">({property.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {amenityList.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {amenityList.map((a) => (
              <span
                key={a}
                className="rounded-md border border-white/5 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400"
              >
                {a}
              </span>
            ))}
          </div>
        )}

        <dl className="mt-auto grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">Base / night</dt>
            <dd className="mt-1 text-sm font-semibold text-white">{formatInr(property.pricePerNight)}</dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">Cleaning</dt>
            <dd className="mt-1 text-sm font-semibold text-white">{formatInr(cleaning)}</dd>
          </div>
          <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">Platform service fee</dt>
            <dd className="mt-1 text-sm font-semibold text-sky-200">{platformPct}% of stay subtotal</dd>
          </div>
        </dl>

        <Link
          to={`/property/${property.id}`}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/35 bg-sky-500/10 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/20 hover:shadow-glow-sm"
        >
          Open listing
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
