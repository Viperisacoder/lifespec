'use client';

import { formatCurrencyDetailed } from '@/lib/formatCurrency';
import { BudgetItem } from '@/hooks/useCashflowModel';

interface BudgetTableProps {
  items: BudgetItem[];
  onUpdate: (items: BudgetItem[]) => void;
  currentTotal: number;
  plannedTotal: number;
}

export function BudgetTable({ items, onUpdate, currentTotal, plannedTotal }: BudgetTableProps) {
  const handlePlannedChange = (index: number, value: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], planned: Math.max(0, value) };
    onUpdate(updated);
  };

  const handleSetPlannedToCurrent = () => {
    const updated = items.map((item) => ({ ...item, planned: item.current }));
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      {/* Table Header with Actions */}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
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
            {items.map((item, idx) => {
              const delta = item.planned - item.current;
              return (
                <tr key={idx} style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                  <td className="py-3 px-3" style={{ color: 'rgb(var(--text))' }}>
                    {item.category}
                  </td>
                  <td className="text-right py-3 px-3" style={{ color: 'rgb(var(--muted))' }}>
                    {formatCurrencyDetailed(item.current)}
                  </td>
                  <td className="text-right py-3 px-3">
                    <input
                      type="number"
                      value={item.planned}
                      onChange={(e) => handlePlannedChange(idx, parseFloat(e.target.value) || 0)}
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {items.map((item, idx) => {
          const delta = item.planned - item.current;
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
                {item.category}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'rgb(var(--muted-2))' }}>Current</span>
                  <span style={{ color: 'rgb(var(--muted))' }}>{formatCurrencyDetailed(item.current)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'rgb(var(--muted-2))' }}>Planned</span>
                  <input
                    type="number"
                    value={item.planned}
                    onChange={(e) => handlePlannedChange(idx, parseFloat(e.target.value) || 0)}
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

      {/* Summary Footer */}
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
              {formatCurrencyDetailed(currentTotal)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: 'rgb(var(--muted-2))' }}>
              Planned Total / mo
            </p>
            <p className="text-lg font-bold" style={{ color: 'rgb(var(--text))' }}>
              {formatCurrencyDetailed(plannedTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
