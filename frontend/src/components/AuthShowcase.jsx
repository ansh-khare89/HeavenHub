import { Link } from 'react-router-dom';

/**
 * Split-panel “brand rail” for auth pages: memorable in a portfolio review.
 */
export function AuthShowcase({ kicker = 'Portfolio-grade UX', title, children }) {
  return (
    <div className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#071225] via-navy-900 to-[#050b14] p-10 lg:flex">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-20%] top-[10%] h-64 w-64 rounded-full bg-sky-500/30 blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-cyan-400/20 blur-[100px]" />
      </div>
      <div className="relative z-[1]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">{kicker}</p>
        <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-white">{title}</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">{children}</p>
      </div>
      <div className="relative z-[1] space-y-4">
        <div className="flex flex-wrap gap-2">
          {['Spring Boot API', 'Role-based routes', 'Live pricing', 'Recharts analytics'].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 transition hover:text-sky-200"
        >
          ← Back to explore
        </Link>
      </div>
    </div>
  );
}
