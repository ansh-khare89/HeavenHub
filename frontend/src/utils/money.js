/** All listing prices in the API are stored in INR. */
export function formatInr(amount) {
  const x = Number(amount);
  if (Number.isNaN(x)) return '—';
  return x.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}
