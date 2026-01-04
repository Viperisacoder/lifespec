'use client';

import { useMemo } from 'react';

interface LifeStatusStripProps {
  savingsViability?: number; // 0-100
  incomeGap?: number; // negative = shortfall, positive = surplus
  lifestyleStress?: number; // 0-100
  marginPercentage?: number; // percentage of income as margin
  hasData?: boolean; // whether we have enough data to show meaningful metrics
}

export default function LifeStatusStrip({
  savingsViability = 50,
  incomeGap = 0,
  lifestyleStress = 50,
  marginPercentage = 15,
  hasData = true
}: LifeStatusStripProps) {
  // Memoize calculations to prevent unnecessary re-renders
  const metrics = useMemo(() => {
    if (!hasData) {
      return {
        lifestyle: { value: '—', color: 'var(--text-secondary)' },
        flexibility: { value: '—', color: 'var(--text-secondary)' },
        stress: { value: '—', color: 'var(--text-secondary)' },
        trajectory: { value: '—', color: 'var(--text-secondary)' }
      };
    }

    // Calculate lifestyle level
    const lifestyle = {
      value: lifestyleStress < 30 ? 'Minimal' : 
             lifestyleStress < 60 ? 'Balanced' : 
             lifestyleStress < 80 ? 'Premium' : 'Luxury',
      color: lifestyleStress < 30 ? '#34d399' : 
             lifestyleStress < 60 ? 'var(--white)' : 
             lifestyleStress < 80 ? '#fbbf24' : '#f87171'
    };

    // Calculate financial flexibility
    const flexibility = {
      value: marginPercentage < 5 ? 'Low' :
             marginPercentage < 15 ? 'Moderate' :
             marginPercentage < 25 ? 'Good' : 'High',
      color: marginPercentage < 5 ? '#f87171' :
             marginPercentage < 15 ? '#fbbf24' :
             marginPercentage < 25 ? 'var(--white)' : '#34d399'
    };

    // Calculate stress level
    const stress = {
      value: lifestyleStress < 30 ? 'Low' :
             lifestyleStress < 60 ? 'Moderate' :
             lifestyleStress < 80 ? 'High' : 'Critical',
      color: lifestyleStress < 30 ? '#34d399' :
             lifestyleStress < 60 ? '#fbbf24' :
             lifestyleStress < 80 ? '#f87171' : '#ef4444'
    };

    // Calculate trajectory
    const trajectory = {
      value: incomeGap >= 10000 ? 'Rising' :
             incomeGap >= 0 ? 'Stable' :
             incomeGap >= -20000 ? 'At Risk' : 'Declining',
      color: incomeGap >= 10000 ? '#34d399' :
             incomeGap >= 0 ? 'var(--white)' :
             incomeGap >= -20000 ? '#fbbf24' : '#f87171'
    };

    return { lifestyle, flexibility, stress, trajectory };
  }, [savingsViability, incomeGap, lifestyleStress, marginPercentage, hasData]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {/* Lifestyle Pill */}
        <div
          className="px-4 py-2 rounded-full animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.lifestyle.color === 'var(--white)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Lifestyle</span>
            <span className="text-sm font-medium" style={{ color: metrics.lifestyle.color }}>
              {metrics.lifestyle.value}
            </span>
          </div>
        </div>

        {/* Flexibility Pill */}
        <div
          className="px-4 py-2 rounded-full animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.flexibility.color === 'var(--white)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Flexibility</span>
            <span className="text-sm font-medium" style={{ color: metrics.flexibility.color }}>
              {metrics.flexibility.value}
            </span>
          </div>
        </div>

        {/* Stress Pill */}
        <div
          className="px-4 py-2 rounded-full animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.stress.color === 'var(--white)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Stress</span>
            <span className="text-sm font-medium" style={{ color: metrics.stress.color }}>
              {metrics.stress.value}
            </span>
          </div>
        </div>

        {/* Trajectory Pill */}
        <div
          className="px-4 py-2 rounded-full animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.trajectory.color === 'var(--white)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Trajectory</span>
            <span className="text-sm font-medium" style={{ color: metrics.trajectory.color }}>
              {metrics.trajectory.value}
            </span>
          </div>
        </div>
      </div>

      {/* Helper text for when data is missing */}
      {!hasData && (
        <p 
          className="text-center text-xs mt-4 text-[var(--text-secondary)] animate-fade-in"
        >
          Add inputs to unlock your life metrics
        </p>
      )}
    </div>
  );
}
