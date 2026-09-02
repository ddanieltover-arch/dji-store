import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import type { ViewMode } from '../../types';

type AuthMode = 'login' | 'signup';

interface AuthPageProps {
  mode: AuthMode;
  redirectMode?: ViewMode;
  adminOnly?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode: initialMode, redirectMode, adminOnly }) => {
  const { login, signup } = useAuth();
  const { setViewMode, addToast } = useStore();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result =
      mode === 'login'
        ? await login(email, password)
        : await signup({ email, password, firstName, lastName });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? 'Authentication failed');
      return;
    }

    addToast({
      type: 'success',
      title: mode === 'login' ? 'Signed in' : 'Account created',
      message: adminOnly ? 'Welcome to the admin console.' : 'Welcome back to DJI Store EU.'
    });

    if (redirectMode) {
      setViewMode(redirectMode);
    } else if (adminOnly) {
      setViewMode('admin');
    } else {
      setViewMode('account');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1D1D1F] text-white mb-4">
            {adminOnly ? <ShieldCheck className="w-7 h-7" /> : <User className="w-7 h-7" />}
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D1D1F]">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {adminOnly
              ? 'Admin console access requires an account with admin privileges.'
              : 'Use your email and password to access your DJI Store EU account.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-4"
        >
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-gray-600 font-medium">First name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
                  autoComplete="given-name"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600 font-medium">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
                  autoComplete="family-name"
                />
              </label>
            </div>
          )}

          <label className="block text-sm">
            <span className="text-gray-600 font-medium">Email</span>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="block text-sm">
            <span className="text-gray-600 font-medium">Password</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
            {mode === 'signup' && (
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            )}
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E30613] text-white font-bold py-3 text-sm hover:bg-[#c5050f] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>

          <p className="text-center text-sm text-gray-500 pt-2">
            {mode === 'login' ? (
              <>
                New to DJI Store EU?{' '}
                <button
                  type="button"
                  className="text-[#E30613] font-semibold hover:underline"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setViewMode('signup');
                  }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-[#E30613] font-semibold hover:underline"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setViewMode('login');
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};
