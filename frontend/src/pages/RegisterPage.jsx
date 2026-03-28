import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client.js';
import { AuthShowcase } from '../components/AuthShowcase.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function splitName(full) {
  const t = full.trim();
  if (!t) return { firstName: '', lastName: '' };
  const i = t.indexOf(' ');
  if (i === -1) return { firstName: t, lastName: 'Traveler' };
  return { firstName: t.slice(0, i), lastName: t.slice(i + 1).trim() || 'Traveler' };
}

export function RegisterPage() {
  const { register, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location.state?.initialRole === 'HOST' ? 'HOST' : 'GUEST';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    if (role === 'HOST') return <Navigate to="/host/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const { firstName, lastName } = splitName(name);
    const payload = {
      firstName,
      lastName,
      email,
      password,
      role: selectedRole,
    };
    setSubmitting(true);
    try {
      const u = await register(payload);
      toast.success(`Welcome, ${u.firstName}`);
      if (u.role === 'HOST') navigate('/host/dashboard', { replace: true });
      else navigate('/home', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
        toast.error('Please fix the highlighted fields');
      } else {
        toast.error(err instanceof ApiError ? err.message : 'Registration failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const err = (k) => fieldErrors[k];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row lg:min-h-[calc(100vh-3.5rem)]">
      <AuthShowcase title="Onboarding that teaches without a tutorial" kicker="Guest / Host · API validation">
        Two roles, one coherent visual language, and field-level errors straight from the server — so the experience
        feels premium even when something fails.
      </AuthShowcase>

      <div className="relative flex flex-1 items-center justify-center px-4 py-14 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent lg:hidden"
          aria-hidden
        />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-navy-900/75 p-8 shadow-[0_24px_80px_-40px_rgba(56,189,248,0.35)] backdrop-blur-xl">
          <h1 className="font-display text-2xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">One account. Two journeys. Zero confusion.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-xs text-slate-400">
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-navy-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/25"
              />
              {(err('firstName') || err('lastName')) && (
                <span className="mt-1 block text-xs text-rose-400">{err('firstName') || err('lastName')}</span>
              )}
            </div>
            <div>
              <label htmlFor="register-email" className="block text-xs text-slate-400">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-navy-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/25"
              />
              {err('email') && <span className="mt-1 block text-xs text-rose-400">{err('email')}</span>}
            </div>
            <div>
              <label htmlFor="register-password" className="block text-xs text-slate-400">
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-navy-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/25"
              />
              {err('password') && <span className="mt-1 block text-xs text-rose-400">{err('password')}</span>}
            </div>

            <div>
              <p className="text-xs text-slate-400">I am joining as</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['GUEST', 'HOST'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      selectedRole === r
                        ? 'border-sky-400/60 bg-sky-500/15 text-sky-100 shadow-glow-sm'
                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {r === 'GUEST' ? 'Guest' : 'Host'}
                  </button>
                ))}
              </div>
              {err('role') && <span className="mt-1 block text-xs text-rose-400">{err('role')}</span>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 py-3 text-sm font-semibold text-navy-950 shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-300 hover:text-sky-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
