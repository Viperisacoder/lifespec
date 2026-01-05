'use client';

import React, { useState, useMemo } from 'react';
import { SavedBlueprint } from '@/lib/blueprintTypes';
import { calculateCashflow, PRESET_PROFILES, PlannerInputs } from '@/lib/finance/cashflow';
import { formatCurrencyDetailed, formatPercent } from '@/lib/finance/format';

interface FinancialPlannerNewProps {
  blueprint: SavedBlueprint | null;
  financeData: { annual_income: number | null; age: number | null };
  onCashflowUpdate?: (cashflow: any) => void;
}

export function FinancialPlannerNew({ blueprint, financeData, onCashflowUpdate }: FinancialPlannerNewProps) {
  const [inputs, setInputs] = useState<PlannerInputs>({
    grossYearly: financeData.annual_income || 150000,
    taxRate: 0.28,
    savingsRate: 0.25,
    returnRate: 0.08,
    startingNetWorth: 0,
  });

  const [plannedBudgets, setPlannedBudgets] = useState<Record<string, number>>(() => {
    const budgets: Record<string, number> = {};
    blueprint?.blueprint?.selections?.forEach((sel: any) => {
      budgets[sel.category] = sel.totalMonthly || 0;
    });
    return budgets;
  });

  const plannedLifestyleMonthly = useMemo(
    () => Object.values(plannedBudgets).reduce((sum, val) => sum + (val || 0), 0),
    [plannedBudgets]
  );

  const cashflow = useMemo(
    () => calculateCashflow(inputs, plannedLifestyleMonthly),
    [inputs, plannedLifestyleMonthly]
  );

  React.useEffect(() => {
    onCashflowUpdate?.(cashflow);
  }, [cashflow, onCashflowUpdate]);

  const currentLifestyleMonthly = useMemo(
    () => blueprint?.blueprint?.selections?.reduce((sum: number, sel: any) => sum + (sel.totalMonthly || 0), 0) || 0,
    [blueprint]
  );

  const handleInputChange = (key: keyof PlannerInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const handleApplyPreset = (preset: keyof typeof PRESET_PROFILES) => {
    const profile = PRESET_PROFILES[preset];
    setInputs((prev) => ({ ...prev, ...profile }));
  };

  const handleSetPlannedToCurrent = () => {
    const updated: Record<string, number> = {};
    blueprint?.blueprint?.selections?.forEach((sel: any) => {
      updated[sel.category] = sel.totalMonthly || 0;
    });
    setPlannedBudgets(updated);
  };

  const handleBudgetChange = (category: string, value: number) => {
    setPlannedBudgets((prev) => ({ ...prev, [category]: Math.max(0, value) }));
  };

  return (
    <div style={{ marginTop: '32px', width: '100%' }}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>
          Financial Planner
        </h2>
        <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
          Adjust your income and budget assumptions to see how your financial plan evolves.
        </p>
        <div
          style={{
            width: '28px',
            height: '2px',
            backgroundColor: 'rgb(var(--gold))',
            opacity: 0.4,
            marginTop: '8px',
          }}
        />
      </div>

      {/* Main Card */}
      <div
        className="rounded-2xl border p-8"
        style={{
          backgroundColor: `rgb(var(--panel) / 0.8)`,
          borderColor: 'rgb(var(--border))',
          boxShadow: 'var(--shadow)',
          backgroundImage: `linear-gradient(135deg, rgb(var(--panel)) 0%, rgb(var(--panel-2)) 100%)`,
        }}
      >
        {/* A) Snapshot Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Take-home / mo', value: cashflow.netMonthly, highlight: false },
            { label: 'Lifestyle / mo', value: plannedLifestyleMonthly, highlight: false },
            { label: 'Investing / mo', value: cashflow.investMonthly, highlight: true },
            { label: 'Surplus / deficit / mo', value: cashflow.surplusMonthly, highlight: false, isPositive: cashflow.surplusMonthly >= 0 },
          ].map((tile, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border transition-all hover:bg-opacity-80"
              style={{
                backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                borderColor: 'rgb(var(--border))',
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                {tile.label}
              </p>
              <p
                className="text-lg md:text-xl font-bold"
                style={{
                  color: tile.highlight
                    ? 'rgb(var(--gold))'
                    : tile.isPositive !== undefined
                    ? tile.isPositive
                      ? 'rgb(var(--text))'
                      : '#ef4444'
                    : 'rgb(var(--text))',
                }}
              >
                {formatCurrencyDetailed(tile.value)}
              </p>
            </div>
          ))}
        </div>

        {/* B) Inputs */}
        <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--text))' }}>
            Assumptions
          </h3>

          {/* Presets */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(Object.keys(PRESET_PROFILES) as Array<keyof typeof PRESET_PROFILES>).map((preset) => (
              <button
                key={preset}
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded text-xs font-medium transition-all capitalize"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgb(var(--muted))',
                  border: '1px solid rgb(var(--border))',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Annual Gross Income
              </label>
              <input
                type="number"
                value={inputs.grossYearly || ''}
                onChange={(e) => handleInputChange('grossYearly', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
                style={{
                  backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                  borderColor: 'rgb(var(--border))',
                  color: 'rgb(var(--text))',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--gold))';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(213, 160, 33, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Tax Rate {formatPercent(inputs.taxRate)}
              </label>
              <input
                type="number"
                value={inputs.taxRate * 100 || ''}
                onChange={(e) => handleInputChange('taxRate', (parseFloat(e.target.value) || 0) / 100)}
                min="0"
                max="90"
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
                style={{
                  backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                  borderColor: 'rgb(var(--border))',
                  color: 'rgb(var(--text))',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--gold))';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(213, 160, 33, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Savings Rate {formatPercent(inputs.savingsRate)}
              </label>
              <input
                type="number"
                value={inputs.savingsRate * 100 || ''}
                onChange={(e) => handleInputChange('savingsRate', (parseFloat(e.target.value) || 0) / 100)}
                min="0"
                max="90"
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
                style={{
                  backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                  borderColor: 'rgb(var(--border))',
                  color: 'rgb(var(--text))',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--gold))';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(213, 160, 33, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Return Rate {formatPercent(inputs.returnRate)}
              </label>
              <input
                type="number"
                value={inputs.returnRate * 100 || ''}
                onChange={(e) => handleInputChange('returnRate', (parseFloat(e.target.value) || 0) / 100)}
                min="0"
                max="90"
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
                style={{
                  backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                  borderColor: 'rgb(var(--border))',
                  color: 'rgb(var(--text))',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--gold))';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(213, 160, 33, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Starting Net Worth
              </label>
              <input
                type="number"
                value={inputs.startingNetWorth || ''}
                onChange={(e) => handleInputChange('startingNetWorth', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
                style={{
                  backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                  borderColor: 'rgb(var(--border))',
                  color: 'rgb(var(--text))',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--gold))';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(213, 160, 33, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* C) Budget Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>
              Budget Breakdown
            </h3>
            <button
              onClick={handleSetPlannedToCurrent}
              className="text-xs px-3 py-1.5 rounded transition-colors"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'rgb(var(--muted))',
                border: '1px solid rgb(var(--border))',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              Set planned = current
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                  <th className="text-left py-3 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                    Category
                  </th>
                  <th className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                    Current
                  </th>
                  <th className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                    Planned
                  </th>
                  <th className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                    Delta
                  </th>
                </tr>
              </thead>
              <tbody>
                {blueprint?.blueprint?.selections?.map((sel: any, idx: number) => {
                  const current = sel.totalMonthly || 0;
                  const planned = plannedBudgets[sel.category] || current;
                  const delta = planned - current;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                      <td className="py-3 px-3" style={{ color: 'rgb(var(--text))' }}>
                        {sel.category}
                      </td>
                      <td className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted))' }}>
                        {formatCurrencyDetailed(current)}
                      </td>
                      <td className="text-right py-3 px-3">
                        <input
                          type="number"
                          value={planned || ''}
                          onChange={(e) => handleBudgetChange(sel.category, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 rounded text-right text-sm"
                          style={{
                            backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                            borderColor: 'rgb(var(--border))',
                            color: 'rgb(var(--text))',
                            border: '1px solid rgb(var(--border))',
                          }}
                        />
                      </td>
                      <td className="text-right py-3 px-3" style={{ color: delta > 0 ? '#ef4444' : delta < 0 ? '#10b981' : 'rgb(var(--muted))' }}>
                        {delta > 0 ? '+' : ''}{formatCurrencyDetailed(delta)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {blueprint?.blueprint?.selections?.map((sel: any, idx: number) => {
              const current = sel.totalMonthly || 0;
              const planned = plannedBudgets[sel.category] || current;
              const delta = planned - current;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                    borderColor: 'rgb(var(--border))',
                  }}
                >
                  <p className="font-semibold mb-3" style={{ color: 'rgb(var(--text))' }}>
                    {sel.category}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'rgb(var(--muted-2))' }}>Current</span>
                      <span style={{ color: 'rgb(var(--muted))' }}>{formatCurrencyDetailed(current)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: 'rgb(var(--muted-2))' }}>Planned</span>
                      <input
                        type="number"
                        value={planned || ''}
                        onChange={(e) => handleBudgetChange(sel.category, parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded text-right text-sm"
                        style={{
                          backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                          borderColor: 'rgb(var(--border))',
                          color: 'rgb(var(--text))',
                          border: '1px solid rgb(var(--border))',
                        }}
                      />
                    </div>
                    <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgb(var(--border))' }}>
                      <span style={{ color: 'rgb(var(--muted-2))' }}>Delta</span>
                      <span style={{ color: delta > 0 ? '#ef4444' : delta < 0 ? '#10b981' : 'rgb(var(--muted))' }}>
                        {delta > 0 ? '+' : ''}{formatCurrencyDetailed(delta)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div
            className="p-4 rounded-lg border mt-6"
            style={{
              backgroundColor: 'rgb(var(--panel-2) / 0.3)',
              borderColor: 'rgb(var(--border))',
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgb(var(--muted-2))' }}>
                  Current Total / mo
                </p>
                <p className="text-lg font-bold" style={{ color: 'rgb(var(--muted))' }}>
                  {formatCurrencyDetailed(currentLifestyleMonthly)}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgb(var(--muted-2))' }}>
                  Planned Total / mo
                </p>
                <p className="text-lg font-bold" style={{ color: 'rgb(var(--text))' }}>
                  {formatCurrencyDetailed(plannedLifestyleMonthly)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* D) Insight */}
        <div
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'rgb(var(--panel-2) / 0.3)',
            border: '1px solid rgb(var(--border))',
          }}
        >
          <p style={{ color: 'rgb(var(--muted))' }}>
            With this plan you invest{' '}
            <span style={{ color: 'rgb(var(--gold))', fontWeight: '700' }}>
              {formatCurrencyDetailed(cashflow.investMonthly)}/mo
            </span>{' '}
            and run a{' '}
            <span
              style={{
                color: cashflow.surplusMonthly >= 0 ? 'rgb(var(--text))' : '#ef4444',
                fontWeight: '700',
              }}
            >
              {cashflow.surplusMonthly >= 0 ? '+' : ''}{formatCurrencyDetailed(cashflow.surplusMonthly)}/mo
            </span>{' '}
            surplus.
          </p>
        </div>
      </div>
    </div>
  );
}
