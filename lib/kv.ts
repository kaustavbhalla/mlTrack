import { TrackerData, Goal } from './types';

const DEFAULT_DATA: TrackerData = {
  users: ['', ''],
  goals: [],
};

const GIST_API = 'https://api.github.com';

function getGithubToken(): string | undefined {
  return process.env.GITHUB_PAT;
}

function getGistId(): string | undefined {
  return process.env.GIST_ID;
}

async function fetchGist(): Promise<TrackerData> {
  const token = getGithubToken();
  const gistId = getGistId();

  if (!token || !gistId) {
    console.log('GitHub credentials not configured, using localStorage');
    return getLocalData();
  }

  try {
    const res = await fetch(`${GIST_API}/gists/${gistId}`, {
      headers: { Authorization: `token ${token}` },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('GitHub API error:', res.status, err);
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const gist = await res.json();
    const content = gist.files['learning-tracker.json']?.content;

    if (!content) {
      console.log('No learning-tracker.json file in gist, using empty data');
      return DEFAULT_DATA;
    }

    return JSON.parse(content) as TrackerData;
  } catch (error) {
    console.error('Failed to read from Gist:', error);
    return getLocalData();
  }
}

async function updateGist(data: TrackerData): Promise<void> {
  const token = getGithubToken();
  const gistId = getGistId();

  if (!token || !gistId) {
    setLocalData(data);
    return;
  }

  try {
    const res = await fetch(`${GIST_API}/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'learning-tracker.json': {
            content: JSON.stringify(data, null, 2),
          },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Failed to update gist:', res.status, err);
    }
  } catch (error) {
    console.error('Failed to update Gist:', error);
    setLocalData(data);
  }
}

// Local storage fallback
function getLocalData(): TrackerData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const data = localStorage.getItem('learning-tracker:data');
    return data ? JSON.parse(data) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

function setLocalData(data: TrackerData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('learning-tracker:data', JSON.stringify(data));
}

export async function getData(): Promise<TrackerData> {
  if (getGithubToken() && getGistId()) {
    return fetchGist();
  }
  return getLocalData();
}

export async function setData(data: TrackerData): Promise<void> {
  if (getGithubToken() && getGistId()) {
    await updateGist(data);
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
