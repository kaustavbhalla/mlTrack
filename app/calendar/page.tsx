'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Goal, DayOfWeek, DAYS_OF_WEEK } from '@/lib/types';
import { getMonday, formatDate, getWeekDates, getUserGoals, calculateWeekSummary } from '@/lib/utils';
import { DayColumn } from '@/components/calendar/DayColumn';
import { UserToggle } from '@/components/calendar/UserToggle';
import { Card } from '@/components/ui/Card';

export default function CalendarPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<[string, string]>(['', '']);
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('learning-tracker-users');
    if (!storedUsers) {
      router.push('/');
      return;
    }

    const parsedUsers = JSON.parse(storedUsers) as [string, string];
    setUsers(parsedUsers);
    setCurrentUser(parsedUsers[0]);
    setWeekStart(formatDate(getMonday(new Date())));

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/goals');
      const data = await response.json();
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalUpdate = useCallback(async (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...updates } : g));

    try {
      await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateGoal', goal: { id: goalId, ...updates } }),
      });
    } catch (error) {
      console.error('Failed to update goal:', error);
      fetchData();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-on-surface-variant">Loading calendar...</div>
      </div>
    );
  }

  const weekDates = getWeekDates(weekStart);
  const userGoals = goals.filter(g => g.user === currentUser && g.week_start_date === weekStart);
  const partnerUser = currentUser === users[0] ? users[1] : users[0];
  const partnerGoals = goals.filter(g => g.user === partnerUser && g.week_start_date === weekStart);

  const userSummary = calculateWeekSummary(goals, weekStart);
  const user1Goals = goals.filter(g => g.user === users[0] && g.week_start_date === weekStart);
  const user2Goals = goals.filter(g => g.user === users[1] && g.week_start_date === weekStart);
  const completionRates = {
    user1: user1Goals.length > 0 ? (user1Goals.filter(g => g.status === 'done').length / user1Goals.length) * 100 : 0,
    user2: user2Goals.length > 0 ? (user2Goals.filter(g => g.status === 'done').length / user2Goals.length) * 100 : 0,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface">Calendar</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Week of {new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <UserToggle
          users={users}
          selectedUser={currentUser}
          onSelect={setCurrentUser}
          completionRates={completionRates}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {DAYS_OF_WEEK.map((day, index) => (
              <DayColumn
                key={day}
                day={day}
                date={formatDate(weekDates[index])}
                goals={userGoals}
                onGoalUpdate={handleGoalUpdate}
              />
            ))}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-on-surface mb-4">
              Your Progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-on-surface-variant">Goals Completed</span>
                  <span className="font-medium text-on-surface">
                    {userSummary.goals_completed}/{userSummary.goals_set}
                  </span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full transition-all duration-500"
                    style={{ width: `${userSummary.completion_rate}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant">
                <h3 className="text-sm font-medium text-on-surface mb-2">By Category</h3>
                <div className="space-y-2">
                  {Object.entries(userSummary.by_category).map(([category, data]) => {
                    if (data.set === 0) return null;
                    return (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="text-on-surface-variant">{category}</span>
                        <span className="text-on-surface">{data.completed}/{data.set}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-on-surface mb-4">
              {partnerUser}&apos;s Goals
            </h2>
            {partnerGoals.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">
                {partnerUser} hasn&apos;t set goals yet
              </p>
            ) : (
              <div className="space-y-2">
                {partnerGoals.slice(0, 5).map(goal => (
                  <div key={goal.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        goal.status === 'done'
                          ? 'bg-primary-container'
                          : goal.status === 'in_progress'
                          ? 'bg-domain-dl-text'
                          : 'bg-outline-variant'
                      }`}
                    />
                    <span className={goal.status === 'done' ? 'line-through text-on-surface-variant' : 'text-on-surface'}>
                      {goal.title}
                    </span>
                  </div>
                ))}
                {partnerGoals.length > 5 && (
                  <p className="text-xs text-on-surface-variant">
                    +{partnerGoals.length - 5} more goals
                  </p>
                )}
              </div>
            )}
          </Card>

          <div className="text-center">
            <p className="text-sm text-on-surface-variant">
              Press <kbd className="px-1.5 py-0.5 bg-surface-container rounded text-xs font-mono">C</kbd> to add a goal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
