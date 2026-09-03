'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<[string, string]>(['', '']);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [user1Name, setUser1Name] = useState('');
  const [user2Name, setUser2Name] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('learning-tracker-users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setShowSetup(true);
    }
    setLoading(false);
  }, []);

  const handleSetup = async () => {
    if (!user1Name.trim() || !user2Name.trim()) return;

    const newUsers: [string, string] = [user1Name.trim(), user2Name.trim()];
    localStorage.setItem('learning-tracker-users', JSON.stringify(newUsers));

    try {
      await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setUsers', users: newUsers }),
      });
    } catch (error) {
      console.error('Failed to save users:', error);
    }

    setUsers(newUsers);
    setShowSetup(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-semibold text-on-surface mb-2">
              Welcome to Learning Tracker
            </h1>
            <p className="text-sm text-on-surface-variant">
              Set up your pair study accountability tool
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={user1Name}
                onChange={(e) => setUser1Name(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-white border border-outline-variant rounded-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Partner's Name
              </label>
              <input
                type="text"
                value={user2Name}
                onChange={(e) => setUser2Name(e.target.value)}
                placeholder="Enter partner's name"
                className="w-full px-4 py-2 bg-white border border-outline-variant rounded-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              onClick={handleSetup}
              disabled={!user1Name.trim() || !user2Name.trim()}
              className="w-full"
            >
              Get Started
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-semibold text-on-surface mb-3">
          Welcome back, {users[0]} & {users[1]}
        </h1>
        <p className="text-on-surface-variant">
          Track your weekly learning goals together
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card hover className="p-6 cursor-pointer" onClick={() => router.push('/goals')}>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-container" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-on-surface mb-2">Set Goals</h2>
            <p className="text-sm text-on-surface-variant">
              Define 1-7 focused objectives for this week
            </p>
          </div>
        </Card>

        <Card hover className="p-6 cursor-pointer" onClick={() => router.push('/calendar')}>
          <div className="text-center">
            <div className="w-12 h-12 bg-domain-dl-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-domain-dl-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-on-surface mb-2">Calendar</h2>
            <p className="text-sm text-on-surface-variant">
              Track daily progress and tick off goals
            </p>
          </div>
        </Card>

        <Card hover className="p-6 cursor-pointer" onClick={() => router.push('/review')}>
          <div className="text-center">
            <div className="w-12 h-12 bg-domain-ai-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-domain-ai-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="font-display text-lg font-semibold text-on-surface mb-2">Review</h2>
            <p className="text-sm text-on-surface-variant">
              See weekly summaries and streaks
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-on-surface-variant">
          Press <kbd className="px-1.5 py-0.5 bg-surface-container rounded text-xs font-mono">C</kbd> to quickly add a new goal
        </p>
      </div>
    </div>
  );
}
