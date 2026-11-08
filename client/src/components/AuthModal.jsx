import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await login(email, password);
        if (!res.success) setError(res.message);
      } else {
        const res = await register(name, email, password);
        if (!res.success) setError(res.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setEmail('admin@vizagexplorer.com');
    setPassword('admin123');
    setLoading(true);
    await login('admin@vizagexplorer.com', 'admin123');
    setLoading(false);
  };

  const handleDemoTourist = async () => {
    setEmail('priya@example.com');
    setPassword('admin123');
    setLoading(true);
    await login('priya@example.com', 'admin123');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-ocean-900/80 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-turquoise to-ocean-600 mb-3 shadow-lg">
            <span className="text-2xl">🌊</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-serif-luxury">
            {authMode === 'login' ? 'Welcome Back' : 'Create Tourist Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'login'
              ? 'Sign in to access your saved destinations & bookings'
              : 'Join Vizag Explorer to plan your personalized coastal holiday'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mb-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDemoTourist}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-ocean-900 border border-turquoise/30 text-[11px] font-semibold text-turquoise hover:bg-turquoise/10 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tourist Demo</span>
          </button>
          <button
            type="button"
            onClick={handleDemoAdmin}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-ocean-900 border border-gold/30 text-[11px] font-semibold text-gold hover:bg-gold/10 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Admin Demo</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full pl-10 pr-3 py-2.5 bg-ocean-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-turquoise"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-ocean-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-turquoise"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-ocean-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-turquoise"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-turquoise via-cyan-400 to-teal-400 text-ocean-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {authMode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-turquoise font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-turquoise font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

