import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { subDays, format } from "date-fns";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user_id = userData.user.id;
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  try {
    // Fetch all tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user_id)
      .eq("is_active", true);

    if (tasksError) throw tasksError;

    // Fetch daily marks for the period
    const { data: marks, error: marksError } = await supabase
      .from("daily_marks")
      .select("*")
      .eq("user_id", user_id)
      .gte("date", format(startDate, "yyyy-MM-dd"))
      .lte("date", format(endDate, "yyyy-MM-dd"))
      .order("date", { ascending: true });

    if (marksError) throw marksError;

    // Fetch all subtasks for the period
    const { data: subtasks, error: subtasksError } = await supabase
      .from("daily_subtasks")
      .select("*")
      .eq("user_id", user_id)
      .gte("date", format(startDate, "yyyy-MM-dd"))
      .lte("date", format(endDate, "yyyy-MM-dd"));

    if (subtasksError) throw subtasksError;

    // Fetch monthly goals
    const { data: monthlyGoals, error: monthlyGoalsError } = await supabase
      .from("monthly_goals")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "active");

    if (monthlyGoalsError) throw monthlyGoalsError;

    // Fetch weekly goals
    const { data: weeklyGoals, error: weeklyGoalsError } = await supabase
      .from("weekly_goals")
      .select("*")
      .eq("user_id", user_id);

    if (weeklyGoalsError) throw weeklyGoalsError;

    // Calculate statistics
    const totalMarks = marks?.length || 0;
    const completedMarks = marks?.filter((m) => m.completed).length || 0;
    const completionRate =
      totalMarks > 0 ? (completedMarks / totalMarks) * 100 : 0;

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedMarks =
      marks?.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ) || [];

    for (let i = 0; i < sortedMarks.length; i++) {
      if (sortedMarks[i].completed) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i === 0) currentStreak = 0;
        tempStreak = 0;
      }
    }

    // Group marks by date for trend chart
    const dailyData: { [key: string]: { completed: number; total: number } } =
      {};

    // Initialize all days with 0
    for (let i = 0; i <= days; i++) {
      const date = format(subDays(endDate, days - i), "yyyy-MM-dd");
      dailyData[date] = { completed: 0, total: 0 };
    }

    // Fill in actual data
    marks?.forEach((mark) => {
      if (dailyData[mark.date]) {
        dailyData[mark.date].total++;
        if (mark.completed) {
          dailyData[mark.date].completed++;
        }
      }
    });

    const trendData = Object.entries(dailyData).map(([date, data]) => ({
      date,
      completionRate:
        data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      completed: data.completed,
      total: data.total,
    }));

    // Group marks by task for breakdown
    const taskBreakdown: { [key: string]: number } = {};
    marks
      ?.filter((m) => m.completed)
      .forEach((mark) => {
        const task = tasks?.find((t) => t.id === mark.task_id);
        if (task) {
          taskBreakdown[task.name] = (taskBreakdown[task.name] || 0) + 1;
        }
      });

    const taskBreakdownData = Object.entries(taskBreakdown).map(
      ([name, count]) => ({
        name,
        value: count,
      })
    );

    // Calculate weekly activity (for heatmap)
    const weeklyActivity: { [key: string]: number } = {};
    marks
      ?.filter((m) => m.completed)
      .forEach((mark) => {
        const dayOfWeek = new Date(mark.date).getDay(); // 0 = Sunday
        weeklyActivity[dayOfWeek] = (weeklyActivity[dayOfWeek] || 0) + 1;
      });

    const heatmapData = [
      { day: "Sun", value: weeklyActivity[0] || 0 },
      { day: "Mon", value: weeklyActivity[1] || 0 },
      { day: "Tue", value: weeklyActivity[2] || 0 },
      { day: "Wed", value: weeklyActivity[3] || 0 },
      { day: "Thu", value: weeklyActivity[4] || 0 },
      { day: "Fri", value: weeklyActivity[5] || 0 },
      { day: "Sat", value: weeklyActivity[6] || 0 },
    ];

    // Calculate total actions and completion
    const totalActions = subtasks?.length || 0;
    const completedActions = subtasks?.filter((s) => s.completed).length || 0;
    const actionsCompletionRate =
      totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

    // Calculate goal progress
    const activeMonthlyGoals = monthlyGoals?.length || 0;
    const activeWeeklyGoals = weeklyGoals?.length || 0;

    return NextResponse.json({
      data: {
        overview: {
          totalMarks,
          completedMarks,
          completionRate: Math.round(completionRate),
          currentStreak,
          longestStreak,
          totalActions,
          completedActions,
          actionsCompletionRate: Math.round(actionsCompletionRate),
          activeTasks: tasks?.length || 0,
          activeMonthlyGoals,
          activeWeeklyGoals,
        },
        trendData,
        taskBreakdownData,
        heatmapData,
        tasks: tasks || [],
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
