# 🗄️ Database Schema

Complete database schema for X-ing with SQL setup scripts.

---

## 📊 Database Overview

X-ing uses PostgreSQL via Supabase with the following tables:

1. **tasks** - Main tasks/projects
2. **monthly_goals** - Monthly goals for each task
3. **weekly_goals** - Weekly goals for each monthly goal
4. **daily_subtasks** - Daily actions for each weekly goal
5. **daily_marks** - Daily completion tracking for calendar

---

## 🔐 Security

All tables use **Row Level Security (RLS)** to ensure users can only access their own data.

---

## 📝 Table Schemas

### 1. Tasks Table

Stores the main tasks/projects users want to work on.

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  task_color VARCHAR(7) DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_is_active ON tasks(is_active);
```

---

### 2. Monthly Goals Table

Stores monthly goals linked to tasks.

```sql
CREATE TABLE monthly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  goal_title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE monthly_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own monthly goals"
  ON monthly_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly goals"
  ON monthly_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly goals"
  ON monthly_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monthly goals"
  ON monthly_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_monthly_goals_user_id ON monthly_goals(user_id);
CREATE INDEX idx_monthly_goals_task_id ON monthly_goals(task_id);
CREATE INDEX idx_monthly_goals_status ON monthly_goals(status);
CREATE INDEX idx_monthly_goals_target_date ON monthly_goals(target_date);
```

---

### 3. Weekly Goals Table

Stores weekly goals linked to monthly goals.

```sql
CREATE TABLE weekly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_goal_id UUID NOT NULL REFERENCES monthly_goals(id) ON DELETE CASCADE,
  goal_title VARCHAR(255) NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own weekly goals"
  ON weekly_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly goals"
  ON weekly_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly goals"
  ON weekly_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly goals"
  ON weekly_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_weekly_goals_user_id ON weekly_goals(user_id);
CREATE INDEX idx_weekly_goals_monthly_goal_id ON weekly_goals(monthly_goal_id);
CREATE INDEX idx_weekly_goals_week_dates ON weekly_goals(week_start_date, week_end_date);
```

---

### 4. Daily Subtasks Table

Stores daily actions linked to weekly goals.

```sql
CREATE TABLE daily_subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  weekly_goal_id UUID REFERENCES weekly_goals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  subtask_title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_subtasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own daily subtasks"
  ON daily_subtasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily subtasks"
  ON daily_subtasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily subtasks"
  ON daily_subtasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily subtasks"
  ON daily_subtasks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_daily_subtasks_user_id ON daily_subtasks(user_id);
CREATE INDEX idx_daily_subtasks_task_id ON daily_subtasks(task_id);
CREATE INDEX idx_daily_subtasks_weekly_goal_id ON daily_subtasks(weekly_goal_id);
CREATE INDEX idx_daily_subtasks_date ON daily_subtasks(date);
CREATE INDEX idx_daily_subtasks_completed ON daily_subtasks(completed);
```

---

### 5. Daily Marks Table

Stores daily completion marks for the calendar view.

```sql
CREATE TABLE daily_marks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE daily_marks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own daily marks"
  ON daily_marks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily marks"
  ON daily_marks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily marks"
  ON daily_marks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily marks"
  ON daily_marks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_daily_marks_user_id ON daily_marks(user_id);
CREATE INDEX idx_daily_marks_date ON daily_marks(date);
CREATE INDEX idx_daily_marks_completed ON daily_marks(completed);
CREATE UNIQUE INDEX idx_daily_marks_user_date ON daily_marks(user_id, date);
```

---

## 🔧 Setup Instructions

### Step 1: Create Tables

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Create a new query
5. Copy and paste the SQL from each table section above
6. Run each query

### Step 2: Verify RLS

1. Go to **Authentication** → **Policies**
2. Verify each table has RLS enabled
3. Verify policies are created for each table

### Step 3: Test the Setup

1. Create a test user via your app
2. Try creating a task
3. Verify data appears in the database
4. Try accessing data from another user (should fail)

---

## 🔍 Database Relationships

```
auth.users (Supabase Auth)
    ↓
tasks (1:N)
    ↓
monthly_goals (1:N)
    ↓
weekly_goals (1:N)
    ↓
daily_subtasks (N:1)

auth.users (Supabase Auth)
    ↓
daily_marks (1:N)
```

---

## 📈 Performance Optimization

### Indexes Created

All critical query paths are indexed:

- User ID lookups (all tables)
- Date range queries (goals, subtasks, marks)
- Status filtering (tasks, monthly_goals)
- Foreign key relationships

### Query Tips

1. **Always filter by user_id** - This uses the index and ensures security
2. **Use date ranges wisely** - Index on date columns for fast lookups
3. **Limit result sets** - Use `.limit()` for large datasets
4. **Use select()** - Only fetch columns you need

---

## 🔄 Automatic Updates

### Updated At Trigger

To automatically update `updated_at` timestamps:

```sql
-- Create function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to each table
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_goals_updated_at
  BEFORE UPDATE ON monthly_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_goals_updated_at
  BEFORE UPDATE ON weekly_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_subtasks_updated_at
  BEFORE UPDATE ON daily_subtasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_marks_updated_at
  BEFORE UPDATE ON daily_marks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🗑️ Soft Delete Pattern

X-ing uses soft deletes for tasks:

- Tasks have an `is_active` field
- Setting `is_active = false` archives the task
- Associated goals are set to `status = 'cancelled'`
- Data is preserved for analytics

---

## 🔒 Security Best Practices

1. **RLS Enabled** - All tables have RLS
2. **User Isolation** - Policies ensure users only see their data
3. **Cascade Deletes** - Foreign keys maintain referential integrity
4. **Check Constraints** - Validate data at database level
5. **Unique Constraints** - Prevent duplicate marks per user per day

---

## 📊 Sample Queries

### Get Today's Tasks with Subtasks

```sql
SELECT 
  t.task_name,
  t.task_color,
  ds.subtask_title,
  ds.completed
FROM tasks t
JOIN daily_subtasks ds ON ds.task_id = t.id
WHERE t.user_id = auth.uid()
  AND t.is_active = true
  AND ds.date = CURRENT_DATE
ORDER BY t.created_at, ds.created_at;
```

### Get Current Streak

```sql
WITH date_series AS (
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '365 days',
    CURRENT_DATE,
    '1 day'::interval
  )::date AS date
),
marks_with_days AS (
  SELECT 
    ds.date,
    COALESCE(dm.completed, false) AS completed
  FROM date_series ds
  LEFT JOIN daily_marks dm ON dm.date = ds.date AND dm.user_id = auth.uid()
  ORDER BY ds.date DESC
)
SELECT COUNT(*) AS current_streak
FROM marks_with_days
WHERE completed = true
  AND date <= CURRENT_DATE;
```

---

## 🎯 Migration Notes

If you need to migrate data or update the schema:

1. **Always backup first** - Use Supabase backup feature
2. **Test on staging** - Create a test project first
3. **Use transactions** - Wrap changes in BEGIN/COMMIT
4. **Verify RLS** - Ensure policies still work after changes

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your database is the foundation of X-ing!** 🏗️✨

