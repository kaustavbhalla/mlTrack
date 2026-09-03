'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // C - Quick add goal
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        router.push('/goals');
      }

      // G - Go to goals
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        router.push('/goals');
      }

      // K - Go to calendar
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        router.push('/calendar');
      }

      // R - Go to review
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        router.push('/review');
      }

      // H - Go to home
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);
}
