'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function VerifyPaymentPage() {
  const router = useRouter();
  const { user, session } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Redirect if not logged in
  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Please Log In
          </h1>
          <p className="mb-8" style={{ color: '#888' }}>
            You need to be logged in to verify your payment.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: '#D4AF37',
              color: '#0E0E0E',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your PayPal email.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Get access token from session
      const accessToken = session.access_token;

      const response = await fetch('/api/paypal/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          payerEmail: email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-12" style={{ backgroundColor: '#0E0E0E' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Payment Complete?
          </h1>
          <p style={{ color: '#888' }}>
            Verify your PayPal payment to unlock Pro features.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-8 mb-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-3"
                style={{ color: '#FFFFFF' }}
              >
                PayPal Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status Messages */}
            {message && (
              <div
                className="p-4 rounded-lg text-sm"
                style={{
                  backgroundColor:
                    status === 'success'
                      ? 'rgba(34, 197, 94, 0.1)'
                      : status === 'error'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                  color:
                    status === 'success'
                      ? '#22C55E'
                      : status === 'error'
                        ? '#EF4444'
                        : '#3B82F6',
                  borderColor:
                    status === 'success'
                      ? 'rgba(34, 197, 94, 0.3)'
                      : status === 'error'
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(59, 130, 246, 0.3)',
                  border: '1px solid',
                }}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
              style={{
                backgroundColor: status === 'success' ? '#22C55E' : '#D4AF37',
                color: '#0E0E0E',
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading' && status !== 'success') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(212, 175, 55, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(212, 175, 55, 0.25)';
              }}
            >
              {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Success! Redirecting...' : 'Verify & Unlock'}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-xs text-center" style={{ color: '#888' }}>
              💡 We match the PayPal email to your payment event. Takes up to 1–2 minutes to appear.
            </p>
          </div>
        </div>

        {/* Return Link */}
        <div className="text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm transition-colors duration-300"
            style={{ color: '#888' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
