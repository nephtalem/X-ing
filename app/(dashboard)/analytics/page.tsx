'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Flame,
  Calendar,
  CheckCircle2,
  Activity,
  Award,
  BarChart3,
} from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsData {
  overview: {
    totalMarks: number;
    completedMarks: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    totalActions: number;
    completedActions: number;
    actionsCompletionRate: number;
    activeTasks: number;
    activeMonthlyGoals: number;
    activeWeeklyGoals: number;
  };
  trendData: Array<{
    date: string;
    completionRate: number;
    completed: number;
    total: number;
  }>;
  taskBreakdownData: Array<{
    name: string;
    value: number;
  }>;
  heatmapData: Array<{
    day: string;
    value: number;
  }>;
  tasks: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

const COLORS = ['#4f46e5', '#9333ea', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?days=${period}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Hero Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="skeleton h-10 w-80 mb-4 bg-white/20" />
              <div className="skeleton h-6 w-64 bg-white/20" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-10 w-24 rounded-lg bg-white/30" />
              <div className="skeleton h-10 w-24 rounded-lg bg-white/30" />
              <div className="skeleton h-10 w-24 rounded-lg bg-white/30" />
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-4 w-28 bg-gray-200 dark:bg-gray-700" />
                  <div className="skeleton h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                  <div className="skeleton h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="skeleton h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 animate-pulse space-y-4">
              <div className="skeleton h-6 w-40 bg-gray-200 dark:bg-gray-700" />
              <div className="skeleton h-64 w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <BarChart3 className="w-10 h-10" />
                Analytics Dashboard
              </h1>
              <p className="text-blue-100 text-lg">
                Track your deep work progress and insights
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPeriod('7')}
                className={
                  period === '7'
                    ? 'bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg'
                    : 'bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 hover:border-white font-medium backdrop-blur-sm'
                }
              >
                7 Days
              </Button>
              <Button
                onClick={() => setPeriod('30')}
                className={
                  period === '30'
                    ? 'bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg'
                    : 'bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 hover:border-white font-medium backdrop-blur-sm'
                }
              >
                30 Days
              </Button>
              <Button
                onClick={() => setPeriod('90')}
                className={
                  period === '90'
                    ? 'bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg'
                    : 'bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 hover:border-white font-medium backdrop-blur-sm'
                }
              >
                90 Days
              </Button>
            </div>
          </div>
        </div>

        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -ml-32 -mb-32" />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {data.overview.completionRate}%
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {data.overview.completedMarks}/{data.overview.totalMarks} days
                </p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-orange-900 mt-1">
                  {data.overview.currentStreak}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Longest: {data.overview.longestStreak} days
                </p>
              </div>
              <Flame className="w-10 h-10 text-orange-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Total Actions */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Actions Completed</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {data.overview.completedActions}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {data.overview.actionsCompletionRate}% completion
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Active Goals</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {data.overview.activeMonthlyGoals}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {data.overview.activeWeeklyGoals} weekly goals
                </p>
              </div>
              <Target className="w-10 h-10 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                  formatter={(value: any, name: string) => {
                    if (name === 'completionRate') return [`${value}%`, 'Completion Rate'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Task Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.taskBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.taskBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => 
                      `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.taskBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No completed tasks yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.heatmapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task List with Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-500" />
              Task Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {data.tasks.map((task) => {
                const taskMarks = data.taskBreakdownData.find((t) => t.name === task.name);
                const completions = taskMarks?.value || 0;

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: task.color }}
                      >
                        {task.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{task.name}</p>
                        <p className="text-sm text-gray-500">{completions} completions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{completions}</div>
                      <div className="text-xs text-gray-500">X marks</div>
                    </div>
                  </div>
                );
              })}
              {data.tasks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No active tasks yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">📊 Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.overview.completionRate >= 80 && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">🎉</div>
              <div>
                <p className="font-semibold text-green-900">Excellent Performance!</p>
                <p className="text-sm text-gray-700">
                  You're maintaining an {data.overview.completionRate}% completion rate. Keep up the
                  amazing work!
                </p>
              </div>
            </div>
          )}

          {data.overview.currentStreak >= 7 && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">🔥</div>
              <div>
                <p className="font-semibold text-orange-900">Streak Master!</p>
                <p className="text-sm text-gray-700">
                  You're on a {data.overview.currentStreak}-day streak! You're building great
                  habits.
                </p>
              </div>
            </div>
          )}

          {data.overview.completionRate < 50 && data.overview.totalMarks > 0 && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">💪</div>
              <div>
                <p className="font-semibold text-blue-900">Room for Growth</p>
                <p className="text-sm text-gray-700">
                  Your completion rate is {data.overview.completionRate}%. Try breaking down tasks
                  into smaller actions for easier wins!
                </p>
              </div>
            </div>
          )}

          {data.heatmapData.some((d) => d.value === 0) && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">📅</div>
              <div>
                <p className="font-semibold text-purple-900">Consistency Opportunity</p>
                <p className="text-sm text-gray-700">
                  Some days have no activity. Try to spread your deep work across the week for
                  better consistency.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

