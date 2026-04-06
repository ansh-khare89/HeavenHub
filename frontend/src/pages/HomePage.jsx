import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProperties } from '../api/properties.js';
import { PropertyCard } from '../components/PropertyCard.jsx';
import { PropertyGridSkeleton } from '../components/PropertyGridSkeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { addWishlist, fetchWishlist, removeWishlist } from '../api/wishlist.js';
import { ApiError } from '../api/client.js';

export function HomePage() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishIds, setWishIds] = useState(() => new Set());

  // Vibe Matcher State
  const [vibeStep, setVibeStep] = useState(0); // 0=start, 1=who, 2=where, 3=vibe
  const [vibeState, setVibeState] = useState({ who: '', where: '', type: '' });

  const handleVibeMatch = () => {
    let qs = new URLSearchParams();
    if (vibeState.who === 'Family') qs.set('minRating', '4.5');
    if (vibeState.who === 'Pets') qs.set('petFriendly', 'true');
    if (vibeState.where === 'Mountains') qs.set('region', 'North');
    if (vibeState.where === 'Beaches') qs.set('region', 'West');
    if (vibeState.type === 'Luxury') qs.set('minPrice', '8000');
    if (vibeState.type === 'Budget') qs.set('maxPrice', '4000');
    
    navigate(`/hotels?${qs.toString()}`);
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProperties();
        // Just take the first 4 for the homepage as 'Featured'
        setProperties(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (e) {
        toast.error('Could not load featured properties.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Vibe Matcher */}
      <section className="relative mx-auto max-w-6xl px-4 pb-6 pt-12 md:px-6 md:pt-24 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-sky-400/90">
              Welcome to HeavenHub
            </p>
            <h1 className="animate-fade-up mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[4.5rem]">
              Discover your next{' '}
              <span className="bg-gradient-to-r from-sky-200 via-cyan-200 to-amber-100/90 bg-clip-text text-transparent">
                escape
              </span>
              .
            </h1>
            <p className="animate-fade-up-delay mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
              Curated stays from metros to hill stations — priced in ₹, rated honestly, filtered in seconds. Experience India like never before.
            </p>
            <div className="animate-fade-up-delay mt-10">
              <Link
                to="/hotels"
                className="inline-flex rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-8 py-3.5 text-sm font-semibold text-[#050b14] shadow-lg shadow-sky-500/25 transition hover:brightness-110"
              >
                Explore all hotels
              </Link>
            </div>
          </div>

          <div className="animate-fade-up-delay bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold font-display text-white mb-6">Travel Vibe Matcher</h2>
            
            {vibeStep === 0 && (
              <div className="text-center py-6">
                <p className="text-slate-300 mb-6">Not sure where to go? Let us find the perfect curated stay based on your vibe.</p>
                <button 
                  onClick={() => setVibeStep(1)}
                  className="rounded-full bg-sky-500/20 border border-sky-400/50 px-6 py-3 text-sky-200 hover:bg-sky-500/30 font-semibold transition"
                >
                  Start Matcher ✨
                </button>
              </div>
            )}

            {vibeStep === 1 && (
              <div className="animate-fade-in">
                <p className="text-slate-300 mb-4 font-semibold uppercase tracking-wider text-sm">Step 1: Who is going?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Solo', 'Couple', 'Family', 'Pets'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => { setVibeState(s => ({...s, who: opt})); setVibeStep(2); }}
                      className="border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {vibeStep === 2 && (
              <div className="animate-fade-in">
                <p className="text-slate-300 mb-4 font-semibold uppercase tracking-wider text-sm">Step 2: What's the scenery?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Mountains', 'Beaches', 'City Hub', 'Heritage'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => { setVibeState(s => ({...s, where: opt})); setVibeStep(3); }}
                      className="border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {vibeStep === 3 && (
              <div className="animate-fade-in">
                <p className="text-slate-300 mb-4 font-semibold uppercase tracking-wider text-sm">Step 3: What's the budget vibe?</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Luxury', 'Balanced', 'Budget'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setVibeState(s => ({...s, type: opt}))}
                      className={`border rounded-xl p-4 text-center transition ${vibeState.type === opt ? 'bg-sky-500/40 border-sky-400' : 'border-white/10 hover:bg-white/10'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleVibeMatch}
                  disabled={!vibeState.type}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-4 font-bold text-[#050b14] shadow-lg disabled:opacity-50"
                >
                  Find My Vibe →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Featured stays</h2>
            <p className="mt-1 text-sm text-slate-500">Hand-picked properties for your next trip</p>
          </div>
        </div>

        {loading ? (
          <PropertyGridSkeleton count={4} />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                showWishlist={isAuthenticated && role === 'GUEST'}
                wishlisted={wishIds.has(p.id)}
                onToggleWishlist={() => toggleWishlist(p.id)}
                compareSelected={false}
                onToggleCompare={() => {}}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/hotels"
            className="inline-flex rounded-full border border-sky-400/50 bg-[#0a1628]/95 px-6 py-3 text-sm font-semibold text-sky-200 shadow-xl transition hover:border-sky-400 hover:bg-sky-500/10"
          >
            View all {properties.length > 0 ? 'hotels' : 'stays'} →
          </Link>
        </div>
      </section>
    </div>
  );
}
