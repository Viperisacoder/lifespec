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
    <div className="min-h-screen bg-[#060A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-light tracking-widest text-white mb-8">
          Life<span className="font-semibold">Spec</span>
        </div>
        
        <div className="mb-8">
          <p className="text-slate-300 text-lg">Building your LifeSpec...</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-[#2DD4BF]"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite',
            }}
          />
          <div
            className="w-2 h-2 rounded-full bg-[#2DD4BF]"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite 0.2s',
            }}
          />
          <div
            className="w-2 h-2 rounded-full bg-[#2DD4BF]"
            style={{
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
    </div>
  );
}
