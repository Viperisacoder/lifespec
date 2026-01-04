'use client';

import { useState } from 'react';

interface InteractionControlsProps {
  initialValues?: {
    income: number;
    savingsRate: number;
    lifestyleLevel: number;
  };
  onUpdate?: (values: {
    income: number;
    savingsRate: number;
    lifestyleLevel: number;
  }) => void;
}

export default function InteractionControls({
  initialValues = {
    income: 150000,
    savingsRate: 15,
    lifestyleLevel: 70
  },
  onUpdate
}: InteractionControlsProps) {
  const [income, setIncome] = useState(initialValues.income);
  const [savingsRate, setSavingsRate] = useState(initialValues.savingsRate);
  const [lifestyleLevel, setLifestyleLevel] = useState(initialValues.lifestyleLevel);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle slider changes
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setIncome(value);
    if (onUpdate) {
      onUpdate({
        income: value,
        savingsRate,
        lifestyleLevel
      });
    }
  };
  
  const handleSavingsRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSavingsRate(value);
    if (onUpdate) {
      onUpdate({
        income,
        savingsRate: value,
        lifestyleLevel
      });
    }
  };
  
  const handleLifestyleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLifestyleLevel(value);
    if (onUpdate) {
      onUpdate({
        income,
        savingsRate,
        lifestyleLevel: value
      });
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-light tracking-wide text-[var(--text-primary)] mb-8">
        Tune Your Life
      </h2>
      
      <div className="space-y-10">
        {/* Income Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <label className="text-lg font-light text-[var(--text-secondary)]">Annual Income</label>
            <span className="text-xl font-light text-[var(--text-primary)]">{formatCurrency(income)}</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="50000"
              max="500000"
              step="5000"
              value={income}
              onChange={handleIncomeChange}
              className="w-full appearance-none bg-transparent cursor-pointer"
              style={{
                // Custom slider styling
                WebkitAppearance: 'none',
                height: '2px',
                background: 'linear-gradient(to right, var(--accent-gold-subtle), var(--white))',
              }}
            />
            <style jsx>{`
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--white);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                cursor: pointer;
                transition: all 0.2s ease;
              }
              
              input[type=range]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
              }
              
              input[type=range]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--white);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
              }
              
              input[type=range]::-moz-range-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
              }
            `}</style>
          </div>
          
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>$50,000</span>
            <span>$500,000</span>
          </div>
        </div>
        
        {/* Savings Rate Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <label className="text-lg font-light text-[var(--text-secondary)]">Savings Rate</label>
            <span className="text-xl font-light text-[var(--text-primary)]">{savingsRate}%</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={savingsRate}
              onChange={handleSavingsRateChange}
              className="w-full appearance-none bg-transparent cursor-pointer"
              style={{
                WebkitAppearance: 'none',
                height: '2px',
                background: 'linear-gradient(to right, var(--accent-gold-subtle), var(--white))',
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>
        
        {/* Lifestyle Level Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <label className="text-lg font-light text-[var(--text-secondary)]">Lifestyle Level</label>
            <span className="text-xl font-light text-[var(--text-primary)]">{lifestyleLevel}%</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={lifestyleLevel}
              onChange={handleLifestyleLevelChange}
              className="w-full appearance-none bg-transparent cursor-pointer"
              style={{
                WebkitAppearance: 'none',
                height: '2px',
                background: 'linear-gradient(to right, var(--accent-gold-subtle), var(--white))',
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>Minimal (30%)</span>
            <span>Luxury (100%)</span>
          </div>
        </div>
      </div>
      
      {/* Removed 'Recalculate My Life' button - updates happen automatically when sliders change */}
    </div>
  );
}
