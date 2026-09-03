'use client';

import { useState } from 'react';
import { Goal, Category, CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { GoalCard } from './GoalCard';

interface GoalFormProps {
  weekStart: string;
  user: string;
  existingGoals: Goal[];
  onSave: (goals: Goal[]) => void;
  onCopyFromPrevious: (goals: Goal[]) => void;
}

export function GoalForm({ weekStart, user, existingGoals, onSave, onCopyFromPrevious }: GoalFormProps) {
  const [goals, setGoals] = useState<Goal[]>(
    existingGoals.length > 0
      ? existingGoals
      : [
          {
            id: crypto.randomUUID(),
            user,
            week_start_date: weekStart,
            title: '',
            category: 'ML' as Category,
            status: 'todo',
            created_at: new Date().toISOString(),
          },
        ]
  );

  const [saving, setSaving] = useState(false);

  const addGoal = () => {
    setGoals([
      ...goals,
      {
        id: crypto.randomUUID(),
        user,
        week_start_date: weekStart,
        title: '',
        category: 'ML' as Category,
        status: 'todo',
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleSave = async () => {
    const validGoals = goals.filter(g => g.title.trim() !== '');
    if (validGoals.length === 0) return;

    setSaving(true);
    try {
      await onSave(validGoals);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyFromPrevious = async () => {
    const previousWeekGoals = goals.filter(g => g.week_start_date !== weekStart);
    if (previousWeekGoals.length === 0) return;

    const newGoals = previousWeekGoals.map(g => ({
      ...g,
      id: crypto.randomUUID(),
      week_start_date: weekStart,
      status: 'todo' as const,
      created_at: new Date().toISOString(),
    }));

    setGoals(newGoals);
    onCopyFromPrevious(newGoals);
  };

  const validGoalsCount = goals.filter(g => g.title.trim() !== '').length;
  const isValid = validGoalsCount >= 1 && validGoalsCount <= 7;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-on-surface">Set Goals for This Week</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Add 1-7 focused objectives for the week
          </p>
        </div>
        <span className={`text-sm font-medium ${isValid ? 'text-primary' : 'text-on-surface-variant'}`}>
          {validGoalsCount} Active
        </span>
      </div>

      <div className="space-y-3">
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdate={(updates) => updateGoal(goal.id, updates)}
            onDelete={() => deleteGoal(goal.id)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={addGoal} disabled={goals.length >= 7}>
          Add Goal
        </Button>
        <Button variant="ghost" onClick={handleCopyFromPrevious}>
          Copy from Previous Week
        </Button>
      </div>

      <div className="pt-4 border-t border-outline-variant">
        <Button onClick={handleSave} disabled={saving || !isValid}>
          {saving ? 'Saving...' : `Save ${validGoalsCount} Goal${validGoalsCount !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}
