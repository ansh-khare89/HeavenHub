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
    if (vibeState.who === 'squad') qs.set('minRating', '4.5');
    if (vibeState.who === 'pets') qs.set('petFriendly', 'true');
    if (vibeState.where === 'mountains') qs.set('region', 'North');
    if (vibeState.where === 'beaches') qs.set('region', 'West');
    if (vibeState.type === 'luxury') qs.set('minPrice', '8000');
    if (vibeState.type === 'budget') qs.set('maxPrice', '4000');
    
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
              Welcome to HeavenHub (No Halos Required)
            </p>
            <h1 className="animate-fade-up mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-[4.5rem]">
              Stop doom-scrolling.<br />Start{' '}
              <span className="bg-gradient-to-r from-sky-200 via-cyan-200 to-amber-100/90 bg-clip-text text-transparent">
                escaping
              </span>
              .
            </h1>
            <p className="animate-fade-up-delay mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
              Tired of your boss? Exhausted by traffic? We have highly curated hideaways priced in ₹, where your only worry is whether to order room service again. (Do it, you deserve it).
            </p>
            <div className="animate-fade-up-delay mt-10">
              <Link
                to="/hotels"
                className="inline-flex rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-8 py-3.5 text-sm font-semibold text-[#050b14] shadow-lg shadow-sky-500/25 transition hover:brightness-110"
              >
                Take me away immediately
              </Link>
            </div>
          </div>

          <div className="animate-fade-up-delay bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold font-display text-white mb-6">The Vibe Interrogator 9000</h2>
            
            {vibeStep === 0 && (
              <div className="text-center py-6">
                <p className="text-slate-300 mb-6">Too burnt out to plan? Let our highly judgmental algorithm pick your vacation based on your emotional state.</p>
                <button 
                  onClick={() => setVibeStep(1)}
                  className="rounded-full bg-sky-500/20 border border-sky-400/50 px-6 py-3 text-sky-200 hover:bg-sky-500/30 font-semibold transition"
                >
                  Read my mind ✨
                </button>
              </div>
            )}

            {vibeStep === 1 && (
              <div className="animate-fade-in">
                <p className="text-slate-300 mb-4 font-semibold uppercase tracking-wider text-sm">Step 1: Who's crashing this party?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: 'Me, myself, & I', v: 'solo' },
                    { l: 'Romantic cliché', v: 'couple' },
                    { l: 'The chaotic squad', v: 'squad' },
                    { l: 'The favorite child (Pets)', v: 'pets' }
                  ].map(opt => (
                    <button 
                      key={opt.v}
                      onClick={() => { setVibeState(s => ({...s, who: opt.v})); setVibeStep(2); }}
                      className="border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition text-sm"
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {vibeStep === 2 && (
              <div className="animate-fade-in">
                <p className="text-slate-300 mb-4 font-semibold uppercase tracking-wider text-sm">Step 2: What are we staring at?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: 'Freezing peaks', v: 'mountains' },
                    { l: 'Sand everywhere', v: 'beaches' },
                    { l: 'Concrete jungle', v: 'city' },
                    { l: 'Old expensive rocks', v: 'heritage' }
                  ].map(opt => (
                    <button 
                      key={opt.v}
                      onClick={() => { setVibeState(s => ({...s, where: opt.v})); setVibeStep(3); }}
                      className="border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition text-sm"
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {vibeStep === 3 && (
              <div className="animate-fade-in">
                <p className="text-slate-300 mb-4 font-semibold uppercase tracking-wider text-sm">Step 3: How's the bank account feeling?</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { l: 'Make it rain', v: 'luxury' },
                    { l: 'Reasonable adulting', v: 'balanced' },
                    { l: 'Instant noodles vibe', v: 'budget' }
                  ].map(opt => (
                    <button 
                      key={opt.v}
                      onClick={() => setVibeState(s => ({...s, type: opt.v}))}
                      className={`border rounded-xl p-4 text-center transition text-sm ${vibeState.type === opt.v ? 'bg-sky-500/40 border-sky-400' : 'border-white/10 hover:bg-white/10'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleVibeMatch}
                  disabled={!vibeState.type}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-4 font-bold text-[#050b14] shadow-lg disabled:opacity-50"
                >
                  Teleport me there →
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
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Places better than your house</h2>
            <p className="mt-1 text-sm text-slate-500">Properties we'd totally live in if we didn't have to work here</p>
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
            Show me more shiny things →
          </Link>
        </div>
      </section>
    </div>
  );
}
