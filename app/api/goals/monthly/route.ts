import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonthYear } from "@/lib/utils";

/**
 * GET /api/goals/monthly
 * Get monthly goals
 * Query params:
 *   - task_id: Get goals for specific task
 *   - status: Filter by status (active, completed, cancelled)
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
    const taskId = searchParams.get("task_id");
    const status = searchParams.get("status");

    // Build query
    let query = supabase
      .from("monthly_goals")
      .select("*")
      .eq("user_id", user.id);

    // Filter by task if provided
    if (taskId) {
      query = query.eq("task_id", taskId);
    }

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Order by most recent
    query = query.order("created_at", { ascending: false });

    const { data: goals, error } = await query;

    if (error) {
      console.error("Error fetching monthly goals:", error);
      return NextResponse.json(
        { error: "Failed to fetch monthly goals" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: goals });
  } catch (error) {
    console.error("Error in GET /api/goals/monthly:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/goals/monthly
 * Create a new monthly goal
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
    const { task_id, goal_title, description, target_date, month_year } = body;

    // Validate required fields
    if (!task_id || !goal_title) {
      return NextResponse.json(
        { error: "task_id and goal_title are required" },
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

    // Create monthly goal
    const { data: goal, error } = await supabase
      .from("monthly_goals")
      .insert({
        user_id: user.id,
        task_id,
        goal_title: goal_title.trim(),
        description: description?.trim() || null,
        target_date: target_date || null,
        month_year: month_year || getCurrentMonthYear(),
        progress_percentage: 0,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating monthly goal:", error);
      return NextResponse.json(
        { error: "Failed to create monthly goal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: goal }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/goals/monthly:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
