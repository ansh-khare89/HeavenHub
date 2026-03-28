import { Link } from 'react-router-dom';

export function BrandMark({ to = '/home' }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
    >
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-400 to-indigo-500 shadow-glow-sm ring-1 ring-white/20 transition duration-500 group-hover:scale-[1.04] group-hover:shadow-glow">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.45),transparent_55%)] opacity-80" />
        <svg viewBox="0 0 24 24" className="relative z-[1] h-5 w-5 text-navy-950" fill="currentColor" aria-hidden>
          <path d="M5 19V5h2.2l4 7.2L15.2 5H17.4v14h-2.1V9.1l-3.1 5.6h-2.4L7.1 9.3V19H5z" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        <span className="bg-gradient-to-r from-white via-sky-100 to-cyan-200 bg-clip-text text-transparent">
          Heaven
        </span>
        <span className="text-white/90">Hub</span>
      </span>
    </Link>
  );
}
