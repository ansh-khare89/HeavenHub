/**
 * Split-panel “brand rail” for auth pages: memorable in a portfolio review.
 */
export function AuthShowcase({ kicker = 'Portfolio-grade UX', title, children }) {
  return (
    <div className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden border-r border-stone-200 bg-gradient-to-br from-[#071225] via-navy-900 to-[#050b14] p-10 lg:flex">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-20%] top-[10%] h-64 w-64 rounded-full bg-sky-500/30 blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-cyan-400/20 blur-[100px]" />
      </div>
      <div className="relative z-[1]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-hotel-gold/80">{kicker}</p>
        <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-slate-50">{title}</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-200/80">{children}</p>
      </div>
    </div>
  );
}
