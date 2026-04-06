import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProperties } from '../api/properties.js';
import { addWishlist, fetchWishlist, removeWishlist } from '../api/wishlist.js';
import { ApiError } from '../api/client.js';
import { CompareStaysModal } from '../components/CompareStaysModal.jsx';
import { IndiaExplorerMap } from '../components/IndiaExplorerMap.jsx';
import { PropertyCard } from '../components/PropertyCard.jsx';
import { PropertyGridSkeleton } from '../components/PropertyGridSkeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatInr } from '../utils/money.js';

const REGIONS = [
  { value: '', label: 'All regions' },
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
  { value: 'East', label: 'East' },
  { value: 'West', label: 'West' },
  { value: 'Central', label: 'Central' },
  { value: 'Northeast', label: 'Northeast' },
  { value: 'Islands', label: 'Islands' },
];

const SORTS = [
  { value: 'featured', label: 'Featured mix' },
  { value: 'price_asc', label: 'Price · low to high' },
  { value: 'price_desc', label: 'Price · high to low' },
  { value: 'rating_desc', label: 'Rating · highest' },
];

/** Quick picks — align with seeded cities; prices are typical “from” hints for UX */
const CITY_SPOTLIGHT = [
  { city: 'Panaji', hint: 'Beach & susegad', from: 15400 },
  { city: 'Kochi', hint: 'Backwaters', from: 12400 },
  { city: 'Shimla', hint: 'Pine & ridge', from: 1450 },
  { city: 'Jaipur', hint: 'Pink City', from: 6200 },
  { city: 'Bengaluru', hint: 'Workations', from: 5100 },
  { city: 'Kolkata', hint: 'Culture', from: 5400 },
  { city: 'Port Blair', hint: 'Islands', from: 11200 },
  { city: 'Varanasi', hint: 'Spiritual', from: 1750 },
  { city: 'Ooty', hint: 'Tea hills', from: 8900 },
  { city: 'Hyderabad', hint: 'Heritage', from: 4200 },
];

function seasonalCopy() {
  const m = new Date().getMonth();
  if (m >= 10 || m <= 1) {
    return 'Winter glow: hill stations & desert nights — filter “North” or tap Shimla on the map.';
  }
  if (m >= 5 && m <= 8) {
    return 'Monsoon mode: Western Ghats & Kerala — pet-friendly stays hide under Instant book.';
  }
  return 'Shoulder season: fewer crowds in heritage towns — sort by rating and compare three stays.';
}

export function HotelsPage() {
  const { user, role, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishIds, setWishIds] = useState(() => new Set());

  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [propertyTypeQ, setPropertyTypeQ] = useState(searchParams.get('propertyType') || '');
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(searchParams.get('petFriendly') === 'true');
  const [instantOnly, setInstantOnly] = useState(searchParams.get('instantBook') === 'true');
  const [superhostOnly, setSuperhostOnly] = useState(searchParams.get('superhost') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState(() => new Set());

  const query = useMemo(() => {
    const q = {};
    const loc = location.trim();
    if (loc) q.location = loc;
    const mp = String(minPrice).trim();
    const xp = String(maxPrice).trim();
    const mr = String(minRating).trim();
    if (mp !== '') q.minPrice = mp;
    if (xp !== '') q.maxPrice = xp;
    if (mr !== '') q.minRating = mr;
    if (region) q.region = region;
    const pt = propertyTypeQ.trim();
    if (pt) q.propertyType = pt;
    if (petFriendlyOnly) q.petFriendly = true;
    if (instantOnly) q.instantBook = true;
    if (superhostOnly) q.superhost = true;
    return q;
  }, [location, minPrice, maxPrice, minRating, region, propertyTypeQ, petFriendlyOnly, instantOnly, superhostOnly]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProperties(query);
      setProperties(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? `${e.message} (check API URL or network — production: heavenhub-production.up.railway.app)`
            : 'Could not load listings';
      toast.error(msg);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isAuthenticated || role !== 'GUEST' || !user?.id) {
      setWishIds(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchWishlist(user.id);
        if (cancelled) return;
        setWishIds(new Set((list || []).map((p) => p.id)));
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, role, user?.id]);

  const sorted = useMemo(() => {
    const arr = [...properties];
    if (sort === 'price_asc') {
      arr.sort((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));
    } else if (sort === 'price_desc') {
      arr.sort((a, b) => Number(b.pricePerNight) - Number(a.pricePerNight));
    } else if (sort === 'rating_desc') {
      arr.sort((a, b) => Number(b.averageRating || 0) - Number(a.averageRating || 0));
    } else {
      arr.sort((a, b) => Number(b.superhost) - Number(a.superhost) || Number(b.averageRating || 0) - Number(a.averageRating || 0));
    }
    return arr;
  }, [properties, sort]);

  const compareList = useMemo(
    () => sorted.filter((p) => compareIds.has(p.id)),
    [sorted, compareIds],
  );

  const priceBand = useMemo(() => {
    if (!properties.length) return null;
    let lo = Infinity;
    let hi = -Infinity;
    for (const p of properties) {
      const n = Number(p.pricePerNight);
      if (n < lo) lo = n;
      if (n > hi) hi = n;
    }
    return { lo, hi };
  }, [properties]);

  const toggleWishlist = async (propertyId) => {
    if (!user?.id) return;
    const on = wishIds.has(propertyId);
    try {
      if (on) {
        await removeWishlist(user.id, propertyId);
        setWishIds((prev) => {
          const n = new Set(prev);
          n.delete(propertyId);
          return n;
        });
        toast.success('Removed from wishlist');
      } else {
        await addWishlist(user.id, propertyId);
        setWishIds((prev) => new Set(prev).add(propertyId));
        toast.success('Saved to wishlist');
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Wishlist update failed');
    }
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
        return n;
      }
      if (n.size >= 3) {
        toast.error('Compare up to three stays — remove one first');
        return prev;
      }
      n.add(id);
      return n;
    });
  };

  const resetFilters = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setRegion('');
    setPropertyTypeQ('');
    setPetFriendlyOnly(false);
    setInstantOnly(false);
    setSuperhostOnly(false);
    setSort('featured');
  };

  return (
    <div className="relative overflow-hidden">
      <section className="relative mx-auto max-w-6xl px-4 pb-6 pt-12 md:px-6 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-sky-400/90">
              India-wide · ₹ transparent
            </p>
            <h1 className="animate-fade-up mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[3.25rem]">
              Stays that feel{' '}
              <span className="bg-gradient-to-r from-sky-200 via-cyan-200 to-amber-100/90 bg-clip-text text-transparent">
                local
              </span>
              , priced like{' '}
              <span className="bg-gradient-to-r from-amber-100/90 via-white to-sky-200 bg-clip-text text-transparent">
                home
              </span>
              .
            </h1>
            <p className="animate-fade-up-delay mt-5 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
              {priceBand ? (
                <>
                  Live inventory spans{' '}
                  <span className="text-sky-200/90">{properties.length} hand-picked listings</span> from{' '}
                  <span className="font-medium text-white">{formatInr(priceBand.lo)}</span> to{' '}
                  <span className="font-medium text-white">{formatInr(priceBand.hi)}</span> per night — metros,
                  ghats, beaches &amp; peaks.
                </>
              ) : (
                <>Curated stays from metros to hill stations — priced in ₹, rated honestly, filtered in seconds.</>
              )}
            </p>

            <div className="animate-fade-up-delay mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/95">
                <span className="font-semibold text-emerald-200">HeavenHub clarity</span>
                <span className="text-emerald-100/80"> — cleaning + platform fee shown before you pay.</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-up-delay rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">Trip pulse</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{seasonalCopy()}</p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
            <p className="mt-4 text-xs text-slate-500">
              Tip: save a search — filters sync when you hit apply. Use Compare to line up three finalists.
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto pb-2 [scrollbar-width:thin]">
          <div className="flex min-w-min gap-2">
            {CITY_SPOTLIGHT.map((s) => (
              <button
                key={s.city}
                type="button"
                onClick={() => {
                  setLocation(s.city);
                  setRegion('');
                }}
                className="group shrink-0 rounded-2xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-left transition hover:border-sky-400/40 hover:bg-sky-500/10"
              >
                <span className="block font-display text-sm font-semibold text-white">{s.city}</span>
                <span className="mt-0.5 block text-[11px] text-slate-500">{s.hint}</span>
                <span className="mt-1 block text-[10px] font-medium text-sky-300/90">from ~ {formatInr(s.from)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 md:px-6">
        <IndiaExplorerMap
          properties={properties}
          activeCity={location.trim()}
          onSelectCity={(city) => {
            setLocation(city);
            window.scrollTo({ top: 420, behavior: 'smooth' });
          }}
        />
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-sky-900/25 backdrop-blur-xl md:p-6">
          <div className="grid gap-4 lg:grid-cols-6">
            <label className="flex flex-col gap-1 text-xs text-slate-400 lg:col-span-2">
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or state — e.g. Jaipur, Kerala…"
                className="rounded-xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 placeholder:text-slate-600 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Region
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 focus:ring-2"
              >
                {REGIONS.map((r) => (
                  <option key={r.value || 'all'} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Stay type
              <input
                value={propertyTypeQ}
                onChange={(e) => setPropertyTypeQ(e.target.value)}
                placeholder="villa, haveli…"
                className="rounded-xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 placeholder:text-slate-600 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Min ₹ / night
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="1500"
                className="rounded-xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 placeholder:text-slate-600 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Max ₹ / night
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="15000"
                className="rounded-xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 placeholder:text-slate-600 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              Min rating
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                placeholder="4.2"
                className="rounded-xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 placeholder:text-slate-600 focus:ring-2"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={petFriendlyOnly}
                onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                className="rounded border-white/20 bg-[#050b14] text-sky-400 focus:ring-sky-400/40"
              />
              Pet-friendly
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={instantOnly}
                onChange={(e) => setInstantOnly(e.target.checked)}
                className="rounded border-white/20 bg-[#050b14] text-sky-400 focus:ring-sky-400/40"
              />
              Instant book
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={superhostOnly}
                onChange={(e) => setSuperhostOnly(e.target.checked)}
                className="rounded border-white/20 bg-[#050b14] text-sky-400 focus:ring-sky-400/40"
              />
              Superhost
            </label>
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-400">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={load}
              className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-[#050b14] shadow-lg shadow-sky-500/25 transition hover:brightness-110"
            >
              Apply filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-white"
            >
              Reset
            </button>
            {compareIds.size > 0 && (
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="rounded-full border border-amber-400/40 bg-amber-500/10 px-6 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20"
              >
                Compare ({compareIds.size})
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Homes worth the detour</h2>
            <p className="text-sm text-slate-500">
              {loading ? 'Loading…' : `${sorted.length} listing${sorted.length === 1 ? '' : 's'} match`}
            </p>
          </div>
        </div>

        {loading ? (
          <PropertyGridSkeleton count={6} />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                showWishlist={isAuthenticated && role === 'GUEST'}
                wishlisted={wishIds.has(p.id)}
                onToggleWishlist={() => toggleWishlist(p.id)}
                compareSelected={compareIds.has(p.id)}
                onToggleCompare={() => toggleCompare(p.id)}
              />
            ))}
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-white">No matches — yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Try another city, widen your ₹ range, or clear badges — India&apos;s a big country; there&apos;s room to
              search.
            </p>
          </div>
        )}
      </section>

      <CompareStaysModal open={compareOpen} onClose={() => setCompareOpen(false)} properties={compareList} />

      {compareIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2">
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            className="rounded-full border border-amber-400/50 bg-[#0a1628]/95 px-6 py-3 text-sm font-semibold text-amber-100 shadow-2xl backdrop-blur-md transition hover:bg-amber-500/20"
          >
            Open compare · {compareIds.size}/3
          </button>
        </div>
      )}
    </div>
  );
}
