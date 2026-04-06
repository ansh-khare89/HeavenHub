import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../api/client.js';
import { createBooking } from '../api/bookings.js';
import { estimatePricing } from '../api/pricing.js';
import { fetchProperty } from '../api/properties.js';
import { createReview, fetchPropertyReviews } from '../api/reviews.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatInr } from '../utils/money.js';

function tomorrowISODate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [checkIn, setCheckIn] = useState(tomorrowISODate());
  const [checkOut, setCheckOut] = useState(() => addDays(tomorrowISODate(), 3));
  const [guests, setGuests] = useState(2);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loadError, setLoadError] = useState(null);

  const [msgContent, setMsgContent] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const idValid = Boolean(id) && Number.isFinite(Number(id));

  useEffect(() => {
    if (!idValid) {
      setLoading(false);
      setProperty(null);
      setLoadError('Invalid listing link.');
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [p, r] = await Promise.all([fetchProperty(id), fetchPropertyReviews(id)]);
        if (cancelled) return;
        setProperty(p);
        setReviews(Array.isArray(r) ? r : []);
        setGuests((g) => Math.min(Math.max(1, Number(g) || 1), p.maxGuests || 8));
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof ApiError ? e.message : 'Could not load property';
          setLoadError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, idValid]);

  useEffect(() => {
    if (!property?.id || !checkIn || !checkOut) return;
    let cancelled = false;
    (async () => {
      try {
        const est = await estimatePricing({
          propertyId: Number(property.id),
          checkIn,
          checkOut,
          guests: Number(guests),
        });
        if (!cancelled) setPricing(est);
      } catch {
        if (!cancelled) setPricing(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [property, checkIn, checkOut, guests]);

  const canBook = isAuthenticated && role === 'GUEST' && user?.id;

  const onBook = async () => {
    if (!canBook) {
      navigate('/login', { state: { from: `/property/${id}` } });
      return;
    }
    setBooking(true);
    try {
      await createBooking({
        propertyId: Number(property.id),
        guestId: user.id,
        startDate: checkIn,
        endDate: checkOut,
        numberOfGuests: Number(guests),
      });
      toast.success('Booking requested — host will review shortly');
      navigate('/bookings');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();
    if (!canBook) {
      toast.error('Sign in as a guest to leave a review');
      return;
    }
    try {
      await createReview(Number(id), {
        guestId: user.id,
        rating: Number(reviewRating),
        comment: reviewText || undefined,
      });
      setReviewText('');
      const r = await fetchPropertyReviews(id);
      setReviews(Array.isArray(r) ? r : []);
      toast.success('Review posted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not post review');
    }
  };

  const onSendMessage = async (e) => {
    e.preventDefault();
    if (!canBook) return;
    if (!msgContent.trim()) return;
    setSendingMsg(true);
    try {
      const res = await fetch(`/api/messages?senderId=${user.id}&receiverId=${property.hostId}&propertyId=${property.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: msgContent }),
      });
      if (!res.ok) throw new Error();
      toast.success('Message sent! Check your inbox for replies.');
      setMsgContent('');
    } catch (e) {
      toast.error('Could not send message.');
    } finally {
      setSendingMsg(false);
    }
  };

  const hero = useMemo(() => {
    const idNum = Number(id) || 0;
    const imageNumber = ((idNum * 7) % 6) + 1;
    return `/hotels/hotel-${imageNumber}.jpg`;
  }, [id]);

  if (loadError && !loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-display text-lg text-white">{loadError}</p>
        <Link to="/home" className="mt-6 inline-block text-sky-300 hover:text-sky-200">
          ← Back to explore
        </Link>
      </div>
    );
  }

  if (loading || !property) {
    return <div className="py-24 text-center text-slate-500">Loading sanctuary…</div>;
  }

  const rating = property.averageRating != null ? Number(property.averageRating) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1628] shadow-2xl shadow-sky-900/20">
        <div className="relative h-72 md:h-[420px]">
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-300/90">
              {property.city}
              {property.state ? `, ${property.state}` : ''}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{property.title}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
              {rating != null && (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  ★ {rating.toFixed(2)} avg
                  {property.reviewCount != null ? ` · ${property.reviewCount} reviews` : ''}
                </span>
              )}
              {property.propertyType && (
                <span className="rounded-full bg-white/10 px-3 py-1">{property.propertyType}</span>
              )}
              <span className="rounded-full bg-white/10 px-3 py-1">Up to {property.maxGuests} guests</span>
              {property.bedrooms != null && property.bathrooms != null && (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {property.bedrooms} bed · {property.bathrooms} bath
                </span>
              )}
              {property.superhost && (
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-100">Superhost</span>
              )}
              {property.instantBook && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-100">Instant book</span>
              )}
              {property.petFriendly && (
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-violet-100">Pet-friendly</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-10 p-6 md:grid-cols-3 md:p-10">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-white">About</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-400">
                {property.description || 'A thoughtfully hosted HeavenHub original.'}
              </p>
              <p className="mt-4 text-sm text-slate-500">{property.address}</p>
              {property.region && (
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-sky-400/80">
                  Region · {property.region}
                </p>
              )}
              {property.latitude != null && property.longitude != null && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/20"
                >
                  Open in Maps
                  <span aria-hidden>↗</span>
                </a>
              )}
            </section>

            {property.amenities && (
              <section>
                <h2 className="text-lg font-semibold text-white">Amenities &amp; details</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {property.amenities.split(',').map((raw, i) => {
                    const a = raw.trim();
                    if (!a) return null;
                    return (
                      <li
                        key={`${i}-${a}`}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300"
                      >
                        {a}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {property.houseManual && (
              <section className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                <h2 className="text-lg font-semibold text-sky-100">House manual</h2>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-300">{property.houseManual}</p>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold text-white">Guest reviews</h2>
              <div className="mt-4 space-y-4">
                {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
                {reviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white">
                        {rev.guestFirstName || 'Guest'} ·{' '}
                        <span className="text-sky-300">★ {rev.rating}</span>
                      </p>
                      <span className="text-xs text-slate-500">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    {rev.comment && <p className="mt-2 text-sm text-slate-400">{rev.comment}</p>}
                    {rev.hostReply && (
                      <div className="mt-3 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-sm text-sky-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                          Host reply
                        </span>
                        <p className="mt-1 text-slate-100">{rev.hostReply}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {canBook && (
                <form onSubmit={onSubmitReview} className="mt-6 space-y-3 rounded-2xl border border-white/10 p-4">
                  <h3 className="text-sm font-semibold text-white">Write a review</h3>
                  <label className="block text-xs text-slate-400">
                    Rating
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} stars
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs text-slate-400">
                    Comment
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Post review
                  </button>
                </form>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#050b14]/80 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Reserve</h2>
              <div className="mt-4 grid gap-3">
                <label className="text-xs text-slate-400">
                  Check-in
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="text-xs text-slate-400">
                  Check-out
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="text-xs text-slate-400">
                  Guests
                  <input
                    type="number"
                    min={1}
                    max={property.maxGuests}
                    value={guests}
                    onChange={(e) =>
                      setGuests(Math.max(1, Math.min(Number(e.target.value) || 1, property.maxGuests || 99)))
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-transparent p-4 text-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">Live estimate</h3>
                {pricing ? (
                  <dl className="mt-3 space-y-2 text-slate-200">
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Nights</dt>
                      <dd>{pricing.nights}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Nightly</dt>
                      <dd>{formatInr(pricing.nightlyRate)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Room subtotal</dt>
                      <dd>{formatInr(pricing.roomSubtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Cleaning</dt>
                      <dd>{formatInr(pricing.cleaningFee)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400">Platform ({pricing.platformFeePercent}%)</dt>
                      <dd>{formatInr(pricing.platformFee)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
                      <dt>Total</dt>
                      <dd>{formatInr(pricing.total)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="mt-3 text-slate-500">Select dates to preview pricing.</p>
                )}
              </div>

              {canBook ? (
                <button
                  type="button"
                  onClick={onBook}
                  disabled={booking || !pricing}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 py-3 text-sm font-semibold text-[#050b14] shadow-lg shadow-sky-500/25 transition hover:brightness-110 disabled:opacity-50"
                >
                  {booking ? 'Booking…' : 'Book now'}
                </button>
              ) : (
                <div className="mt-5 space-y-2">
                  <p className="text-xs text-slate-500">Guests can book instantly. Hosts may browse in view-only mode.</p>
                  <Link
                    to="/login"
                    state={{ from: `/property/${id}` }}
                    className="block w-full rounded-full border border-sky-400/40 py-3 text-center text-sm font-semibold text-sky-200 hover:bg-sky-500/10"
                  >
                    Sign in as guest
                  </Link>
                </div>
              )}

              {canBook && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-3">Have a question?</h3>
                  <form onSubmit={onSendMessage} className="space-y-3">
                    <textarea 
                      value={msgContent}
                      onChange={e => setMsgContent(e.target.value)}
                      rows={2} 
                      placeholder="Ask the host about this stay..."
                      className="w-full rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:border-sky-400"
                    />
                    <button 
                      type="submit"
                      disabled={sendingMsg || !msgContent.trim()}
                      className="w-full rounded-full border border-sky-400/40 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/10 disabled:opacity-50"
                    >
                      {sendingMsg ? 'Sending...' : 'Message Host'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
