'use client';

import React, { useState } from 'react';

interface FinancialCardProps {
  monthlyTotal: number;
  yearlyTotal: number;
  requiredIncome: number;
  taxRate: number;
  savingsRate: number;
  selections: Array<{
    category: string;
    items: Array<{
      name: string;
      monthly: number;
    }>;
  }>;
}

export function FinancialCard({
  monthlyTotal,
  yearlyTotal,
  requiredIncome,
  taxRate,
  savingsRate,
  selections,
}: FinancialCardProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-16">
      {/* Main Card */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: `rgb(var(--panel) / 0.8)`,
          borderColor: 'rgb(var(--border))',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* LEFT: Core Numbers (3 cols) */}
          <div className="lg:col-span-3 p-12 border-r" style={{ borderColor: 'rgb(var(--border))' }}>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-8"
              style={{ color: 'rgb(var(--muted-2))' }}
            >
              Core Numbers
            </h2>

            <div className="space-y-8">
              {/* Monthly Cost */}
              <div>
                <div
                  className="flex items-baseline gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-opacity-50"
                  style={{
                    backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                    borderLeft: '4px solid rgb(var(--gold))',
                    boxShadow: '0 0 20px rgba(213, 160, 33, 0.1)',
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--muted))' }}>
                      Monthly Lifestyle Cost
                    </p>
                    <p className="text-4xl font-bold" style={{ color: 'rgb(var(--gold))' }}>
                      ${monthlyTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Yearly Cost */}
              <div>
                <div
                  className="flex items-baseline gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-opacity-50"
                  style={{
                    backgroundColor: `rgb(var(--panel-2) / 0.5)`,
                    borderLeft: '4px solid rgb(var(--gold))',
                    boxShadow: '0 0 20px rgba(213, 160, 33, 0.1)',
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--muted))' }}>
                      Yearly Lifestyle Cost
                    </p>
                    <p className="text-4xl font-bold" style={{ color: 'rgb(var(--gold))' }}>
                      ${yearlyTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Income */}
              <div>
                <div
                  className="flex items-baseline gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-opacity-50"
                  style={{
                    backgroundColor: `rgb(var(--panel-2) / 0.8)`,
                    borderLeft: '4px solid rgb(var(--gold))',
                    boxShadow: '0 0 30px rgba(213, 160, 33, 0.2)',
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--muted))' }}>
                      Required Gross Income (Yearly)
                    </p>
                    <p className="text-4xl font-bold" style={{ color: 'rgb(var(--gold))' }}>
                      ${requiredIncome.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assumptions */}
              <div className="pt-4 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
                <p className="text-xs" style={{ color: 'rgb(var(--muted-2))' }}>
                  Assumes {taxRate}% taxes + {savingsRate}% savings. Adjust anytime.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Selections (2 cols) */}
          <div className="lg:col-span-2 p-12">
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-8"
              style={{ color: 'rgb(var(--muted-2))' }}
            >
              Your Selections
            </h2>

            <div className="space-y-6">
              {selections.map((section) => (
                <div key={section.category}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.category)}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-300 hover:bg-opacity-50"
                    style={{
                      backgroundColor: `rgb(var(--panel-2) / 0.3)`,
                      borderLeft: '3px solid rgb(var(--gold))',
                    }}
                  >
                    <p
                      className="text-sm font-semibold uppercase tracking-wider"
                      style={{ color: 'rgb(var(--gold))' }}
                    >
                      {section.category}
                    </p>
                    <span
                      style={{ color: 'rgb(var(--gold))' }}
                      className={`transition-transform duration-300 ${
                        expandedSections[section.category] ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Items */}
                  {expandedSections[section.category] && (
                    <div className="mt-2 space-y-2 pl-4">
                      {section.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 px-3 rounded transition-all duration-300 hover:translate-x-1"
                          style={{
                            backgroundColor: `rgb(var(--panel-2) / 0.2)`,
                            borderLeft: '2px solid rgb(var(--gold))',
                          }}
                        >
                          <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
                            {item.name}
                          </p>
                          <p className="text-sm font-semibold" style={{ color: 'rgb(var(--gold))' }}>
                            +${item.monthly.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Divider */}
                  <div
                    className="mt-4 h-px"
                    style={{
                      background: `linear-gradient(90deg, rgb(var(--gold)), transparent)`,
                      opacity: 0.4,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center mt-8" style={{ color: 'rgb(var(--muted-2))' }}>
        Estimates for planning—not financial advice.
      </p>
    </div>
  );
}
