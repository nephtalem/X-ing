"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Trash2,
  ChevronRight,
  Target,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import type { Task } from "@/types";
import { toast } from "sonner";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const result = await response.json();

      if (response.ok) {
        setTasks(result.data || []);
      } else {
        setError(result.error || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    setDeletingTaskId(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId));
        toast.success("Task archived successfully", {
          description: "The task has been hidden from your active list.",
        });
      } else {
        const result = await response.json();
        toast.error("Failed to archive task", {
          description: result.error || "Something went wrong.",
        });
      }
    } catch (err) {
      toast.error("Failed to archive task", {
        description: "Please try again later.",
      });
      console.error(err);
    } finally {
      setDeletingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Hero Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="skeleton h-10 w-80 mb-4 bg-white/20" />
              <div className="skeleton h-6 w-96 bg-white/20" />
            </div>
            <div className="skeleton h-12 w-32 rounded-lg bg-white/30" />
          </div>
        </div>

        {/* Task Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="group relative p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 animate-pulse"
            >
              <div className="skeleton h-2 w-full mb-6 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="flex items-start gap-4">
                <div className="skeleton h-12 w-12 rounded-xl bg-gray-300 dark:bg-gray-700" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
                  <div className="skeleton h-4 w-full bg-gray-200 dark:bg-gray-800" />
                  <div className="skeleton h-4 w-2/3 bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <div className="skeleton h-9 w-20 rounded-md bg-gray-200 dark:bg-gray-800" />
                <div className="skeleton h-9 w-20 rounded-md bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Target className="w-10 h-10" />
                Your Deep Work Tasks
              </h1>
              <p className="text-indigo-100 text-lg max-w-2xl">
                Build deep work habits in the areas that matter most to you
              </p>
            </div>
            <Button
              onClick={() => router.push("/tasks/new")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </Button>
          </div>

          {/* Stats */}
          {tasks.length > 0 && (
            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{tasks.length}</div>
                  <div className="text-indigo-100 text-sm">Active Tasks</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {tasks.reduce((sum, t) => sum + t.target_days_per_week, 0)}
                  </div>
                  <div className="text-indigo-100 text-sm">
                    Weekly Target Days
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -ml-32 -mb-32" />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <Target className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No tasks yet
            </h3>
            <p className="text-gray-600 text-center mb-8 max-w-md text-lg">
              Create your first deep work task to start tracking your progress.
              Tasks represent major areas like learning guitar, programming, or
              fitness.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 cursor-pointer"
              style={{ borderColor: task.color + "40" }}
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              {/* Colored Top Bar */}
              <div className="h-2" style={{ backgroundColor: task.color }} />

              {/* Card Content */}
              <CardContent className="p-6">
                {/* Task Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      style={{ backgroundColor: task.color }}
                    >
                      {task.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {task.name}
                      </h3>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Weekly Target
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {task.target_days_per_week} days
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tasks/${task.id}`);
                    }}
                  >
                    Edit Task
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        disabled={deletingTaskId === task.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <AlertDialogTitle className="text-left">
                            Archive Task?
                          </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-left">
                          Are you sure you want to archive{" "}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            &quot;{task.name}&quot;
                          </span>
                          ?
                          <br />
                          <br />
                          <span className="text-amber-600 dark:text-amber-400">
                            📦 This task will be hidden from your active tasks
                            list. All associated goals, subtasks, and progress
                            will be preserved in the database but won&apos;t be
                            visible.
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task.id);
                          }}
                          disabled={deletingTaskId === task.id}
                          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                        >
                          {deletingTaskId === task.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Archiving...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Archive Task
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* View Goals Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-blue-600 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/tasks/${task.id}/goals`);
                  }}
                >
                  Manage Goals →
                </Button>
              </CardContent>

              {/* Hover Gradient Effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${task.color} 0%, transparent 100%)`,
                }}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Help Card */}
      {tasks.length > 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  💡 Pro Tip: Set Clear Goals
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Each task can have multiple monthly goals, weekly goals, and
                  daily actions. Click &quot;Manage Goals&quot; on any task to
                  set up your goal hierarchy and start tracking progress!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
