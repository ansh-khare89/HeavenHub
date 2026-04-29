import { Link } from 'react-router-dom';

export function BrandMark({ to = '/home' }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-premium-dark"
    >
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden transition duration-500 group-hover:scale-[1.05]">
        <img src="/logo.png" alt="HeavenHub Logo" className="h-full w-full object-cover" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-airbnb">
        HeavenHub
      </span>
    </Link>
  );
}
