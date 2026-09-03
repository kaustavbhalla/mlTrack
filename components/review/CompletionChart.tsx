'use client';

import { WeekSummary } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/types';

interface CompletionChartProps {
  summary: WeekSummary;
}

export function CompletionChart({ summary }: CompletionChartProps) {
  const percentage = Math.round(summary.completion_rate);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-6">
      <h3 className="font-display text-lg font-semibold text-on-surface mb-4">Overall Completion</h3>

      <div className="flex items-center justify-center">
        <div className="relative">
          <svg className="w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e4e2df"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#4e6b56"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold text-on-surface">{percentage}%</span>
            <span className="text-xs text-on-surface-variant">
              {summary.goals_completed}/{summary.goals_set} goals
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {Object.entries(summary.by_category).map(([category, data]) => {
          if (data.set === 0) return null;
          const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
          const catPercentage = Math.round((data.completed / data.set) * 100);

          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">{config.label}</span>
                <span className="text-on-surface-variant">{data.completed}/{data.set}</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${catPercentage}%`,
                    backgroundColor: config.bg,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
