import { TrackerData, Goal } from './types';

const KV_KEY = 'learning-tracker:goals';

const DEFAULT_DATA: TrackerData = {
  users: ['', ''],
  goals: [],
};

const isKVConfigured = () => {
  return process.env.KV_REST_API_URL || process.env.REDIS_URL;
};

// Local storage fallback for development
function getLocalData(): TrackerData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const data = localStorage.getItem(KV_KEY);
    return data ? JSON.parse(data) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

function setLocalData(data: TrackerData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KV_KEY, JSON.stringify(data));
}

export async function getData(): Promise<TrackerData> {
  if (isKVConfigured()) {
    try {
      const { kv } = await import('@vercel/kv');
      const data = await kv.get<TrackerData>(KV_KEY);
      return data || DEFAULT_DATA;
    } catch (error) {
      console.error('Failed to read from KV, falling back to localStorage:', error);
      return getLocalData();
    }
  }
  return getLocalData();
}

export async function setData(data: TrackerData): Promise<void> {
  if (isKVConfigured()) {
    try {
      const { kv } = await import('@vercel/kv');
      await kv.set(KV_KEY, data);
    } catch (error) {
      console.error('Failed to write to KV, falling back to localStorage:', error);
      setLocalData(data);
    }
  } else {
    setLocalData(data);
  }
}

export async function getUsers(): Promise<[string, string]> {
  const data = await getData();
  return data.users;
}

export async function setUsers(users: [string, string]): Promise<void> {
  const data = await getData();
  data.users = users;
  await setData(data);
}

export async function getGoals(): Promise<Goal[]> {
  const data = await getData();
  return data.goals;
}

export async function addGoal(goal: Goal): Promise<void> {
  const data = await getData();
  data.goals.push(goal);
  await setData(data);
}

export async function updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
  const data = await getData();
  const index = data.goals.findIndex(g => g.id === goalId);
  if (index !== -1) {
    data.goals[index] = { ...data.goals[index], ...updates, updated_at: new Date().toISOString() };
    await setData(data);
  }
}

export async function deleteGoal(goalId: string): Promise<void> {
  const data = await getData();
  data.goals = data.goals.filter(g => g.id !== goalId);
  await setData(data);
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  const data = await getData();
  data.goals = goals;
  await setData(data);
}
