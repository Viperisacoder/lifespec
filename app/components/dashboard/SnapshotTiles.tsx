'use client';

import { formatCurrencyDetailed } from '@/lib/formatCurrency';
import { CashflowSummary } from '@/hooks/useCashflowModel';

interface SnapshotTilesProps {
  cashflow: CashflowSummary;
}

export function SnapshotTiles({ cashflow }: SnapshotTilesProps) {
  const tiles = [
    {
      label: 'Take-home / mo',
      value: cashflow.netMonthly,
      highlight: false,
    },
    {
      label: 'Planned lifestyle / mo',
      value: cashflow.plannedLifestyleMonthly,
      highlight: false,
    },
    {
      label: 'Investing / mo',
      value: cashflow.investMonthly,
      highlight: true,
    },
    {
      label: 'Surplus / deficit / mo',
      value: cashflow.surplusMonthly,
      highlight: false,
      isPositive: cashflow.surplusMonthly >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {tiles.map((tile, idx) => (
        <div
          key={idx}
          className="p-4 rounded-lg border transition-all hover:bg-opacity-80"
          style={{
            backgroundColor: 'rgb(var(--panel-2) / 0.5)',
            borderColor: 'rgb(var(--border))',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'rgb(var(--muted-2))' }}
          >
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
  );
}
