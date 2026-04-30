import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { searchPropertiesPageable } from '../api/properties.js';
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
  { value: 'featured', label: 'Featured mix', dbSort: 'superhost,desc' },
  { value: 'price_asc', label: 'Price · low to high', dbSort: 'pricePerNight,asc' },
  { value: 'price_desc', label: 'Price · high to low', dbSort: 'pricePerNight,desc' },
  { value: 'rating_desc', label: 'Rating · highest', dbSort: 'averageRating,desc' },
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
  const [loadMessage, setLoadMessage] = useState(null);
  const [wishIds, setWishIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
    let timeoutId;
    const cacheKey = `heavenhub_hotels_${JSON.stringify(query)}_${sort}_${currentPage}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProperties(parsed.content || []);
        setTotalPages(parsed.totalPages || 0);
        setLoading(false);
      } catch {
        // ignore cache parse error
      }
    } else {
      setLoading(true);
    }

    setLoadMessage(null);
    timeoutId = setTimeout(() => {
      setLoadMessage('Backend is waking up (free tier). This might take 1-2 minutes. Please wait...');
    }, 5000);

    try {
      // Get database sort parameter from frontend sort value
      const sortObj = SORTS.find(s => s.value === sort);
      const dbSort = sortObj?.dbSort || 'superhost,desc';
      
      const pageData = await searchPropertiesPageable({
        ...query,
        page: currentPage,
        size: 20,
        sort: dbSort,
      });
      
      setProperties(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      localStorage.setItem(cacheKey, JSON.stringify(pageData));
      setLoadMessage(null);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? `${e.message} (check API URL or network)`
            : 'Could not load listings';
      toast.error(msg);
      if (!cached) setProperties([]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [query, sort, currentPage]);

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

  // Properties are already sorted by the database, so no client-side sorting needed
  const sorted = properties;

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
    setCurrentPage(0);
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    load();
  };

  return (
    <div className="relative overflow-hidden">
      <section className="relative mx-auto max-w-6xl px-4 pb-6 pt-12 md:px-6 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-hotel-gold">
              India-wide · ₹ transparent
            </p>
            <h1 className="animate-fade-up mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-[3.25rem]">
              Find your next stay.
            </h1>
            <p className="animate-fade-up-delay mt-5 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
              {priceBand ? (
                <>
                  Live inventory spans{' '}
                  <span className="text-hotel-accent font-semibold">{properties.length} hand-picked listings</span> from{' '}
                  <span className="font-medium text-stone-900">{formatInr(priceBand.lo)}</span> to{' '}
                  <span className="font-medium text-stone-900">{formatInr(priceBand.hi)}</span> per night — metros,
                  ghats, beaches &amp; peaks.
                </>
              ) : (
                <>Curated stays from metros to hill stations — priced in ₹, rated honestly, filtered in seconds.</>
              )}
            </p>

            <div className="animate-fade-up-delay mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                <span className="font-semibold text-hotel-accent">HeavenHub clarity</span>
                <span className="text-stone-500"> — cleaning + platform fee shown before you pay.</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-up-delay rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Trip pulse</p>
            <p className="mt-2 text-sm text-gray-500">{seasonalCopy()}</p>
            <div className="mt-4 h-px bg-gray-200" />
            <p className="mt-4 text-xs text-gray-400">
              Tip: Use Compare to line up three finalists.
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
                className="group shrink-0 rounded-full border border-gray-200 bg-white px-5 py-2 text-left transition hover:border-gray-900"
              >
                <span className="block text-sm font-semibold text-gray-900">{s.city}</span>
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
        <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-lg md:p-6">
          <div className="grid gap-4 lg:grid-cols-6">
            <label className="flex flex-col gap-1 text-xs text-stone-500 lg:col-span-2">
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or state — e.g. Jaipur, Kerala…"
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none ring-hotel-gold/50 placeholder:text-stone-400 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-500">
              Region
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none ring-hotel-gold/50 focus:ring-2"
              >
                {REGIONS.map((r) => (
                  <option key={r.value || 'all'} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-500">
              Stay type
              <input
                value={propertyTypeQ}
                onChange={(e) => setPropertyTypeQ(e.target.value)}
                placeholder="villa, haveli…"
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none ring-hotel-gold/50 placeholder:text-stone-400 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-500">
              Min ₹ / night
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="1500"
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none ring-hotel-gold/50 placeholder:text-stone-400 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-500">
              Max ₹ / night
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="15000"
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none ring-hotel-gold/50 placeholder:text-stone-400 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-500">
              Min rating
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                placeholder="4.2"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-stone-100 pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={petFriendlyOnly}
                onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                className="rounded border-stone-300 text-hotel-gold focus:ring-hotel-gold/40"
              />
              Pet-friendly
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={instantOnly}
                onChange={(e) => setInstantOnly(e.target.checked)}
                className="rounded border-stone-300 text-hotel-gold focus:ring-hotel-gold/40"
              />
              Instant book
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={superhostOnly}
                onChange={(e) => setSuperhostOnly(e.target.checked)}
                className="rounded border-stone-300 text-hotel-gold focus:ring-hotel-gold/40"
              />
              Superhost
            </label>
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-stone-500">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900"
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
              onClick={handleApplyFilters}
              className="rounded-lg bg-airbnb px-6 py-3 text-sm font-semibold text-white transition hover:bg-airbnb-hover"
            >
              Apply filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
            >
              Reset
            </button>
            {compareIds.size > 0 && (
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="rounded-full border border-stone-300 bg-white px-6 py-2.5 text-sm font-semibold text-hotel-accent transition hover:bg-stone-50"
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
            <h2 className="font-display text-3xl font-bold text-hotel-accent md:text-4xl">Homes worth the detour</h2>
            <p className="text-sm text-stone-500 mt-1">
              {loading ? 'Loading…' : `${sorted.length} listing${sorted.length === 1 ? '' : 's'} match`}
            </p>
          </div>
        </div>

        {loadMessage && (
          <div className="mb-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 border border-blue-100 flex items-center justify-between">
            <span>{loadMessage}</span>
          </div>
        )}

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

        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-stone-500">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition"
            >
              Next
            </button>
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50 px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-hotel-accent">No matches — yet</p>
            <p className="mt-2 text-sm text-stone-500">
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
