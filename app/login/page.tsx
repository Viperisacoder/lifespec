'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/loading-screen');
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-[#060A0F] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/homepage.png)',
          filter: 'blur(12px)',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060A0F]/50 via-[#060A0F]/70 to-[#060A0F]/90" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#060A0F]/60 to-[#060A0F] z-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-light tracking-widest text-white hover:text-[#2DD4BF] transition-colors mb-8 inline-block"
            >
              Life<span className="font-semibold">Spec</span>
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Log in to your LifeSpec account</p>
          </div>

          {/* Card */}
          <div className="bg-gradient-to-br from-white/12 to-white/6 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            {showSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-r from-[#2DD4BF] to-[#F6C66A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#060A0F]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white font-semibold mb-2">Welcome back!</p>
                <p className="text-slate-400 text-sm">Redirecting to your LifeSpec...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] transition-colors"
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Forgot Password */}
                <button
                  type="button"
                  className="text-sm text-[#2DD4BF] hover:text-[#F6C66A] transition-colors"
                >
                  Forgot password?
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] text-white font-semibold rounded-xl hover:from-[#0D5F5B] hover:to-[#1BA39F] transition-all duration-300 shadow-lg shadow-[rgba(45,212,191,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </button>

                {/* Sign Up Link */}
                <p className="text-center text-slate-400 text-sm">
                  No account?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/signup')}
                    className="text-[#2DD4BF] hover:text-[#F6C66A] transition-colors font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
