import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PATCH /api/goals/weekly/[id]
 * Update a weekly goal
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

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
    const { goal_title, description, completed } = body;

    // Build update object
    const updates: any = {};
    if (goal_title !== undefined) updates.goal_title = goal_title.trim();
    if (description !== undefined)
      updates.description = description?.trim() || null;
    if (completed !== undefined) updates.completed = completed;

    // Validate goal_title if provided
    if (updates.goal_title !== undefined && updates.goal_title === "") {
      return NextResponse.json(
        { error: "Goal title cannot be empty" },
        { status: 400 }
      );
    }

    // Update weekly goal
    const { data: goal, error } = await supabase
      .from("weekly_goals")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating weekly goal:", error);
      return NextResponse.json(
        { error: "Failed to update weekly goal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: goal });
  } catch (error) {
    console.error("Error in PATCH /api/goals/weekly/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/goals/weekly/[id]
 * Delete a weekly goal
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete weekly goal
    const { error } = await supabase
      .from("weekly_goals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting weekly goal:", error);
      return NextResponse.json(
        { error: "Failed to delete weekly goal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Weekly goal deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/goals/weekly/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

