import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProperties } from '../api/properties.js';
import { PropertyCard } from '../components/PropertyCard.jsx';
import { PropertyGridSkeleton } from '../components/PropertyGridSkeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { addWishlist, fetchWishlist, removeWishlist } from '../api/wishlist.js';

const categories = [
  { icon: "⛰️", label: "Amazing views", val: "North" },
  { icon: "🏖️", label: "Beachfront", val: "West" },
  { icon: "🏊‍♂️", label: "Amazing pools", val: "South" },
  { icon: "🏰", label: "Castles", val: "Central" },
  { icon: "🏙️", label: "Iconic cities", val: "East" },
  { icon: "🌲", label: "Cabins", val: "Northeast" },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [wishIds, setWishIds] = useState(() => new Set());
  const [activeCategory, setActiveCategory] = useState(categories[0].val);

  useEffect(() => {
    let timeoutId;
    async function load() {
      // Show cached properties immediately if available
      const cached = localStorage.getItem('heavenhub_home_properties');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProperties(Array.isArray(parsed) ? parsed.slice(0, 16) : []);
          setLoading(false); // don't show skeleton if we have cache
        } catch {
          // ignore cache parse error
        }
      } else {
        setLoading(true);
      }
      
      setLoadError(null);
      
      // If the backend takes more than 5 seconds, show a helpful message
      timeoutId = setTimeout(() => {
        setLoadError('Backend is waking up (free tier). This might take 1-2 minutes. Please wait...');
      }, 5000);

      try {
        const data = await fetchProperties();
        const topProperties = Array.isArray(data) ? data.slice(0, 16) : [];
        setProperties(topProperties);
        localStorage.setItem('heavenhub_home_properties', JSON.stringify(topProperties));
        setLoadError(null);
      } catch (e) {
        console.error(e);
        if (!cached) {
          setProperties([]);
        }
        setLoadError('Could not load listings. Start the backend (or set VITE_DEV_PROXY_TARGET) and refresh.');
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }
    load();
    return () => clearTimeout(timeoutId);
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
      } catch { /* silent */ }
    })();
    return () => { cancelled = true; };
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
      } else {
        await addWishlist(user.id, propertyId);
        setWishIds((prev) => new Set(prev).add(propertyId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const SarcasticHero = () => (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-white px-6 py-24 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-70"></div>
      
      <div className="relative z-10 max-w-4xl">
        <span className="mb-4 inline-block animate-fade-up rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
          The honest booking platform
        </span>
        <h1 className="animate-fade-up mb-6 font-display text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
          Book a place. Or don't. <br className="hidden sm:block" />
          <span className="text-airbnb">We already have investors.</span>
        </h1>
        <p className="animate-fade-up-delay mx-auto max-w-2xl text-lg text-gray-500 sm:text-xl">
          Stop scrolling through fake 5-star reviews. Experience the mediocre reality of travel without the marketing fluff. We promise a roof. Anything else is extra.
        </p>
        <div className="animate-fade-up-delay mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => {
              document.getElementById('property-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-full bg-airbnb px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-airbnb-hover hover:shadow-xl"
          >
            Show me the properties
          </button>
          <button
            onClick={() => navigate('/hotels')}
            className="rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50"
          >
            Advanced Search (Nerd)
          </button>
        </div>
      </div>
    </section>
  );

  const Features = () => (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Not HeavenHub?
          </h2>
          <p className="mt-4 text-lg text-gray-500">Features you didn't ask for, but are getting anyway.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { title: 'Zero Guarantees', desc: 'If the wifi drops, pretend it’s a digital detox. It’s a feature, not a bug.', icon: '🤷‍♂️' },
            { title: 'Instant Regret', desc: 'Book instantly. No refunds when you realize you hate nature and bugs.', icon: '💸' },
            { title: 'Aggressive Hosts', desc: 'They will message you 5 times before you arrive to ask your arrival time.', icon: '📱' },
          ].map((f, i) => (
            <div key={i} className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const ReviewsMarquee = () => {
    const reviews = [
      { text: "The ghost in the attic was surprisingly polite. 4/5 stars.", author: "Sarah from Ohio" },
      { text: "They charged me $50 for breathing the air in the lobby. Would visit again.", author: "John D." },
      { text: "I asked for a sea view. I got a poster of the ocean. Fair enough.", author: "Mike T." },
      { text: "The bed was harder than my math exam. My back is perfectly aligned now.", author: "Emily R." },
      { text: "No wifi meant I had to talk to my spouse. 1/5 stars.", author: "Dave" },
      { text: "Found a raccoon in the kitchen. We named him Bob. Best trip ever.", author: "Alice M." }
    ];

    return (
      <section className="overflow-hidden bg-white py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">
            Real Reviews from "Real" People
          </h2>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="flex w-max animate-[marquee_25s_linear_infinite] gap-6">
            {[...reviews, ...reviews, ...reviews].map((r, i) => (
              <div key={i} className="w-[350px] shrink-0 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="mb-4 flex text-airbnb">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{r.text}"</p>
                <p className="mt-4 text-sm font-semibold text-gray-900">- {r.author}</p>
              </div>
            ))}
          </div>
          {/* Gradient overlays for smooth fading edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent"></div>
        </div>
      </section>
    );
  };

  const Stats = () => (
    <section className="bg-navy-900 py-24 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-12 sm:grid-cols-3 text-center">
          <div>
            <div className="text-5xl font-extrabold text-airbnb mb-2">1.2M</div>
            <div className="text-lg font-medium text-gray-300">Mosquitoes slapped by our guests</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-airbnb mb-2">404</div>
            <div className="text-lg font-medium text-gray-300">F*cks given by customer support</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-airbnb mb-2">$0</div>
            <div className="text-lg font-medium text-gray-300">Our marketing budget this year</div>
          </div>
        </div>
      </div>
    </section>
  );

  const FinalCTA = () => (
    <section className="bg-white py-32 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-4xl font-bold tracking-tight text-gray-900 mb-6">
          You scrolled this far?
        </h2>
        <p className="text-xl text-gray-500 mb-10">
          Clearly you have nothing better to do. Stop procrastinating and just book a stay already. Or at least go to sleep.
        </p>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
        >
          Take me back to the top
        </button>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <SarcasticHero />

      {/* 2. Category Bar (Sticky) */}
      <div id="property-grid" className="sticky top-[73px] z-30 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 pt-4 flex gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                setActiveCategory(cat.val);
                navigate(`/hotels?region=${cat.val}`);
              }}
              className={`flex flex-col items-center gap-2 min-w-max transition-all ${
                activeCategory === cat.val
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-2 opacity-100'
                  : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-2 border-b-2 border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <span className="text-2xl grayscale">{cat.icon}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Property Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Properties that probably won't disappoint</h2>
          <p className="text-gray-500 mt-1">Or maybe they will. Only one way to find out.</p>
        </div>
        
        {loading ? (
          <PropertyGridSkeleton count={8} />
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <p className="font-display text-2xl font-bold text-gray-900">No stays to show</p>
            <p className="mt-2 text-sm text-stone-600">
              {loadError || 'Try browsing Hotels or change the region.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/hotels')}
                className="rounded-full bg-airbnb px-6 py-3 text-sm font-semibold text-white transition hover:bg-airbnb-hover"
              >
                Browse hotels
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {loadError && (
              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 border border-blue-100 flex items-center justify-between">
                <span>{loadError}</span>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  showWishlist={isAuthenticated && role === 'GUEST'}
                  wishlisted={wishIds.has(p.id)}
                  onToggleWishlist={() => toggleWishlist(p.id)}
                />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => navigate('/hotels')}
                className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                Show more properties (If you insist)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. Features Section */}
      <Features />

      {/* 5. Reviews Marquee */}
      <ReviewsMarquee />

      {/* 6. Stats Section */}
      <Stats />

      {/* 7. Final CTA */}
      <FinalCTA />
    </div>
  );
}
