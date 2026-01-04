'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { getBlueprint } from '@/lib/blueprintService';
import { SavedBlueprint } from '@/lib/blueprintTypes';
import { createBrowserClient } from '@supabase/ssr';

interface FinanceData {
  annual_income: number | null;
  monthly_savings: number | null;
  monthly_investing: number | null;
  age: number | null;
  has_debt: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [blueprint, setBlueprint] = useState<SavedBlueprint | null>(null);
  const [blueprintLoading, setBlueprintLoading] = useState(true);
  const [financeData, setFinanceData] = useState<FinanceData>({
    annual_income: null,
    monthly_savings: null,
    monthly_investing: null,
    age: null,
    has_debt: false,
  });
  const [isEditingFinances, setIsEditingFinances] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    const loadData = async () => {
      if (!authLoading && user) {
        try {
          // Try to load from localStorage first
          const cachedFinances = localStorage.getItem('lifespec_finances');
          const cachedBlueprint = localStorage.getItem('lifespec_blueprint');

          // Load blueprint
          const result = await getBlueprint();
          if (result.success) {
            setBlueprint(result.data);
            localStorage.setItem('lifespec_blueprint', JSON.stringify(result.data));
          } else if (cachedBlueprint) {
            setBlueprint(JSON.parse(cachedBlueprint));
          }

          // Load finance data
          const { data: financeRecord } = await supabase
            .from('user_finances')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (financeRecord) {
            const financeData = {
              annual_income: financeRecord.annual_income,
              monthly_savings: financeRecord.monthly_savings,
              monthly_investing: financeRecord.monthly_investing,
              age: financeRecord.age,
              has_debt: financeRecord.has_debt || false,
            };
            setFinanceData(financeData);
            localStorage.setItem('lifespec_finances', JSON.stringify(financeData));
          } else if (cachedFinances) {
            setFinanceData(JSON.parse(cachedFinances));
          }
        } catch (error) {
          console.error('Error loading data:', error);
          // Fall back to cached data if available
          const cachedFinances = localStorage.getItem('lifespec_finances');
          const cachedBlueprint = localStorage.getItem('lifespec_blueprint');
          if (cachedFinances) setFinanceData(JSON.parse(cachedFinances));
          if (cachedBlueprint) setBlueprint(JSON.parse(cachedBlueprint));
        } finally {
          setBlueprintLoading(false);
        }
      } else {
        setBlueprintLoading(false);
      }
    };

    loadData();
  }, [authLoading, user]);

  const handleSaveFinances = async (updatedData: FinanceData) => {
    if (!user) return;

    try {
      await supabase
        .from('user_finances')
        .upsert(
          {
            user_id: user.id,
            ...updatedData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      setFinanceData(updatedData);
      localStorage.setItem('lifespec_finances', JSON.stringify(updatedData));
      setIsEditingFinances(false);
    } catch (error) {
      console.error('Error saving finances:', error);
    }
  };


  if (authLoading || blueprintLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full animate-pulse mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, #D4AF37, #B8860B)' }} />
          <p style={{ color: '#888' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="text-center">
          <h1 className="text-4xl font-light tracking-wide mb-4" style={{ color: '#FFFFFF' }}>
            Access Denied
          </h1>
          <p className="mb-8" style={{ color: '#888' }}>Please log in to access your dashboard.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 font-semibold rounded-full transition-all duration-300"
            style={{
              backgroundColor: '#D4AF37',
              color: '#0E0E0E',
              boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0E0E0E' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* My Dream Dashboard Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Lifestyle Image */}
            <div
              className="rounded-2xl overflow-hidden h-96 lg:h-full min-h-96"
              style={{
                backgroundColor: '#1A1A1A',
                backgroundImage: 'url(/House/westvanmansion.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
            </div>

            {/* Right: Dream Metrics */}
            <div>
              <h2 className="text-4xl font-light mb-2" style={{ color: '#FFFFFF' }}>
                My Dream Lifestyle
              </h2>
              <p className="mb-8" style={{ color: '#888' }}>Your dream lifestyle, visualized.</p>

              {blueprint && (
                <>
                  {/* Tier Badge */}
                  <div className="mb-8">
                    <span
                      className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      Premium Tier
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-6 mb-8">
                    {/* Monthly Lifestyle Cost */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <svg className="w-4 h-4" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Lifestyle Cost</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: '#FF9500' }}>
                          ${blueprint.blueprint?.totalMonthly?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>

                    {/* Required Pre-Tax Income */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <svg className="w-4 h-4" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Pre-Tax Income</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: '#FFFFFF' }}>
                          ${blueprint.blueprint?.requiredGrossYearly?.toLocaleString() || '0'} <span style={{ color: '#888', fontSize: '14px', fontWeight: 'normal' }}>yearly</span>
                        </p>
                        <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
                          ${(blueprint.blueprint?.requiredGrossYearly ? Math.round(blueprint.blueprint.requiredGrossYearly / 12) : 0).toLocaleString()} monthly
                        </p>
                      </div>
                    </div>

                    {/* Items Selected */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <svg className="w-4 h-4" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items Selected</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: '#FFFFFF' }}>
                          {blueprint.blueprint?.selections?.reduce((total, sel) => total + sel.items.length, 0) || 0}
                        </p>
                      </div>
                    </div>

                    {/* 30-Year Cost */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <svg className="w-4 h-4" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>30-Year Cost</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: '#FFFFFF' }}>
                          ${(blueprint.blueprint?.totalMonthly ? Math.round(blueprint.blueprint.totalMonthly * 12 * 30) : 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/wizard')}
                      className="w-full py-3 rounded-full font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#0E0E0E',
                        boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Create New Dream Card
                    </button>
                  </div>
                </>
              )}

              {!blueprint && (
                <div className="text-center py-12">
                  <p style={{ color: '#888', marginBottom: '16px' }}>No dream lifestyle created yet</p>
                  <button
                    onClick={() => router.push('/wizard')}
                    className="px-8 py-3 rounded-full font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#0E0E0E',
                      boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Create Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Finances Section */}
        <div>
          <div
            className="rounded-2xl p-8 border"
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-light mb-2" style={{ color: '#FFFFFF' }}>
                  My Finances
                </h3>
                <p style={{ color: '#888' }}>Your financial information from onboarding</p>
              </div>
              <button
                onClick={() => setIsEditingFinances(!isEditingFinances)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#FFFFFF' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            {!isEditingFinances ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Annual Income</p>
                  <p className="text-2xl font-bold mt-2" style={{ color: '#FFFFFF' }}>
                    {financeData.annual_income ? `$${financeData.annual_income.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Savings</p>
                  <p className="text-2xl font-bold mt-2" style={{ color: '#FFFFFF' }}>
                    {financeData.monthly_savings ? `$${financeData.monthly_savings.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Investing</p>
                  <p className="text-2xl font-bold mt-2" style={{ color: '#FFFFFF' }}>
                    {financeData.monthly_investing ? `$${financeData.monthly_investing.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Age</p>
                  <p className="text-2xl font-bold mt-2" style={{ color: '#FFFFFF' }}>
                    {financeData.age ? financeData.age : '—'}
                  </p>
                </div>
              </div>
            ) : (
              <FinancesEditForm
                initialData={financeData}
                onSave={handleSaveFinances}
                onCancel={() => setIsEditingFinances(false)}
              />
            )}

            {/* Footer Note */}
            <div
              className="mt-8 p-4 rounded-lg flex items-start gap-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
              </svg>
              <p style={{ color: '#888', fontSize: '13px' }}>
                Your financial data helps us calculate your dream lifestyle costs and savings projections.
              </p>
            </div>
          </div>
        </div>

        {/* Finance Calculator Section */}
        <div className="mt-12">
          <div
            className="rounded-2xl p-8 border"
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3 className="text-2xl font-light mb-8" style={{ color: '#FFFFFF' }}>
              Finance Calculator
            </h3>

            {/* Summary Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Current Age Box */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Current Age
                </p>
                <p className="text-4xl font-bold" style={{ color: '#FFFFFF' }}>
                  {financeData.age ?? '—'}
                </p>
              </div>

              {/* Millionaire Age Box */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Millionaire Age
                </p>
                <p className="text-4xl font-bold" style={{ color: '#FFFFFF' }}>
                  {calculateMillionaireAge(financeData)}
                </p>
              </div>

              {/* Dream Completion Age Box */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Dream Completion Age
                </p>
                <p className="text-4xl font-bold" style={{ color: '#FFFFFF' }}>
                  {calculateDreamCompletionAge(financeData, blueprint)}
                </p>
              </div>
            </div>

            {/* Timeline Graph */}
            <TimelineGraph financeData={financeData} blueprint={blueprint} />
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateMillionaireAge(financeData: FinanceData): string {
  if (!financeData.age || !financeData.monthly_savings || !financeData.monthly_investing) {
    return '—';
  }

  const monthlyAccumulation = financeData.monthly_savings + financeData.monthly_investing;
  if (monthlyAccumulation <= 0) {
    return 'Not Possible';
  }

  const millionTarget = 1000000;
  const monthsNeeded = Math.ceil(millionTarget / monthlyAccumulation);
  const yearsNeeded = monthsNeeded / 12;
  const millionaireAge = Math.floor(financeData.age + yearsNeeded);

  if (millionaireAge > 100) {
    return 'Not Possible';
  }

  return millionaireAge.toString();
}

function calculateDreamCompletionAge(financeData: FinanceData, blueprint: SavedBlueprint | null): string {
  if (!financeData.age || !financeData.annual_income || !blueprint?.blueprint?.totalMonthly) {
    return '—';
  }

  const blueprintMonthlyCost = blueprint.blueprint.totalMonthly;
  const currentMonthlyIncome = financeData.annual_income / 12;

  // If current income already covers blueprint cost, dream is affordable now
  if (currentMonthlyIncome >= blueprintMonthlyCost) {
    return financeData.age.toString();
  }

  // Calculate how much monthly income is needed to cover the gap
  const monthlyIncomeGap = blueprintMonthlyCost - currentMonthlyIncome;
  const monthlySavings = financeData.monthly_savings || 0;
  const monthlyInvesting = financeData.monthly_investing || 0;
  const monthlyAccumulation = monthlySavings + monthlyInvesting;

  // If no accumulation, dream is not possible
  if (monthlyAccumulation <= 0) {
    return 'Not Possible';
  }

  // Calculate years needed to accumulate enough to cover the gap
  // Assuming the gap can be covered by converting savings/investing to income
  const yearsNeeded = monthlyIncomeGap / monthlyAccumulation;
  const dreamCompletionAge = Math.floor(financeData.age + yearsNeeded);

  if (dreamCompletionAge > 100) {
    return 'Not Possible';
  }

  return dreamCompletionAge.toString();
}

function TimelineGraph({ financeData, blueprint }: { financeData: FinanceData; blueprint: SavedBlueprint | null }) {
  const [hoveredAge, setHoveredAge] = React.useState<number | null>(null);

  if (!financeData.age || !financeData.monthly_savings || !financeData.monthly_investing) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
        <p>Add financial data to view your timeline</p>
      </div>
    );
  }

  const monthlyAccumulation = financeData.monthly_savings + financeData.monthly_investing;
  const currentAge = financeData.age;
  const millionaireAgeStr = calculateMillionaireAge(financeData);
  const dreamCompletionAgeStr = calculateDreamCompletionAge(financeData, blueprint);
  
  const millionaireAge = millionaireAgeStr !== '—' && millionaireAgeStr !== 'Not Possible' ? parseInt(millionaireAgeStr) : null;
  const dreamCompletionAge = dreamCompletionAgeStr !== '—' && dreamCompletionAgeStr !== 'Not Possible' ? parseInt(dreamCompletionAgeStr) : null;

  // Extended timeline: end at max of (millionaire + 10, dream + 10, current + 40)
  let maxAge = currentAge + 40;
  if (millionaireAge && millionaireAge + 10 > maxAge) maxAge = millionaireAge + 10;
  if (dreamCompletionAge && dreamCompletionAge + 10 > maxAge) maxAge = dreamCompletionAge + 10;

  const ageRange = maxAge - currentAge;
  const points: Array<{ age: number; money: number }> = [];

  // Year-by-year data resolution
  for (let age = currentAge; age <= maxAge; age++) {
    const yearsElapsed = age - currentAge;
    const monthsElapsed = yearsElapsed * 12;
    const totalMoney = monthlyAccumulation * monthsElapsed;
    points.push({ age, money: totalMoney });
  }

  // Auto-scale Y-axis with clean rounded ticks
  const maxMoney = Math.max(...points.map((p) => p.money), 1000000);
  let yAxisMax = 1000000;
  if (maxMoney > 1000000) yAxisMax = Math.ceil(maxMoney / 1000000) * 1000000;

  const yTicks = [0];
  if (yAxisMax >= 250000) yTicks.push(250000);
  if (yAxisMax >= 500000) yTicks.push(500000);
  if (yAxisMax >= 1000000) yTicks.push(1000000);
  if (yAxisMax >= 2000000) yTicks.push(2000000);
  if (yAxisMax >= 3000000) yTicks.push(3000000);

  const graphHeight = 420;
  const graphWidth = 1200;
  const padding = { top: 30, right: 40, bottom: 80, left: 100 };
  const innerWidth = graphWidth - padding.left - padding.right;
  const innerHeight = graphHeight - padding.top - padding.bottom;

  const getX = (age: number) => padding.left + ((age - currentAge) / ageRange) * innerWidth;
  const getY = (money: number) => graphHeight - padding.bottom - (money / yAxisMax) * innerHeight;

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.age)} ${getY(p.money)}`).join(' ');
  
  // Create area fill path
  const areaPathData = `${pathData} L ${getX(maxAge)} ${graphHeight - padding.bottom} L ${getX(currentAge)} ${graphHeight - padding.bottom} Z`;

  const millionaireX = millionaireAge !== null ? getX(millionaireAge) : null;
  const millionaireY = millionaireAge !== null ? getY(1000000) : null;
  const dreamCompletionX = dreamCompletionAge !== null ? getX(dreamCompletionAge) : null;
  const dreamCompletionY = dreamCompletionAge !== null ? getY(Math.min(yAxisMax, points[dreamCompletionAge - currentAge]?.money || 0)) : null;

  // Get hovered data point
  const hoveredPoint = hoveredAge !== null ? points.find(p => p.age === hoveredAge) : null;

  return (
    <div style={{ marginTop: '24px', width: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Capital ($)
        </p>
      </div>
      
      <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        <svg 
          width={graphWidth} 
          height={graphHeight} 
          style={{ minWidth: '100%', maxWidth: '100%', cursor: 'crosshair' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const age = Math.round(currentAge + ((x - padding.left) / innerWidth) * ageRange);
            if (age >= currentAge && age <= maxAge) {
              setHoveredAge(age);
            }
          }}
          onMouseLeave={() => setHoveredAge(null)}
        >
          <defs>
            {/* Gradient for line */}
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
            </linearGradient>
            
            {/* Gradient for area fill */}
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.01)" />
            </linearGradient>
          </defs>

          {/* Grid lines for Y-axis */}
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            const isMillionMark = tick === 1000000;
            return (
              <line
                key={`grid-${i}`}
                x1={padding.left}
                y1={y}
                x2={graphWidth - padding.right}
                y2={y}
                stroke={isMillionMark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={isMillionMark ? '1.5' : '1'}
              />
            );
          })}

          {/* Y-axis labels */}
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            let label = '';
            if (tick === 0) label = '$0';
            else if (tick < 1000000) label = `$${(tick / 1000).toFixed(0)}k`;
            else label = `$${(tick / 1000000).toFixed(1)}M`;

            return (
              <text
                key={`y-label-${i}`}
                x={padding.left - 16}
                y={y + 5}
                textAnchor="end"
                style={{ fontSize: '12px', fill: '#777', fontWeight: tick === 1000000 ? '500' : '400' }}
              >
                {label}
              </text>
            );
          })}

          {/* X-axis labels */}
          {Array.from({ length: Math.min(14, ageRange + 1) }).map((_, i) => {
            const age = currentAge + Math.floor((ageRange / 13) * i);
            if (age > maxAge) return null;
            const x = getX(age);
            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={graphHeight - 30}
                textAnchor="middle"
                style={{ fontSize: '12px', fill: '#777' }}
              >
                {age}
              </text>
            );
          })}

          {/* Axes */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={graphHeight - padding.bottom} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
          <line x1={padding.left} y1={graphHeight - padding.bottom} x2={graphWidth - padding.right} y2={graphHeight - padding.bottom} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />

          {/* Area fill under line */}
          <path d={areaPathData} fill="url(#areaGradient)" />

          {/* Main line with gradient */}
          <path d={pathData} stroke="url(#lineGradient)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hover line and tooltip */}
          {hoveredPoint && (
            <>
              <line 
                x1={getX(hoveredPoint.age)} 
                y1={padding.top} 
                x2={getX(hoveredPoint.age)} 
                y2={graphHeight - padding.bottom} 
                stroke="rgba(255, 255, 255, 0.2)" 
                strokeWidth="1.5" 
                strokeDasharray="3,3"
              />
              <circle 
                cx={getX(hoveredPoint.age)} 
                cy={getY(hoveredPoint.money)} 
                r="5" 
                fill="rgba(255, 255, 255, 0.9)" 
              />
              <rect 
                x={getX(hoveredPoint.age) - 60} 
                y={getY(hoveredPoint.money) - 35} 
                width="120" 
                height="30" 
                rx="6" 
                fill="rgba(0, 0, 0, 0.8)" 
                stroke="rgba(255, 255, 255, 0.3)" 
                strokeWidth="1"
              />
              <text 
                x={getX(hoveredPoint.age)} 
                y={getY(hoveredPoint.money) - 15} 
                textAnchor="middle" 
                style={{ fontSize: '11px', fill: '#FFFFFF', fontWeight: '500' }}
              >
                Age {hoveredPoint.age}
              </text>
              <text 
                x={getX(hoveredPoint.age)} 
                y={getY(hoveredPoint.money) - 2} 
                textAnchor="middle" 
                style={{ fontSize: '11px', fill: '#AAAAAA' }}
              >
                ${(hoveredPoint.money / 1000000).toFixed(2)}M
              </text>
            </>
          )}

          {/* Millionaire marker */}
          {millionaireX !== null && millionaireY !== null && (
            <>
              <line x1={millionaireX} y1={padding.top} x2={millionaireX} y2={graphHeight - padding.bottom} stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" strokeDasharray="6,4" />
              <circle cx={millionaireX} cy={millionaireY} r="6.5" fill="rgba(255, 255, 255, 0.95)" />
              <circle cx={millionaireX} cy={millionaireY} r="6.5" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
              <text
                x={millionaireX}
                y={graphHeight - padding.bottom + 35}
                textAnchor="middle"
                style={{ fontSize: '12px', fill: '#FFFFFF', fontWeight: '600' }}
              >
                Millionaire @ {millionaireAge}
              </text>
            </>
          )}

          {/* Dream completion marker */}
          {dreamCompletionX !== null && dreamCompletionY !== null && (
            <>
              <line x1={dreamCompletionX} y1={padding.top} x2={dreamCompletionX} y2={graphHeight - padding.bottom} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeDasharray="4,3" />
              <circle cx={dreamCompletionX} cy={dreamCompletionY} r="5" fill="rgba(255, 255, 255, 0.7)" />
              <text
                x={dreamCompletionX}
                y={graphHeight - padding.bottom + 50}
                textAnchor="middle"
                style={{ fontSize: '12px', fill: '#BBBBBB', fontWeight: '500' }}
              >
                Dream @ {dreamCompletionAge}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '40px', fontSize: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '2.5px', background: 'linear-gradient(to right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8))' }} />
          <span style={{ color: '#999' }}>Net Worth Over Time</span>
        </div>
        {millionaireX !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '2px solid rgba(255, 255, 255, 0.3)' }} />
            <span style={{ color: '#999' }}>Millionaire Age</span>
          </div>
        )}
        {dreamCompletionX !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }} />
            <span style={{ color: '#999' }}>Dream Completion Age</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FinancesEditForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: FinanceData;
  onSave: (data: FinanceData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: keyof FinanceData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="block mb-2">
            Annual Income
          </label>
          <input
            type="number"
            value={formData.annual_income || ''}
            onChange={(e) => handleChange('annual_income', e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="0"
          />
        </div>

        <div>
          <label style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="block mb-2">
            Monthly Savings
          </label>
          <input
            type="number"
            value={formData.monthly_savings || ''}
            onChange={(e) => handleChange('monthly_savings', e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="0"
          />
        </div>

        <div>
          <label style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="block mb-2">
            Monthly Investing
          </label>
          <input
            type="number"
            value={formData.monthly_investing || ''}
            onChange={(e) => handleChange('monthly_investing', e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="0"
          />
        </div>

        <div>
          <label style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="block mb-2">
            Your Age
          </label>
          <input
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="has_debt"
          checked={formData.has_debt}
          onChange={(e) => handleChange('has_debt', e.target.checked)}
          className="w-4 h-4 rounded"
          style={{
            backgroundColor: formData.has_debt ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
          }}
        />
        <label htmlFor="has_debt" style={{ color: '#FFFFFF', cursor: 'pointer' }}>
          I have outstanding debt
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0E0E0E',
            boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-lg font-semibold transition-colors"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
