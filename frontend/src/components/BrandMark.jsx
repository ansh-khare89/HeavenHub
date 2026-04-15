import { Link } from 'react-router-dom';

export function BrandMark({ to = '/home' }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-premium-dark"
    >
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl shadow-neon-purple ring-1 ring-white/10 transition duration-500 group-hover:scale-[1.05] group-hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.8)]">
        <img src="/logo.png" alt="HeavenHub Logo" className="h-full w-full object-cover" />
      </span>
      <span className="font-display text-xl font-black tracking-tight">
        <span className="bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-white bg-clip-text text-transparent">
          Heaven
        </span>
        <span className="text-white/90">Hub</span>
      </span>
    </Link>
  );
}
