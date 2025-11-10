import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/goals/weekly
 * Get weekly goals
 * Query params:
 *   - monthly_goal_id: Get goals for specific monthly goal
 *   - task_id: Get goals for specific task
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const monthlyGoalId = searchParams.get('monthly_goal_id');
    const taskId = searchParams.get('task_id');

    // Build query
    let query = supabase
      .from('weekly_goals')
      .select('*')
      .eq('user_id', user.id);

    // Filter by monthly goal if provided
    if (monthlyGoalId) {
      query = query.eq('monthly_goal_id', monthlyGoalId);
    }

    // Filter by task if provided
    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    // Order by week start date
    query = query.order('week_start_date', { ascending: true });

    const { data: goals, error } = await query;

    if (error) {
      console.error('Error fetching weekly goals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch weekly goals' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: goals });
  } catch (error) {
    console.error('Error in GET /api/goals/weekly:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/goals/weekly
 * Create weekly goal(s)
 * Can create multiple at once for monthly planning
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
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
    
    // Support both single and batch creation
    const goals = Array.isArray(body) ? body : [body];

    // Validate all goals
    for (const goal of goals) {
      if (!goal.monthly_goal_id || !goal.task_id || !goal.goal_title || !goal.week_start_date || !goal.week_end_date) {
        return NextResponse.json(
          { error: 'monthly_goal_id, task_id, goal_title, week_start_date, and week_end_date are required for all goals' },
          { status: 400 }
        );
      }
    }

    // Prepare data for insertion
    const goalsToInsert = goals.map(goal => ({
      user_id: user.id,
      monthly_goal_id: goal.monthly_goal_id,
      task_id: goal.task_id,
      goal_title: goal.goal_title.trim(),
      description: goal.description?.trim() || null,
      week_start_date: goal.week_start_date,
      week_end_date: goal.week_end_date,
      completed: false,
    }));

    // Insert weekly goals
    const { data: createdGoals, error } = await supabase
      .from('weekly_goals')
      .insert(goalsToInsert)
      .select();

    if (error) {
      console.error('Error creating weekly goals:', error);
      return NextResponse.json(
        { error: 'Failed to create weekly goals' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: createdGoals }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/goals/weekly:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

