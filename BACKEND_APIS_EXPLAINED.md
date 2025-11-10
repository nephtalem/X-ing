# Backend APIs Explained - Quick Guide

## 🎓 What We Just Built

### **Monthly Goals API**

#### Location: `app/api/goals/monthly/route.ts`

**What it does:**

- **GET** - Fetch monthly goals (can filter by task or status)
- **POST** - Create a new monthly goal

**Key Learning Points:**

1. **Query Parameters** - How to filter data

```typescript
// URL: /api/goals/monthly?task_id=123&status=active
const task_id = searchParams.get("task_id"); // Get filters from URL
```

2. **Verification** - Always check:

   - Is user logged in?
   - Does the task belong to this user?
   - Are required fields present?

3. **Database Insert**

```typescript
await supabase.from("monthly_goals").insert({
  user_id: user.id, // Who owns it
  task_id, // Which task
  goal_title, // The goal
  status: "active", // Default status
  progress_percentage: 0, // Starts at 0%
});
```

---

#### Location: `app/api/goals/monthly/[id]/route.ts`

**What it does:**

- **GET** - Fetch one specific goal
- **PATCH** - Update a goal (title, progress, status, etc.)
- **DELETE** - Remove a goal

**Key Learning Points:**

1. **Dynamic Routes** - `[id]` matches any ID

```typescript
// URL: /api/goals/monthly/abc-123
const { id } = await params; // Gets "abc-123"
```

2. **Partial Updates** - Only update fields that changed

```typescript
const updates: any = {};
if (goal_title !== undefined) updates.goal_title = goal_title;
// Only updates what user changed!
```

3. **Cascade Delete** - When you delete a monthly goal, weekly goals and subtasks linked to it are automatically deleted (thanks to ON DELETE CASCADE in our SQL schema!)

---

### **Weekly Goals API**

#### Location: `app/api/goals/weekly/route.ts`

**What it does:**

- **GET** - Fetch weekly goals (filtered by monthly goal or task)
- **POST** - Create weekly goals (can create multiple at once!)

**Key Learning Points:**

1. **Batch Creation** - Create multiple weeks in one request

```typescript
// Can send array:
POST /api/goals/weekly
Body: [
  { goal_title: "Week 1", ... },
  { goal_title: "Week 2", ... },
  { goal_title: "Week 3", ... },
]

// Or single:
Body: { goal_title: "Week 1", ... }
```

2. **Flexible API Design**

```typescript
const goals = Array.isArray(body) ? body : [body];
// Handles both single and array!
```

3. **Relationships**

```typescript
{
  monthly_goal_id: "parent-id",  // Links to parent
  task_id: "task-id",            // Also links to task
  week_start_date: "2025-11-15", // Week boundaries
  week_end_date: "2025-11-21"
}
```

---

## 🔄 How They Connect

```
Frontend calls:
    fetch('/api/goals/monthly', { method: 'POST', body: data })
        ↓
    API Route (route.ts) receives request
        ↓
    Check: Is user logged in?
        ↓
    Validate: Are required fields present?
        ↓
    Database: Insert into monthly_goals table
        ↓
    Response: Return created goal to frontend
        ↓
    Frontend: Update UI with new goal
```

---

## ✅ What Can We Do Now?

With these APIs, we can:

1. ✅ Create monthly goals for tasks
2. ✅ Update goal progress and status
3. ✅ Delete goals
4. ✅ Create weekly goals (in batches!)
5. ✅ Fetch goals with filters

**Next:** We'll create Subtasks API, then build the UI to use all of this!

---

Take a moment to look at the files we created and see the patterns. Notice:

- Authentication checking (same in all)
- Error handling (try/catch everywhere)
- Validation (before inserting)
- Clear responses (always { data } or { error })

Questions before we continue? 🤔
