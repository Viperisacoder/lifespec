'use client';

import { useState, useEffect } from 'react';
import { useCountUp } from '@/app/hooks/useCountUp';

interface TotalsMobileBarProps {
  totalMonthly: number;
  totalYearly: number;
}

export function TotalsMobileBar({ totalMonthly, totalYearly }: TotalsMobileBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

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
    <div className="md:hidden fixed top-20 left-0 right-0 z-40 bg-[#0B1220]/95 backdrop-blur-md border-b border-[rgba(45,212,191,0.12)]">
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className={`
          w-full px-4 py-4 flex items-center justify-between
          transition-all duration-300
          hover:bg-[rgba(45,212,191,0.05)]
          active:bg-[rgba(45,212,191,0.08)]
        `}
      >
        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-[#2DD4BF]">
            {formatMoney(animatedMonthly)}<span className="text-xs font-medium text-[#A8B3C7] ml-1">/mo</span>
          </p>
          <p className="text-xs text-[#A8B3C7]/70 mt-0.5">Tap to expand</p>
        </div>

        {/* Chevron Icon */}
        <div className="flex-shrink-0 ml-4">
          <svg
            className={`
              w-5 h-5 text-[#A8B3C7] transition-transform duration-300 ease-out
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${isExpanded ? 'max-h-80' : 'max-h-0'}
        `}
      >
        <div className="px-4 py-6 space-y-5 border-t border-[rgba(45,212,191,0.12)] bg-gradient-to-b from-[#0B1220]/50 to-[#060A0F]/50">
          {/* Monthly */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#A8B3C7] uppercase tracking-widest">
              Monthly Total
            </div>
            <div className="text-3xl font-bold text-[#2DD4BF]">
              {formatMoney(animatedMonthly)}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-[rgba(45,212,191,0.1)] to-[rgba(45,212,191,0.05)]" />

          {/* Yearly */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#A8B3C7] uppercase tracking-widest">
              Yearly Total
            </div>
            <div className="text-2xl font-semibold text-[#F6C66A]">
              {formatMoney(animatedYearly)}
            </div>
          </div>

          {/* Caption */}
          <div className="pt-2 text-xs text-[#A8B3C7]/70">
            Estimates for inspiration only
          </div>
        </div>
      </div>
    </div>
  );
}
