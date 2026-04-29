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
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await fetchProperties();
        // Just show a bunch of properties for the home feed
        setProperties(Array.isArray(data) ? data.slice(0, 16) : []);
      } catch (e) {
        console.error(e);
        setProperties([]);
        setLoadError('Could not load listings. Start the backend (or set VITE_DEV_PROXY_TARGET) and refresh.');
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

  return (
    <div className="min-h-screen">
      {/* Category Bar */}
      <div className="sticky top-[73px] z-30 bg-white/90 backdrop-blur border-b border-gray-200">
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

      {/* Property Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
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
        )}
      </main>
    </div>
  );
}
