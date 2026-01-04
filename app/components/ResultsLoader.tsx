'use client';

interface ResultsLoaderProps {
  stage: 'analyzing' | 'estimating' | 'building' | 'complete';
}

export function ResultsLoader({ stage }: ResultsLoaderProps) {
  const stages = [
    { key: 'analyzing', label: 'Analyzing inputs' },
    { key: 'estimating', label: 'Estimating timelines' },
    { key: 'building', label: 'Building blueprint' },
  ];

  const stageIndex = stages.findIndex(s => s.key === stage);
  const isComplete = stage === 'complete';

  return (
    <div className="space-y-8">
      {/* Progress Stages */}
      <div className="space-y-4">
        {stages.map((s, idx) => {
          const isActive = idx === stageIndex;
          const isCompleted = idx < stageIndex;

          return (
            <div key={s.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isCompleted
                    ? 'bg-[var(--white)] text-[var(--bg-primary)]'
                    : isActive
                    ? 'bg-[var(--white)] text-[var(--bg-primary)] animate-pulse'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                }`}
                style={
                  isCompleted
                    ? { backgroundColor: 'var(--white)', color: 'var(--bg-primary)' }
                    : isActive
                    ? {
                        backgroundColor: 'var(--white)',
                        color: 'var(--bg-primary)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                      }
                    : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }
                }
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                style={{
                  color: isActive || isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                className="font-medium"
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Skeleton Cards */}
      {!isComplete && (
        <div className="space-y-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="rounded-2xl p-6 animate-pulse"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="h-4 w-24 rounded mb-4" style={{ backgroundColor: 'var(--border-color)' }} />
                <div className="h-8 w-32 rounded" style={{ backgroundColor: 'var(--border-color)' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
