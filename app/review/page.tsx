'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Goal } from '@/lib/types';
import { getMonday, formatDate, calculateWeekSummary, calculateStreak, getAvailableWeeks } from '@/lib/utils';
import { CompletionChart } from '@/components/review/CompletionChart';
import { DomainProgress } from '@/components/review/DomainProgress';
import { StreakIndicator } from '@/components/review/StreakIndicator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ReviewPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<[string, string]>(['', '']);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('learning-tracker-users');
    if (!storedUsers) {
      router.push('/');
      return;
    }

    const parsedUsers = JSON.parse(storedUsers) as [string, string];
    setUsers(parsedUsers);
    setWeekStart(formatDate(getMonday(new Date())));

    fetchData();
  }, [router]);

  const setWeekStart = (week: string) => {
    setSelectedWeek(week);
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/goals');
      const data = await response.json();
      const allGoals = data.goals || [];
      setGoals(allGoals);

      const weeks = getAvailableWeeks(allGoals);
      setAvailableWeeks(weeks);

      if (weeks.length > 0) {
        setSelectedWeek(weeks[0]);
      } else {
        setSelectedWeek(formatDate(getMonday(new Date())));
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-on-surface-variant">Loading review...</div>
      </div>
    );
  }

  const weekSummary = calculateWeekSummary(goals, selectedWeek);
  const streak = calculateStreak(goals, availableWeeks);

  const user1Goals = goals.filter(g => g.user === users[0] && g.week_start_date === selectedWeek);
  const user2Goals = goals.filter(g => g.user === users[1] && g.week_start_date === selectedWeek);
  const user1Summary = calculateWeekSummary(goals.filter(g => g.user === users[0]), selectedWeek);
  const user2Summary = calculateWeekSummary(goals.filter(g => g.user === users[1]), selectedWeek);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface">Review</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Weekly summary and progress
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="px-4 py-2 bg-white border border-outline-variant rounded-md text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {availableWeeks.length === 0 ? (
              <option value={formatDate(getMonday(new Date()))}>
                Current Week
              </option>
            ) : (
              availableWeeks.map(week => (
                <option key={week} value={week}>
                  Week of {new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </option>
              ))
            )}
          </select>

          <Button variant="secondary" onClick={() => router.push('/goals')}>
            Set Next Week&apos;s Goals
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CompletionChart summary={weekSummary} />
        <StreakIndicator streak={streak} />
        <DomainProgress summary={weekSummary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-on-surface mb-4">
            {users[0]}&apos;s Week
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Completion Rate</span>
              <span className="font-medium text-on-surface">{Math.round(user1Summary.completion_rate)}%</span>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-500"
                style={{ width: `${user1Summary.completion_rate}%` }}
              />
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-medium text-on-surface mb-2">Goals Completed</h3>
              <div className="space-y-2">
                {user1Goals.filter(g => g.status === 'done').map(goal => (
                  <div key={goal.id} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary-container" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="line-through text-on-surface-variant">{goal.title}</span>
                  </div>
                ))}
                {user1Goals.filter(g => g.status === 'done').length === 0 && (
                  <p className="text-sm text-on-surface-variant italic">No goals completed yet</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-medium text-on-surface mb-2">Remaining</h3>
              <div className="space-y-2">
                {user1Goals.filter(g => g.status !== 'done').map(goal => (
                  <div key={goal.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-outline-variant" />
                    <span className="text-on-surface">{goal.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-on-surface mb-4">
            {users[1]}&apos;s Week
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Completion Rate</span>
              <span className="font-medium text-on-surface">{Math.round(user2Summary.completion_rate)}%</span>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-domain-dl-text rounded-full transition-all duration-500"
                style={{ width: `${user2Summary.completion_rate}%` }}
              />
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-medium text-on-surface mb-2">Goals Completed</h3>
              <div className="space-y-2">
                {user2Goals.filter(g => g.status === 'done').map(goal => (
                  <div key={goal.id} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-primary-container" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="line-through text-on-surface-variant">{goal.title}</span>
                  </div>
                ))}
                {user2Goals.filter(g => g.status === 'done').length === 0 && (
                  <p className="text-sm text-on-surface-variant italic">No goals completed yet</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <h3 className="text-sm font-medium text-on-surface mb-2">Remaining</h3>
              <div className="space-y-2">
                {user2Goals.filter(g => g.status !== 'done').map(goal => (
                  <div key={goal.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-outline-variant" />
                    <span className="text-on-surface">{goal.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {availableWeeks.length > 1 && (
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-on-surface mb-4">Week History</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableWeeks.map(week => {
                const summary = calculateWeekSummary(goals, week);
                return (
                  <button
                    key={week}
                    onClick={() => setSelectedWeek(week)}
                    className={`p-4 rounded-md border transition-colors ${
                      selectedWeek === week
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant hover:border-outline'
                    }`}
                  >
                    <div className="text-sm font-medium text-on-surface">
                      {new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-lg font-semibold text-on-surface mt-1">
                      {Math.round(summary.completion_rate)}%
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {summary.goals_completed}/{summary.goals_set} goals
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
