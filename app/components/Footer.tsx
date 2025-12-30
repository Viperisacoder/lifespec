'use client';

import { useRouter } from 'next/navigation';

export function Footer() {
  const router = useRouter();

  return (
    <footer className="border-t border-white/10 bg-[#060A0F]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">© LifeSpec</p>
        <button
          onClick={() => router.push('/contact')}
          className="text-sm text-slate-400 hover:text-[#F6C66A] transition-colors duration-300"
        >
          Contact Us
        </button>
      </div>
    </footer>
  );
}
