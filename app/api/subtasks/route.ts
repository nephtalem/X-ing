import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/subtasks
 * Get daily subtasks
 * Query params:
 *   - date: Get subtasks for specific date (YYYY-MM-DD)
 *   - task_id: Get subtasks for specific task
 *   - weekly_goal_id: Get subtasks for specific weekly goal
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const taskId = searchParams.get("task_id");
    const weeklyGoalId = searchParams.get("weekly_goal_id");

    // Build query
    let query = supabase
      .from("daily_subtasks")
      .select("*")
      .eq("user_id", user.id);

    // Filter by date if provided
    if (date) {
      query = query.eq("date", date);
    }

    // Filter by task if provided
    if (taskId) {
      query = query.eq("task_id", taskId);
    }

    // Filter by weekly goal if provided
    if (weeklyGoalId) {
      query = query.eq("weekly_goal_id", weeklyGoalId);
    }

    // Order by date and creation time
    query = query.order("date", { ascending: false }).order("created_at", {
      ascending: true,
    });

    const { data: subtasks, error } = await query;

    if (error) {
      console.error("Error fetching subtasks:", error);
      return NextResponse.json(
        { error: "Failed to fetch subtasks" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: subtasks });
  } catch (error) {
    console.error("Error in GET /api/subtasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subtasks
 * Create a new daily subtask
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      task_id,
      weekly_goal_id,
      date,
      subtask_title,
      description,
      estimated_duration,
    } = body;

    // Validate required fields
    if (!task_id || !date || !subtask_title) {
      return NextResponse.json(
        { error: "task_id, date, and subtask_title are required" },
        { status: 400 }
      );
    }

    // Verify task belongs to user
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", task_id)
      .eq("user_id", user.id)
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }

    // Create subtask
    const { data: subtask, error } = await supabase
      .from("daily_subtasks")
      .insert({
        user_id: user.id,
        task_id,
        weekly_goal_id: weekly_goal_id || null,
        date,
        subtask_title: subtask_title.trim(),
        description: description?.trim() || null,
        estimated_duration: estimated_duration || null,
        completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating subtask:", error);
      return NextResponse.json(
        { error: "Failed to create subtask" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: subtask }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/subtasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

