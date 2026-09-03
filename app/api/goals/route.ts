import { NextRequest, NextResponse } from 'next/server';
import { getGoals, saveGoals, getUsers, setUsers } from '@/lib/kv';
import { Goal } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const [users, goals] = await Promise.all([getUsers(), getGoals()]);
    return NextResponse.json({ users, goals });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, users, goals, goal } = body;

    switch (action) {
      case 'setUsers':
        await setUsers(users);
        return NextResponse.json({ success: true });

      case 'addGoal':
        const newGoal: Goal = {
          id: uuidv4(),
          created_at: new Date().toISOString(),
          status: 'todo',
          ...goal,
        };
        const currentGoals = await getGoals();
        currentGoals.push(newGoal);
        await saveGoals(currentGoals);
        return NextResponse.json({ goal: newGoal });

      case 'updateGoal':
        const updatedGoals = await getGoals();
        const index = updatedGoals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
          updatedGoals[index] = { ...updatedGoals[index], ...goal, updated_at: new Date().toISOString() };
          await saveGoals(updatedGoals);
          return NextResponse.json({ goal: updatedGoals[index] });
        }
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 });

      case 'deleteGoal':
        const filteredGoals = await getGoals();
        const newGoals = filteredGoals.filter(g => g.id !== goal.id);
        await saveGoals(newGoals);
        return NextResponse.json({ success: true });

      case 'saveGoals':
        await saveGoals(goals);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
