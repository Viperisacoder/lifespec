'use client';

import { Tier1Results } from '@/lib/userInputTypes';

interface Tier1ModulesProps {
  results: Tier1Results;
}

export function Tier1Modules({ results }: Tier1ModulesProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Blueprint Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(results).map(([key, value]) => (
          <div 
            key={key}
            className="rounded-2xl p-6 border transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>{key}</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--white)' }}>
              {typeof value === 'number' ? value.toLocaleString() : JSON.stringify(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
