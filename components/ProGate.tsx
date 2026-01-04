'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { checkUserIsPro } from '@/lib/proGating';

interface ProGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ProGate component wraps Pro-only features
 * Shows fallback UI if user is not Pro
 */
export function ProGate({ children, fallback }: ProGateProps) {
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

      const proStatus = await checkUserIsPro(user.id);
      setIsPro(proStatus);
      setLoading(false);
    };

    checkPro();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
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
        <div className="rounded-2xl p-8 border text-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgba(212, 175, 55, 0.2)' }}>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
            Pro Feature
          </h3>
          <p className="mb-6" style={{ color: '#888' }}>
            Unlock Pro to access this feature.
          </p>
          <button
            onClick={() => router.push('/premium/verify')}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: '#D4AF37',
              color: '#0E0E0E',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(212, 175, 55, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Unlock Pro
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
}
