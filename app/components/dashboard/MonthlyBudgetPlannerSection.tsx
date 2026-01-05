'use client';

import React, { useState, useMemo } from 'react';
import {
  BudgetInputs,
  BudgetCategory,
  DEFAULT_INPUTS,
  DEFAULT_CATEGORIES,
  computeBudgetSummary,
  computeInsights,
} from '@/lib/finance/budget';
import { sanitizeCurrencyInput, normalizePercent } from '@/lib/finance/cashflow';
import { formatCurrencyDetailed, formatPercent } from '@/lib/finance/format';

interface SnapshotTile {
  label: string;
  value: number;
  highlight: boolean;
  isPositive?: boolean;
}

export function MonthlyBudgetPlannerSection() {
  const [inputs, setInputs] = useState<BudgetInputs>(DEFAULT_INPUTS);
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);

  const summary = useMemo(() => computeBudgetSummary(inputs, categories), [inputs, categories]);
  const insights = useMemo(() => computeInsights(categories, summary), [categories, summary]);

  const handleInputChange = (key: keyof BudgetInputs, rawValue: string | number) => {
    let value: number;

    if (key === 'grossYearly' || key === 'startingNetWorth' || key === 'savingsFixed') {
      value = sanitizeCurrencyInput(rawValue);
      if (isNaN(value)) return; // Don't update if invalid, but allow 0
    } else if (key === 'taxRate' || key === 'savingsRate' || key === 'returnRate') {
      value = normalizePercent(rawValue);
      if (isNaN(value)) return; // Don't update if invalid, but allow 0
    } else {
      return;
    }

    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavingsModeChange = (mode: 'percent' | 'fixed') => {
    setInputs((prev) => ({ ...prev, savingsMode: mode }));
  };

  const handleCategoryChange = (categoryId: string, amount: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, monthlyAmount: amount } : cat))
    );
  };

  const handleApplyPreset = (preset: 'conservative' | 'standard' | 'aggressive') => {
    const presets = {
      conservative: { taxRate: 0.30, savingsRate: 0.15, returnRate: 0.06 },
      standard: { taxRate: 0.28, savingsRate: 0.25, returnRate: 0.08 },
      aggressive: { taxRate: 0.25, savingsRate: 0.35, returnRate: 0.10 },
    };
    const profile = presets[preset];
    setInputs((prev) => ({ ...prev, ...profile }));
  };

  const snapshotTiles: SnapshotTile[] = [
    { label: 'Take-home / mo', value: summary.takeHomeMonthly, highlight: false },
    { label: 'Total spending / mo', value: summary.totalExpensesMonthly, highlight: false },
    { label: 'Savings target / mo', value: summary.savingsTargetMonthly, highlight: false },
    {
      label: 'Surplus / deficit / mo',
      value: summary.surplusMonthly,
      highlight: true,
      isPositive: summary.surplusMonthly >= 0,
    },
  ];

  const needsCategories = categories.filter((c) => c.group === 'NEEDS');
  const lifestyleCategories = categories.filter((c) => c.group === 'LIFESTYLE');
  const otherCategories = categories.filter((c) => c.group === 'OTHER');

  return (
    <div style={{ marginTop: '32px', width: '100%' }}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--text))' }}>
          Monthly Budget Planner
        </h2>
        <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
          Plan your income, set savings goals, and track spending in one place.
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
        {/* 1) Snapshot Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {snapshotTiles.map((tile, idx) => (
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
                    ? tile.isPositive
                      ? 'rgb(var(--gold))'
                      : '#ef4444'
                    : 'rgb(var(--text))',
                }}
              >
                {formatCurrencyDetailed(tile.value)}
              </p>
            </div>
          ))}
        </div>

        {/* 2) Income & Assumptions */}
        <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--text))' }}>
            Income & Assumptions
          </h3>

          {/* Presets */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['conservative', 'standard', 'aggressive'] as const).map((preset) => (
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
                type="text"
                value={inputs.grossYearly > 0 ? `$${inputs.grossYearly.toLocaleString()}` : ''}
                onChange={(e) => handleInputChange('grossYearly', e.target.value)}
                placeholder="$150,000"
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
                type="text"
                value={inputs.taxRate > 0 ? `${(inputs.taxRate * 100).toFixed(1)}` : ''}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                placeholder="28"
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
                Savings Target
              </label>
              <div className="flex gap-2 mb-2">
                {(['percent', 'fixed'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleSavingsModeChange(mode)}
                    className="flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all"
                    style={{
                      backgroundColor: inputs.savingsMode === mode ? 'rgb(var(--gold))' : 'rgba(255, 255, 255, 0.05)',
                      color: inputs.savingsMode === mode ? 'rgb(var(--bg))' : 'rgb(var(--muted))',
                      border: `1px solid ${inputs.savingsMode === mode ? 'rgb(var(--gold))' : 'rgb(var(--border))'}`,
                    }}
                  >
                    {mode === 'percent' ? '%' : '$'}
                  </button>
                ))}
              </div>
              {inputs.savingsMode === 'percent' ? (
                <input
                  type="text"
                  value={inputs.savingsRate > 0 ? `${(inputs.savingsRate * 100).toFixed(1)}` : ''}
                  onChange={(e) => handleInputChange('savingsRate', e.target.value)}
                  placeholder="25"
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
              ) : (
                <input
                  type="text"
                  value={inputs.savingsFixed ? `$${inputs.savingsFixed.toLocaleString()}` : ''}
                  onChange={(e) => handleInputChange('savingsFixed', e.target.value)}
                  placeholder="$500"
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
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                Return Rate {formatPercent(inputs.returnRate)}
              </label>
              <input
                type="text"
                value={inputs.returnRate > 0 ? `${(inputs.returnRate * 100).toFixed(1)}` : ''}
                onChange={(e) => handleInputChange('returnRate', e.target.value)}
                placeholder="8"
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

        {/* 3) Budget Table */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--text))' }}>
            Monthly Expenses
          </h3>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                  <th className="text-left py-3 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                    Category
                  </th>
                  <th className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                    Monthly
                  </th>
                  <th className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                    % of Take-home
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { group: 'NEEDS', cats: needsCategories },
                  { group: 'LIFESTYLE', cats: lifestyleCategories },
                  { group: 'OTHER', cats: otherCategories },
                ].map((section) => (
                  <React.Fragment key={section.group}>
                    <tr style={{ backgroundColor: 'rgb(var(--panel-2) / 0.3)' }}>
                      <td colSpan={3} className="py-2 px-3" style={{ color: 'rgb(var(--muted-2))' }}>
                        <span className="text-xs font-semibold uppercase">{section.group}</span>
                      </td>
                    </tr>
                    {section.cats.map((cat) => {
                      const pct = summary.takeHomeMonthly > 0 ? (cat.monthlyAmount / summary.takeHomeMonthly) * 100 : 0;
                      return (
                        <tr key={cat.id} style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                          <td className="py-3 px-3" style={{ color: 'rgb(var(--text))' }}>
                            {cat.name}
                          </td>
                          <td className="text-right py-3 px-3">
                            <input
                              type="text"
                              value={cat.monthlyAmount ? `$${cat.monthlyAmount.toLocaleString()}` : ''}
                              onChange={(e) => handleCategoryChange(cat.id, sanitizeCurrencyInput(e.target.value))}
                              className="w-24 px-2 py-1 rounded text-right text-sm"
                              style={{
                                backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                                borderColor: 'rgb(var(--border))',
                                color: 'rgb(var(--text))',
                                border: '1px solid rgb(var(--border))',
                              }}
                            />
                          </td>
                          <td className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted))' }}>
                            {pct.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {[
              { group: 'NEEDS', cats: needsCategories },
              { group: 'LIFESTYLE', cats: lifestyleCategories },
              { group: 'OTHER', cats: otherCategories },
            ].map((section) => (
              <div key={section.group}>
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'rgb(var(--muted-2))' }}>
                  {section.group}
                </p>
                <div className="space-y-2">
                  {section.cats.map((cat) => {
                    const pct = summary.takeHomeMonthly > 0 ? (cat.monthlyAmount / summary.takeHomeMonthly) * 100 : 0;
                    return (
                      <div
                        key={cat.id}
                        className="p-3 rounded-lg border"
                        style={{
                          backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                          borderColor: 'rgb(var(--border))',
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ color: 'rgb(var(--text))' }}>{cat.name}</span>
                          <span style={{ color: 'rgb(var(--muted))' }}>{pct.toFixed(1)}%</span>
                        </div>
                        <input
                          type="text"
                          value={cat.monthlyAmount ? `$${cat.monthlyAmount.toLocaleString()}` : ''}
                          onChange={(e) => handleCategoryChange(cat.id, sanitizeCurrencyInput(e.target.value))}
                          className="w-full px-2 py-1 rounded text-right text-sm"
                          style={{
                            backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                            borderColor: 'rgb(var(--border))',
                            color: 'rgb(var(--text))',
                            border: '1px solid rgb(var(--border))',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer - Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Total Spending Card */}
            <div
              className="p-5 rounded-2xl border transition-all hover:shadow-lg hover:border-opacity-100"
              style={{
                backgroundColor: 'rgb(var(--panel-2) / 0.4)',
                borderColor: 'rgb(var(--border))',
                borderWidth: '1px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.6)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.4)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgb(var(--muted-2))' }}>
                    Total Spending
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(213, 160, 33, 0.1)',
                    color: 'rgb(var(--gold))',
                  }}
                >
                  💰
                </div>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--text))' }}>
                {formatCurrencyDetailed(summary.totalExpensesMonthly)}
              </p>
              <p className="text-xs" style={{ color: 'rgb(var(--muted-2))' }}>
                per month
              </p>
            </div>

            {/* Max Spending Card */}
            <div
              className="p-5 rounded-2xl border transition-all hover:shadow-lg hover:border-opacity-100"
              style={{
                backgroundColor: 'rgb(var(--panel-2) / 0.4)',
                borderColor: 'rgb(var(--border))',
                borderWidth: '1px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.6)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.4)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgb(var(--muted-2))' }}>
                    Recommended Max
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(213, 160, 33, 0.1)',
                    color: 'rgb(var(--gold))',
                  }}
                >
                  🎯
                </div>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--text))' }}>
                {formatCurrencyDetailed(summary.takeHomeMonthly - summary.savingsTargetMonthly)}
              </p>
              <p className="text-xs" style={{ color: 'rgb(var(--muted-2))' }}>
                per month
              </p>
            </div>

            {/* Difference Card - Emphasized */}
            <div
              className="p-5 rounded-2xl border transition-all hover:shadow-lg hover:border-opacity-100 relative"
              style={{
                backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                borderColor: summary.surplusMonthly >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                borderWidth: '1px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.7)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgb(var(--muted-2))' }}>
                    Difference
                  </p>
                </div>
                <div
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: summary.surplusMonthly >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: summary.surplusMonthly >= 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {summary.surplusMonthly >= 0 ? 'Surplus' : 'Deficit'}
                </div>
              </div>
              <p
                className="text-2xl font-bold mb-1"
                style={{
                  color: summary.surplusMonthly >= 0 ? '#10b981' : '#ef4444',
                }}
              >
                {summary.surplusMonthly >= 0 ? '+' : ''}{formatCurrencyDetailed(summary.surplusMonthly)}
              </p>
              <p className="text-xs" style={{ color: 'rgb(var(--muted-2))' }}>
                per month
              </p>
              {/* Gold accent line */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  width: '24px',
                  height: '2px',
                  backgroundColor: 'rgb(var(--gold))',
                  opacity: 0.3,
                }}
              />
            </div>
          </div>
        </div>

        {/* 4) Insights Panel - Redesigned */}
        {insights.messages.length > 0 && (
          <div
            className="rounded-2xl border overflow-hidden mt-8"
            style={{
              backgroundColor: 'rgb(var(--panel-2) / 0.3)',
              borderColor: 'rgb(var(--border))',
            }}
          >
            {/* Header */}
            <div
              className="p-5 flex items-center justify-between"
              style={{
                borderBottom: '1px solid rgb(var(--border))',
                backgroundColor: 'rgb(var(--panel-2) / 0.2)',
              }}
            >
              <h4 className="text-sm font-semibold" style={{ color: 'rgb(var(--text))' }}>
                Insights
              </h4>
              <div
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor:
                    summary.surplusMonthly >= 0
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  color: summary.surplusMonthly >= 0 ? '#10b981' : '#ef4444',
                }}
              >
                {summary.surplusMonthly >= 0 ? '✓ On track' : '⚠ Needs attention'}
              </div>
            </div>

            {/* Body */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - What's Happening */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgb(var(--muted-2))' }}>
                  What's Happening
                </p>

                {/* Status Sentence */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgb(var(--text))' }}>
                  {insights.messages[0]}
                </p>

                {/* Flags as Chips */}
                {insights.flags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {insights.flags.slice(0, 4).map((flag, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                        }}
                      >
                        ⚠ {flag.categoryName.split(' ')[0]} high
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Cut Plan */}
              {insights.cutSuggestions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgb(var(--muted-2))' }}>
                    Cut Plan
                  </p>

                  <div className="space-y-3">
                    {insights.cutSuggestions.map((sug, idx) => {
                      const progress = (sug.suggestedCut / Math.abs(summary.surplusMonthly)) * 100;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border transition-all hover:bg-opacity-60"
                          style={{
                            backgroundColor: 'rgb(var(--panel-2) / 0.3)',
                            borderColor: 'rgb(var(--border))',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(var(--panel-2) / 0.3)';
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm" style={{ color: 'rgb(var(--text))' }}>
                              {sug.categoryName}
                            </span>
                            <span className="text-sm font-semibold" style={{ color: 'rgb(var(--gold))' }}>
                              ${sug.suggestedCut.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div
                            className="w-full h-1.5 rounded-full overflow-hidden"
                            style={{
                              backgroundColor: 'rgb(var(--panel-2) / 0.5)',
                            }}
                          >
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${Math.min(progress, 100)}%`,
                                backgroundColor: 'rgb(var(--gold))',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
