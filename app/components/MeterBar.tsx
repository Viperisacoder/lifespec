'use client';

import React from 'react';

interface MeterBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  showValue?: boolean;
}

export function MeterBar({ label, value, max, unit = '', showValue = true }: MeterBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium" style={{ color: 'rgb(var(--muted))' }}>
          {label}
        </p>
        {showValue && (
          <p className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>
            ${value.toLocaleString()}{unit}
          </p>
        )}
      </div>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{
          backgroundColor: 'rgb(var(--panel-2))',
          border: '1px solid rgb(var(--border))',
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: 'rgb(var(--gold))',
          }}
        />
      </div>
    </div>
  );
}
