import { Link } from 'react-router-dom';
import { formatInr } from '../utils/money.js';

export function CompareStaysModal({ open, onClose, properties }) {
  if (!open) return null;
  const list = properties || [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close comparison"
      />
      <div className="relative z-[1] max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl border border-sky-500/25 bg-[#0a1628] p-6 shadow-2xl shadow-sky-900/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="compare-title" className="font-display text-xl font-bold text-white">
              Compare stays
            </h2>
            <p className="mt-1 text-sm text-slate-500">Side-by-side — up to three picks from your session.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-300 hover:border-sky-400/40 hover:text-white"
          >
            Close
          </button>
        </div>

        {list.length === 0 ? (
          <p className="mt-8 text-center text-slate-500">Add listings from the grid using “Compare”.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-3 pr-4">Listing</th>
                  {list.map((p) => (
                    <th key={p.id} className="py-3 px-2 font-semibold text-sky-200">
                      <span className="line-clamp-2">{p.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 text-slate-500">City</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.city}
                      {p.state ? `, ${p.state}` : ''}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 text-slate-500">Type</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.propertyType || '—'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 text-slate-500">₹ / night</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3 font-semibold text-white">
                      {formatInr(p.pricePerNight)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 text-slate-500">Guest rating</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.averageRating != null ? `★ ${Number(p.averageRating).toFixed(2)}` : '—'}{' '}
                      <span className="text-xs text-slate-500">
                        ({p.reviewCount != null ? `${p.reviewCount} reviews` : '—'})
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 text-slate-500">Beds / baths</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.bedrooms ?? '—'} bd · {p.bathrooms ?? '—'} ba
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 text-slate-500">Badges</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3 text-xs">
                      {[p.instantBook && 'Instant', p.petFriendly && 'Pet-friendly', p.superhost && 'Superhost']
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-slate-500">Open</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-4">
                      <Link
                        to={`/property/${p.id}`}
                        className="inline-flex rounded-full bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-500/25"
                        onClick={onClose}
                      >
                        View listing
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
