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
      <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: 'rgba(14, 15, 17, 0.6)' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', border: '1px solid' }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'var(--border-color)',
                color: 'white',
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'var(--border-color)',
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
              backgroundColor: 'var(--white)',
              color: 'var(--bg-primary)',
              boxShadow: '0 10px 25px rgba(255, 255, 255, 0.25)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            New to LifeSpec?{' '}
            <button
              onClick={() => router.push('/redeem')}
              className="font-medium transition-colors"
              style={{ color: 'var(--white)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--white)')}
            >
              Create account after payment
            </button>
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
