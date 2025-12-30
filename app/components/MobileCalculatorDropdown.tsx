'use client';

import { useState, useEffect } from 'react';

interface MobileCalculatorDropdownProps {
  totalMonthly: number;
  totalYearly: number;
  requiredIncome: number;
}

export function MobileCalculatorDropdown({
  totalMonthly,
  totalYearly,
  requiredIncome,
}: MobileCalculatorDropdownProps) {
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

  const formatMoney = (n: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  const formatMonthly = (n: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <div className="sm:hidden fixed top-20 left-0 right-0 z-40 bg-[#0B1220]/95 backdrop-blur-md border-b border-white/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-[#2DD4BF]">
            Total: {formatMonthly(totalMonthly)}/mo
          </p>
          <p className="text-xs text-slate-500">Tap for breakdown</p>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
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
      </button>

      {/* Expanded dropdown panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-3 border-t border-white/10 bg-[#060A0F]/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Monthly Total</span>
            <span className="text-sm font-semibold text-[#2DD4BF]">{formatMonthly(totalMonthly)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Yearly Total</span>
            <span className="text-sm font-semibold text-[#F6C66A]">{formatMoney(totalYearly)}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Required Income</span>
            <span className="text-sm font-semibold text-white">{formatMoney(requiredIncome)}</span>
          </div>

          <p className="text-xs text-slate-500 pt-2">
            Assumes 25% taxes + 10% savings
          </p>
        </div>
      </div>
    </div>
  );
}
