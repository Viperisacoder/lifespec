'use client';

import React, { useState } from 'react';
import { BudgetTable } from './BudgetTable';
import { useCashflowModel, CashflowAssumptions, BudgetItem } from '@/hooks/useCashflowModel';
import { formatCurrencyDetailed } from '@/lib/formatCurrency';

interface FinancialPlannerSectionProps {
  initialAssumptions: CashflowAssumptions;
  initialBudgetItems: BudgetItem[];
}

export function FinancialPlannerSection({
  initialAssumptions,
  initialBudgetItems,
}: FinancialPlannerSectionProps) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);

  const cashflow = useCashflowModel(initialAssumptions, budgetItems);

  const currentTotal = budgetItems.reduce((sum, item) => sum + item.current, 0);
  const plannedTotal = budgetItems.reduce((sum, item) => sum + item.planned, 0);

  return (
    <div style={{ marginTop: '32px', width: '100%' }}>
      {/* Header Section */}
      <div className="mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>
            Financial Planner
          </h2>
          <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
            Adjust your planned budgets — everything updates instantly.
          </p>
        </div>
        {/* Gold accent line */}
        <div
          style={{
            width: '28px',
            height: '2px',
            backgroundColor: 'rgb(var(--gold))',
            opacity: 0.4,
            borderRadius: '1px',
            marginTop: '8px',
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
        {/* Budget Table */}
        <BudgetTable
          items={budgetItems}
          onUpdate={setBudgetItems}
          currentTotal={currentTotal}
          plannedTotal={plannedTotal}
        />

        {/* Insight Line */}
        <div
          className="p-4 rounded-lg text-center mt-8"
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
