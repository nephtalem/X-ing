// Database Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_days_per_week: number;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonthlyGoal {
  id: string;
  task_id: string;
  user_id: string;
  goal_title: string;
  description: string | null;
  target_date: string | null;
  progress_percentage: number;
  month_year: string;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface WeeklyGoal {
  id: string;
  monthly_goal_id: string;
  task_id: string;
  user_id: string;
  goal_title: string;
  description: string | null;
  week_start_date: string;
  week_end_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailySubtask {
  id: string;
  task_id: string;
  weekly_goal_id: string | null;
  user_id: string;
  date: string;
  subtask_title: string;
  description: string | null;
  completed: boolean;
  estimated_duration: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyMark {
  id: string;
  task_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Extended Types with Relations
export interface TaskWithGoals extends Task {
  monthly_goal?: MonthlyGoal;
  weekly_goal?: WeeklyGoal;
  daily_subtasks?: DailySubtask[];
  daily_mark?: DailyMark;
}

export interface WeeklyGoalWithTask extends WeeklyGoal {
  task?: Task;
}

export interface DailySubtaskWithTask extends DailySubtask {
  task?: Task;
  weekly_goal?: WeeklyGoal;
}

// Form Types
export interface CreateTaskInput {
  name: string;
  description?: string;
  target_days_per_week?: number;
  color?: string;
}

export interface CreateMonthlyGoalInput {
  task_id: string;
  goal_title: string;
  description?: string;
  target_date?: string;
  month_year: string;
}

export interface CreateWeeklyGoalInput {
  monthly_goal_id: string;
  task_id: string;
  goal_title: string;
  description?: string;
  week_start_date: string;
  week_end_date: string;
}

export interface CreateDailySubtaskInput {
  task_id: string;
  weekly_goal_id?: string;
  date: string;
  subtask_title: string;
  description?: string;
  estimated_duration?: number;
}

export interface CreateDailyMarkInput {
  task_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}

// Analytics Types
export interface StreakData {
  task_id: string;
  task_name: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export interface CompletionRate {
  task_id: string;
  task_name: string;
  completed_days: number;
  target_days: number;
  percentage: number;
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  tasks: {
    task_id: string;
    task_name: string;
    completed_days: number;
    target_days: number;
    subtasks_completed: number;
    subtasks_total: number;
  }[];
  overall_completion_rate: number;
}

export interface MonthlySummary {
  month_year: string;
  goals: {
    goal_id: string;
    goal_title: string;
    task_name: string;
    progress_percentage: number;
    weekly_goals_completed: number;
    weekly_goals_total: number;
    status: string;
  }[];
}

// UI State Types
export interface TodayViewTask {
  task: Task;
  monthly_goal: MonthlyGoal | null;
  weekly_goal: WeeklyGoal | null;
  subtasks: DailySubtask[];
  daily_mark: DailyMark | null;
  current_streak: number;
}

export interface CalendarDay {
  date: string;
  is_completed: boolean;
  subtasks_count: number;
  subtasks_completed: number;
  notes: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
