'use client';

import { useEffect, useState } from 'react';

interface RealitySnapshotProps {
  lifestyleCost?: {
    yearly: number;
    monthly: number;
    composition: {
      housing: number;
      lifestyle: number;
      fixed: number;
    };
  };
  incomeReality?: {
    required: number;
    current: number;
  };
  timeToEquilibrium?: number | null; // in months, null if not achievable
}

export default function RealitySnapshot({
  lifestyleCost = {
    yearly: 120000,
    monthly: 10000,
    composition: { housing: 40, lifestyle: 35, fixed: 25 }
  },
  incomeReality = {
    required: 180000,
    current: 150000
  },
  timeToEquilibrium = 24
}: RealitySnapshotProps) {
  const [animatedYearlyCost, setAnimatedYearlyCost] = useState(0);
  const [animatedMonthlyCost, setAnimatedMonthlyCost] = useState(0);
  const [animatedRequiredIncome, setAnimatedRequiredIncome] = useState(0);
  const [animatedCurrentIncome, setAnimatedCurrentIncome] = useState(0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate income gap
  const incomeGap = incomeReality.current - incomeReality.required;
  const incomeGapLabel = incomeGap >= 0 
    ? "Surplus" 
    : incomeGap >= -incomeReality.required * 0.1 
      ? "Knife-edge" 
      : "Shortfall";
  
  // Animate numbers on load
  useEffect(() => {
    const duration = 1500; // ms
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    
    const timer = setInterval(() => {
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      
      setAnimatedYearlyCost(Math.round(lifestyleCost.yearly * easeProgress));
      setAnimatedMonthlyCost(Math.round(lifestyleCost.monthly * easeProgress));
      setAnimatedRequiredIncome(Math.round(incomeReality.required * easeProgress));
      setAnimatedCurrentIncome(Math.round(incomeReality.current * easeProgress));
      
      step++;
      if (step > steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, [lifestyleCost.yearly, lifestyleCost.monthly, incomeReality.required, incomeReality.current]);

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <h2 className="text-2xl font-light tracking-wide text-[var(--text-primary)]">
        Reality Snapshot
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lifestyle Cost */}
        <div 
          className="relative overflow-hidden rounded-2xl p-8 hover:shadow-lg transition-shadow"
          style={{ 
            background: 'rgba(20, 20, 22, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.05)'
          }}
        >
          <h3 className="text-lg font-light mb-6 text-[var(--text-secondary)]">Lifestyle Cost</h3>
          
          <div className="mb-6">
            <p className="text-4xl font-light mb-1 text-[var(--text-primary)]">
              {formatCurrency(animatedYearlyCost)}
              <span className="text-lg ml-1 opacity-60">/ year</span>
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              {formatCurrency(animatedMonthlyCost)} monthly
            </p>
          </div>
          
          {/* Composition Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Housing</span>
                <span className="text-[var(--text-secondary)]">{lifestyleCost.composition.housing}%</span>
              </div>
              <div className="h-1.5 bg-[rgba(212,175,55,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C8A24D] animate-fade-in"
                  style={{ width: `${lifestyleCost.composition.housing}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Lifestyle</span>
                <span className="text-[var(--text-secondary)]">{lifestyleCost.composition.lifestyle}%</span>
              </div>
              <div className="h-1.5 bg-[rgba(212,175,55,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B89B5E] animate-fade-in"
                  style={{ width: `${lifestyleCost.composition.lifestyle}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Fixed Costs</span>
                <span className="text-[var(--text-secondary)]">{lifestyleCost.composition.fixed}%</span>
              </div>
              <div className="h-1.5 bg-[rgba(212,175,55,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C8A24D] to-[#B89B5E] animate-fade-in"
                  style={{ width: `${lifestyleCost.composition.fixed}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Income Reality */}
        <div 
          className="relative overflow-hidden rounded-2xl p-8 hover:shadow-lg transition-shadow"
          style={{ 
            background: 'rgba(20, 20, 22, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.05)'
          }}
        >
          <h3 className="text-lg font-light mb-6 text-[var(--text-secondary)]">Income Reality</h3>
          
          <div className="mb-8">
            <div className="flex items-baseline">
              <p className="text-4xl font-light text-[var(--text-primary)]">
                {formatCurrency(animatedRequiredIncome)}
              </p>
              <p className="text-lg ml-2 text-[var(--text-secondary)]">required</p>
            </div>
            <div className="flex items-baseline mt-2">
              <p className="text-2xl font-light text-[var(--text-primary)]">
                {formatCurrency(animatedCurrentIncome)}
              </p>
              <p className="text-base ml-2 text-[var(--text-secondary)]">current</p>
            </div>
          </div>
          
          {/* Income Gap Visualization */}
          <div className="relative h-16">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[rgba(212,175,55,0.1)] rounded-full" />
            
            {/* Required Income Marker */}
            <div 
              className="absolute top-0 h-6 w-1 bg-[var(--text-primary)] rounded-full animate-fade-in"
              style={{ left: '70%' }}
            >
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <p className="text-xs text-[var(--text-secondary)]">Required</p>
              </div>
            </div>
            
            {/* Current Income Marker */}
            <div 
              className="absolute top-0 h-6 w-1 bg-[var(--accent-gold)] rounded-full animate-fade-in"
              style={{ 
                left: `${Math.max(5, Math.min(95, (incomeReality.current / incomeReality.required) * 70))}%` 
              }}
            >
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <p className="text-xs text-[var(--text-secondary)]">Current</p>
              </div>
            </div>
            
            {/* Gap Label */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-fade-in"
            >
              <p className={`text-sm font-medium ${
                incomeGapLabel === "Surplus" 
                  ? "text-emerald-400" 
                  : incomeGapLabel === "Knife-edge" 
                    ? "text-amber-400" 
                    : "text-rose-400"
              }`}>
                {incomeGapLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Pressure */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 hover:shadow-lg transition-shadow animate-fade-in"
        style={{ 
          background: 'rgba(20, 20, 22, 0.7)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.05)'
        }}
      >
        <h3 className="text-lg font-light mb-6 text-[var(--text-secondary)]">Time Pressure</h3>
        
        {timeToEquilibrium !== null ? (
          <div className="flex items-baseline">
            <p className="text-4xl font-light text-[var(--text-primary)]">
              {timeToEquilibrium}
            </p>
            <p className="text-lg ml-2 text-[var(--text-secondary)]">
              months until equilibrium
            </p>
          </div>
        ) : (
          <p className="text-xl font-light text-rose-400">
            Not achievable at current inputs
          </p>
        )}
      </div>
    </div>
  );
}
