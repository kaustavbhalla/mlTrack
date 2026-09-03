'use client';

import { WeekSummary, CATEGORY_CONFIG } from '@/lib/types';

interface DomainProgressProps {
  summary: WeekSummary;
}

export function DomainProgress({ summary }: DomainProgressProps) {
  const categories = Object.entries(summary.by_category).filter(([, data]) => data.set > 0);

  if (categories.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-6">
        <h3 className="font-display text-lg font-semibold text-on-surface mb-4">Domain Progress</h3>
        <p className="text-sm text-on-surface-variant italic">No goals set yet</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-6">
      <h3 className="font-display text-lg font-semibold text-on-surface mb-4">Domain Progress</h3>

      <div className="space-y-4">
        {categories.map(([category, data]) => {
          const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
          const percentage = Math.round((data.completed / data.set) * 100);

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-full border"
                    style={{
                      backgroundColor: config.bg,
                      color: config.text,
                      borderColor: config.border,
                    }}
                  >
                    {category}
                  </span>
                  <span className="text-sm text-on-surface-variant">{config.label}</span>
                </div>
                <span className="text-sm font-medium text-on-surface">{percentage}%</span>
              </div>

              <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.text,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>{data.completed} completed</span>
                <span>{data.set - data.completed} remaining</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
