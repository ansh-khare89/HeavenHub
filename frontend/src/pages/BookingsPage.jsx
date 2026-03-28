import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ApiError } from '../api/client.js';
import { cancelBooking, fetchGuestBookings } from '../api/bookings.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatInr } from '../utils/money.js';

const STEPS = ['Requested', 'Pending approval', 'Confirmed', 'Completed'];

/** checks[i] = step i is satisfied; pulse = index to highlight as current */
function timelineMeta(status) {
  const s = (status || '').toUpperCase();
  if (s === 'CANCELLED') return { cancelled: true };
  if (s === 'PENDING') return { cancelled: false, checks: [true, false, false, false], pulse: 1 };
  if (s === 'CONFIRMED') return { cancelled: false, checks: [true, true, true, false], pulse: 2 };
  if (s === 'COMPLETED') return { cancelled: false, checks: [true, true, true, true], pulse: 3 };
  return { cancelled: false, checks: [true, false, false, false], pulse: 0 };
}

export function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await fetchGuestBookings(user.id);
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not load bookings');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const onCancel = async (id) => {
    try {
      await cancelBooking(id, user.id);
      toast.success('Booking cancelled');
      load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Cancel failed');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold text-white">My bookings</h1>
      <p className="mt-2 text-sm text-slate-400">Track every request from spark to stay.</p>

      {loading ? (
        <p className="mt-12 text-center text-slate-500">Retrieving your journeys…</p>
      ) : bookings.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-white/10 bg-[#0a1628] p-10 text-center">
          <p className="text-slate-400">No bookings yet.</p>
          <Link
            to="/home"
            className="mt-4 inline-block rounded-full bg-sky-500/20 px-5 py-2 text-sm font-semibold text-sky-200 hover:bg-sky-500/30"
          >
            Explore homes
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-8">
          {bookings.map((b) => {
            const meta = timelineMeta(b.status);
            const checks = meta.checks || [false, false, false, false];
            return (
              <li
                key={b.id}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#050b14] p-6 shadow-xl shadow-sky-900/20"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{b.propertyTitle || 'Stay'}</h2>
                    <p className="text-sm text-slate-400">{b.propertyCity}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {b.startDate} → {b.endDate} · {formatInr(b.totalPrice)}
                    </p>
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200">
                    {b.status}
                  </span>
                </div>

                {meta.cancelled ? (
                  <p className="mt-6 text-sm text-rose-300/90">This booking was cancelled.</p>
                ) : (
                  <div className="mt-8">
                    <div className="relative flex justify-between gap-2">
                      {STEPS.map((label, idx) => {
                        const done = checks[idx];
                        const active = idx === meta.pulse;
                        return (
                          <div key={label} className="flex flex-1 flex-col items-center text-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                                done
                                  ? 'border-sky-400 bg-sky-500/20 text-sky-100'
                                  : 'border-white/15 text-slate-500'
                              } ${active ? 'ring-2 ring-sky-400/60 ring-offset-2 ring-offset-[#050b14]' : ''}`}
                            >
                              {done ? '✓' : idx + 1}
                            </div>
                            <p className="mt-2 hidden text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:block">
                              {label}
                            </p>
                          </div>
                        );
                      })}
                      <div className="pointer-events-none absolute left-0 right-0 top-5 -z-0 hidden h-0.5 bg-gradient-to-r from-sky-500/40 via-sky-400/20 to-transparent sm:block" />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
                      {STEPS.map((label) => (
                        <span key={label} className="text-[10px] text-slate-500">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {b.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => onCancel(b.id)}
                      className="rounded-full border border-rose-400/40 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/10"
                    >
                      Cancel request
                    </button>
                  )}
                  {b.status === 'COMPLETED' && (
                    <Link
                      to={`/property/${b.propertyId}`}
                      className="rounded-full bg-gradient-to-r from-sky-400/80 to-cyan-400/80 px-4 py-2 text-sm font-semibold text-[#050b14]"
                    >
                      Book again
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
