'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    console.log('SIGNUP_START:', { email: email.substring(0, 3) + '***' });

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      console.log('SIGNUP_RESPONSE:', { 
        hasUser: !!data?.user, 
        hasSession: !!data?.session, 
        error: signUpError 
      });

      if (signUpError) {
        console.error('❌ SIGNUP_ERROR:', signUpError);
        setError(`Signup failed: ${signUpError.message}`);
        setLoading(false);
        return;
      }

      if (!data?.user) {
        console.error('❌ SIGNUP_NO_USER');
        setError('Signup failed: No user created. Check Supabase Email provider is enabled.');
        setLoading(false);
        return;
      }

      if (data?.session) {
        console.log('✓ SIGNUP_SUCCESS_WITH_SESSION - Redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('✓ SIGNUP_SUCCESS_NEEDS_CONFIRMATION - Check your email');
        setConfirmationSent(true);
      }
    } catch (error) {
      console.error('SIGNUP_EXCEPTION:', error);
      setError(`Signup failed: ${(error as Error).message}`);
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-[#060A0F] flex items-center justify-center px-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light tracking-widest text-white mb-2">
              Life<span className="font-semibold">Spec</span>
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
            <p className="text-slate-300 mb-4">
              Check your email to confirm your account. Once confirmed, you can sign in.
            </p>
            <p className="text-slate-400 text-sm">
              Didn't receive an email? Check your spam folder.
            </p>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="text-[#2DD4BF] hover:text-[#1BA39F] font-medium transition-colors"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-[#060A0F] flex items-center justify-center px-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light tracking-widest text-white mb-2">
              Life<span className="font-semibold">Spec</span>
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
            <p className="text-slate-300 mb-4">
              Check your email to confirm your account. Once confirmed, you can sign in.
            </p>
            <p className="text-slate-400 text-sm">
              Didn't receive an email? Check your spam folder.
            </p>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="text-[#2DD4BF] hover:text-[#1BA39F] font-medium transition-colors"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: 'url(/signup.jpeg)',
      }}
    >
      {/* Blurred background overlay */}
      <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: 'rgba(14, 15, 17, 0.6)' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-md border rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: 'rgba(26, 29, 34, 0.8)', borderColor: 'var(--border-color)' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-light tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
              Life<span className="font-semibold">Spec</span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', border: '1px solid' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--border-color)',
                }}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--border-color)',
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
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--border-color)',
                }}
                placeholder="••••••••"
                required
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--border-color)',
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
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
              }}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-medium transition-colors"
                style={{ color: 'var(--accent-gold)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
              >
                Sign in
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
    </div>
  );
}
