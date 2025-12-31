'use client';

import { useState, useEffect } from 'react';
import { useCountUp } from '@/app/hooks/useCountUp';

interface TotalsCardProps {
  totalMonthly: number;
  totalYearly: number;
}

export function TotalsCard({ totalMonthly, totalYearly }: TotalsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const animatedMonthly = useCountUp(totalMonthly, 600);
  const animatedYearly = useCountUp(totalYearly, 600);

  const formatMoney = (n: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <div
      className={`
        hidden md:block fixed top-24 left-6 z-30
        transition-all duration-500 ease-out
        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl
          backdrop-blur-xl
          px-6 py-8
          shadow-2xl
          transition-all duration-300 ease-out
          ${isHovered ? 'shadow-[0_20px_40px_rgba(212,175,55,0.15)]' : 'shadow-[0_10px_30px_rgba(0,0,0,0.3)]'}
          ${isHovered ? '-translate-y-1' : 'translate-y-0'}
        `}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: isHovered ? 'var(--accent-gold)' : 'var(--border-color)',
          borderWidth: '1px',
        }}
      >
        {/* Animated gradient background on hover */}
        <div
          className={`
            absolute inset-0 opacity-0 transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: `linear-gradient(to right, var(--accent-gold) 0%, var(--accent-gold) 50%, transparent 100%)`,
          opacity: isHovered ? 0.3 : 0.15,
        }} />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Label */}
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            Totals
          </div>

          {/* Monthly (Hero) */}
          <div className="space-y-2">
            <div className="text-4xl font-bold tracking-tight" style={{ color: 'var(--accent-gold)' }}>
              {formatMoney(animatedMonthly)}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Per Month
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{
            background: `linear-gradient(to right, var(--accent-gold) 0%, transparent 100%)`,
            opacity: 0.2,
          }} />

          {/* Yearly (Secondary) */}
          <div className="space-y-2">
            <div className="text-2xl font-semibold" style={{ color: 'var(--accent-gold-muted)' }}>
              {formatMoney(animatedYearly)}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Per Year
            </div>
          </div>

          {/* Caption */}
          <div className="pt-2 text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            Estimates for inspiration only
          </div>
        </div>
      </div>
    </div>
  );
}
