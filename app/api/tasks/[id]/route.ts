import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/tasks/[id]
 * Get a specific task
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get task
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: task });
  } catch (error) {
    console.error('Error in GET /api/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tasks/[id]
 * Update a task
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, description, target_days_per_week, color, is_active } = body;

    // Build update object
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (target_days_per_week !== undefined) updates.target_days_per_week = target_days_per_week;
    if (color !== undefined) updates.color = color;
    if (is_active !== undefined) updates.is_active = is_active;

    // Validate name if provided
    if (updates.name !== undefined && updates.name === '') {
      return NextResponse.json(
        { error: 'Task name cannot be empty' },
        { status: 400 }
      );
    }

    // Update task
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: task });
  } catch (error) {
    console.error('Error in PATCH /api/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task (soft delete by setting is_active to false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Soft delete task
    const { error: taskError } = await supabase
      .from('tasks')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (taskError) {
      console.error('Error archiving task:', taskError);
      return NextResponse.json(
        { error: 'Failed to archive task' },
        { status: 500 }
      );
    }

    // Also mark all associated monthly goals as cancelled
    const { error: goalsError } = await supabase
      .from('monthly_goals')
      .update({ status: 'cancelled' })
      .eq('task_id', id)
      .eq('user_id', user.id)
      .eq('status', 'active'); // Only cancel active goals

    if (goalsError) {
      console.error('Error cancelling monthly goals:', goalsError);
      // Don't fail the entire operation if this fails, just log it
    }

    return NextResponse.json({ message: 'Task archived successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/tasks/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

