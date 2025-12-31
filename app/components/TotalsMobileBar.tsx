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
    <div className="md:hidden fixed top-20 left-0 right-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(26, 29, 34, 0.95)', borderColor: 'var(--border-color)' }}>
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className={`
          w-full px-4 py-4 flex items-center justify-between
          transition-all duration-300
          hover:bg-white/5
          active:bg-white/10
        `}
      >
        <div className="text-left flex-1">
          <p className="text-sm font-semibold" style={{ color: 'var(--accent-gold)' }}>
            {formatMoney(animatedMonthly)}<span className="text-xs font-medium ml-1" style={{ color: 'var(--text-secondary)' }}>/mo</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Tap to expand</p>
        </div>

        {/* Chevron Icon */}
        <div className="flex-shrink-0 ml-4">
          <svg
            className={`
              w-5 h-5 transition-transform duration-300 ease-out
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--text-secondary)' }}
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
        <div className="px-4 py-6 space-y-5 border-t" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(14, 15, 17, 0.5)' }}>
          {/* Monthly */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Monthly Total
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent-gold)' }}>
              {formatMoney(animatedMonthly)}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{
            background: `linear-gradient(to right, var(--accent-gold) 0%, transparent 100%)`,
            opacity: 0.2,
          }} />

          {/* Yearly */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Yearly Total
            </div>
            <div className="text-2xl font-semibold" style={{ color: 'var(--accent-gold-muted)' }}>
              {formatMoney(animatedYearly)}
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
