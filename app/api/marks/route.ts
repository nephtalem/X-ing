import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/marks - Get marks for a date range
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const taskId = searchParams.get("task_id");

    // Build query
    let query = supabase
      .from("daily_marks")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (startDate) {
      query = query.gte("date", startDate);
    }

    if (endDate) {
      query = query.lte("date", endDate);
    }

    if (taskId) {
      query = query.eq("task_id", taskId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching marks:", error);
      return NextResponse.json(
        { error: "Failed to fetch marks" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in GET /api/marks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/marks - Create or update a daily mark
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { task_id, date, completed, notes } = body;

    // Validate required fields
    if (!task_id || !date) {
      return NextResponse.json(
        { error: "task_id and date are required" },
        { status: 400 }
      );
    }

    // Check if mark already exists
    const { data: existing } = await supabase
      .from("daily_marks")
      .select("*")
      .eq("user_id", user.id)
      .eq("task_id", task_id)
      .eq("date", date)
      .single();

    if (existing) {
      // Update existing mark
      const { data, error } = await supabase
        .from("daily_marks")
        .update({
          completed: completed ?? existing.completed,
          notes: notes ?? existing.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating mark:", error);
        return NextResponse.json(
          { error: "Failed to update mark" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data });
    } else {
      // Create new mark
      const { data, error } = await supabase
        .from("daily_marks")
        .insert({
          user_id: user.id,
          task_id,
          date,
          completed: completed ?? false,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating mark:", error);
        return NextResponse.json(
          { error: "Failed to create mark" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data }, { status: 201 });
    }
  } catch (error) {
    console.error("Error in POST /api/marks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

