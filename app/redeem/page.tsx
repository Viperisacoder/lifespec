'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PAYPAL_LINK = 'https://www.paypal.com/ncp/payment/ZSBQDYCMZXZ4N';

export default function RedeemPage() {
  const router = useRouter();
  const [step, setStep] = useState<'payment' | 'create'>('payment');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePaymentClick = () => {
    window.open(PAYPAL_LINK, '_blank');
    setStep('create');
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!paypalEmail.trim()) {
      setError('PayPal email is required.');
      return;
    }

    if (!accountEmail.trim()) {
      setError('Account email is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypalEmail: paypalEmail.trim().toLowerCase(),
          accountEmail: accountEmail.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Account creation failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setError('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Redeem error:', err);
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <svg className="w-8 h-8" style={{ color: '#22C55E' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
              Account Created!
            </h1>
            <p style={{ color: '#888' }}>
              Your LifeSpec account is ready. Redirecting to sign in...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Payment step
  if (step === 'payment') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'rgb(var(--bg))' }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>
              Unlock Pro Access
            </h1>
            <p style={{ color: 'rgb(var(--muted))' }}>
              One-time payment. Lifetime access.
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8 mb-8 border"
            style={{
              backgroundColor: `rgb(var(--panel) / 0.6)`,
              borderColor: 'rgb(var(--border))',
            }}
          >
            {/* Price */}
            <div className="text-center mb-8 pb-8 border-b" style={{ borderColor: 'rgb(var(--border))' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'rgb(var(--gold))' }}>
                $2.99
              </div>
              <p style={{ color: 'rgb(var(--muted))' }}>
                One-time payment. Lifetime access.
              </p>
            </div>

            {/* Features */}
            <div className="mb-8 space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--gold))' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span style={{ color: 'rgb(var(--text))' }}>Unlimited Blueprints</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--gold))' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span style={{ color: 'rgb(var(--text))' }}>Save & Edit Blueprints</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--gold))' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span style={{ color: 'rgb(var(--text))' }}>Affordability Tools & Calculators</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handlePaymentClick}
              className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300"
              style={{
                backgroundColor: 'rgb(var(--gold))',
                color: 'rgb(var(--bg))',
                boxShadow: '0 10px 25px rgba(213, 160, 33, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(213, 160, 33, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(213, 160, 33, 0.25)';
              }}
            >
              Pay with PayPal
            </button>

            {/* Microcopy */}
            <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: 'rgb(var(--border))' }}>
              <p className="text-xs text-center" style={{ color: 'rgb(var(--muted-2))' }}>
                After payment, you'll be redirected to create your account.
              </p>
              <p className="text-xs text-center" style={{ color: 'rgb(var(--muted-2))' }}>
                Questions? Email: <span style={{ color: 'rgb(var(--gold))' }}>mylifespec@outlook.com</span>
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-sm transition-colors duration-300"
              style={{ color: '#888' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create account step
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0E0E0E' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Create Your Account
          </h1>
          <p style={{ color: '#888' }}>
            Complete your LifeSpec setup.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 mb-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <form onSubmit={handleCreateAccount} className="space-y-5">
            {error && (
              <div
                className="p-4 rounded-lg text-sm border"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                }}
              >
                {error}
              </div>
            )}

            {/* PayPal Email */}
            <div>
              <label
                htmlFor="paypal-email"
                className="block text-sm font-medium mb-2"
                style={{ color: '#FFFFFF' }}
              >
                PayPal Email
              </label>
              <input
                id="paypal-email"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs mt-1" style={{ color: '#888' }}>
                The email you used to pay on PayPal
              </p>
            </div>

            {/* Account Email */}
            <div>
              <label
                htmlFor="account-email"
                className="block text-sm font-medium mb-2"
                style={{ color: '#FFFFFF' }}
              >
                Account Email
              </label>
              <input
                id="account-email"
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs mt-1" style={{ color: '#888' }}>
                Can be the same as PayPal email
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: '#FFFFFF' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs mt-1" style={{ color: '#888' }}>
                At least 8 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-2"
                style={{ color: '#FFFFFF' }}
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
              style={{
                backgroundColor: '#D4AF37',
                color: '#0E0E0E',
                boxShadow: '0 10px 25px rgba(255, 255, 255, 0.25)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 255, 255, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.25)';
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Microcopy */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-xs text-center" style={{ color: '#888' }}>
              💡 PayPal confirmation can take 30–90 seconds. If you don't see your payment, wait a moment and try again.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => setStep('payment')}
            className="text-sm transition-colors duration-300"
            style={{ color: '#888' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
          >
            ← Back to payment
          </button>
        </div>
      </div>
    </div>
  );
}
