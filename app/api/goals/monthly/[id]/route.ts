import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/goals/monthly/[id]
 * Get a specific monthly goal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get monthly goal
    const { data: goal, error } = await supabase
      .from('monthly_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching monthly goal:', error);
      return NextResponse.json(
        { error: 'Monthly goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: goal });
  } catch (error) {
    console.error('Error in GET /api/goals/monthly/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/goals/monthly/[id]
 * Update a monthly goal
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      goal_title, 
      description, 
      target_date, 
      progress_percentage,
      status 
    } = body;

    // Build update object
    const updates: any = {};
    if (goal_title !== undefined) updates.goal_title = goal_title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (target_date !== undefined) updates.target_date = target_date;
    if (progress_percentage !== undefined) updates.progress_percentage = progress_percentage;
    if (status !== undefined) updates.status = status;

    // Validate goal_title if provided
    if (updates.goal_title !== undefined && updates.goal_title === '') {
      return NextResponse.json(
        { error: 'Goal title cannot be empty' },
        { status: 400 }
      );
    }

    // Update monthly goal
    const { data: goal, error } = await supabase
      .from('monthly_goals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating monthly goal:', error);
      return NextResponse.json(
        { error: 'Failed to update monthly goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: goal });
  } catch (error) {
    console.error('Error in PATCH /api/goals/monthly/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/goals/monthly/[id]
 * Delete a monthly goal
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete monthly goal (this will cascade to weekly goals and subtasks)
    const { error } = await supabase
      .from('monthly_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting monthly goal:', error);
      return NextResponse.json(
        { error: 'Failed to delete monthly goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Monthly goal deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/goals/monthly/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

