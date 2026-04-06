import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ApiError } from '../api/client.js';
import {
  approveBooking,
  completeBooking,
  fetchHostAllBookings,
  fetchHostPendingBookings,
  rejectBooking,
} from '../api/bookings.js';
import { fetchHostAnalytics, fetchHostReviews, fetchSmartPricing } from '../api/host.js';
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../api/properties.js';
import { replyToReview } from '../api/reviews.js';
import { ChartErrorBoundary } from '../components/ChartErrorBoundary.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatInr } from '../utils/money.js';

const emptyForm = {
  title: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  pricePerNight: '',
  maxGuests: '4',
  cleaningFee: '800',
  averageRating: '4.85',
  platformFeePercent: '12',
  houseManual: '',
  propertyType: 'Apartment',
  bedrooms: '2',
  bathrooms: '2',
  amenities: 'WiFi, AC, Kitchen',
  region: '',
  instantBook: false,
  petFriendly: false,
  superhost: false,
  reviewCount: '',
  latitude: '',
  longitude: '',
};

export function HostDashboardPage() {
  const { user } = useAuth();
  const hostId = user?.id;

  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [pending, setPending] = useState([]);
  const [allHostBookings, setAllHostBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [replyDrafts, setReplyDrafts] = useState({});

  const [pricingPropId, setPricingPropId] = useState('');
  const [pricingData, setPricingData] = useState(null);

  const loadSmartPricing = async (propId) => {
    if (!propId) {
      setPricingData(null);
      return;
    }
    try {
      const data = await fetchSmartPricing(hostId, propId);
      setPricingData(data);
    } catch (e) {
      toast.error('Failed to load smart pricing data');
    }
  };

  const handleSmartPricingSelect = (e) => {
    const pId = e.target.value;
    setPricingPropId(pId);
    loadSmartPricing(pId);
  };

  const refresh = useCallback(async () => {
    if (!hostId) return;
    setLoading(true);
    try {
      const [a, props, pen, allB, rev] = await Promise.all([
        fetchHostAnalytics(hostId),
        fetchProperties({ hostId }),
        fetchHostPendingBookings(hostId),
        fetchHostAllBookings(hostId),
        fetchHostReviews(hostId),
      ]);
      setAnalytics(a);
      setProperties(Array.isArray(props) ? props : []);
      setPending(Array.isArray(pen) ? pen : []);
      setAllHostBookings(Array.isArray(allB) ? allB : []);
      setReviews(Array.isArray(rev) ? rev : []);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Dashboard data failed to load');
    } finally {
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const chartData = useMemo(() => {
    const rows = analytics?.monthlyEarnings || [];
    return rows.map((r) => ({
      month: r.month,
      amount: Number(r.amount) || 0,
    }));
  }, [analytics]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title ?? '',
      description: p.description ?? '',
      address: p.address ?? '',
      city: p.city ?? '',
      state: p.state ?? '',
      zipCode: p.zipCode ?? '',
      pricePerNight: String(p.pricePerNight ?? ''),
      maxGuests: String(p.maxGuests ?? ''),
      cleaningFee: String(p.cleaningFee ?? '0'),
      averageRating: String(p.averageRating ?? '4.8'),
      platformFeePercent: String(p.platformFeePercent ?? '12'),
      houseManual: p.houseManual ?? '',
      propertyType: p.propertyType ?? 'Apartment',
      bedrooms: String(p.bedrooms ?? '1'),
      bathrooms: String(p.bathrooms ?? '1'),
      amenities: p.amenities ?? '',
      region: p.region ?? '',
      instantBook: Boolean(p.instantBook),
      petFriendly: Boolean(p.petFriendly),
      superhost: Boolean(p.superhost),
      reviewCount: p.reviewCount != null ? String(p.reviewCount) : '',
      latitude: p.latitude != null ? String(p.latitude) : '',
      longitude: p.longitude != null ? String(p.longitude) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = () => ({
    title: form.title,
    description: form.description,
    address: form.address,
    city: form.city,
    state: form.state || undefined,
    zipCode: form.zipCode || undefined,
    pricePerNight: Number(form.pricePerNight),
    maxGuests: Number(form.maxGuests),
    cleaningFee: form.cleaningFee === '' ? undefined : Number(form.cleaningFee),
    averageRating: form.averageRating === '' ? undefined : Number(form.averageRating),
    platformFeePercent: form.platformFeePercent === '' ? undefined : Number(form.platformFeePercent),
    houseManual: form.houseManual || undefined,
    propertyType: form.propertyType || undefined,
    bedrooms: form.bedrooms === '' ? undefined : Number(form.bedrooms),
    bathrooms: form.bathrooms === '' ? undefined : Number(form.bathrooms),
    amenities: form.amenities || undefined,
    region: form.region || undefined,
    instantBook: form.instantBook,
    petFriendly: form.petFriendly,
    superhost: form.superhost,
    reviewCount: form.reviewCount === '' ? undefined : Number(form.reviewCount),
    latitude: form.latitude === '' ? undefined : Number(form.latitude),
    longitude: form.longitude === '' ? undefined : Number(form.longitude),
    hostId,
  });

  const onSaveProperty = async (e) => {
    e.preventDefault();
    if (!hostId) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingId) {
        await updateProperty(editingId, hostId, payload);
        toast.success('Listing updated');
      } else {
        await createProperty(payload);
        toast.success('Listing published');
      }
      resetForm();
      refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!hostId || !window.confirm('Delete this listing?')) return;
    try {
      await deleteProperty(id, hostId);
      toast.success('Listing removed');
      if (editingId === id) resetForm();
      refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Delete failed');
    }
  };

  const onApprove = async (id) => {
    try {
      await approveBooking(id, hostId);
      toast.success('Booking confirmed');
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Approve failed');
    }
  };

  const onReject = async (id) => {
    try {
      await rejectBooking(id, hostId);
      toast.success('Booking rejected');
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Reject failed');
    }
  };

  const onComplete = async (id) => {
    try {
      await completeBooking(id, hostId);
      toast.success('Marked completed');
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not complete');
    }
  };

  const onReply = async (reviewId) => {
    const text = (replyDrafts[reviewId] || '').trim();
    if (!text) {
      toast.error('Write a reply first');
      return;
    }
    try {
      await replyToReview(reviewId, { hostId, reply: text });
      setReplyDrafts((d) => ({ ...d, [reviewId]: '' }));
      toast.success('Reply posted');
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Reply failed');
    }
  };

  if (!hostId) {
    return null;
  }

  if (loading && !analytics && properties.length === 0) {
    return <div className="py-24 text-center text-slate-500">Loading host hub…</div>;
  }

  const upcomingStays = allHostBookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'PAID');

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 md:px-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/90">Host command</p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Orchestrate listings, respond to guests, and watch earnings glow in real time.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/15 to-transparent p-5">
          <p className="text-xs uppercase tracking-wider text-sky-200/80">Lifetime earnings</p>
          <p className="mt-2 text-2xl font-bold text-white">{formatInr(analytics?.totalEarnings)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-wider text-slate-400">Pending payout</p>
          <p className="mt-2 text-2xl font-bold text-white">{formatInr(analytics?.pendingPayout)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-wider text-slate-400">Active listings</p>
          <p className="mt-2 text-2xl font-bold text-white">{properties.length}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0a1628] p-6 shadow-xl shadow-sky-900/20">
        <h2 className="text-lg font-semibold text-white">Earnings by month</h2>
        <div className="mt-6 h-72 w-full">
          {chartData.length === 0 ? (
            <p className="text-sm text-slate-500">No confirmed stays yet — your chart will ignite soon.</p>
          ) : (
            <ChartErrorBoundary>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: '1px solid rgba(56,189,248,0.3)',
                      borderRadius: 12,
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="amount" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartErrorBoundary>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0a1628] p-6">
        <h2 className="text-lg font-semibold text-white">Pending booking requests</h2>
        {pending.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Inbox zero — outstanding work.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {pending.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#050b14]/60 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{b.propertyTitle}</p>
                  <p className="text-xs text-slate-500">
                    Guest #{b.guestId} · {b.startDate} → {b.endDate} · {formatInr(b.totalPrice)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(b.id)}
                    className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/30"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(b.id)}
                    className="rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/25"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0a1628] p-6">
        <h2 className="text-lg font-semibold text-white">Upcoming stays</h2>
        <p className="mt-1 text-sm text-slate-500">Mark completed after checkout to close the loop (only allowed for PAID stays).</p>
        {upcomingStays.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No upcoming stays right now.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {upcomingStays.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{b.propertyTitle}</p>
                  <p className="text-xs text-slate-400">
                    {b.startDate} → {b.endDate}
                  </p>
                </div>
                  <div className="flex flex-col md:items-end">
                    <p className="text-xs font-semibold mb-2">
                      Status: <span className={b.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}>{b.status}</span>
                    </p>
                    {b.status === 'PAID' && (
                      <button
                        type="button"
                        onClick={() => onComplete(b.id)}
                        className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-[#050b14]"
                      >
                        Mark completed
                      </button>
                    )}
                  </div>
                </li>
            ))}
          </ul>
        )}
      </section>

      {/* Smart Pricing Simulator */}
      <section className="rounded-3xl border border-[#38bdf8]/30 bg-[#0a1628] p-6 shadow-xl shadow-sky-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 blur-[2px] pointer-events-none">
          <span className="text-[120px]">📈</span>
        </div>
        <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1"><span className="text-sky-400">Smart Pricing</span> Simulator</h2>
            <p className="text-sm text-slate-400">Maximize revenue with AI-driven seasonal forecasting.</p>
          </div>
          <select 
            value={pricingPropId} 
            onChange={handleSmartPricingSelect}
            className="rounded-xl border border-white/10 bg-[#050b14]/80 px-4 py-3 text-sm text-white"
          >
            <option value="">Select a property to simulate...</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {pricingData && (
          <div className="mt-8 relative z-10 grid lg:grid-cols-[1fr_300px] gap-8">
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pricingData.forecasts} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 12 }}
                    labelStyle={{ color: '#e2e8f0', marginBottom: '8px' }}
                    itemStyle={{ fontSize: 13, fontWeight: 'bold' }}
                    formatter={(val, name) => [
                      `₹${val}`, 
                      name === 'recommendedPrice' ? 'Recommended' : 'Base Price'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    name="recommendedPrice"
                    dataKey="recommendedPrice" 
                    stroke="#38bdf8" 
                    strokeWidth={4} 
                    dot={{ fill: '#38bdf8', r: 5 }} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="step" 
                    dataKey={() => pricingData.basePrice} 
                    name="basePrice"
                    stroke="#ed8936" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col gap-4 justify-center">
              <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent p-5">
                <p className="text-xs uppercase tracking-wider text-sky-200/80">Base Listed Price</p>
                <p className="mt-1 text-xl font-bold text-white">{formatInr(pricingData.basePrice)}</p>
              </div>
              <p className="text-sm text-slate-400">
                The orange dashed line represents your static base price. The blue line represents HeavenHub's recommended pricing optimized for upcoming local seasonal demand.
              </p>
              {pricingData.forecasts[0] && (
                 <div className="mt-2 rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20">
                   <p className="text-xs text-emerald-300 font-semibold mb-1">Insight for {pricingData.forecasts[0].month}</p>
                   <p className="text-sm text-emerald-100">{pricingData.forecasts[0].rationale}</p>
                 </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0a1628] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-white">Listings & house manuals</h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-sky-300 hover:text-sky-200"
            >
              Cancel edit
            </button>
          )}
        </div>
        <form onSubmit={onSaveProperty} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 text-xs text-slate-400">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="md:col-span-2 text-xs text-slate-400">
            Description
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Address
            <input
              required
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            City
            <input
              required
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            State
            <input
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            ZIP
            <input
              value={form.zipCode}
              onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Property type
            <input
              value={form.propertyType}
              onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}
              placeholder="Apartment, villa…"
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Region (India)
            <input
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
              placeholder="North, South, West…"
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Bedrooms
            <input
              type="number"
              min={1}
              value={form.bedrooms}
              onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Bathrooms
            <input
              type="number"
              min={1}
              value={form.bathrooms}
              onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="md:col-span-2 text-xs text-slate-400">
            Amenities (comma-separated)
            <input
              value={form.amenities}
              onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
              placeholder="WiFi, AC, Parking…"
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 md:col-span-2">
            <input
              type="checkbox"
              checked={form.instantBook}
              onChange={(e) => setForm((f) => ({ ...f, instantBook: e.target.checked }))}
              className="rounded border-white/20 bg-[#050b14] text-sky-400"
            />
            Instant book
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 md:col-span-2">
            <input
              type="checkbox"
              checked={form.petFriendly}
              onChange={(e) => setForm((f) => ({ ...f, petFriendly: e.target.checked }))}
              className="rounded border-white/20 bg-[#050b14] text-sky-400"
            />
            Pet-friendly
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 md:col-span-2">
            <input
              type="checkbox"
              checked={form.superhost}
              onChange={(e) => setForm((f) => ({ ...f, superhost: e.target.checked }))}
              className="rounded border-white/20 bg-[#050b14] text-sky-400"
            />
            Superhost listing
          </label>
          <label className="text-xs text-slate-400">
            Review count (display)
            <input
              type="number"
              min={0}
              value={form.reviewCount}
              onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Latitude
            <input
              value={form.latitude}
              onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
              placeholder="19.0760"
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Longitude
            <input
              value={form.longitude}
              onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
              placeholder="72.8777"
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Price / night
            <input
              type="number"
              required
              min={1}
              step="0.01"
              value={form.pricePerNight}
              onChange={(e) => setForm((f) => ({ ...f, pricePerNight: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Max guests
            <input
              type="number"
              required
              min={1}
              value={form.maxGuests}
              onChange={(e) => setForm((f) => ({ ...f, maxGuests: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Cleaning fee
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.cleaningFee}
              onChange={(e) => setForm((f) => ({ ...f, cleaningFee: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Avg rating (display)
            <input
              type="number"
              step="0.01"
              min={1}
              max={5}
              value={form.averageRating}
              onChange={(e) => setForm((f) => ({ ...f, averageRating: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Platform fee %
            <input
              type="number"
              min={0}
              step="0.1"
              value={form.platformFeePercent}
              onChange={(e) => setForm((f) => ({ ...f, platformFeePercent: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="md:col-span-2 text-xs text-slate-400">
            House manual
            <textarea
              rows={4}
              value={form.houseManual}
              onChange={(e) => setForm((f) => ({ ...f, houseManual: e.target.value }))}
              placeholder="Wi‑Fi, amenities, local tips…"
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
            />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-[#050b14] disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update listing' : 'Publish listing'}
            </button>
          </div>
        </form>

        <div className="mt-10">
          <h3 className="text-sm font-semibold text-slate-300">Your published homes</h3>
          <ul className="mt-4 space-y-3">
            {properties.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#050b14]/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{p.title}</p>
                  <p className="text-xs text-slate-500">
                    {p.city} · {formatInr(p.pricePerNight)}/night
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="rounded-full border border-sky-400/40 px-4 py-2 text-sm text-sky-200 hover:bg-sky-500/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-200 hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0a1628] p-6">
        <h2 className="text-lg font-semibold text-white">Guest reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Reviews will appear here as guests share their stays.</p>
        ) : (
          <ul className="mt-6 space-y-5">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-white/10 bg-[#050b14]/60 p-4">
                <p className="text-sm text-sky-200">{r.propertyTitle}</p>
                <p className="mt-1 text-sm text-white">
                  {r.guestFirstName} · ★ {r.rating}
                </p>
                {r.comment && <p className="mt-2 text-sm text-slate-400">{r.comment}</p>}
                {r.hostReply && (
                  <p className="mt-3 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-sm text-sky-100">
                    <span className="text-xs font-semibold uppercase text-sky-300">Your reply · </span>
                    {r.hostReply}
                  </p>
                )}
                {!r.hostReply && (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={replyDrafts[r.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((d) => ({
                          ...d,
                          [r.id]: e.target.value,
                        }))
                      }
                      placeholder="Thoughtful host reply…"
                      className="flex-1 rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={() => onReply(r.id)}
                      className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                    >
                      Send reply
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
