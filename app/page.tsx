'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060A0F] via-[#071827] to-[#060A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-semibold text-[#2DD4BF]">LifeSpec</div>
        <p className="text-[#A8B3C7] mt-4">Loading...</p>
      </div>
    </div>
  );
}
