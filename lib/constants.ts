/**
 * Application Constants
 */

// Default values
export const DEFAULT_TARGET_DAYS_PER_WEEK = 5;
export const DEFAULT_ESTIMATED_DURATION = 60; // minutes

// Task colors
export const TASK_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Orange', value: '#f97316' },
] as const;

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const MONTH_YEAR_FORMAT = 'YYYY-MM';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  TODAY: '/today',
  CALENDAR: '/calendar',
  ANALYTICS: '/analytics',
  GOALS: '/goals',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  MONTHLY_GOALS: '/api/goals/monthly',
  WEEKLY_GOALS: '/api/goals/weekly',
  SUBTASKS: '/api/subtasks',
  MARKS: '/api/marks',
  ANALYTICS: '/api/analytics',
} as const;

// Messages
export const MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  GOAL_CREATED: 'Goal created successfully!',
  GOAL_UPDATED: 'Goal updated successfully!',
  MARK_SAVED: 'Progress saved!',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  LOGIN_SUCCESS: 'Welcome back!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
} as const;

// Goal status
export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Week days
export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const WEEK_DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

