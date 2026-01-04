'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { createBrowserClient } from '@supabase/ssr';

interface ProPaywallProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const PAYPAL_LINK = 'https://www.paypal.com/ncp/payment/ZSBQDYCMZXZ4N';

/**
 * ProPaywall component wraps Pro-only features
 * Shows paywall UI if user is not Pro
 */
export function ProPaywall({ children, fallback }: ProPaywallProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPro = async () => {
      if (!user) {
        setIsPro(false);
        setLoading(false);
        return;
      }

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
        }
      } catch (error) {
        console.error('Error:', error);
        setIsPro(false);
      } finally {
        setLoading(false);
      }
    };

    checkPro();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full animate-pulse mx-auto mb-2" style={{ background: 'linear-gradient(to bottom right, #D4AF37, #B8860B)' }} />
          <p style={{ color: '#888' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isPro) {
    return (
      fallback || (
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgba(212, 175, 55, 0.2)' }}>
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
              Pro Feature
            </h3>
            <p className="mb-6" style={{ color: '#888' }}>
              This feature is available to Pro members only.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.open(PAYPAL_LINK, '_blank')}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#0E0E0E',
                  boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(212, 175, 55, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(212, 175, 55, 0.25)';
                }}
              >
                Pay $2.99 for Pro
              </button>

              <button
                onClick={() => router.push('/redeem')}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 border"
                style={{
                  backgroundColor: 'transparent',
                  color: '#D4AF37',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                }}
              >
                Already paid? Create account
              </button>
            </div>

            <p className="text-xs mt-4" style={{ color: '#888' }}>
              One-time payment. Lifetime access.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
