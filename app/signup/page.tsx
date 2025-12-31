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
        backgroundImage: 'url(/signup.webp)',
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
            <p className="text-slate-300 text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
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
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-slate-400 mt-1">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
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
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-[#2DD4BF] hover:text-[#1BA39F] font-medium transition-colors"
              >
                Sign in
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
