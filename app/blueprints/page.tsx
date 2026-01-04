'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { SavedBlueprint, BlueprintInputs } from '@/lib/blueprintTypes';
import { getBlueprint, deleteBlueprint, importPendingBlueprint } from '@/lib/blueprintService';
import { toast } from 'react-hot-toast';

// Helper function to format age display
function formatAge(age: number | null): string {
  if (age === null || isNaN(age)) return 'NA';
  return Math.ceil(age).toString();
}

// Calculate age when user reaches $1M in savings
function calculateMillionaireAge(
  currentAge: number | null,
  monthlyWealthIncrease: number,
  startingNetWorth: number = 0
): { age: string; subtext: string } {
  if (currentAge === null || currentAge < 0 || currentAge > 120) {
    return { age: 'NA', subtext: 'Enter valid age' };
  }

  if (monthlyWealthIncrease <= 0) {
    return { age: 'NA', subtext: 'Savings must be > $0/month' };
  }

  const monthsToMillion = Math.ceil((1_000_000 - startingNetWorth) / monthlyWealthIncrease);
  const millionaireAge = currentAge + monthsToMillion / 12;

  return {
    age: formatAge(millionaireAge),
    subtext: `Assumes $${Math.round(monthlyWealthIncrease).toLocaleString()}/month saved, no investment returns.`,
  };
}

// Calculate age when user can sustain blueprint + savings goals
function calculateGoalCompletionAge(
  currentAge: number | null,
  netMonthlyIncome: number,
  blueprintMonthlyCost: number,
  monthlySavings: number,
  annualIncomeGrowth: number = 0
): { age: string; subtext: string } {
  if (currentAge === null || currentAge < 0 || currentAge > 120) {
    return { age: 'NA', subtext: 'Enter valid age' };
  }

  const requiredMonthlyIncome = blueprintMonthlyCost + monthlySavings;
  const monthlySurplusAfterCosts = netMonthlyIncome - blueprintMonthlyCost;

  // Check if possible now
  if (monthlySurplusAfterCosts >= monthlySavings) {
    return { age: 'Now', subtext: 'Based on current inputs' };
  }

  // If growth rate is 0 and not possible now
  if (annualIncomeGrowth === 0) {
    return { age: 'Not possible', subtext: 'Requires income growth or cost reduction' };
  }

  // Calculate years needed with income growth
  // netMonthlyIncomeYearN = netMonthlyIncome * (1 + growthRate)^N
  // We need to find N where netMonthlyIncomeYearN >= requiredMonthlyIncome
  const growthRate = annualIncomeGrowth / 100;
  
  let yearsNeeded = 0;
  let projectedIncome = netMonthlyIncome;

  // Simple iteration to find when income grows enough
  for (let year = 0; year <= 100; year++) {
    projectedIncome = netMonthlyIncome * Math.pow(1 + growthRate, year);
    if (projectedIncome >= requiredMonthlyIncome) {
      yearsNeeded = year;
      break;
    }
  }

  const goalCompletionAge = currentAge + yearsNeeded;

  return {
    age: formatAge(goalCompletionAge),
    subtext: `Assumes ${annualIncomeGrowth}% annual income growth`,
  };
}

export default function BlueprintsPage() {
  const router = useRouter();
  const [blueprint, setBlueprint] = useState<SavedBlueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userInputs, setUserInputs] = useState<BlueprintInputs | null>(null);
  const [currentAge, setCurrentAge] = useState<number | null>(null);
  const [annualIncomeGrowth, setAnnualIncomeGrowth] = useState<number>(0);

  const { user, loading: authLoading } = useAuth();

  const loadData = async () => {
    try {
      if (!user) {
        console.log('No user found, redirecting to signup');
        router.push('/signup?next=/blueprints');
        return;
      }

      // Check for pending blueprint in localStorage
      const imported = await importPendingBlueprint();
      if (imported) {
        toast.success('Blueprint imported from your previous session');
      }

      const result = await getBlueprint();
      if (result.success) {
        setBlueprint(result.data);
      } else {
        console.error('Error fetching blueprint:', result.reason);
        setBlueprint(null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setBlueprint(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, user]);

  const handleDeleteBlueprint = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBlueprint();
      if (result.success) {
        toast.success('Blueprint deleted');
        setBlueprint(null);
        setShowDeleteConfirm(false);
      } else {
        toast.error('Failed to delete blueprint');
      }
    } catch (error) {
      console.error('Error deleting blueprint:', error);
      toast.error('Failed to delete blueprint');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full animate-pulse mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>No Blueprint Yet</h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>You haven't saved a blueprint yet. Create one to get started!</p>
          <button
            onClick={() => router.push('/wizard')}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
            style={{
              backgroundColor: 'var(--accent-gold)',
              color: 'var(--bg-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Create Blueprint
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = blueprint ? new Date(blueprint.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8" style={{ color: 'var(--text-primary)' }}>Your Blueprint</h1>
        
        {/* Blueprint Card */}
        <div className="mb-12">
          <div
            onClick={() => router.push('/blueprints/view')}
            className="w-full text-left rounded-2xl transition-all duration-200 ring-1 ring-transparent hover:ring-[rgba(212,175,55,0.3)] cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <div className="backdrop-blur-sm rounded-2xl overflow-hidden p-6 sm:p-8 relative">
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="absolute top-6 right-6 p-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                title="Delete blueprint"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div className="flex items-start justify-between mb-4 pr-12">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Your Lifestyle Blueprint</h2>
                <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' }}>
                  Saved
                </span>
              </div>
              
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Last updated: {formattedDate}</p>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Monthly Cost</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                    ${blueprint.blueprint?.totalMonthly?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Yearly Cost</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                    ${blueprint.blueprint?.totalYearly?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>

              {blueprint.blueprint?.requiredGrossYearly && (
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Required Gross Income (Yearly)</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ${blueprint.blueprint?.requiredGrossYearly?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Click to view full blueprint details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reality Timeline Panel */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Reality Timeline</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>See how your blueprint fits with your financial reality</p>
          
          <div className="bg-[#151822] rounded-2xl p-6 sm:p-8 border border-[rgba(255,255,255,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Input: Monthly Income */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Monthly Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>$</span>
                  <input
                    type="number"
                    value={userInputs?.monthlyIncome || ''}
                    onChange={(e) => setUserInputs(prev => ({ 
                      ...(prev || { taxRatePercent: 0, monthlySavings: 0 }), 
                      monthlyIncome: parseFloat(e.target.value) || 0 
                    }) as BlueprintInputs)}
                    className="w-full px-8 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'var(--border-color)',
                      color: 'white'
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
              
              {/* Input: Tax Rate */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Tax Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.1"
                    value={userInputs?.taxRatePercent || ''}
                    onChange={(e) => setUserInputs(prev => ({ 
                      ...(prev || { monthlyIncome: 0, monthlySavings: 0 }), 
                      taxRatePercent: parseFloat(e.target.value) || 0 
                    }) as BlueprintInputs)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'var(--border-color)',
                      color: 'white'
                    }}
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>%</span>
                </div>
              </div>
              
              {/* Input: Monthly Savings */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Monthly Savings</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>$</span>
                  <input
                    type="number"
                    value={userInputs?.monthlySavings || ''}
                    onChange={(e) => setUserInputs(prev => ({ 
                      ...(prev || { monthlyIncome: 0, taxRatePercent: 0 }), 
                      monthlySavings: parseFloat(e.target.value) || 0 
                    }) as BlueprintInputs)}
                    className="w-full px-8 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'var(--border-color)',
                      color: 'white'
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Input: Current Age */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Current Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={currentAge ?? ''}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : null;
                    setCurrentAge(val && val >= 0 && val <= 120 ? val : null);
                  }}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'var(--border-color)',
                    color: 'white'
                  }}
                  placeholder="e.g. 25"
                />
              </div>

              {/* Input: Annual Income Growth */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Annual Income Growth (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={annualIncomeGrowth}
                    onChange={(e) => setAnnualIncomeGrowth(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'var(--border-color)',
                      color: 'white'
                    }}
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>%</span>
                </div>
              </div>
            </div>
            
            {/* Results */}
            {userInputs?.monthlyIncome && userInputs?.taxRatePercent !== undefined && (
              <div className="space-y-6">
                <div className="h-px w-full bg-[rgba(255,255,255,0.1)] my-6"></div>
                
                {(() => {
                  // Calculate metrics
                  const monthly_cost = blueprint.blueprint?.totalMonthly || 0;
                  const gross_monthly = userInputs?.monthlyIncome || 0;
                  const tax_rate = (userInputs?.taxRatePercent || 0) / 100;
                  const net_monthly = gross_monthly * (1 - tax_rate);
                  const monthlySavings = userInputs?.monthlySavings || 0;
                  
                  // Determine affordability status
                  let affordabilityStatus;
                  if (net_monthly >= monthly_cost && (net_monthly - monthly_cost) >= monthlySavings) {
                    affordabilityStatus = 'Sustainable';
                  } else if (net_monthly >= monthly_cost) {
                    affordabilityStatus = 'Tight';
                  } else {
                    affordabilityStatus = 'Not sustainable';
                  }
                  
                  // Calculate monthly gap
                  const gap = monthly_cost + monthlySavings - net_monthly;
                  const gapLabel = gap <= 0 ? 'extra' : 'short';
                  
                  // Calculate buffer ratio
                  const bufferRatio = net_monthly > monthly_cost 
                    ? ((net_monthly - monthly_cost) / monthly_cost) 
                    : 0;
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Net Monthly Income */}
                      <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Net Monthly Income</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                          ${net_monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      
                      {/* Blueprint Affordability */}
                      <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Blueprint Affordability</p>
                        <p className="text-2xl font-bold" style={{ 
                          color: affordabilityStatus === 'Sustainable' ? '#10B981' : 
                                 affordabilityStatus === 'Tight' ? '#F59E0B' : 
                                 '#EF4444'
                        }}>
                          {affordabilityStatus}
                        </p>
                      </div>
                      
                      {/* Monthly Gap */}
                      <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Monthly Gap</p>
                        <p className="text-2xl font-bold" style={{ 
                          color: gapLabel === 'extra' ? '#10B981' : '#EF4444'
                        }}>
                          {gapLabel === 'extra' ? '+' : '-'}${Math.abs(gap || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} {gapLabel}
                        </p>
                      </div>
                      
                      {/* Buffer Ratio */}
                      <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Buffer Ratio</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
                          {((bufferRatio || 0) * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Income buffer after covering blueprint costs
                        </p>
                      </div>
                      
                      {/* Millionaire Age */}
                      {(() => {
                        const millionaireData = calculateMillionaireAge(currentAge, monthlySavings);
                        return (
                          <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Millionaire Age</p>
                            <p className="text-2xl font-bold" style={{ 
                              color: millionaireData.age === 'NA' ? 'var(--text-secondary)' : 'var(--accent-gold)'
                            }}>
                              {millionaireData.age}
                            </p>
                            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                              {millionaireData.subtext}
                            </p>
                          </div>
                        );
                      })()}
                      
                      {/* Goal Completion Age */}
                      {(() => {
                        const goalData = calculateGoalCompletionAge(
                          currentAge,
                          net_monthly,
                          monthly_cost,
                          monthlySavings,
                          annualIncomeGrowth
                        );
                        return (
                          <div className="rounded-xl p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Goal Completion Age</p>
                            <p className="text-2xl font-bold" style={{ 
                              color: goalData.age === 'NA' ? 'var(--text-secondary)' : 
                                     goalData.age === 'Not possible' ? '#EF4444' :
                                     'var(--accent-gold)'
                            }}>
                              {goalData.age}
                            </p>
                            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                              {goalData.subtext}
                            </p>
                          </div>
                        );
                      })()}
                      
                      {/* Insight */}
                      <div className="md:col-span-2 rounded-xl p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Insight</p>
                        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                          {affordabilityStatus === 'Not sustainable' && 
                            `Your income needs to increase by $${Math.abs(gap || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month or your blueprint cost needs to drop by $${Math.abs(gap || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month.`
                          }
                          {affordabilityStatus === 'Tight' && 
                            'You can afford the blueprint, but savings are low—small setbacks could break the plan.'
                          }
                          {affordabilityStatus === 'Sustainable' && bufferRatio > 0.2 && 
                            'You have a healthy margin—this blueprint looks stable at your current inputs.'
                          }
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {(!userInputs?.monthlyIncome || userInputs?.taxRatePercent === undefined) && (
              <div className="text-center py-4">
                <p style={{ color: 'var(--text-secondary)' }}>Enter your financial details above to see how your blueprint fits with your reality</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 z-40 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md rounded-2xl p-6 sm:p-8 transform -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Delete blueprint?
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              This removes your saved blueprint. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlueprint}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  opacity: isDeleting ? 0.7 : 1,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
