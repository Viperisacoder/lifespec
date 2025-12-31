'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/wizard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Image with Heavy Blur */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/homepage.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px)',
          opacity: 0.3,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(14, 15, 17, 0.85)' }} />

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="text-3xl md:text-4xl font-light tracking-widest mb-8" style={{ color: 'var(--text-primary)' }}>
          Life<span className="font-semibold">Spec</span>
        </div>
        
        <div className="mb-8">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Building your LifeSpec...</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'var(--accent-gold)',
              animation: 'bounce 1.4s ease-in-out infinite',
            }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'var(--accent-gold)',
              animation: 'bounce 1.4s ease-in-out infinite 0.2s',
            }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'var(--accent-gold)',
              animation: 'bounce 1.4s ease-in-out infinite 0.4s',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
      `}</style>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-12 md:py-16 px-8 md:px-12 text-center border-t" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <p className="text-xs md:text-sm opacity-65 max-w-4xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Disclaimer: LifeSpec provides illustrative estimates for entertainment and inspiration purposes only. All costs and projections are approximations and should not be used as financial, legal, or investment advice.
        </p>
      </footer>
    </div>
  );
}
