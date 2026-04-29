import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AmbientBackdrop } from './AmbientBackdrop.jsx';
import { BrandMark } from './BrandMark.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navClass = ({ isActive }) =>
  `relative text-sm font-medium transition px-4 py-2 rounded-full whitespace-nowrap ${
    isActive
      ? 'text-gray-900 bg-gray-100'
      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
    <div className="relative min-h-screen bg-stone-50 text-gray-900 font-sans">
      <AmbientBackdrop />
      <div className="bg-noise" aria-hidden />
      <header
        className={`sticky top-0 z-40 bg-white/90 backdrop-blur-xl transition-colors duration-300 ${
          elevated
            ? 'border-b border-gray-200 shadow-sm'
            : 'border-b border-transparent'
        }`}
      >
        <div className="relative z-[1] mx-auto flex items-center justify-between gap-4 px-6 py-4 md:px-10">
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
            <NavLink to="/matchmaker" className={navClass}>
              Recommendations
            </NavLink>
            <NavLink to="/roast" className={navClass}>
              Guest Reviews
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
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100 sm:inline"
                >
                  List your property
                </Link>
                <Link
                  to="/register"
                  state={{ initialRole: 'GUEST' }}
                  className="hidden rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-900 sm:inline"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="rounded-full bg-airbnb px-5 py-2 text-sm font-medium text-white transition hover:bg-airbnb-hover"
                >
                  Log in
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden max-w-[140px] truncate text-sm font-medium text-gray-900 sm:inline">
                  {user?.firstName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/home');
                  }}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-900"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-[1]">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <p className="text-sm font-semibold text-gray-900">© 2026 HeavenHub, Inc.</p>
        <p className="mt-2 text-sm text-gray-500">
          Privacy · Terms · Sitemap · Company details
        </p>
      </footer>
    </div>
  );
}
