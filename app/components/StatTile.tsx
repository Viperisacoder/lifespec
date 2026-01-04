'use client';

import React from 'react';

interface StatTileProps {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}

export function StatTile({ label, value, subtext, highlight = false }: StatTileProps) {
  return (
    <div
      className="rounded-lg p-4 border border-opacity-10 transition-all duration-300 hover:border-opacity-20"
      style={{
        backgroundColor: `rgb(var(--panel-2) / 0.5)`,
        borderColor: highlight ? 'rgb(var(--gold) / 0.3)' : 'rgb(var(--border))',
      }}
    >
      <p className="text-sm font-medium mb-2" style={{ color: 'rgb(var(--muted))' }}>
        {label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{
          color: highlight ? 'rgb(var(--gold))' : 'rgb(var(--text))',
        }}
      >
        {value}
      </p>
      {subtext && (
        <p className="text-xs mt-1" style={{ color: 'rgb(var(--muted-2))' }}>
          {subtext}
        </p>
      )}
    </div>
  );
}
