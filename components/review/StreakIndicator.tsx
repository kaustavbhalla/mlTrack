'use client';

interface StreakIndicatorProps {
  streak: number;
  record?: number;
}

export function StreakIndicator({ streak, record = 0 }: StreakIndicatorProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-md p-6">
      <h3 className="font-display text-lg font-semibold text-on-surface mb-4">Shared Streak</h3>

      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="text-4xl">
            {streak > 0 ? '🔥' : '✨'}
          </div>
          <div>
            <div className="font-display text-4xl font-semibold text-on-surface">
              {streak}
            </div>
            <div className="text-sm text-on-surface-variant">
              consecutive week{streak !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {record > 0 && (
        <div className="mt-4 pt-4 border-t border-outline-variant text-center">
          <p className="text-sm text-on-surface-variant">
            {streak >= record ? (
              <span className="text-primary font-medium">New record!</span>
            ) : (
              <span>Record: {record} weeks</span>
            )}
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-outline-variant">
        <p className="text-xs text-on-surface-variant text-center">
          ≥80% completion required to maintain streak
        </p>
      </div>
    </div>
  );
}
