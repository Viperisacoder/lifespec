'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
  const prefersReducedMotion = useReducedMotion();
  
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
             lifestyleStress < 60 ? 'var(--accent-gold)' : 
             lifestyleStress < 80 ? '#fbbf24' : '#f87171'
    };

    // Calculate financial flexibility
    const flexibility = {
      value: marginPercentage < 5 ? 'Low' :
             marginPercentage < 15 ? 'Moderate' :
             marginPercentage < 25 ? 'Good' : 'High',
      color: marginPercentage < 5 ? '#f87171' :
             marginPercentage < 15 ? '#fbbf24' :
             marginPercentage < 25 ? 'var(--accent-gold)' : '#34d399'
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
             incomeGap >= 0 ? 'var(--accent-gold)' :
             incomeGap >= -20000 ? '#fbbf24' : '#f87171'
    };

    return { lifestyle, flexibility, stress, trajectory };
  }, [savingsViability, incomeGap, lifestyleStress, marginPercentage, hasData]);

  // Animation variants for the pills
  const pillVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : 0.3 + i * 0.1,
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {/* Lifestyle Pill */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={pillVariants}
          className="px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.lifestyle.color === 'var(--accent-gold)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Lifestyle</span>
            <span className="text-sm font-medium" style={{ color: metrics.lifestyle.color }}>
              {metrics.lifestyle.value}
            </span>
          </div>
        </motion.div>

        {/* Flexibility Pill */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={pillVariants}
          className="px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.flexibility.color === 'var(--accent-gold)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Flexibility</span>
            <span className="text-sm font-medium" style={{ color: metrics.flexibility.color }}>
              {metrics.flexibility.value}
            </span>
          </div>
        </motion.div>

        {/* Stress Pill */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={pillVariants}
          className="px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.stress.color === 'var(--accent-gold)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Stress</span>
            <span className="text-sm font-medium" style={{ color: metrics.stress.color }}>
              {metrics.stress.value}
            </span>
          </div>
        </motion.div>

        {/* Trajectory Pill */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={pillVariants}
          className="px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: 'rgba(20, 20, 22, 0.7)',
            boxShadow: `0 0 15px rgba(${metrics.trajectory.color === 'var(--accent-gold)' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Trajectory</span>
            <span className="text-sm font-medium" style={{ color: metrics.trajectory.color }}>
              {metrics.trajectory.value}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Helper text for when data is missing */}
      {!hasData && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-xs mt-4 text-[var(--text-secondary)]"
        >
          Add inputs to unlock your life metrics
        </motion.p>
      )}
    </div>
  );
}
