'use client';

import { useRouter } from 'next/navigation';

interface SavedBlueprintCardProps {
  blueprint: {
    id: string;
    title: string;
    payload: {
      totalMonthly: number;
      totalYearly: number;
      requiredGrossYearly: number;
    };
    updated_at: string;
  };
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function SavedBlueprintCard({ blueprint }: SavedBlueprintCardProps) {
  const router = useRouter();
  const formattedDate = new Date(blueprint.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => router.push('/blueprints/view')}
      className="w-full text-left rounded-2xl transition-all duration-200 ring-1 ring-transparent hover:ring-[rgba(212,175,55,0.3)] cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <div className="backdrop-blur-sm rounded-2xl overflow-hidden p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {blueprint.title}
          </h2>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' }}>
            Saved
          </span>
        </div>

        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Last updated: {formattedDate}</p>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Monthly Cost</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
              {formatMoney(blueprint.payload.totalMonthly)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Yearly Cost</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>
              {formatMoney(blueprint.payload.totalYearly)}
            </p>
          </div>
        </div>

        {blueprint.payload.requiredGrossYearly && (
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Required Gross Income (Yearly)</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatMoney(blueprint.payload.requiredGrossYearly)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Click to view full blueprint details</p>
        </div>
      </div>
    </div>
  );
}
