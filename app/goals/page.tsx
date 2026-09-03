'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Goal, CATEGORY_CONFIG } from '@/lib/types';
import { getMonday, formatDate, getUserGoals } from '@/lib/utils';
import { GoalForm } from '@/components/goal/GoalForm';
import { Card } from '@/components/ui/Card';

export default function GoalsPage() {
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

  const handleSave = async (newGoals: Goal[]) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveGoals', goals: newGoals }),
      });

      if (response.ok) {
        setGoals(newGoals);
      }
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };

  const handleCopyFromPrevious = (copiedGoals: Goal[]) => {
    setGoals([...goals, ...copiedGoals]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-on-surface-variant">Loading goals...</div>
      </div>
    );
  }

  const currentUserGoals = goals.filter(g => g.user === currentUser && g.week_start_date === weekStart);
  const partnerUser = currentUser === users[0] ? users[1] : users[0];
  const partnerGoals = goals.filter(g => g.user === partnerUser && g.week_start_date === weekStart);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface">Set Goals</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Week of {new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex bg-surface-container rounded-lg p-1">
          <button
            onClick={() => setCurrentUser(users[0])}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentUser === users[0]
                ? 'bg-primary-container text-white'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {users[0]}
          </button>
          <button
            onClick={() => setCurrentUser(users[1])}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentUser === users[1]
                ? 'bg-primary-container text-white'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {users[1]}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <GoalForm
            weekStart={weekStart}
            user={currentUser}
            existingGoals={currentUserGoals}
            onSave={handleSave}
            onCopyFromPrevious={handleCopyFromPrevious}
          />
        </div>

        <div>
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-on-surface mb-4">
              {partnerUser}&apos;s Goals
            </h2>

            {partnerGoals.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">
                {partnerUser} hasn&apos;t set goals yet
              </p>
            ) : (
              <div className="space-y-3">
                {partnerGoals.map(goal => (
                  <div
                    key={goal.id}
                    className="p-3 bg-surface-container rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          goal.status === 'done'
                            ? 'bg-primary-container'
                            : goal.status === 'in_progress'
                            ? 'bg-domain-dl-text'
                            : 'bg-outline-variant'
                        }`}
                      />
                      <span className={`text-sm ${goal.status === 'done' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                        {goal.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 ml-4">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: CATEGORY_CONFIG[goal.category].bg,
                          color: CATEGORY_CONFIG[goal.category].text,
                        }}
                      >
                        {goal.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
