# X-ing Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works!)

## Step 1: Clone and Install

```bash
cd xing
npm install
```

## Step 2: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the database to be provisioned (~2 minutes)
4. Go to Project Settings → API
5. Copy your Project URL and anon/public key

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL (for development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** Replace `your_supabase_project_url` and `your_supabase_anon_key` with actual values from your Supabase project!

## Step 4: Create Database Schema

Go to your Supabase project → SQL Editor and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth, but we can extend it)
-- Supabase automatically creates auth.users table

-- Tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_days_per_week INTEGER DEFAULT 5,
  color TEXT DEFAULT '#3b82f6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Monthly Goals table
CREATE TABLE public.monthly_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  month_year TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Weekly Goals table
CREATE TABLE public.weekly_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  monthly_goal_id UUID NOT NULL REFERENCES public.monthly_goals(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_title TEXT NOT NULL,
  description TEXT,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Daily Subtasks table
CREATE TABLE public.daily_subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  weekly_goal_id UUID REFERENCES public.weekly_goals(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  subtask_title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  estimated_duration INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Daily Marks table
CREATE TABLE public.daily_marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(task_id, user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_is_active ON public.tasks(is_active);

CREATE INDEX idx_monthly_goals_task_id ON public.monthly_goals(task_id);
CREATE INDEX idx_monthly_goals_user_id ON public.monthly_goals(user_id);
CREATE INDEX idx_monthly_goals_status ON public.monthly_goals(status);

CREATE INDEX idx_weekly_goals_monthly_goal_id ON public.weekly_goals(monthly_goal_id);
CREATE INDEX idx_weekly_goals_task_id ON public.weekly_goals(task_id);
CREATE INDEX idx_weekly_goals_user_id ON public.weekly_goals(user_id);

CREATE INDEX idx_daily_subtasks_task_id ON public.daily_subtasks(task_id);
CREATE INDEX idx_daily_subtasks_user_id ON public.daily_subtasks(user_id);
CREATE INDEX idx_daily_subtasks_date ON public.daily_subtasks(date);

CREATE INDEX idx_daily_marks_task_id ON public.daily_marks(task_id);
CREATE INDEX idx_daily_marks_user_id ON public.daily_marks(user_id);
CREATE INDEX idx_daily_marks_date ON public.daily_marks(date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_marks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Tasks policies
CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Monthly Goals policies
CREATE POLICY "Users can view their own monthly goals"
  ON public.monthly_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own monthly goals"
  ON public.monthly_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly goals"
  ON public.monthly_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monthly goals"
  ON public.monthly_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Weekly Goals policies
CREATE POLICY "Users can view their own weekly goals"
  ON public.weekly_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly goals"
  ON public.weekly_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly goals"
  ON public.weekly_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly goals"
  ON public.weekly_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Subtasks policies
CREATE POLICY "Users can view their own daily subtasks"
  ON public.daily_subtasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily subtasks"
  ON public.daily_subtasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily subtasks"
  ON public.daily_subtasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily subtasks"
  ON public.daily_subtasks FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Marks policies
CREATE POLICY "Users can view their own daily marks"
  ON public.daily_marks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily marks"
  ON public.daily_marks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily marks"
  ON public.daily_marks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily marks"
  ON public.daily_marks FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_goals_updated_at BEFORE UPDATE ON public.monthly_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_goals_updated_at BEFORE UPDATE ON public.weekly_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_subtasks_updated_at BEFORE UPDATE ON public.daily_subtasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_marks_updated_at BEFORE UPDATE ON public.daily_marks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 6: Create Your First Account

1. Navigate to `/signup`
2. Create an account with your email
3. Check your email for verification link (Supabase sends it automatically)
4. Login and start X-ing!

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file has the correct Supabase credentials
- Make sure you copied the **anon/public** key, not the service role key
- Restart the development server after changing `.env.local`

### "Failed to fetch" errors
- Make sure your Supabase project is active (not paused)
- Check that RLS policies are created correctly
- Verify your internet connection

### Database errors
- Make sure you ran the SQL schema in Step 4
- Check Supabase dashboard → Database → Tables to verify tables exist

## Next Steps

1. Create your first deep work task
2. Set a monthly goal
3. Break it into weekly goals
4. Add today's subtasks
5. Start X-ing! 🎯

