# X-ing Deep Work Accountability System

## Overview

A modern web application that helps users maintain deep work accountability by marking daily progress ("X-ing") on tasks, visualizing completion patterns, and reviewing performance over time. The system uses a hierarchical goal structure: Monthly Goals → Weekly Goals → Daily Sub-tasks, ensuring alignment between daily work and bigger objectives.

## Concept Origin

Inspired by Cal Newport's "Deep Work" book, this system recognizes that deep work requires routine and accountability. By marking an "X" every day you complete your deep work session, you create a visual chain of progress that motivates continued effort.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Backend**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL (via Supabase for easy cloud hosting + auth)
- **Authentication**: Supabase Auth
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for performance graphs
- **Deployment**: Vercel (frontend) + Supabase (backend/db)

## Core Features

### 1. Authentication System

- Sign up / Login / Logout
- Protected routes for authenticated users
- User session management
- Password reset functionality
- Multi-user support (scalable to 10+ users initially)

### 2. Task Management (Deep Work Areas)

- Create deep work tasks (e.g., "Learn Guitar", "Build Programming Skills")
- Edit task details (name, description, target days per week)
- Delete tasks
- View all user's tasks on dashboard
- Each task represents a major area requiring deep work

### 3. Goal Hierarchy System

#### Monthly Goals

- Set monthly goal for each task (e.g., "Complete React Advanced Concepts course")
- Define success criteria and target completion date
- Track progress percentage toward monthly goal
- Visual progress indicator on dashboard
- One active monthly goal per task at a time

#### Weekly Goals

- Break down monthly goals into weekly milestones
- Each week has specific goals that contribute to the monthly goal
- Example: Monthly = "Complete React Course" → Week 1 = "Master React Hooks"
- Mark weekly goals as completed
- View current week's goals across all tasks
- Automatic progression to next week's goals

#### Daily Sub-tasks

- Plan daily sub-tasks that align with current weekly goal
- Granular, actionable items (e.g., "Watch video on useState - 1 hour", "Build practice project")
- Check off sub-tasks as you complete them
- Multiple sub-tasks per task per day
- Add sub-tasks on the fly during the day
- Optional: estimated duration for time tracking

### 4. Daily Planning & Marking

- Daily view showing all tasks for today with their sub-tasks
- Add/edit daily sub-tasks for each deep work area
- Mark individual sub-tasks as completed throughout the day
- Mark the entire task day as "X" (completed) when daily work is done
- Simple interface for quick sub-task entry
- View connection: daily sub-tasks → weekly goal → monthly goal
- Visual hierarchy showing alignment

### 5. Calendar Visualization

- Monthly calendar view per task
- Visual "X" marks on completed days
- See your completion streak (current and longest)
- Hover to see what sub-tasks were completed that day
- Quick overview of all tasks' calendars
- Monthly goal progress indicator on calendar
- Navigation between months
- Color coding for completion levels

### 6. Progress Analytics

- Weekly review: completion rate per task, sub-tasks completed vs planned
- Monthly goal progress tracking with timeline
- Performance graphs: track consistency over time (30/60/90 days)
- Streak tracking (current streak, longest streak)
- Goal alignment view: how daily work connects to weekly/monthly goals
- Overall statistics dashboard
- Completion patterns (best days, typical completion rate)
- Success metrics per task

## Database Schema

### Users Table

```sql
- id (UUID, primary key)
- email (unique, not null)
- password_hash (not null)
- name (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tasks Table

```sql
- id (UUID, primary key)
- user_id (UUID, foreign key → users.id)
- name (text, not null)
- description (text)
- target_days_per_week (integer, default 5)
- color (text, for UI)
- is_active (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

### Monthly_Goals Table

```sql
- id (UUID, primary key)
- task_id (UUID, foreign key → tasks.id)
- user_id (UUID, foreign key → users.id)
- goal_title (text, not null)
- description (text)
- target_date (date)
- progress_percentage (integer, 0-100)
- month_year (text, e.g., "2025-01")
- status (enum: active, completed, cancelled)
- created_at (timestamp)
- updated_at (timestamp)
```

### Weekly_Goals Table

```sql
- id (UUID, primary key)
- monthly_goal_id (UUID, foreign key → monthly_goals.id)
- task_id (UUID, foreign key → tasks.id)
- user_id (UUID, foreign key → users.id)
- goal_title (text, not null)
- description (text)
- week_start_date (date)
- week_end_date (date)
- completed (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)
```

### Daily_Subtasks Table

```sql
- id (UUID, primary key)
- task_id (UUID, foreign key → tasks.id)
- weekly_goal_id (UUID, foreign key → weekly_goals.id, nullable)
- user_id (UUID, foreign key → users.id)
- date (date, not null)
- subtask_title (text, not null)
- description (text)
- completed (boolean, default false)
- estimated_duration (integer, minutes)
- completed_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

### Daily_Marks Table

```sql
- id (UUID, primary key)
- task_id (UUID, foreign key → tasks.id)
- user_id (UUID, foreign key → users.id)
- date (date, not null, unique per task+user+date)
- completed (boolean, default false)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

## Project Structure

```
xing/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx (protected layout with nav)
│   │   ├── page.tsx (main dashboard - overview)
│   │   ├── tasks/
│   │   │   ├── page.tsx (task list & management)
│   │   │   ├── new/
│   │   │   │   └── page.tsx (create new task)
│   │   │   └── [id]/
│   │   │       ├── page.tsx (task detail)
│   │   │       └── goals/
│   │   │           └── page.tsx (manage monthly/weekly goals)
│   │   ├── today/
│   │   │   └── page.tsx (daily marking interface)
│   │   ├── calendar/
│   │   │   ├── page.tsx (all calendars overview)
│   │   │   └── [taskId]/
│   │   │       └── page.tsx (single task calendar)
│   │   ├── analytics/
│   │   │   └── page.tsx (progress & performance)
│   │   └── goals/
│   │       └── page.tsx (goal hierarchy view)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...]/route.ts
│   │   ├── tasks/
│   │   │   ├── route.ts (GET, POST)
│   │   │   └── [id]/route.ts (GET, PATCH, DELETE)
│   │   ├── goals/
│   │   │   ├── monthly/route.ts
│   │   │   └── weekly/route.ts
│   │   ├── subtasks/
│   │   │   └── route.ts
│   │   ├── marks/
│   │   │   └── route.ts
│   │   └── analytics/
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── TaskCard.tsx
│   ├── CalendarView.tsx
│   ├── MarkButton.tsx
│   ├── ProgressChart.tsx
│   ├── SubtaskList.tsx
│   ├── GoalHierarchy.tsx
│   ├── StreakCounter.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── api/
│   │   ├── tasks.ts
│   │   ├── goals.ts
│   │   ├── subtasks.ts
│   │   └── marks.ts
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── middleware.ts (auth middleware)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local
```

## Key Implementation Details

### Goal Hierarchy Flow

1. **Setup Phase**:

   - User creates a Task (e.g., "Learn Programming")
   - User sets Monthly Goal (e.g., "Complete React Course")
   - User breaks it into Weekly Goals (Week 1: "Hooks", Week 2: "Context", etc.)

2. **Daily Execution**:

   - User goes to "Today" view
   - Sees all tasks with current week's goal displayed
   - Adds daily sub-tasks aligned with weekly goal
   - Completes sub-tasks throughout the day
   - Marks day as "X" when done

3. **Progress Tracking**:
   - System tracks sub-task completion
   - Weekly goal completion updates monthly progress
   - Calendar shows visual X marks
   - Analytics show alignment and patterns

### Daily Marking Flow

1. User navigates to "Today" view
2. System shows all active tasks with:
   - Current monthly goal
   - Current weekly goal
   - Today's sub-tasks (or option to add)
3. User adds/completes sub-tasks
4. When done, clicks "Mark X" to complete the day
5. Visual feedback (animation, color change)
6. Streak counter updates

### Calendar View

- Grid layout showing month view
- Days with completed tasks show "X" or green highlight
- Hover shows completed sub-tasks for that day
- Streak counter at top
- Monthly goal progress bar
- Navigate between months
- Filter by task

### Analytics Dashboard

- **Overview Cards**: Total tasks, Active streaks, Weekly completion rate, Monthly progress
- **Charts**:
  - Line chart: Completion trend over time
  - Bar chart: Sub-tasks completed per week
  - Heatmap: Best completion days/times
- **Goal Alignment**: Visual showing daily→weekly→monthly connection
- **Per-Task Breakdown**: Individual stats for each deep work area
- **Weekly Review**: "You completed 85% of your planned deep work sessions"

## Design Principles

- **Minimal**: Clean interface, focus on the X-marking action
- **Modern**: Smooth animations, contemporary color palette (blues, greens for completion)
- **Motivating**: Show streaks prominently, celebrate completions with micro-animations
- **Fast**: Optimistic UI updates, instant feedback, no loading spinners for simple actions
- **Mobile-friendly**: Responsive design for marking on-the-go
- **Hierarchy-aware**: Always show context (where am I in my goals?)

## User Experience Flow

### First-Time User

1. Sign up → Welcome screen
2. "Create Your First Deep Work Task"
3. "Set Your Monthly Goal"
4. "Break It Into Weekly Goals"
5. "Add Today's Sub-tasks"
6. Tutorial overlay explaining X-marking

### Daily User

1. Login → Dashboard (shows today's tasks)
2. Quick view of current streaks
3. Click "Today" → See all sub-tasks
4. Complete work → Check off sub-tasks
5. End of day → Mark "X"
6. See satisfying completion animation

### Weekly Review

1. Navigate to Analytics
2. See weekly summary
3. Review goal progress
4. Plan next week's goals
5. Adjust if needed

## Scalability Considerations

- **Security**: Row-level security in Supabase (users can only access their data)
- **Performance**:
  - Indexed queries on user_id, date, task_id
  - Pagination for large datasets
  - Caching for analytics (calculate once daily)
- **API**: Rate limiting per user
- **Database**: Connection pooling, efficient queries
- **Frontend**: Code splitting, lazy loading for charts
- **Growth**: Currently designed for 10 users, can scale to 100+ with same architecture

## Development Phases

### Phase 1: Foundation

- Initialize Next.js project ✅
- Set up Supabase
- Implement authentication
- Create database schema

### Phase 2: Core Features

- Task CRUD operations
- Daily marking system
- Basic calendar view

### Phase 3: Goal Hierarchy

- Monthly goals
- Weekly goals
- Daily sub-tasks
- Goal alignment views

### Phase 4: Analytics & Polish

- Progress tracking
- Charts and graphs
- Streaks
- UI/UX polish
- Animations

### Phase 5: Testing & Deployment

- End-to-end testing
- Performance optimization
- Deploy to Vercel + Supabase

## Success Metrics

- User can mark daily X in < 10 seconds
- Goal hierarchy visible at all times
- 100% data accuracy
- < 2 second page loads
- Mobile responsive on all screens
- Secure multi-user isolation

## Future Enhancements (Post-MVP)

- Team features (share progress)
- Habit reminders/notifications
- Export data (PDF reports)
- Social features (accountability partners)
- AI suggestions for sub-tasks
- Time tracking integration
- Mobile app (React Native)
