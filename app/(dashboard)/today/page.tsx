"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  Target,
  TrendingUp,
  Flame,
  ChevronRight,
} from "lucide-react";
import type { Task, DailySubtask, WeeklyGoal, MonthlyGoal } from "@/types";
import { getToday } from "@/lib/utils";

interface TodayTaskData {
  task: Task;
  monthlyGoals: MonthlyGoal[];
  weeklyGoalsGrouped: {
    [monthlyGoalId: string]: WeeklyGoal[];
  };
  subtasksGrouped: {
    [weeklyGoalId: string]: DailySubtask[];
  };
}

export default function TodayPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasksData, setTasksData] = useState<TodayTaskData[]>([]);
  const [newSubtask, setNewSubtask] = useState<{
    [weeklyGoalId: string]: string;
  }>({});
  const today = getToday();

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const tasksResponse = await fetch("/api/tasks");
      const tasksResult = await tasksResponse.json();
      const tasks: Task[] = tasksResult.data || [];

      const todayData: TodayTaskData[] = await Promise.all(
        tasks.map(async (task) => {
          const monthlyGoalResponse = await fetch(
            `/api/goals/monthly?task_id=${task.id}&status=active`
          );
          const monthlyGoalResult = await monthlyGoalResponse.json();
          const monthlyGoals: MonthlyGoal[] = monthlyGoalResult.data || [];

          const weeklyGoalsGrouped: { [monthlyGoalId: string]: WeeklyGoal[] } =
            {};

          for (const monthlyGoal of monthlyGoals) {
            const weeklyGoalResponse = await fetch(
              `/api/goals/weekly?monthly_goal_id=${monthlyGoal.id}`
            );
            const weeklyGoalResult = await weeklyGoalResponse.json();
            const allWeeklyGoals: WeeklyGoal[] = weeklyGoalResult.data || [];

            const thisWeekGoals = allWeeklyGoals.filter(
              (wg) => today >= wg.week_start_date && today <= wg.week_end_date
            );

            if (thisWeekGoals.length > 0) {
              weeklyGoalsGrouped[monthlyGoal.id] = thisWeekGoals;
            }
          }

          const subtasksResponse = await fetch(
            `/api/subtasks?task_id=${task.id}&date=${today}`
          );
          const subtasksResult = await subtasksResponse.json();
          const allSubtasks: DailySubtask[] = subtasksResult.data || [];

          const subtasksGrouped: { [weeklyGoalId: string]: DailySubtask[] } =
            {};
          allSubtasks.forEach((subtask) => {
            if (subtask.weekly_goal_id) {
              if (!subtasksGrouped[subtask.weekly_goal_id]) {
                subtasksGrouped[subtask.weekly_goal_id] = [];
              }
              subtasksGrouped[subtask.weekly_goal_id].push(subtask);
            }
          });

          return {
            task,
            monthlyGoals,
            weeklyGoalsGrouped,
            subtasksGrouped,
          };
        })
      );

      setTasksData(todayData);
    } catch (error) {
      console.error("Error fetching today data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubtask = async (taskId: string, weeklyGoalId: string) => {
    const title = newSubtask[weeklyGoalId]?.trim();
    if (!title) return;

    try {
      const response = await fetch("/api/subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: taskId,
          weekly_goal_id: weeklyGoalId,
          date: today,
          subtask_title: title,
        }),
      });

      if (response.ok) {
        setNewSubtask({ ...newSubtask, [weeklyGoalId]: "" });
        fetchTodayData();
      }
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const handleToggleSubtask = async (subtask: DailySubtask) => {
    try {
      const response = await fetch(`/api/subtasks/${subtask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !subtask.completed,
        }),
      });

      if (response.ok) {
        await fetchTodayData();
        await checkAndMarkDayComplete(subtask.task_id);
      }
    } catch (error) {
      console.error("Error toggling subtask:", error);
    }
  };

  const checkAndMarkDayComplete = async (taskId: string) => {
    try {
      const response = await fetch(
        `/api/subtasks?task_id=${taskId}&date=${today}`
      );
      const result = await response.json();
      const taskSubtasks: DailySubtask[] = result.data || [];

      const allCompleted =
        taskSubtasks.length > 0 && taskSubtasks.every((st) => st.completed);

      await fetch("/api/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: taskId,
          date: today,
          completed: allCompleted,
        }),
      });
    } catch (error) {
      console.error("Error marking day:", error);
    }
  };

  // Calculate overall stats
  const calculateStats = () => {
    let totalActions = 0;
    let completedActions = 0;
    let totalMonthlyGoals = 0;
    let totalWeeklyGoals = 0;

    tasksData.forEach(
      ({ monthlyGoals, weeklyGoalsGrouped, subtasksGrouped }) => {
        totalMonthlyGoals += monthlyGoals.length;

        Object.values(weeklyGoalsGrouped).forEach((goals) => {
          totalWeeklyGoals += goals.length;
        });

        Object.values(subtasksGrouped).forEach((subtasks) => {
          totalActions += subtasks.length;
          completedActions += subtasks.filter((s) => s.completed).length;
        });
      }
    );

    return {
      totalActions,
      completedActions,
      totalMonthlyGoals,
      totalWeeklyGoals,
      completionRate:
        totalActions > 0
          ? Math.round((completedActions / totalActions) * 100)
          : 0,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Hero Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8">
          <div className="skeleton h-10 w-64 mb-4 bg-white/20" />
          <div className="skeleton h-6 w-48 bg-white/20" />
        </div>

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                  <div className="skeleton h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                  <div className="skeleton h-3 w-32 bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="skeleton h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Task Cards Skeleton */}
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="skeleton h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-6 w-40 bg-gray-200 dark:bg-gray-700" />
                  <div className="skeleton h-4 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-16 w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
                <div className="skeleton h-16 w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Today&apos;s Focus</h1>
              <p className="text-blue-100 flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                {new Date(today).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{stats.completionRate}%</div>
              <div className="text-blue-100">Completed</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -ml-32 -mb-32" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Monthly Goals
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {stats.totalMonthlyGoals}
                </p>
              </div>
              <Target className="w-10 h-10 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">This Week</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {stats.totalWeeklyGoals}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {stats.completedActions}/{stats.totalActions}
                </p>
              </div>
              <CheckSquare className="w-10 h-10 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Energy</p>
                <p className="text-3xl font-bold text-orange-900 mt-1">
                  {stats.completionRate > 75
                    ? "🔥"
                    : stats.completionRate > 50
                    ? "💪"
                    : stats.completionRate > 25
                    ? "⚡"
                    : "🌱"}
                </p>
              </div>
              <Flame className="w-10 h-10 text-orange-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks with Tree Structure */}
      {tasksData.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Create your first task to start tracking your deep work progress.
            </p>
            <Button
              onClick={() => router.push("/tasks/new")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {tasksData.map(
            ({ task, monthlyGoals, weeklyGoalsGrouped, subtasksGrouped }) => (
              <Card
                key={task.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2"
                style={{ borderColor: task.color + "40" }}
              >
                {/* Task Header */}
                <div
                  className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
                  style={{
                    background: `linear-gradient(135deg, ${task.color}15 0%, ${task.color}05 100%)`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {task.name}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/tasks/${task.id}/goals`)}
                      className="ml-auto"
                    >
                      Manage Goals
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  {monthlyGoals.length > 0 ? (
                    <div className="space-y-6">
                      {monthlyGoals.map((monthlyGoal) => {
                        const weeklyGoals =
                          weeklyGoalsGrouped[monthlyGoal.id] || [];

                        return (
                          <div key={monthlyGoal.id} className="space-y-4">
                            {/* Monthly Goal */}
                            <div className="flex items-center gap-3 pb-3 border-b-2 border-dashed border-gray-200 dark:border-gray-700">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                M
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                  {monthlyGoal.goal_title}
                                </h3>
                                {monthlyGoal.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {monthlyGoal.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Progress
                                </div>
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {monthlyGoal.progress_percentage}%
                                </div>
                              </div>
                            </div>

                            {/* Show reminder if no weekly goals for this week */}
                            {weeklyGoals.length === 0 ? (
                              <div className="ml-8 p-6 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                                    <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                      No weekly goals for this week yet
                                    </h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                                      Plan your weekly goals to break down this
                                      monthly goal into actionable steps for
                                      this week.
                                    </p>
                                    <Button
                                      onClick={() =>
                                        router.push(`/tasks/${task.id}/goals`)
                                      }
                                      size="sm"
                                      className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Plan Weekly Goals
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Weekly Goals
                              <div className="ml-8 space-y-5">
                                {weeklyGoals.map((weeklyGoal) => {
                                  const subtasks =
                                    subtasksGrouped[weeklyGoal.id] || [];
                                  const completedCount = subtasks.filter(
                                    (s) => s.completed
                                  ).length;
                                  const progress =
                                    subtasks.length > 0
                                      ? (completedCount / subtasks.length) * 100
                                      : 0;

                                  return (
                                    <div
                                      key={weeklyGoal.id}
                                      className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-300 transition-all"
                                    >
                                      {/* Progress Bar Background */}
                                      <div
                                        className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 transition-opacity"
                                        style={{
                                          opacity: progress > 0 ? 0.5 : 0,
                                          width: `${progress}%`,
                                        }}
                                      />

                                      <div className="relative p-5">
                                        {/* Weekly Goal Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                                            W
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">
                                              {weeklyGoal.goal_title}
                                            </h4>
                                          </div>
                                          <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-gray-600">
                                              {completedCount}/{subtasks.length}
                                            </span>
                                            {progress === 100 && (
                                              <span className="text-green-600 font-bold">
                                                ✓
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        {/* Today's Actions */}
                                        <div className="space-y-2 ml-8">
                                          {subtasks.map((subtask) => (
                                            <div
                                              key={subtask.id}
                                              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
                                            >
                                              <button
                                                onClick={() =>
                                                  handleToggleSubtask(subtask)
                                                }
                                                className="shrink-0 transition-transform group-hover:scale-110"
                                              >
                                                {subtask.completed ? (
                                                  <CheckSquare className="w-6 h-6 text-green-600" />
                                                ) : (
                                                  <Square className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                                                )}
                                              </button>
                                              <span
                                                className={`flex-1 ${
                                                  subtask.completed
                                                    ? "line-through text-gray-500"
                                                    : "text-gray-900"
                                                }`}
                                              >
                                                {subtask.subtask_title}
                                              </span>
                                            </div>
                                          ))}

                                          {/* Add Action Input */}
                                          <div className="flex gap-2 pt-2">
                                            <Input
                                              placeholder={`✨ Add action...`}
                                              value={
                                                newSubtask[weeklyGoal.id] || ""
                                              }
                                              onChange={(e) =>
                                                setNewSubtask({
                                                  ...newSubtask,
                                                  [weeklyGoal.id]:
                                                    e.target.value,
                                                })
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  handleAddSubtask(
                                                    task.id,
                                                    weeklyGoal.id
                                                  );
                                                }
                                              }}
                                              className="flex-1 border-dashed"
                                            />
                                            <Button
                                              onClick={() =>
                                                handleAddSubtask(
                                                  task.id,
                                                  weeklyGoal.id
                                                )
                                              }
                                              size="sm"
                                              disabled={
                                                !newSubtask[
                                                  weeklyGoal.id
                                                ]?.trim()
                                              }
                                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            >
                                              <Plus className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">
                        No goals set for this task
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/tasks/${task.id}/goals`)}
                      >
                        Set Goals →
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}

      {/* Motivational Footer */}
      {stats.totalActions > 0 && (
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardContent className="p-6 text-center">
            {stats.completionRate === 100 ? (
              <div>
                <p className="text-3xl mb-2">🎉🎉🎉</p>
                <p className="text-xl font-bold">
                  Amazing! You completed everything today!
                </p>
                <p className="text-gray-400 mt-2">
                  You&apos;re building incredible momentum. Keep it up!
                </p>
              </div>
            ) : stats.completionRate >= 75 ? (
              <div>
                <p className="text-3xl mb-2">🔥</p>
                <p className="text-xl font-bold">
                  You&apos;re on fire! {stats.completionRate}% done!
                </p>
                <p className="text-gray-400 mt-2">
                  Just a few more actions to crush today completely!
                </p>
              </div>
            ) : stats.completionRate >= 50 ? (
              <div>
                <p className="text-3xl mb-2">💪</p>
                <p className="text-xl font-bold">
                  Great progress! {stats.completionRate}% completed!
                </p>
                <p className="text-gray-400 mt-2">
                  You&apos;re past halfway. Keep the momentum going!
                </p>
              </div>
            ) : stats.completionRate > 0 ? (
              <div>
                <p className="text-3xl mb-2">🌱</p>
                <p className="text-xl font-bold">
                  Good start! {stats.completionRate}% done!
                </p>
                <p className="text-gray-400 mt-2">
                  Every action counts. Keep moving forward!
                </p>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">✨</p>
                <p className="text-xl font-bold">Ready to start your day?</p>
                <p className="text-gray-400 mt-2">
                  Begin with one action. Small steps lead to big wins!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
