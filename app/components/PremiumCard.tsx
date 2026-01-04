'use client';

import React from 'react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accent?: boolean;
}

export function PremiumCard({ 
  children, 
  className = '', 
  hover = true,
  accent = false 
}: PremiumCardProps) {
  return (
    <div
      className={`
        rounded-xl border backdrop-blur-sm transition-all duration-300
        ${hover ? 'hover:border-opacity-100 hover:shadow-lg hover:translate-y-[-2px]' : ''}
        ${accent ? 'border-opacity-20' : 'border-opacity-10'}
        ${className}
      `}
      style={{
        backgroundColor: `rgb(var(--panel) / 0.6)`,
        borderColor: accent ? 'rgb(var(--gold) / 0.3)' : 'rgb(var(--border))',
        boxShadow: hover ? 'var(--shadow)' : '0 4px 12px rgba(0,0,0,0.3)',
        backgroundImage: `linear-gradient(135deg, rgb(var(--panel)) 0%, rgb(var(--panel-2)) 100%)`,
      }}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, rgb(var(--gold)) 0%, transparent 100%)`,
            opacity: 0.3,
          }}
        />
      )}
      {children}
    </div>
  );
}
