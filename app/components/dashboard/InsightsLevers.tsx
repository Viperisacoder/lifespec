'use client';

interface InsightData {
  marginAfterLife: {
    amount: number;
    percentage: number;
    interpretation: string;
  };
  lifestressIndex: {
    score: number;
    interpretation: string;
  };
  freedomLevers: Array<{
    id: string;
    description: string;
    impact: string;
  }>;
}

interface InsightsLeversProps {
  data?: InsightData;
}

export default function InsightsLevers({
  data = {
    marginAfterLife: {
      amount: 25000,
      percentage: 16.7,
      interpretation: "Your margin is thin but positive. Consider increasing income or reducing fixed costs."
    },
    lifestressIndex: {
      score: 68,
      interpretation: "Your financial commitments are creating moderate pressure on your lifestyle."
    },
    freedomLevers: [
      {
        id: "lever1",
        description: "Reduce lifestyle by 8%",
        impact: "Income requirement drops $15,000"
      },
      {
        id: "lever2",
        description: "Increase savings rate to 20%",
        impact: "Reach stability 4 years sooner"
      },
      {
        id: "lever3",
        description: "Relocate to lower cost area",
        impact: "Housing costs reduce by 30%"
      }
    ]
  }
}: InsightsLeversProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Determine color based on margin percentage
  const getMarginColor = (percentage: number) => {
    if (percentage < 0) return "from-rose-500 to-rose-400";
    if (percentage < 10) return "from-amber-500 to-amber-400";
    if (percentage < 20) return "from-emerald-500 to-emerald-400";
    return "from-teal-500 to-teal-400";
  };
  
  // Determine color based on stress index
  const getStressColor = (score: number) => {
    if (score > 80) return "from-rose-500 to-rose-400";
    if (score > 60) return "from-amber-500 to-amber-400";
    if (score > 40) return "from-emerald-500 to-emerald-400";
    return "from-teal-500 to-teal-400";
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-light tracking-wide text-[var(--text-primary)] mb-8">
        Insights & Levers
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Margin After Life */}
        <div 
          className="relative overflow-hidden rounded-2xl p-8 hover:shadow-lg transition-shadow"
          style={{ 
            background: 'rgba(20, 20, 22, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          <h3 className="text-lg font-light mb-6 text-[var(--text-secondary)]">Margin After Life</h3>
          
          <div className="mb-6">
            <p className="text-4xl font-light mb-1 text-[var(--text-primary)]">
              {formatCurrency(data.marginAfterLife.amount)}
            </p>
            <p className="text-lg text-[var(--text-secondary)]">
              {data.marginAfterLife.percentage}% of income
            </p>
          </div>
          
          {/* Margin Visualization */}
          <div className="h-2 w-full bg-[rgba(212,175,55,0.1)] rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full bg-gradient-to-r ${getMarginColor(data.marginAfterLife.percentage)} animate-fade-in`}
              style={{ width: `${Math.max(0, Math.min(100, data.marginAfterLife.percentage * 2))}%` }}
            />
          </div>
          
          <p className="text-sm text-[var(--text-secondary)]">
            {data.marginAfterLife.interpretation}
          </p>
        </div>
        
        {/* Lifestyle Stress Index */}
        <div 
          className="relative overflow-hidden rounded-2xl p-8 hover:shadow-lg transition-shadow"
          style={{ 
            background: 'rgba(20, 20, 22, 0.7)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          <h3 className="text-lg font-light mb-6 text-[var(--text-secondary)]">Lifestyle Stress Index</h3>
          
          <div className="flex items-center mb-6">
            <div 
              className="relative w-24 h-24 flex items-center justify-center animate-fade-in"
            >
              {/* Circular progress */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.1)" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke={getStressColor(data.lifestressIndex.score).split(' ')[1]}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * data.lifestressIndex.score / 100)}
                  strokeLinecap="round"
                  style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-light text-[var(--text-primary)]">{data.lifestressIndex.score}</p>
              </div>
            </div>
            
            <div className="ml-6">
              <p className="text-sm text-[var(--text-secondary)]">
                {data.lifestressIndex.interpretation}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>Low Stress</span>
            <span>High Stress</span>
          </div>
        </div>
      </div>
      
      {/* Freedom Levers */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 hover:shadow-lg transition-shadow"
        style={{ 
          background: 'rgba(20, 20, 22, 0.7)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        <h3 className="text-lg font-light mb-6 text-[var(--text-secondary)]">Freedom Levers</h3>
        
        <div className="space-y-6">
          {data.freedomLevers.map((lever, index) => (
            <div 
              key={lever.id}
              className="flex items-start animate-fade-in"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1" 
                style={{ background: 'linear-gradient(135deg, var(--white), var(--white))' }}>
                <span className="text-sm font-medium text-[var(--bg-primary)]">{index + 1}</span>
              </div>
              <div>
                <p className="text-lg font-light text-[var(--text-primary)] mb-1">{lever.description}</p>
                <p className="text-sm text-[var(--white)]">{lever.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
