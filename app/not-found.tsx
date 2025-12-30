'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#060A0F] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2DD4BF] mb-4">404</h1>
        <h2 className="text-3xl font-light tracking-widest text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/')}
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] text-white font-semibold rounded-lg hover:from-[#0D5F5B] hover:to-[#1BA39F] transition-all duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
