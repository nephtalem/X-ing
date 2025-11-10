# X-ing Project Progress - Snapshot 2

## 📋 Goal Hierarchy System Explained

**Status:** About to build this feature
**Previous Snapshot:** PROGRESS_SNAPSHOT_1.md (Foundation complete ✅)

---

## 🎯 What Are We Building?

The **Goal Hierarchy System** - the core of Deep Work accountability. It connects your daily actions to bigger goals.

### The Problem It Solves

When you just have tasks like "Learn Programming", it's hard to know:

- ❌ What should I do TODAY?
- ❌ How do I know I'm making progress?
- ❌ What's my target for this month?
- ❌ Am I aligned with my long-term goals?

### The Solution: Three-Level Hierarchy

```
TASK (The Area)
    "Build Programming Skills"
    ↓
MONTHLY GOAL (The Big Target)
    "Complete React Advanced Course"
    November 2025
    ↓
WEEKLY GOALS (Milestones)
    Week 1: "Master React Hooks"
    Week 2: "Understand Context API"
    Week 3: "Build Real Project"
    Week 4: "Deploy & Review"
    ↓
DAILY SUBTASKS (Actions)
    Monday: "Watch useState tutorial - 1h"
    Tuesday: "Build counter practice app"
    Wednesday: "Learn useEffect hook"
```

Now when you open the app, you see:

- ✅ What to do TODAY (daily subtasks)
- ✅ How it fits into THIS WEEK (weekly goal)
- ✅ How it contributes to THIS MONTH (monthly goal)
- ✅ Clear alignment and purpose!

---

## 🧠 Key Concepts Explained

### 1. **What is a Goal Hierarchy?**

Think of it like a **roadmap**:

**Without hierarchy:**

```
Task: Learn Guitar
Daily: Practice guitar ← Too vague!
```

**With hierarchy:**

```
Task: Learn Guitar
    ↓
Monthly: Learn 5 basic songs by end of month
    ↓
Week 1: Master chord transitions (G, C, D, Em)
    ↓
Today:
    - Practice G to C transition 20 times
    - Play "Wonderwall" verse slowly
    - 15 min finger exercises
```

**Much clearer!** You know exactly what to do and why.

### 2. **The Three Levels**

#### 📅 **Monthly Goals** (The Destination)

- **What:** Big outcome you want this month
- **Example:** "Complete React Course", "Learn 5 songs", "Build portfolio"
- **Duration:** 1 month
- **Status:** Active, Completed, or Cancelled

**Think:** "What do I want to achieve this month?"

---

#### 📆 **Weekly Goals** (The Milestones)

- **What:** Stepping stones toward monthly goal
- **Example:** "Week 1: Learn basics", "Week 2: Build project"
- **Duration:** 7 days (Monday - Sunday)
- **Relation:** 4 weekly goals = 1 monthly goal

**Think:** "What's my focus this week?"

---

#### ✅ **Daily Subtasks** (The Actions)

- **What:** Specific things to do TODAY
- **Example:** "Watch video", "Practice 30 min", "Build feature X"
- **Duration:** Today
- **Granular:** Small, achievable actions

**Think:** "What will I do in the next hour?"

---

## 🗄️ Database Structure

We already created these tables in Snapshot 1! Let's review:

### **monthly_goals** Table

```sql
┌──────────────────────────────────────────────────────┐
│ id                 │ UUID (unique identifier)        │
│ task_id            │ Which task this belongs to      │
│ user_id            │ Who owns this goal              │
│ goal_title         │ "Complete React Course"         │
│ description        │ More details (optional)         │
│ target_date        │ End date (e.g., 2025-11-30)     │
│ progress_percentage│ 0-100% (auto-calculated)        │
│ month_year         │ "2025-11" (for tracking)        │
│ status             │ "active", "completed", "cancelled"│
│ created_at         │ When created                    │
└──────────────────────────────────────────────────────┘
```

**Key Points:**

- Each task can have multiple monthly goals (but only 1 active at a time)
- Progress auto-updates based on weekly goals completed
- Status tracks if goal is ongoing, done, or abandoned

---

### **weekly_goals** Table

```sql
┌──────────────────────────────────────────────────────┐
│ id                 │ UUID                            │
│ monthly_goal_id    │ Parent monthly goal             │
│ task_id            │ The task                        │
│ user_id            │ Owner                           │
│ goal_title         │ "Master React Hooks"            │
│ description        │ Details (optional)              │
│ week_start_date    │ Monday (e.g., 2025-11-03)       │
│ week_end_date      │ Sunday (e.g., 2025-11-09)       │
│ completed          │ true/false                      │
│ created_at         │ When created                    │
└──────────────────────────────────────────────────────┘
```

**Key Points:**

- Belongs to a monthly goal (parent-child relationship)
- Covers exactly 7 days (Monday to Sunday)
- Marked complete when all weekly work is done

---

### **daily_subtasks** Table

```sql
┌──────────────────────────────────────────────────────┐
│ id                 │ UUID                            │
│ task_id            │ The task                        │
│ weekly_goal_id     │ Parent weekly goal (optional)   │
│ user_id            │ Owner                           │
│ date               │ Which day (2025-11-06)          │
│ subtask_title      │ "Watch useState video"          │
│ description        │ Details                         │
│ completed          │ true/false                      │
│ estimated_duration │ Minutes (e.g., 60)              │
│ completed_at       │ When checked off                │
│ created_at         │ When created                    │
└──────────────────────────────────────────────────────┘
```

**Key Points:**

- Multiple subtasks per day
- Links to weekly goal (shows alignment)
- Can estimate time (for time tracking)
- Records when completed

---

## 🔄 How They Connect

### Database Relationships

```
Tasks (1) ──────→ Monthly Goals (many)
                        ↓
                  Weekly Goals (many)
                        ↓
                  Daily Subtasks (many)
```

**Example with IDs:**

```
Task: "Learn Guitar"
  id: task-123
    ↓
Monthly Goal: "Learn 5 songs"
  id: monthly-456
  task_id: task-123 ← Links to task
    ↓
Weekly Goal: "Master chords"
  id: weekly-789
  monthly_goal_id: monthly-456 ← Links to monthly
  task_id: task-123 ← Also links to task
    ↓
Daily Subtask: "Practice G chord"
  id: subtask-999
  task_id: task-123
  weekly_goal_id: weekly-789 ← Links to weekly
  date: 2025-11-06
```

**Why link task_id everywhere?**

- Quick queries: "Show me all subtasks for this task"
- No need to join multiple tables
- Better performance

---

## 🎨 User Experience Flow

### **Creating the Hierarchy**

**Step 1: User has a task**

- Already exists: "Build Programming Skills"

**Step 2: Set monthly goal**

```
User clicks: "Set Goal" on task card
    ↓
Form appears:
    - Goal: "Complete React Course"
    - Target Date: November 30, 2025
    - Description: "Finish all modules and build project"
    ↓
Saves to monthly_goals table
```

**Step 3: Break into weekly goals**

```
User clicks: "Plan Weeks"
    ↓
Sees: 4 weeks in November
    ↓
Fills each week:
    Week 1 (Nov 3-9): "Learn Hooks"
    Week 2 (Nov 10-16): "Context & State"
    Week 3 (Nov 17-23): "Build Project"
    Week 4 (Nov 24-30): "Deploy & Review"
    ↓
Saves 4 records to weekly_goals table
```

**Step 4: Daily work**

```
User opens "Today" view
    ↓
Sees current week's goal: "Learn Hooks"
    ↓
Adds daily subtasks:
    - "Watch useState video - 1h"
    - "Build counter app"
    ↓
Saves to daily_subtasks table with today's date
```

---

### **Using the Hierarchy Daily**

**Morning:**

```
1. Open app → Goes to "Today" view
2. See tasks with current weekly goals
3. Add today's subtasks based on weekly goal
4. Start working!
```

**Throughout the day:**

```
1. Complete a subtask → Check it off
2. Immediate satisfaction ✓
3. See progress bar move
```

**Evening:**

```
1. Review: Did I complete subtasks?
2. If yes → Mark day with "X" (we'll build this in next snapshot)
3. See alignment: Today → This Week → This Month
```

---

## 📊 Progress Tracking

### How Progress Updates

**Monthly Progress:**

```
Monthly Goal Progress = (Completed Weekly Goals / Total Weekly Goals) × 100

Example:
- Week 1: ✅ Complete
- Week 2: ✅ Complete
- Week 3: ⏳ In Progress
- Week 4: ⏸️ Not Started

Progress = 2/4 × 100 = 50%
```

**Weekly Progress:**

```
Based on:
- Daily marks (X's) for that week
- Subtasks completed

Example:
Week 1 (7 days):
- 5 days marked with X
- 15/20 subtasks completed

Good week! ✅
```

---

## 🛠️ What We'll Build

### **Pages/Routes**

#### 1. **Task Detail Page** - `/tasks/[id]`

We'll enhance the existing edit page to show:

- Task info
- Current monthly goal
- Button: "Set Monthly Goal" or "View Goals"

#### 2. **Goals Management Page** - `/tasks/[id]/goals`

**NEW PAGE!**

- View current monthly goal
- Create new monthly goal
- Break down into weekly goals
- Timeline view

#### 3. **Today View** - `/today`

**NEW PAGE!** (Core daily interaction)

- List all tasks
- Show current weekly goal for each
- Add/view daily subtasks
- Quick subtask entry

---

### **API Routes**

#### 1. **Monthly Goals API** - `/api/goals/monthly`

```typescript
GET    /api/goals/monthly?task_id=xxx  → Get monthly goal for task
POST   /api/goals/monthly              → Create new monthly goal
PATCH  /api/goals/monthly/[id]         → Update monthly goal
DELETE /api/goals/monthly/[id]         → Delete monthly goal
```

#### 2. **Weekly Goals API** - `/api/goals/weekly`

```typescript
GET    /api/goals/weekly?monthly_goal_id=xxx  → Get weekly goals
POST   /api/goals/weekly                      → Create weekly goal(s)
PATCH  /api/goals/weekly/[id]                 → Update weekly goal
DELETE /api/goals/weekly/[id]                 → Delete weekly goal
```

#### 3. **Subtasks API** - `/api/subtasks`

```typescript
GET    /api/subtasks?date=2025-11-06&task_id=xxx  → Get subtasks for date
POST   /api/subtasks                              → Create subtask
PATCH  /api/subtasks/[id]                         → Update/complete subtask
DELETE /api/subtasks/[id]                         → Delete subtask
```

---

## 🎯 Example Scenario

Let's trace a complete example:

### **November 1st - Setup Month**

**Nephtalem opens the app:**

1. **Views tasks:**
   - Sees: "Build Programming Skills"
2. **Sets monthly goal:**

   - Clicks "Set Goal"
   - Enters: "Complete React Course by Nov 30"
   - Saves → Creates record in `monthly_goals`

3. **Plans weeks:**
   - Week 1: "Basic Hooks (useState, useEffect)"
   - Week 2: "Advanced Patterns (Context, Reducers)"
   - Week 3: "Build Todo App Project"
   - Week 4: "Deploy and Document"
   - Saves → Creates 4 records in `weekly_goals`

---

### **November 6th (Monday Week 1) - Daily Work**

**Morning routine:**

1. **Opens "Today" view**

   - Sees task: "Build Programming Skills"
   - Current week: "Basic Hooks"
   - No subtasks yet for today

2. **Plans today:**

   - Adds subtask: "Watch useState tutorial - 1 hour"
   - Adds subtask: "Build counter app practice"
   - Adds subtask: "Read docs on useEffect"
   - Saves → 3 records in `daily_subtasks` with date=2025-11-06

3. **Works throughout the day:**

   - 10 AM: Completes "Watch tutorial" → Checks it off
   - 2 PM: Completes "Build counter" → Checks it off
   - 6 PM: Completes "Read docs" → Checks it off
   - All subtasks done! ✅

4. **Evening review:**
   - Sees: 3/3 subtasks complete
   - Marks day with "X" (we'll build this next!)
   - Day 1 of streak! 🔥

---

### **November 9th (Sunday) - Week Complete**

**End of Week 1:**

- 5/7 days marked with X
- 18/20 subtasks completed
- Marks weekly goal "Basic Hooks" as COMPLETE ✅
- Monthly progress updates: 25% → 1/4 weeks done

**App shows:**

- "Great week! You completed 5 days."
- "Week 2 starts Monday: Advanced Patterns"
- "You're on track with your monthly goal!"

---

## 🔑 Key Features We're Building

### 1. **Goal Setting Interface**

- Clean form to set monthly goals
- Date picker for target date
- Auto-calculate month/year

### 2. **Week Planning Interface**

- Visual week grid
- Easy input for 4 weeks
- Auto-calculate week start/end dates

### 3. **Today View**

- See all tasks
- Current weekly goal displayed prominently
- Quick subtask entry
- Check off subtasks instantly
- See alignment: Daily → Weekly → Monthly

### 4. **Progress Visualization**

- Progress bars for monthly goals
- Weekly completion status
- Subtask counters

---

## 💡 Why This Order Makes Sense

**We're building goals BEFORE daily marking because:**

1. **Context is important** - Subtasks need to align with weekly goals
2. **Data structure** - Need goals in place before marking days
3. **User flow** - Users set up goals first, then do daily work
4. **Learning progression** - Understand the structure before the interaction

**Next snapshot will be:**

- Daily Marking (the "X" feature)
- Uses the goals we build here
- The satisfying daily interaction!

---

## 🎓 What You'll Learn

### **Concepts:**

1. **Data relationships** - Parent-child connections in database
2. **Date handling** - Working with weeks, months, dates
3. **Progress calculation** - Auto-updating based on sub-items
4. **Complex forms** - Multi-step input for planning
5. **Context-aware UI** - Showing relevant info based on current date

### **Technical Skills:**

1. Creating related data across multiple tables
2. Calculating date ranges (week start/end)
3. Aggregating data for progress %
4. Building intuitive planning interfaces
5. Query optimization for related data

---

## ✅ Success Criteria

**After building this, users can:**

1. ✅ Set a monthly goal for any task
2. ✅ Break monthly goal into 4 weekly goals
3. ✅ Add daily subtasks for today
4. ✅ Check off subtasks as complete
5. ✅ See how today's work connects to bigger goals
6. ✅ Track monthly progress automatically

**And you'll understand:**

1. ✅ How hierarchical data works
2. ✅ Database relationships in practice
3. ✅ Date calculations and time-based features
4. ✅ Building progressive disclosure UI
5. ✅ The Deep Work philosophy in action!

---

## 📋 Build Order

We'll build in this sequence:

1. **Monthly Goals API** - Backend first
2. **Weekly Goals API** - Backend
3. **Subtasks API** - Backend
4. **Goals Management UI** - Frontend
5. **Today View UI** - Frontend (the daily page!)

Each step builds on the previous, and I'll explain as we go!

---

## 🤔 Questions to Understand

Before we start building, make sure you understand:

1. **Can you explain** the three levels (monthly → weekly → daily)?

2. **Why do we link** `task_id` in all three tables (monthly_goals, weekly_goals, daily_subtasks)?

3. **How does** monthly progress auto-update?

4. **What's the user flow** from setting a goal to doing daily work?

5. **Why build goals** before the daily marking feature?

---

## 🚀 Ready to Build?

When you're ready, tell me and we'll start with:

**Step 1: Monthly Goals API** - The backend to create and manage monthly goals.

I'll explain each piece of code as we write it!

Take your time to read and understand this snapshot. Ask any questions before we proceed! 💪
