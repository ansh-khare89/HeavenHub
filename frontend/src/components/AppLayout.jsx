import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AmbientBackdrop } from './AmbientBackdrop.jsx';
import { BrandMark } from './BrandMark.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navClass = ({ isActive }) =>
  `relative text-sm font-medium transition px-3 py-2 rounded-lg whitespace-nowrap ${
    isActive
      ? 'bg-sky-500/15 text-sky-200 after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:rounded-full after:bg-gradient-to-r after:from-transparent after:via-sky-400 after:to-transparent'
      : 'text-slate-300 hover:text-white hover:bg-white/5'
  }`;

export function AppLayout() {
  const { user, logout, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-100">
      <AmbientBackdrop />
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          elevated
            ? 'border-sky-500/25 bg-navy-950/80 shadow-[0_12px_40px_-20px_rgba(0,0,0,.55)] backdrop-blur-xl'
            : 'border-white/5 bg-navy-950/40 backdrop-blur-md'
        }`}
      >
        <div className="relative z-[1] mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <BrandMark />

          <nav className="flex max-w-[55vw] items-center gap-1 overflow-x-auto md:max-w-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <NavLink to="/home" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/hotels" className={navClass}>
              Hotels
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About Us
            </NavLink>
            <NavLink to="/faq" className={navClass}>
              FAQ
            </NavLink>
            {isAuthenticated && role === 'GUEST' && (
              <NavLink to="/bookings" className={navClass}>
                My bookings
              </NavLink>
            )}
            {isAuthenticated && role === 'HOST' && (
              <NavLink to="/host/dashboard" className={navClass}>
                Host hub
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/inbox" className={navClass}>
                Inbox
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  state={{ initialRole: 'HOST' }}
                  className="hidden rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white sm:inline"
                >
                  Become a host
                </Link>
                <Link
                  to="/login"
                  className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-navy-950 shadow-glow-sm transition hover:brightness-110 hover:shadow-glow"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden max-w-[140px] truncate text-xs text-slate-400 sm:inline">
                  {user?.firstName} · <span className="text-sky-300">{role}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/home');
                  }}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-400/40 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-[1]">
        <Outlet />
      </main>

      <footer className="relative z-[1] mt-20 border-t border-white/5 px-4 py-12 text-center md:px-6">
        <p className="font-display text-sm font-semibold text-white/90">HeavenHub</p>
        <p className="mt-1 text-xs text-slate-500">
          35+ Indian cities · Compare stays · Instant book &amp; Superhost badges · Transparent ₹ pricing
        </p>
      </footer>
    </div>
  );
}
