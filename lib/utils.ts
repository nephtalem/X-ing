import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Used by shadcn/ui components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the end of the week (Sunday) for a given date
 */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

/**
 * Get current month-year string (YYYY-MM)
 */
export function getCurrentMonthYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Calculate streak from an array of dates
 */
export function calculateStreak(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };

  // Sort dates in descending order
  const sortedDates = dates
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if most recent date is today or yesterday for current streak
  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);

  if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
    currentStreak = 1;

    // Calculate current streak
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i]);
      current.setHours(0, 0, 0, 0);
      
      const previous = new Date(sortedDates[i - 1]);
      previous.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  longestStreak = tempStreak;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    current.setHours(0, 0, 0, 0);
    
    const previous = new Date(sortedDates[i - 1]);
    previous.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Generate calendar days for a given month
 */
export function generateCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: Date[] = [];
  
  // Add days from previous month to fill the first week
  const firstDayOfWeek = firstDay.getDay();
  const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday = 0
  
  for (let i = daysToAdd; i > 0; i--) {
    const day = new Date(year, month, 1 - i);
    days.push(day);
  }
  
  // Add all days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add days from next month to fill the last week
  const lastDayOfWeek = lastDay.getDay();
  const daysToAddEnd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  
  for (let i = 1; i <= daysToAddEnd; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

/**
 * Get a random color for tasks
 */
const TASK_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export function getRandomTaskColor(): string {
  return TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)];
}

/**
 * Calculate completion percentage
 */
export function calculateCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * Check if a date is in the current week
 */
export function isThisWeek(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const weekStart = getWeekStart(new Date());
  const weekEnd = getWeekEnd(new Date());
  return d >= weekStart && d <= weekEnd;
}

