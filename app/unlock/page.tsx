'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { createBrowserClient } from '@supabase/ssr';

const PAYPAL_LINK = 'https://www.paypal.com/ncp/payment/ZSBQDYCMZXZ4N';

export default function UnlockPage() {
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth and Pro status
  useEffect(() => {
    const checkStatus = async () => {
      // Not logged in
      if (!authLoading && !user) {
        router.push('/login?next=/unlock');
        return;
      }

      // Logged in, check Pro status
      if (user && !authLoading) {
        try {
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          );

          const { data, error } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error checking Pro status:', error);
            setIsPro(false);
          } else {
            setIsPro(data?.is_pro ?? false);
            
            // If already Pro, redirect to dashboard
            if (data?.is_pro) {
              router.push('/dashboard');
              return;
            }
          }
        } catch (error) {
          console.error('Error:', error);
          setIsPro(false);
        }
      }

      setLoading(false);
    };

    checkStatus();
  }, [user, authLoading, router]);

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: 'rgb(var(--bg))' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full animate-pulse mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, rgb(var(--gold)), rgb(var(--gold)))' }} />
          <p style={{ color: 'rgb(var(--muted))' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in (shouldn't reach here due to redirect, but safety check)
  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: 'rgb(var(--bg))' }}>
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'rgb(var(--text))' }}>
            Please Log In
          </h1>
          <p className="mb-8" style={{ color: 'rgb(var(--muted))' }}>
            You need to be logged in to unlock Pro.
          </p>
          <button
            onClick={() => router.push('/login?next=/unlock')}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: 'rgb(var(--gold))',
              color: 'rgb(var(--bg))',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Already Pro (shouldn't reach here due to redirect, but safety check)
  if (isPro) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Already Pro
          </h1>
          <p className="mb-8" style={{ color: '#888' }}>
            You already have Pro features unlocked!
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: '#D4AF37',
              color: '#0E0E0E',
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main unlock page
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0E0E0E' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Unlock Pro
          </h1>
          <p style={{ color: '#888' }}>
            Get access to advanced features and take control of your financial future.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl p-8 mb-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Price Section */}
          <div className="text-center mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="text-5xl font-bold mb-2" style={{ color: '#D4AF37' }}>
              $2.99
            </div>
            <p style={{ color: '#888' }}>
              One-time payment. Lifetime access.
            </p>
          </div>

          {/* Features Preview */}
          <div className="mb-8 space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span style={{ color: '#FFFFFF' }}>Unlimited Lifestyle Blueprints</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span style={{ color: '#FFFFFF' }}>Save & Edit Blueprints</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span style={{ color: '#FFFFFF' }}>Affordability Timeline & Calculators</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            {/* PayPal Button */}
            <button
              onClick={() => window.open(PAYPAL_LINK, '_blank')}
              className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300"
              style={{
                backgroundColor: '#D4AF37',
                color: '#0E0E0E',
                boxShadow: '0 10px 25px rgba(255, 255, 255, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.25)';
              }}
            >
              Continue to PayPal
            </button>

            {/* Verify Button */}
            <button
              onClick={() => router.push('/premium/verify')}
              className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 border"
              style={{
                backgroundColor: 'transparent',
                color: '#D4AF37',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              I've Paid - Verify
            </button>
          </div>

          {/* Microcopy */}
          <div className="mt-6 pt-6 border-t space-y-3" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <p className="text-xs text-center" style={{ color: '#888' }}>
              💡 PayPal may take 30–90 seconds to send confirmation. After payment, click "I've Paid - Verify" to unlock Pro.
            </p>
            <p className="text-xs text-center" style={{ color: '#888' }}>
              Unable to login? Contact support: <span style={{ color: '#D4AF37' }}>mylifespec@outlook.com</span> and we will give you access ASAP!
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm transition-colors duration-300"
            style={{ color: '#888' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
