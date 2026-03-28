import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client.js';
import { AuthShowcase } from '../components/AuthShowcase.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage() {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [email, setEmail] = useState(() => localStorage.getItem('heavenhub_email') || '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    if (role === 'HOST') return <Navigate to="/host/dashboard" replace />;
    return <Navigate to={from && from !== '/login' ? from : '/home'} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.firstName}`);
      if (u.role === 'HOST') navigate('/host/dashboard', { replace: true });
      else navigate(from && from !== '/login' ? from : '/home', { replace: true });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row lg:min-h-[calc(100vh-3.5rem)]">
      <AuthShowcase title="Calm auth, loud craft" kicker="Hierarchy · focus · restraint">
        Great sign-in screens are boring on purpose — until you notice the micro-details: glass depth, focus rings,
        and a layout that still works when the panel is the whole viewport on mobile.
      </AuthShowcase>

      <div className="relative flex flex-1 items-center justify-center px-4 py-14 sm:px-8">
        {/* Must not capture clicks — otherwise it can sit above inputs and block typing/focus */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent lg:hidden"
          aria-hidden
        />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-navy-900/75 p-8 shadow-[0_24px_80px_-40px_rgba(56,189,248,0.35)] backdrop-blur-xl">
          <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Guests continue trips. Hosts jump to the hub.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs text-slate-400">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-navy-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/25"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-xs text-slate-400">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-navy-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/25"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 py-3 text-sm font-semibold text-navy-950 shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{' '}
            <Link to="/register" className="font-semibold text-sky-300 hover:text-sky-200">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
