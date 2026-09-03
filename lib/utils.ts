import { Goal, WeekSummary, Category, DayOfWeek } from './types';

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getWeekDates(weekStart: string): Date[] {
  const start = parseDate(weekStart);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[date.getDay()];
}

export function calculateWeekSummary(goals: Goal[], weekStart: string): WeekSummary {
  const weekGoals = goals.filter(g => g.week_start_date === weekStart);
  const completed = weekGoals.filter(g => g.status === 'done');

  const by_category: Record<Category, { set: number; completed: number }> = {
    ML: { set: 0, completed: 0 },
    DL: { set: 0, completed: 0 },
    AI: { set: 0, completed: 0 },
    Agents: { set: 0, completed: 0 },
    Other: { set: 0, completed: 0 },
  };

  weekGoals.forEach(g => {
    by_category[g.category].set++;
    if (g.status === 'done') {
      by_category[g.category].completed++;
    }
  });

  return {
    week_start_date: weekStart,
    goals_set: weekGoals.length,
    goals_completed: completed.length,
    completion_rate: weekGoals.length > 0 ? (completed.length / weekGoals.length) * 100 : 0,
    by_category,
  };
}

export function calculateStreak(goals: Goal[], weeks: string[]): number {
  let streak = 0;
  const sortedWeeks = [...weeks].sort().reverse();

  for (const week of sortedWeeks) {
    const summary = calculateWeekSummary(goals, week);
    if (summary.completion_rate >= 80) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getAvailableWeeks(goals: Goal[]): string[] {
  const weeks = new Set(goals.map(g => g.week_start_date));
  return Array.from(weeks).sort().reverse();
}

export function markMissedGoals(goals: Goal[], currentWeekStart: string): Goal[] {
  return goals.map(goal => {
    if (goal.week_start_date < currentWeekStart && goal.status !== 'done') {
      return { ...goal, status: 'missed' as const };
    }
    return goal;
  });
}

export function getGoalsForDay(goals: Goal[], day: DayOfWeek, user: string): Goal[] {
  return goals.filter(g =>
    g.user === user &&
    g.day_of_week?.includes(day) &&
    g.status !== 'missed'
  );
}

export function getUserGoals(goals: Goal[], user: string, weekStart: string): Goal[] {
  return goals.filter(g => g.user === user && g.week_start_date === weekStart);
}
