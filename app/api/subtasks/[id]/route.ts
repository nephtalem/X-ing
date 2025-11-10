import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PATCH /api/subtasks/[id]
 * Update a subtask (mainly for marking as completed)
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
    const { subtask_title, description, completed, estimated_duration } = body;

    // Build update object
    const updates: any = {};
    if (subtask_title !== undefined)
      updates.subtask_title = subtask_title.trim();
    if (description !== undefined)
      updates.description = description?.trim() || null;
    if (estimated_duration !== undefined)
      updates.estimated_duration = estimated_duration;

    // Handle completion
    if (completed !== undefined) {
      updates.completed = completed;
      if (completed) {
        updates.completed_at = new Date().toISOString();
      } else {
        updates.completed_at = null;
      }
    }

    // Validate subtask_title if provided
    if (updates.subtask_title !== undefined && updates.subtask_title === "") {
      return NextResponse.json(
        { error: "Subtask title cannot be empty" },
        { status: 400 }
      );
    }

    // Update subtask
    const { data: subtask, error } = await supabase
      .from("daily_subtasks")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating subtask:", error);
      return NextResponse.json(
        { error: "Failed to update subtask" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: subtask });
  } catch (error) {
    console.error("Error in PATCH /api/subtasks/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subtasks/[id]
 * Delete a subtask
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

    // Delete subtask
    const { error } = await supabase
      .from("daily_subtasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting subtask:", error);
      return NextResponse.json(
        { error: "Failed to delete subtask" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/subtasks/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

