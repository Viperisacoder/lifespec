'use client';

import React, { useState, useCallback } from 'react';
import { SnapshotTiles } from './SnapshotTiles';
import { BudgetTable } from './BudgetTable';
import { useCashflowModel, CashflowAssumptions, BudgetItem } from '@/hooks/useCashflowModel';
import { formatCurrencyDetailed } from '@/lib/formatCurrency';

interface FinancialPlannerSectionProps {
  initialAssumptions: CashflowAssumptions;
  initialBudgetItems: BudgetItem[];
  onCashflowChange?: (cashflow: any) => void;
}

const PRESET_PROFILES = {
  conservative: { taxRate: 0.25, savingsRate: 0.15, investmentReturn: 0.06 },
  standard: { taxRate: 0.22, savingsRate: 0.25, investmentReturn: 0.08 },
  aggressive: { taxRate: 0.20, savingsRate: 0.35, investmentReturn: 0.10 },
};

export function FinancialPlannerSection({
  initialAssumptions,
  initialBudgetItems,
  onCashflowChange,
}: FinancialPlannerSectionProps) {
  const [assumptions, setAssumptions] = useState<CashflowAssumptions>(initialAssumptions);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);

  const cashflow = useCashflowModel(assumptions, budgetItems);

  React.useEffect(() => {
    onCashflowChange?.(cashflow);
  }, [cashflow, onCashflowChange]);

  const handleAssumptionChange = useCallback((key: keyof CashflowAssumptions, value: number) => {
    setAssumptions((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  }, []);

  const handleApplyPreset = useCallback((preset: keyof typeof PRESET_PROFILES) => {
    const profile = PRESET_PROFILES[preset];
    setAssumptions((prev) => ({ ...prev, ...profile }));
  }, []);

  const handleResetPlan = useCallback(() => {
    setAssumptions(initialAssumptions);
    setBudgetItems(initialBudgetItems);
  }, [initialAssumptions, initialBudgetItems]);

  const currentTotal = budgetItems.reduce((sum, item) => sum + item.current, 0);
  const plannedTotal = budgetItems.reduce((sum, item) => sum + item.planned, 0);

  return (
    <div style={{ marginTop: '32px', width: '100%' }}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>
              Financial Planner
            </h2>
            <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
              Adjust assumptions and planned budgets — everything updates instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResetPlan}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: 'transparent',
                color: 'rgb(var(--muted))',
                border: '1px solid rgb(var(--border))',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Reset
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: 'rgb(var(--gold))',
                color: 'rgb(var(--bg))',
                boxShadow: '0 4px 12px rgba(213, 160, 33, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(213, 160, 33, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(213, 160, 33, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Save Plan
            </button>
          </div>
        </div>
        {/* Gold accent line */}
        <div
          style={{
            width: '28px',
            height: '2px',
            backgroundColor: 'rgb(var(--gold))',
            opacity: 0.4,
            borderRadius: '1px',
          }}
        />
      </div>

      {/* Main Panel Card */}
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
        <SnapshotTiles cashflow={cashflow} />

        {/* B) Inputs / Assumptions */}
        <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--text))' }}>
            Assumptions
          </h3>

          {/* Preset Chips */}
          <div className="flex gap-2 mb-6">
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Annual Gross Income */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Annual Gross Income
              </label>
              <input
                type="number"
                value={assumptions.grossYearly}
                onChange={(e) => handleAssumptionChange('grossYearly', parseFloat(e.target.value) || 0)}
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

            {/* Tax Rate */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={assumptions.taxRate * 100}
                onChange={(e) => handleAssumptionChange('taxRate', (parseFloat(e.target.value) || 0) / 100)}
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

            {/* Savings/Investing Rate */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Savings/Investing Rate (%)
              </label>
              <input
                type="number"
                value={assumptions.savingsRate * 100}
                onChange={(e) => handleAssumptionChange('savingsRate', (parseFloat(e.target.value) || 0) / 100)}
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

            {/* Investment Return */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Investment Return (%)
              </label>
              <input
                type="number"
                value={assumptions.investmentReturn * 100}
                onChange={(e) => handleAssumptionChange('investmentReturn', (parseFloat(e.target.value) || 0) / 100)}
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

            {/* Starting Net Worth */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Starting Net Worth
              </label>
              <input
                type="number"
                value={assumptions.startingNetWorth}
                onChange={(e) => handleAssumptionChange('startingNetWorth', parseFloat(e.target.value) || 0)}
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
          <BudgetTable
            items={budgetItems}
            onUpdate={setBudgetItems}
            currentTotal={currentTotal}
            plannedTotal={plannedTotal}
          />
        </div>

        {/* D) Insight Line */}
        <div
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'rgb(var(--panel-2) / 0.3)',
            borderColor: 'rgb(var(--border))',
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
