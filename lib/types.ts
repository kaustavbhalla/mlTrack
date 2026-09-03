export type Category = 'ML' | 'DL' | 'AI' | 'Agents' | 'Other';
export type GoalStatus = 'todo' | 'in_progress' | 'done' | 'missed';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  user: string;
  week_start_date: string;
  title: string;
  description?: string;
  link?: string;
  category: Category;
  status: GoalStatus;
  day_of_week?: DayOfWeek[];
  focus_hours?: number;
  subtasks?: Subtask[];
  created_at: string;
  updated_at?: string;
}

export interface TrackerData {
  users: [string, string];
  goals: Goal[];
}

export interface WeekSummary {
  week_start_date: string;
  goals_set: number;
  goals_completed: number;
  completion_rate: number;
  by_category: Record<Category, { set: number; completed: number }>;
}

export interface DayGoals {
  day: DayOfWeek;
  date: string;
  goals: Goal[];
}

export const CATEGORIES: Category[] = ['ML', 'DL', 'AI', 'Agents', 'Other'];

export const CATEGORY_CONFIG: Record<Category, { label: string; bg: string; text: string; border: string }> = {
  ML: { label: 'Machine Learning', bg: '#edf2ee', text: '#4e6b56', border: 'rgba(78, 107, 86, 0.2)' },
  DL: { label: 'Deep Learning', bg: '#ebf0f3', text: '#4d6475', border: 'rgba(77, 100, 117, 0.2)' },
  AI: { label: 'Artificial Intelligence', bg: '#f6eeeb', text: '#a36a56', border: 'rgba(163, 106, 86, 0.2)' },
  Agents: { label: 'Autonomous Agents', bg: '#f5f1e6', text: '#8c733e', border: 'rgba(140, 115, 62, 0.2)' },
  Other: { label: 'Other', bg: '#f0f0f0', text: '#666666', border: 'rgba(102, 102, 102, 0.2)' },
};

export const DAYS_OF_WEEK: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};
