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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        backgroundColor: 'rgb(var(--bg))',
        backgroundImage: 'linear-gradient(135deg, rgb(var(--bg)) 0%, rgb(var(--panel)) 100%)',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .login-card {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>

      {/* Brand Header */}
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-bold" style={{ color: 'rgb(var(--text))' }}>
          LifeSpec
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '1px',
              backgroundColor: 'rgb(var(--gold))',
              opacity: 0.4,
              margin: '6px auto 0',
            }}
          />
        </h1>
      </div>

      {/* Login Card */}
      <div
        className="login-card w-full max-w-md rounded-2xl border p-8 md:p-10"
        style={{
          backgroundColor: `rgb(var(--panel) / 0.8)`,
          borderColor: 'rgb(var(--border))',
          boxShadow: 'var(--shadow)',
          backgroundImage: `linear-gradient(135deg, rgb(var(--panel)) 0%, rgb(var(--panel-2)) 100%)`,
        }}
      >
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>
          Welcome back
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgb(var(--muted))' }}>
          Sign in to continue to your LifeSpec.
        </p>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 rounded-lg text-sm mb-6 border"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
              style={{
                backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                borderColor: 'rgb(var(--border))',
                color: 'rgb(var(--text))',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--gold))';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(213, 160, 33, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--border))';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
              style={{
                backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                borderColor: 'rgb(var(--border))',
                color: 'rgb(var(--text))',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--gold))';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(213, 160, 33, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--border))';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgb(var(--border))',
              opacity: 0.5,
            }}
          />

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: 'rgb(var(--gold))',
              color: 'rgb(var(--bg))',
              boxShadow: '0 4px 12px rgba(213, 160, 33, 0.2)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(213, 160, 33, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(213, 160, 33, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Secondary Text */}
        <p className="text-xs mt-6 text-center" style={{ color: 'rgb(var(--muted))' }}>
          New to LifeSpec?{' '}
          <button
            onClick={() => router.push('/redeem')}
            className="transition-colors"
            style={{ color: 'rgb(var(--gold))' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Access is created after checkout.
          </button>
        </p>
      </div>

      {/* Back Link */}
      <button
        onClick={() => router.push('/')}
        className="mt-8 text-xs transition-colors"
        style={{ color: 'rgb(var(--muted-2))' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgb(var(--muted))')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgb(var(--muted-2))')}
      >
        ← Back to home
      </button>
    </div>
  );
}
