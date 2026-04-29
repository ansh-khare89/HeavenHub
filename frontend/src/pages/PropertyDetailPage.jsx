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
        <p className="font-display text-lg text-stone-900">{loadError}</p>
        <Link to="/home" className="mt-6 inline-block text-hotel-gold hover:text-hotel-goldHover">
          ← Back home
        </Link>
      </div>
    );
  }

  if (loading || !property) {
    return <div className="py-24 text-center text-stone-500">Loading sanctuary…</div>;
  }

  const rating = property.averageRating != null ? Number(property.averageRating) : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">{property.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-900 underline decoration-gray-900">
          {rating != null && (
            <span>★ {rating.toFixed(2)} {property.reviewCount != null ? `· ${property.reviewCount} reviews` : ''}</span>
          )}
          <span>{property.city}{property.state ? `, ${property.state}` : ''}</span>
        </div>
      </div>

      <div className="relative mb-8 h-72 w-full overflow-hidden rounded-xl md:h-[500px]">
        <img src={hero} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]" />
      </div>

        <div className="grid gap-12 md:grid-cols-[1.8fr_1fr]">
          <div className="space-y-8">
            <section className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                {property.propertyType || 'Entire home'} hosted by HeavenHub
              </h2>
              <div className="mt-2 flex gap-4 text-gray-900">
                <span>{property.maxGuests} guests</span> ·
                <span>{property.bedrooms || 1} bedroom</span> ·
                <span>{property.bathrooms || 1} bath</span>
              </div>
            </section>

            <section className="border-b border-gray-200 pb-8">
              <p className="whitespace-pre-line text-base text-gray-900">
                {property.description || 'A thoughtfully hosted HeavenHub original.'}
              </p>
              {property.latitude != null && property.longitude != null && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block font-semibold text-gray-900 underline"
                >
                  Show on map
                </a>
              )}
            </section>

            {property.amenities && (
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">What this place offers</h2>
                <ul className="grid grid-cols-2 gap-y-4">
                  {property.amenities.split(',').map((raw, i) => {
                    const a = raw.trim();
                    if (!a) return null;
                    return (
                      <li key={`${i}-${a}`} className="text-gray-900 text-base">
                        {a}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {property.houseManual && (
              <section className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900">House rules</h2>
                <p className="mt-4 whitespace-pre-line text-base text-gray-900">{property.houseManual}</p>
              </section>
            )}

            <section className="pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                ★ {rating != null ? rating.toFixed(2) : 'No reviews (yet)'} 
                {property.reviewCount ? ` · ${property.reviewCount} reviews` : ''}
              </h2>
              
              <div className="grid gap-8 sm:grid-cols-2">
                {reviews.map((rev) => (
                  <article key={rev.id} className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <div>
                        <p className="font-semibold text-gray-900">{rev.guestFirstName || 'Guest'}</p>
                        <p className="text-sm text-gray-500">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric'}) : ''}
                        </p>
                      </div>
                    </div>
                    {rev.comment && <p className="text-gray-900">{rev.comment}</p>}
                  </article>
                ))}
              </div>

              {canBook && (
                <form onSubmit={onSubmitReview} className="mt-8 space-y-4">
                  <h3 className="font-semibold text-gray-900">Write a review</h3>
                  <label className="block text-sm">
                    Rating
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} stars</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    Comment
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </label>
                  <button type="submit" className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white">
                    Post review
                  </button>
                </form>
              )}
            </section>
          </div>

          <div>
            <div className="sticky top-28 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-gray-900">{formatInr(property.pricePerNight)}</span>
                <span className="text-base text-gray-900">night</span>
              </div>
              
              <div className="rounded-lg border border-gray-400 overflow-hidden mb-4">
                <div className="flex border-b border-gray-400">
                  <label className="flex-1 p-3 text-xs font-bold uppercase border-r border-gray-400">
                    CHECK-IN
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="mt-1 block w-full text-sm font-normal outline-none"
                    />
                  </label>
                  <label className="flex-1 p-3 text-xs font-bold uppercase">
                    CHECKOUT
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="mt-1 block w-full text-sm font-normal outline-none"
                    />
                  </label>
                </div>
                <label className="block p-3 text-xs font-bold uppercase">
                  GUESTS
                  <input
                    type="number"
                    min={1}
                    max={property.maxGuests}
                    value={guests}
                    onChange={(e) =>
                      setGuests(Math.max(1, Math.min(Number(e.target.value) || 1, property.maxGuests || 99)))
                    }
                    className="mt-1 block w-full text-sm font-normal outline-none"
                  />
                </label>
              </div>

              {canBook ? (
                <button
                  type="button"
                  onClick={onBook}
                  disabled={booking || !pricing}
                  className="w-full rounded-lg bg-airbnb py-3.5 text-base font-semibold text-white transition hover:bg-airbnb-hover disabled:opacity-50"
                >
                  {booking ? 'Booking…' : 'Reserve'}
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: `/property/${id}` }}
                  className="block w-full rounded-lg bg-airbnb py-3.5 text-center text-base font-semibold text-white transition hover:bg-airbnb-hover"
                >
                  Sign in to reserve
                </Link>
              )}

              {pricing && (
                <div className="mt-4">
                  <p className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</p>
                  <dl className="space-y-4 text-base text-gray-900">
                    <div className="flex justify-between">
                      <dt className="underline">{formatInr(pricing.nightlyRate)} x {pricing.nights} nights</dt>
                      <dd>{formatInr(pricing.roomSubtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="underline">Cleaning fee</dt>
                      <dd>{formatInr(pricing.cleaningFee)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="underline">HeavenHub service fee</dt>
                      <dd>{formatInr(pricing.platformFee)}</dd>
                    </div>
                    <div className="mt-6 flex justify-between border-t border-gray-200 pt-6 text-lg font-semibold text-gray-900">
                      <dt>Total before taxes</dt>
                      <dd>{formatInr(pricing.total)}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
