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
      <div className="relative z-[1] max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="compare-title" className="font-display text-2xl font-bold text-hotel-accent">
              Compare stays
            </h2>
            <p className="mt-1 text-sm text-stone-500">Side-by-side — up to three picks from your session.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 hover:border-hotel-gold hover:text-hotel-accent transition"
          >
            Close
          </button>
        </div>

        {list.length === 0 ? (
          <p className="mt-8 text-center text-stone-500">Add listings from the grid using “Compare”.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="py-3 pr-4">Listing</th>
                  {list.map((p) => (
                    <th key={p.id} className="py-3 px-2 font-display text-base font-bold text-hotel-accent">
                      <span className="line-clamp-2">{p.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-stone-700">
                <tr className="border-b border-stone-50">
                  <td className="py-3 pr-4 text-stone-500 font-medium">City</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.city}
                      {p.state ? `, ${p.state}` : ''}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-50">
                  <td className="py-3 pr-4 text-stone-500 font-medium">Type</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.propertyType || '—'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-50">
                  <td className="py-3 pr-4 text-stone-500 font-medium">₹ / night</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3 font-semibold text-stone-900">
                      {formatInr(p.pricePerNight)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-50">
                  <td className="py-3 pr-4 text-stone-500 font-medium">Guest rating</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.averageRating != null ? <span className="text-hotel-gold font-semibold">★ {Number(p.averageRating).toFixed(2)}</span> : '—'}{' '}
                      <span className="text-xs text-stone-500">
                        ({p.reviewCount != null ? `${p.reviewCount} reviews` : '—'})
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-50">
                  <td className="py-3 pr-4 text-stone-500 font-medium">Beds / baths</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3">
                      {p.bedrooms ?? '—'} bd · {p.bathrooms ?? '—'} ba
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-stone-50">
                  <td className="py-3 pr-4 text-stone-500 font-medium">Badges</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-3 text-xs font-semibold text-hotel-gold">
                      {[p.instantBook && 'Instant', p.petFriendly && 'Pet-friendly', p.superhost && 'Superhost']
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-stone-500 font-medium">Open</td>
                  {list.map((p) => (
                    <td key={p.id} className="px-2 py-4">
                      <Link
                        to={`/property/${p.id}`}
                        className="inline-flex rounded-lg border border-hotel-gold px-3 py-1.5 text-xs font-semibold text-hotel-accent hover:bg-hotel-gold hover:text-white transition shadow-sm"
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
