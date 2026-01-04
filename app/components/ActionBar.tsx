'use client';

import React from 'react';

interface ActionBarProps {
  onBack?: () => void;
  onFinish?: () => void;
  isLoading?: boolean;
}

export function ActionBar({ onBack, onFinish, isLoading = false }: ActionBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        backgroundColor: `rgb(var(--panel) / 0.95)`,
        borderColor: 'rgb(var(--gold))',
        borderTopWidth: '2px',
        backdropFilter: 'blur(10px)',
        height: '72px',
        boxShadow: '0 -4px 20px rgba(213, 160, 33, 0.1)',
      }}
    >
      <div className="h-full max-w-6xl mx-auto px-8 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-sm font-medium transition-colors duration-300 hover:text-opacity-100"
          style={{ color: 'rgb(var(--gold))' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgb(var(--text))')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgb(var(--gold))')}
        >
          ← Back
        </button>

        {/* Center Text */}
        <p className="text-xs" style={{ color: 'rgb(var(--gold))' }}>
          You can refine this later.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onFinish}
          disabled={isLoading}
          className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: 'rgb(var(--gold))',
            color: 'rgb(var(--bg))',
            boxShadow: '0 4px 12px rgba(213, 160, 33, 0.2)',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(213, 160, 33, 0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(213, 160, 33, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {isLoading ? 'Saving...' : 'Finish Blueprint'}
        </button>
      </div>
    </div>
  );
}
