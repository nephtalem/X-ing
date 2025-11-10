# X-ing Project Progress - Snapshot 1

## What We've Built So Far

This document explains everything we've created in the first phase of building the X-ing app. Read this carefully to understand what each part does and how they work together.

---

## 🎯 Overview

We've completed the **foundation** of the X-ing app. Think of it like building a house - we've laid the foundation, built the walls, and installed the doors. The app can now:

1. ✅ Let users sign up and log in
2. ✅ Create and manage tasks (like "Learn Guitar" or "Build Programming Skills")
3. ✅ Navigate between pages
4. ✅ Store data securely in a cloud database

---

## 📁 Project Structure Explained

Here's what we created and why:

```
xing/
├── app/                          ← Your application pages and API
│   ├── (auth)/                  ← Login & Signup pages (grouped)
│   │   ├── login/               
│   │   │   └── page.tsx         ← Login page UI
│   │   ├── signup/              
│   │   │   └── page.tsx         ← Signup page UI
│   │   └── layout.tsx           ← Shared layout for auth pages
│   │
│   ├── (dashboard)/             ← Main app pages (after login)
│   │   ├── tasks/               
│   │   │   ├── page.tsx         ← List of all tasks
│   │   │   └── new/             
│   │   │       └── page.tsx     ← Create new task form
│   │   ├── layout.tsx           ← Dashboard layout with navbar
│   │   └── page.tsx             ← Redirects to /today
│   │
│   ├── api/                     ← BACKEND API routes
│   │   └── tasks/               
│   │       ├── route.ts         ← GET all tasks, POST new task
│   │       └── [id]/route.ts    ← GET/UPDATE/DELETE single task
│   │
│   ├── page.tsx                 ← Root page (redirects to login/dashboard)
│   └── layout.tsx               ← Root layout
│
├── components/                   ← Reusable UI components
│   ├── ui/                      ← Basic components (buttons, cards, etc.)
│   │   ├── button.tsx           
│   │   ├── input.tsx            
│   │   ├── card.tsx             
│   │   └── label.tsx            
│   └── Navbar.tsx               ← Navigation bar
│
├── lib/                         ← Helper functions and utilities
│   ├── supabase/                ← Database connection
│   │   ├── client.ts            ← For browser (client-side)
│   │   ├── server.ts            ← For server (API routes)
│   │   └── middleware.ts        ← Session management
│   ├── api/                     
│   │   └── auth.ts              ← Authentication helpers
│   ├── utils.ts                 ← Utility functions
│   └── constants.ts             ← App constants
│
├── types/                       
│   └── index.ts                 ← TypeScript type definitions
│
├── middleware.ts                ← Handles auth on every request
├── SETUP.md                     ← Setup instructions
└── PLAN.md                      ← Full project plan
```

---

## 🔑 Key Concepts Explained

### 1. **What is Client vs Server?**

In Next.js, code can run in two places:

#### **Client (Browser)**
- Runs in the user's web browser
- Can interact with the user (clicks, typing)
- Files marked with `'use client'` at the top
- Examples: Login form, Task list UI

#### **Server (Backend)**
- Runs on Vercel's servers (or your computer during development)
- Handles database operations
- Protects sensitive operations
- Examples: API routes in `app/api/`

**Example:**
```typescript
// app/(dashboard)/tasks/page.tsx
'use client';  // ← This tells Next.js: "Run this in the browser"

export default function TasksPage() {
  // This code runs in the user's browser
  // Can use useState, onClick, etc.
}
```

```typescript
// app/api/tasks/route.ts
// No 'use client' = runs on server automatically

export async function GET() {
  // This code runs on the server
  // Can access database securely
}
```

---

### 2. **How Authentication Works**

Here's the complete flow when a user signs up:

```
1. User fills signup form (app/(auth)/signup/page.tsx)
   - Name: "John"
   - Email: "john@example.com"
   - Password: "secret123"
   
2. Browser calls signUp() function (lib/api/auth.ts)
   
3. signUp() talks to Supabase Auth service
   
4. Supabase:
   - Hashes password (makes it unreadable)
   - Creates user account
   - Sends verification email
   - Returns authentication token
   
5. Browser stores token in cookies
   
6. User is redirected to dashboard
   
7. Every page checks: "Is there a valid token?"
   - Yes → Show dashboard
   - No → Redirect to login
```

**Why cookies?**
- Cookies are small pieces of data stored in your browser
- They're sent with every request automatically
- The authentication token in cookies proves "I'm logged in"

---

### 3. **How the Database Works (Supabase)**

Supabase is like Excel in the cloud, but much more powerful:

#### **Tables we created:**
1. **tasks** - Stores your deep work tasks
   - Each row = one task (like "Learn Guitar")
   - Columns: id, user_id, name, description, color, etc.

2. **monthly_goals** - Your monthly goals for each task
3. **weekly_goals** - Weekly breakdown
4. **daily_subtasks** - Daily action items
5. **daily_marks** - Track if you completed each day

#### **Row Level Security (RLS)**
This is a security feature that ensures:
- You can ONLY see YOUR data
- Another user can't access your tasks
- Even if they know your task ID

**How it works:**
```sql
-- This policy says: "Users can only see tasks where user_id matches their ID"
CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);
```

---

### 4. **How API Routes Work**

API routes are your backend. Let's trace what happens when you fetch tasks:

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (Browser)                                     │
│  app/(dashboard)/tasks/page.tsx                         │
│                                                         │
│  const response = await fetch('/api/tasks');           │
│  const result = await response.json();                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP GET Request to /api/tasks
                     ↓
┌─────────────────────────────────────────────────────────┐
│  BACKEND (Server)                                       │
│  app/api/tasks/route.ts                                 │
│                                                         │
│  export async function GET() {                          │
│    1. Check if user is logged in                       │
│    2. Query Supabase: "SELECT * FROM tasks             │
│                        WHERE user_id = current_user"   │
│    3. Return JSON: { data: [...tasks] }               │
│  }                                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Response with JSON data
                     ↓
┌─────────────────────────────────────────────────────────┐
│  FRONTEND receives data                                 │
│  setTasks(result.data);  // Update UI                  │
└─────────────────────────────────────────────────────────┘
```

---

### 5. **Understanding TypeScript Types**

Types help catch errors before they happen. Look at this example:

```typescript
// types/index.ts
export interface Task {
  id: string;
  name: string;
  description: string | null;  // Can be string OR null
  target_days_per_week: number;
  color: string;
}

// Now when you use it:
const task: Task = {
  id: "123",
  name: "Learn Guitar",
  description: null,
  target_days_per_week: 5,
  color: "#3b82f6"
};

// TypeScript will ERROR if you forget a field:
const badTask: Task = {
  id: "123",
  name: "Learn Guitar"
  // ERROR: Missing required fields!
};
```

**Benefits:**
- Autocomplete in your editor
- Catch typos immediately
- Documentation of data structure

---

## 🧩 How Components Work Together

Let's trace creating a new task from start to finish:

### Step 1: User clicks "New Task" button
**File:** `app/(dashboard)/tasks/page.tsx`
```typescript
<Button onClick={() => router.push('/tasks/new')}>
  New Task
</Button>
```
→ Navigates to the new task form

### Step 2: User fills the form
**File:** `app/(dashboard)/tasks/new/page.tsx`
- Name: "Learn Guitar"
- Description: "Practice 1 hour daily"
- Target: 5 days/week
- Color: Blue

### Step 3: User clicks "Create Task"
```typescript
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```
→ Sends data to the backend

### Step 4: Backend receives request
**File:** `app/api/tasks/route.ts`
```typescript
export async function POST(request: NextRequest) {
  // 1. Check user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Get form data
  const body = await request.json();
  
  // 3. Insert into database
  const { data: task } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      name: body.name,
      description: body.description,
      // ...
    });
    
  // 4. Return the created task
  return NextResponse.json({ data: task });
}
```

### Step 5: Frontend receives response
- Shows success message
- Redirects back to tasks list
- New task appears!

---

## 🎨 How Styling Works (Tailwind CSS)

Instead of writing CSS files, we use utility classes directly in the component:

```typescript
<div className="bg-blue-600 text-white rounded-md px-4 py-2">
  Hello
</div>
```

Breaks down to:
- `bg-blue-600` → background color blue
- `text-white` → white text
- `rounded-md` → rounded corners (medium)
- `px-4` → padding left/right: 16px
- `py-2` → padding top/bottom: 8px

**Benefits:**
- No need to think of class names
- Changes are instant
- Responsive design built-in: `sm:`, `md:`, `lg:`

---

## 🔐 Security Features We Implemented

### 1. **Protected Routes**
```typescript
// app/(dashboard)/layout.tsx
export default async function DashboardLayout({ children }) {
  const { user } = await getCurrentUser();
  
  if (!user) {
    redirect('/login');  // Not logged in? → Login page
  }
  
  return <div>{children}</div>;  // Logged in? → Show page
}
```

### 2. **Row Level Security**
Database ensures users can only access their own data.

### 3. **Password Hashing**
Passwords are never stored as plain text. Supabase automatically hashes them.

### 4. **HTTPS Only**
All data encrypted in transit (handled by Vercel).

---

## 📊 Current Database Schema

**Tasks Table:**
```
┌──────────────────────────────────────────────────┐
│ id (UUID)        │ Unique identifier            │
│ user_id          │ Who owns this task           │
│ name             │ "Learn Guitar"               │
│ description      │ "Practice daily"             │
│ target_days      │ 5                            │
│ color            │ "#3b82f6"                    │
│ is_active        │ true                         │
│ created_at       │ 2025-11-06 12:00:00         │
└──────────────────────────────────────────────────┘
```

---

## ✅ What Works Right Now

### You can:
1. ✅ Sign up with email/password
2. ✅ Log in
3. ✅ Create new tasks
4. ✅ View all your tasks
5. ✅ Delete tasks
6. ✅ Log out
7. ✅ Navigate with the navbar

### What's NOT built yet:
- ❌ Today view (mark X)
- ❌ Monthly/Weekly goals
- ❌ Daily subtasks
- ❌ Calendar visualization
- ❌ Analytics/Charts
- ❌ Streak tracking

---

## 🔄 How to Test What We Built

### 1. Set up Supabase (if you haven't):
1. Go to https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Copy/paste SQL from `SETUP.md`
5. Run it

### 2. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Start the app:
```bash
npm run dev
```

### 4. Test the flow:
1. Go to http://localhost:3000
2. Click "Sign up"
3. Create an account
4. You'll be redirected to /today (empty for now)
5. Click "Tasks" in navbar
6. Click "New Task"
7. Fill the form
8. See your task appear!

---

## 💡 Key Takeaways for Learning

### **1. Full-Stack = Frontend + Backend in one project**
- Frontend: What users see and interact with
- Backend: Handles data, security, business logic
- Next.js lets you build both in the same codebase!

### **2. Modern web apps use APIs**
- Frontend and backend communicate via HTTP requests
- Frontend sends: `fetch('/api/tasks')`
- Backend responds: `{ data: [...] }`

### **3. TypeScript catches errors early**
- Defines the "shape" of your data
- Editor helps you with autocomplete
- Catches typos before runtime

### **4. Authentication is complex but crucial**
- Supabase handles the hard parts
- Tokens in cookies prove identity
- Every protected page checks authentication

### **5. Database security is paramount**
- Row Level Security ensures data isolation
- Users can't access others' data
- Policies are enforced at the database level

---

## 🤔 Questions to Ask Yourself

Before we continue, make sure you understand:

1. **Can you explain** what happens when you click "Create Task"? (Trace the full flow)

2. **Where does** the authentication token get stored?

3. **What's the difference** between `app/(dashboard)/tasks/page.tsx` and `app/api/tasks/route.ts`?

4. **Why do we need** TypeScript types?

5. **How does** Row Level Security protect your data?

---

## 🎯 Next Steps (When You're Ready)

We'll build these features next, **one at a time with explanations**:

1. **Daily marking system** (Today view)
   - View all tasks for today
   - Add subtasks
   - Mark day as complete (the X!)

2. **Goal hierarchy**
   - Monthly goals
   - Weekly goals
   - Link subtasks to goals

3. **Calendar view**
   - See X marks on calendar
   - Track streaks

4. **Analytics**
   - Charts and graphs
   - Progress tracking

---

## 📝 Summary

**What we built:**
- ✅ Complete authentication system
- ✅ Task management (CRUD operations)
- ✅ Database with security
- ✅ API routes (backend)
- ✅ UI components
- ✅ Navigation

**What you learned:**
- How Next.js combines frontend and backend
- API routes are your backend
- Client vs Server code
- Authentication flow
- Database security with RLS
- TypeScript basics

**Current state:**
You have a working app where users can sign up, log in, and manage tasks. It's the **foundation** for the X-ing system. Now we need to build the core features: daily marking, goals, and tracking.

---

Take your time to review this. When you're ready, let me know what you want to tackle next, and I'll explain it thoroughly before building it!

