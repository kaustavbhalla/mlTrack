'use client';

import { Goal, DayOfWeek, DAY_LABELS } from '@/lib/types';
import { GoalCard } from '@/components/goal/GoalCard';

interface DayColumnProps {
  day: DayOfWeek;
  date: string;
  goals: Goal[];
  onGoalUpdate: (goalId: string, updates: Partial<Goal>) => void;
}

export function DayColumn({ day, date, goals, onGoalUpdate }: DayColumnProps) {
  const dayGoals = goals.filter(g => g.day_of_week?.includes(day));

  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="border-b border-outline-variant last:border-b-0">
      <div className="flex items-center gap-3 py-3 px-4 bg-surface-container">
        <span className="font-display text-sm font-semibold text-on-surface w-8">
          {DAY_LABELS[day]}
        </span>
        <span className="text-xs text-on-surface-variant">{formatDateString(date)}</span>
        {dayGoals.length > 0 && (
          <span className="ml-auto text-xs text-on-surface-variant">
            {dayGoals.filter(g => g.status === 'done').length}/{dayGoals.length}
          </span>
        )}
      </div>

      <div className="p-3 space-y-2">
        {dayGoals.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic py-2">No goals scheduled</p>
        ) : (
          dayGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={(updates) => onGoalUpdate(goal.id, updates)}
              showUser={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
