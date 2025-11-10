"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import type { Task, DailyMark } from "@/types";

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [marks, setMarks] = useState<{ [key: string]: DailyMark[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      // Fetch all tasks
      const tasksResponse = await fetch("/api/tasks");
      const tasksResult = await tasksResponse.json();
      setTasks(tasksResult.data || []);

      // Fetch marks for current month
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${new Date(
        year,
        currentDate.getMonth() + 1,
        0
      ).getDate()}`;

      const marksResponse = await fetch(
        `/api/marks?start_date=${startDate}&end_date=${endDate}`
      );
      const marksResult = await marksResponse.json();

      // Group marks by date
      const groupedMarks: { [key: string]: DailyMark[] } = {};
      (marksResult.data || []).forEach((mark: DailyMark) => {
        if (!groupedMarks[mark.date]) {
          groupedMarks[mark.date] = [];
        }
        groupedMarks[mark.date].push(mark);
      });

      setMarks(groupedMarks);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getMarksForDate = (date: Date | null): DailyMark[] => {
    if (!date) return [];
    const dateStr = formatDate(date);
    return marks[dateStr] || [];
  };

  const hasCompletedTasks = (date: Date | null): boolean => {
    const dayMarks = getMarksForDate(date);
    return dayMarks.some((mark) => mark.completed);
  };

  const calculateStreak = (): number => {
    const today = new Date();
    let streak = 0;
    const checkDate = new Date(today);

    while (true) {
      const dateStr = formatDate(checkDate);
      const dayMarks = marks[dateStr] || [];
      const hasCompleted = dayMarks.some((mark) => mark.completed);

      if (!hasCompleted) {
        break;
      }

      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  const days = getDaysInMonth();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-9 w-80 mb-2 bg-gray-300 dark:bg-gray-700" />
            <div className="skeleton h-5 w-64 bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Streak Card Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="skeleton h-8 w-8 rounded-full bg-white/20" />
              <div>
                <div className="skeleton h-5 w-32 mb-2 bg-white/20" />
                <div className="skeleton h-9 w-24 bg-white/20" />
              </div>
            </div>
            <div className="skeleton h-10 w-32 rounded-lg bg-white/30" />
          </div>
        </div>

        {/* Calendar Skeleton */}
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="skeleton h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="skeleton h-7 w-40 bg-gray-200 dark:bg-gray-700" />
            <div className="skeleton h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-24 rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            Calendar
          </h1>
          <p className="text-gray-600 mt-1">Track your deep work progress</p>
        </div>
        <Button onClick={goToToday} variant="outline">
          Today
        </Button>
      </div>

      {/* Streak Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Streak</p>
              <p className="text-4xl font-bold">{calculateStreak()} days</p>
            </div>
            <div className="text-6xl">🔥</div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((date, index) => {
              const dateMarks = getMarksForDate(date);
              const completed = hasCompletedTasks(date);
              const today = isToday(date);

              return (
                <div
                  key={index}
                  className={`
                    relative aspect-square p-2 border rounded-lg text-center
                    ${!date ? "bg-gray-50" : "hover:bg-gray-50 cursor-pointer"}
                    ${today ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                    ${
                      completed
                        ? "bg-green-50 border-green-500"
                        : "border-gray-200"
                    }
                  `}
                  onClick={() => {
                    if (date) {
                      // TODO: Open day details modal
                      console.log("Clicked:", formatDate(date));
                    }
                  }}
                >
                  {date && (
                    <>
                      <div
                        className={`text-sm font-medium ${
                          today ? "text-blue-600" : "text-gray-700"
                        }`}
                      >
                        {date.getDate()}
                      </div>

                      {/* X Mark for completed days */}
                      {completed && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl font-bold text-green-600">
                            ✕
                          </div>
                        </div>
                      )}

                      {/* Dot indicators for tasks */}
                      {dateMarks.length > 0 && (
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                          {dateMarks.slice(0, 3).map((mark, i) => {
                            const task = tasks.find(
                              (t) => t.id === mark.task_id
                            );
                            return (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor: task?.color || "#gray",
                                }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-blue-500 rounded bg-blue-50" />
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-green-500 rounded bg-green-50 flex items-center justify-center">
                <span className="text-green-600 font-bold">✕</span>
              </div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-gray-200 rounded" />
              <span className="text-gray-600">Not completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
