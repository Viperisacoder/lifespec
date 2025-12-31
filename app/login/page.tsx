'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('SIGNIN_START:', { email: email.substring(0, 3) + '***' });

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('SIGNIN_RESPONSE:', { 
        hasUser: !!data?.user, 
        hasSession: !!data?.session, 
        error: signInError 
      });

      if (signInError) {
        console.error('❌ SIGNIN_ERROR:', signInError);
        setError(`Login failed: ${signInError.message}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        console.error('❌ SIGNIN_NO_USER');
        setError('Login failed: No user found');
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log('✓ SIGNIN_SUCCESS');
        router.push('/dashboard');
      } else {
        console.error('❌ SIGNIN_NO_SESSION');
        setError('Login failed: No session created');
        setLoading(false);
      }
    } catch (error) {
      console.error('SIGNIN_EXCEPTION:', error);
      setError(`Login failed: ${(error as Error).message}`);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: 'url(/login.jpeg)',
      }}
    >
      {/* Blurred background overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-light tracking-widest text-white mb-2">
              Life<span className="font-semibold">Spec</span>
            </h1>
            <p className="text-slate-300 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-[#2DD4BF] hover:text-[#1BA39F] font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
