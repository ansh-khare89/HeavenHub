import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProperties } from '../api/properties.js';
import { PropertyCard } from '../components/PropertyCard.jsx';
import { PropertyGridSkeleton } from '../components/PropertyGridSkeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { addWishlist, fetchWishlist, removeWishlist } from '../api/wishlist.js';

export function HomePage() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishIds, setWishIds] = useState(() => new Set());
  const [pageRating, setPageRating] = useState(0);

  // Luxury Concierge (Matcher)
  const [vibeStep, setVibeStep] = useState(0); 
  const [vibeState, setVibeState] = useState({ who: '', where: '', type: '' });

  const handleVibeMatch = () => {
    let qs = new URLSearchParams();
    if (vibeState.who.includes('Family')) qs.set('minRating', '4.5');
    if (vibeState.who.includes('Pets')) qs.set('petFriendly', 'true');
    if (vibeState.where.includes('Mountains')) qs.set('region', 'North');
    if (vibeState.where.includes('Beaches')) qs.set('region', 'West');
    if (vibeState.type.includes('Luxury')) qs.set('minPrice', '8000');
    if (vibeState.type.includes('Budget')) qs.set('maxPrice', '4000');
    
    navigate(`/hotels?${qs.toString()}`);
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProperties();
        setProperties(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (e) {
        toast.error('The concierge failed to retrieve our exclusive properties.');
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
        toast.success('Removed from your exclusive list.');
      } else {
        await addWishlist(user.id, propertyId);
        setWishIds((prev) => new Set(prev).add(propertyId));
        toast.success('Saved. Splendid choice.');
      }
    } catch (e) {
      toast.error('The concierge refused your request.');
    }
  };

  // 8 Structured Reviews
  const reviews = [
    { name: "Ansh Khare", text: "The booking process was incredibly smooth. I found the perfect premium retreat within minutes.", stars: 5, role: "Frequent Traveler" },
    { name: "Sarah J.", text: "I love the transparent pricing. Knowing exactly what I'm paying upfront makes budgeting for trips so much easier.", stars: 5, role: "Family Trip Planner" },
    { name: "Vikram S.", text: "The built-in recommendations engine is spot on. It found me exactly what I was looking for.", stars: 5, role: "Business Professional" },
    { name: "Aria M.", text: "Unmatched quality and verified properties give me absolute peace of mind when booking.", stars: 5, role: "Travel Content Creator" },
    { name: "David T.", text: "Excellent customer service and fantastic locations. Highly recommended.", stars: 4, role: "Solo Adventurer" },
    { name: "Priya R.", text: "This is now my go-to platform for vacation rentals. Simply the best.", stars: 5, role: "Vacation Enthusiast" },
    { name: "Suresh P.", text: "Great interface, super easy to filter stays based on our pet requirements.", stars: 5, role: "Pet Parent" },
    { name: "Nina K.", text: "Loved the seamless experience from start to finish. Everything was transparent and trustworthy.", stars: 5, role: "Event Organizer" },
  ];

  return (
    <div className="relative overflow-hidden bg-premium-dark text-slate-200 min-h-screen">
      <div className="bg-noise"></div>
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/30 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none z-0"></div>
      
      {/* SCROLL 1: Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 min-h-[90vh] flex items-center pt-20 md:pt-0 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full relative">
          
          <div className="relative z-10">
            <div className="inline-block border border-cyan-400/30 rounded-full px-4 py-1 mb-6 bg-premium-panel backdrop-blur-md shadow-neon-cyan/20">
              <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                The Elite Standard
              </p>
            </div>
            <h1 className="animate-fade-up mt-2 font-anton text-6xl md:text-7xl lg:text-[7.5rem] uppercase leading-[0.95] tracking-wide text-white drop-shadow-2xl">
              FIND YOUR <br/>
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">PERFECT STAY</span>
            </h1>
            <p className="animate-fade-up-delay mt-8 max-w-xl text-lg leading-relaxed text-slate-300 font-medium">
              Discover and book hand-picked, premium accommodations tailored to your unique preferences. Because you deserve better than your ex's couch.
            </p>
            <div className="animate-fade-up-delay mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                to="/hotels"
                className="inline-flex rounded-lg bg-gradient-to-r from-fuchsia-600 to-violet-600 px-12 py-4 text-lg font-bold uppercase tracking-widest text-white shadow-neon-purple transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.8)]"
              >
                Explore Stays
              </Link>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <div className="text-left border-l-2 border-white/10 pl-4">
                  <p className="text-2xl font-anton text-white">50+</p>
                  <p className="text-xs text-fuchsia-400 font-bold uppercase tracking-widest">Premium Listings</p>
                </div>
                <div className="text-left border-l-2 border-white/10 pl-4">
                  <p className="text-2xl font-anton text-white">1000+</p>
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Happy Guests</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-up-delay bg-premium-panel border border-premium-border p-8 rounded-2xl shadow-2xl relative z-10 backdrop-blur-xl">
            <h2 className="text-2xl font-anton uppercase text-white mb-6 border-b border-white/10 pb-3 tracking-widest">
              Smart Recommendations
            </h2>
            
            {vibeStep === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-300 mb-8 font-medium">Let our intelligent engine find your ideal retreat based on your group size, preferred scenery, and budget. Because we know you can't make decisions on your own.</p>
                <button 
                  onClick={() => setVibeStep(1)}
                  className="rounded-lg bg-cyan-400/10 border border-cyan-400/50 px-8 py-4 text-cyan-300 font-black uppercase tracking-widest transition hover:bg-cyan-400 hover:text-black w-full shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                >
                  Start Matchmaker
                </button>
              </div>
            )}

            {vibeStep === 1 && (
              <div className="animate-fade-in py-6">
                <p className="text-fuchsia-400 mb-6 font-bold uppercase tracking-wider text-sm">Select Your Party Size:</p>
                <div className="grid grid-cols-1 gap-4">
                  {['Solo Traveler', 'Couple (Romantic Retreat)', 'Family & Pets (Spacious)'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => { setVibeState(s => ({...s, who: opt})); setVibeStep(2); }}
                      className="border border-white/10 bg-black/40 rounded p-5 text-left hover:border-fuchsia-500 hover:text-fuchsia-400 transition font-medium tracking-wide uppercase text-sm shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {vibeStep === 2 && (
              <div className="animate-fade-in py-6">
                <p className="text-cyan-400 mb-6 font-bold uppercase tracking-wider text-sm">Select Preferred Scenery:</p>
                <div className="grid grid-cols-1 gap-4">
                  {['Mountains (Cool & Serene)', 'Beaches (Coastal Views)', 'Metropolis (Urban Luxury)'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => { setVibeState(s => ({...s, where: opt})); setVibeStep(3); }}
                      className="border border-white/10 bg-black/40 rounded p-5 text-left hover:border-cyan-400 hover:text-cyan-300 transition font-medium tracking-wide uppercase text-sm shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {vibeStep === 3 && (
              <div className="animate-fade-in py-6">
                <p className="text-violet-400 mb-6 font-bold uppercase tracking-wider text-sm">Select Budget Tier:</p>
                <div className="grid grid-cols-1 gap-4 mb-10">
                  {['Ultra Luxury (Premium Features)', 'Premium (Great Value)'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setVibeState(s => ({...s, type: opt}))}
                      className={`border rounded p-5 text-left font-bold tracking-wide uppercase text-sm transition ${vibeState.type === opt ? 'bg-violet-600 border-violet-500 text-white shadow-neon-purple' : 'border-white/10 bg-black/40 hover:border-violet-500 hover:text-violet-300'}`}
                    >
                      {opt}
                    </button>
                  ))}
                 </div>
                <button 
                  onClick={handleVibeMatch}
                  disabled={!vibeState.type}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-4 font-black uppercase text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125 transition"
                >
                  View Personalized Results →
                </button>
              </div>
            )}
           </div>
        </div>
      </section>

      {/* Colourful Gradient Divider */}
      <div className="w-full h-14 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 flex items-center overflow-hidden border-y border-white/10 box-border z-20 relative shadow-[0_0_50px_rgba(168,85,247,0.3)]">
        <div className="whitespace-nowrap animate-shimmer font-anton text-2xl uppercase text-white tracking-widest min-w-full drop-shadow-md">
          SMART FILTERING • VERIFIED PREMIUM PROPERTIES • INSTANT BOOKING • MULTIPLE REGIONS • 24/7 GUEST SUPPORT • EXCLUSIVE EXPERIENCES • SMART FILTERING • 
        </div>
      </div>

      {/* SCROLL 2: Bento Features */}
      <section className="relative mx-auto max-w-7xl px-4 py-32 z-10 w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-[100%] bg-violet-600/10 blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="font-anton text-4xl md:text-6xl uppercase text-white tracking-wide">Why Tolerate Ordinary?</h2>
          <p className="mt-4 text-cyan-400 font-medium uppercase tracking-widest text-sm">The HeavenHub Advantage is practically unfair.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] relative z-10">
          {/* Large Left Box */}
          <div 
            onClick={() => navigate('/hotels')}
            className="md:col-span-2 md:row-span-2 rounded-3xl bg-premium-panel backdrop-blur-xl border border-white/10 p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-700"></div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-fuchsia-500/30 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10">
              <h3 className="font-anton text-5xl text-white uppercase mb-4">Transparent Pricing</h3>
              <p className="text-slate-300 text-xl max-w-lg font-light leading-relaxed">No hidden fees, no last-minute surprises. We display standard rates, cleaning fees, and service charges upfront so you can see exactly why you'll be eating instant noodles next month.</p>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
               <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                 <p className="text-fuchsia-400 font-bold mb-1">Clear Breakdown</p>
                 <p className="text-white text-2xl font-anton">100%</p>
                 <p className="text-xs text-slate-400 mt-1">Cost transparency.</p>
               </div>
               <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                 <p className="text-fuchsia-400 font-bold mb-1">Guest Satisfaction</p>
                 <p className="text-white text-2xl font-anton">4.9/5</p>
                 <p className="text-xs text-slate-400 mt-1">Highly rated by users.</p>
               </div>
            </div>
          </div>
          
          {/* Top Right Box */}
          <div 
            onClick={() => navigate('/about')}
            className="rounded-3xl bg-premium-panel backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-center relative group overflow-hidden shadow-xl cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <h3 className="font-anton text-3xl text-cyan-300 uppercase mb-4 relative z-10">Verified Properties</h3>
            <p className="text-slate-300 text-sm relative z-10 leading-relaxed mb-4">Every property is vetted for accurate photos, amenities, and host reliability. What you see is precisely what you get. No weird smells or haunted basements (unless you pay extra).</p>
            <div className="text-cyan-400 font-bold uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">Learn the Truth →</div>
          </div>
          
          {/* Bottom Right Box */}
          <div 
             onClick={() => navigate('/faq')}
             className="rounded-3xl bg-premium-panel backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-center relative group overflow-hidden shadow-xl cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <h3 className="font-anton text-3xl text-violet-400 uppercase mb-4 relative z-10">Dedicated Hosts</h3>
            <p className="text-slate-300 text-sm relative z-10 leading-relaxed mb-4">Our hosts are committed to providing premium service. From local tips to personalized touches, they ensure a memorable stay. They also promise to only judge your questionable life choices behind your back.</p>
             <div className="text-violet-400 font-bold uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">Read FAQ →</div>
          </div>
        </div>
      </section>

      {/* SCROLL 3: Destination Spotlight */}
      <section className="relative w-full bg-black/40 py-32 border-y border-white/5 z-10 overflow-hidden backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="font-anton text-4xl md:text-6xl uppercase text-white tracking-wide drop-shadow-xl">Popular Destinations</h2>
              <p className="mt-2 text-slate-400 text-lg">Curated locations for every type of traveler.</p>
            </div>
            <Link to="/hotels" className="mt-6 md:mt-0 uppercase tracking-widest text-fuchsia-400 font-bold hover:text-white transition text-sm flex items-center gap-2">
              Explore All Regions <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Box 1 (Alpine) */}
            <div 
              onClick={() => navigate('/hotels?region=North')}
              className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl bg-black"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-60"
                style={{ backgroundImage: "url('/peak.png')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent border border-white/10 group-hover:border-emerald-500/50 transition duration-500"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-emerald-400/10 opacity-0 group-hover:opacity-100 blur-3xl transition duration-700 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2 drop-shadow-md">Altitude</p>
                <h4 className="font-anton text-4xl uppercase text-white mb-4 drop-shadow-lg">The High Peaks</h4>
                <p className="text-slate-100 text-sm opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-4 group-hover:translate-y-0 drop-shadow">Freezing temperatures, but the aesthetics for your Instagram are impeccable. Hypothermia is complimentary.</p>
              </div>
            </div>

            {/* Box 2 (Ocean) */}
            <div 
               onClick={() => navigate('/hotels?region=South')}
               className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-xl bg-black"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-60"
                style={{ backgroundImage: "url('/ocean.png')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent border border-white/10 group-hover:border-cyan-400/50 transition duration-500"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-cyan-400/10 opacity-0 group-hover:opacity-100 blur-3xl transition duration-700 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2 drop-shadow-md">Coastline</p>
                <h4 className="font-anton text-4xl uppercase text-white mb-4 drop-shadow-lg">Oceanfront Villas</h4>
                <p className="text-slate-100 text-sm opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-4 group-hover:translate-y-0 drop-shadow">Private beaches where nobody can bother you. Sand will get everywhere. Don't complain.</p>
              </div>
            </div>

            {/* Box 3 (Urban) */}
            <div 
              onClick={() => navigate('/hotels?region=Central')}
              className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-xl bg-black z-10"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-60"
                style={{ backgroundImage: "url('/urban.png')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent border border-white/10 group-hover:border-fuchsia-500/50 transition duration-500"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-fuchsia-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition duration-700 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <p className="text-fuchsia-400 font-bold uppercase tracking-widest text-xs mb-2 drop-shadow-md">Metropolis</p>
                <h4 className="font-anton text-4xl uppercase text-white mb-4 drop-shadow-lg">Concrete Jungle</h4>
                <p className="text-slate-100 text-sm opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-4 group-hover:translate-y-0 drop-shadow">Penthouses looking down on the traffic below. Literally, you are above the law up here.</p>
              </div>
            </div>
          </div>
         </div>
      </section>

      {/* SCROLL 4: Featured Safehouses */}
      <section className="relative mx-auto max-w-7xl px-4 py-32 z-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] pointer-events-none -z-10"></div>
        
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-anton text-5xl md:text-6xl uppercase text-white tracking-wide">Featured Properties</h2>
          <p className="mt-4 text-violet-400 font-medium uppercase tracking-widest text-sm">Hand-picked stays representing the best of HeavenHub.</p>
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

        <div className="mt-20 text-center">
          <Link
            to="/hotels"
            className="inline-flex rounded-lg border border-violet-500/50 bg-violet-600/10 px-10 py-4 text-sm font-bold uppercase tracking-widest text-violet-300 transition hover:bg-violet-600 hover:text-white shadow-neon-purple hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
          >
            Unlock Full Vault →
          </Link>
        </div>
      </section>
      
      {/* SCROLL 5: Wall of Fame / Reviews */}
      <section className="relative border-y border-white/5 bg-black/60 backdrop-blur-md py-32 z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-cyan-500/5 rounded-[100%] blur-[120px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 mb-20 text-center relative z-10">
          <h3 className="font-anton text-4xl md:text-6xl uppercase text-white tracking-wide">Trusted By Travelers</h3>
          <p className="mt-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-bold uppercase tracking-widest text-sm">Real Testimonies from guests who love our platform.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="break-inside-avoid bg-premium-panel backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-cyan-400/50 transition duration-500 shadow-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="flex gap-1 text-cyan-400 mb-4 relative z-10">
                  {Array.from({length: rev.stars}).map((_, i) => <span key={i}>★</span>)}
                  {Array.from({length: 5 - rev.stars}).map((_, i) => <span key={i} className="opacity-20">★</span>)}
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed group-hover:text-white transition relative z-10">"{rev.text}"</p>
                <div className="border-t border-white/5 pt-4 relative z-10">
                  <p className="font-anton text-sm md:text-base uppercase tracking-widest text-fuchsia-400 group-hover:text-fuchsia-300">{rev.name}</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCROLL 6: Epic Footer Call to Action */}
      <section className="relative px-4 py-32 z-10 text-center flex flex-col items-center justify-center min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-premium-dark to-premium-dark pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-fuchsia-600/20 blur-[150px] pointer-events-none rounded-t-full z-0"></div>
        
        <h2 className="font-anton text-6xl md:text-[8rem] uppercase text-white mb-8 drop-shadow-2xl z-10 leading-[0.9]">
          ENOUGH SCROLLING.<br/>
          <span className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">START PACKING.</span>
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-16 z-10 text-xl font-light">
          You've seen the properties. You've read the reviews. Time to book your perfect retreat and start packing.
        </p>
        
        <Link
          to="/register"
          className="z-10 rounded-xl bg-white px-16 py-6 text-2xl font-black uppercase tracking-widest text-black shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all hover:bg-slate-200 hover:scale-105 hover:shadow-[0_0_80px_rgba(255,255,255,0.5)]"
        >
          Join The Elite
        </Link>
        
        {/* Interactive Element: Quick Rating */}
        <div className="mt-16 z-10 border border-white/10 bg-black/40 p-6 rounded-2xl backdrop-blur-xl animate-fade-in shadow-xl">
          <p className="text-sm uppercase tracking-widest text-cyan-400 font-bold mb-3">Rate your experience</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setPageRating(star);
                  toast.success('Thanks for your feedback!');
                }}
                className={`text-2xl transition-transform hover:scale-125 ${pageRating >= star ? 'text-fuchsia-400 drop-shadow-glow' : 'text-slate-600'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
