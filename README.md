# 🎯 X-ing - Deep Work Tracking App

A beautiful, modern deep work tracking application built with Next.js, Supabase, and Tailwind CSS. Track your goals, plan your weeks, and build unstoppable momentum towards your dreams.

![X-ing Banner](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 📋 Task Management
- Create and organize tasks with custom colors
- Archive tasks with soft delete (preserves data)
- Modern, engaging UI with gradient designs

### 🎯 Goal Hierarchy
- **Monthly Goals** - Set overarching goals for the month
- **Weekly Goals** - Break down monthly goals into weekly actions
- **Daily Subtasks** - Create specific daily actions for each weekly goal
- Full tree structure with progress tracking

### 📅 Today View
- See all tasks and goals for today in one beautiful page
- Add daily actions directly under weekly goals
- Real-time progress tracking with completion percentages
- Smart reminders for goals without weekly planning
- Motivational stats and completion rate

### 🗓️ Calendar View
- Visual calendar with "X marks" for completed days
- Streak tracking to maintain momentum
- Monthly navigation with today quick-jump
- See your consistency at a glance

### 📊 Analytics Dashboard
- Completion trends over time (7, 30, 90 days)
- Task breakdown with beautiful pie charts
- Weekly activity heatmap
- Goal progress tracking
- Overview stats (total marks, completion rate, current streak)

### 🎨 Beautiful UI/UX
- Modern gradient designs throughout
- Smooth animations and transitions
- Full dark mode support with theme toggle
- Loading skeletons for better perceived performance
- Toast notifications for user feedback
- Responsive design for all devices

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd Xing
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy the example file
cp env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

X-ing uses Supabase for authentication and database. The app requires the following tables:

### Tables

1. **tasks** - Main tasks
2. **monthly_goals** - Monthly goals linked to tasks
3. **weekly_goals** - Weekly goals linked to monthly goals
4. **daily_subtasks** - Daily actions linked to weekly goals
5. **daily_marks** - Daily completion marks for calendar

### Setting Up Your Database

1. Create a new Supabase project
2. Run the provided SQL migrations (see `DEPLOYMENT.md` for schema)
3. Enable Row Level Security (RLS) on all tables
4. Set up authentication providers

---

## 📦 Tech Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Real-time subscriptions

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icons
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components

### Data & Analytics
- **[Recharts](https://recharts.org/)** - Data visualization
- **[date-fns](https://date-fns.org/)** - Date utilities

### Developer Experience
- **[ESLint](https://eslint.org/)** - Code linting
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure

```
Xing/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/      # Main app pages
│   │   ├── today/        # Today view
│   │   ├── tasks/        # Task management
│   │   ├── calendar/     # Calendar view
│   │   └── analytics/    # Analytics dashboard
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── lib/
│   └── supabase/         # Supabase client
├── types/                # TypeScript types
└── public/               # Static assets
```

---

## 🚀 Deployment

X-ing is optimized for deployment on Vercel with full CI/CD automation.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/xing)

### Manual Deployment

See the comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide for:
- Step-by-step Vercel deployment
- CI/CD setup with GitHub Actions
- Environment variables configuration
- Post-deployment checklist
- Troubleshooting tips

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Your Supabase anonymous key |

See `env.example` for a template.

---

## 🎨 Features in Detail

### Tree Structure Goal Management

X-ing uses a unique hierarchical approach:

```
📋 Task (e.g., "Master Blues Guitar")
  └── 📅 Monthly Goal (e.g., "Learn 12-bar blues progression")
      └── 📆 Weekly Goal (e.g., "Practice chord transitions")
          └── ✅ Daily Subtask (e.g., "Practice 30 mins")
```

This structure helps break down big dreams into actionable daily steps.

### Smart Reminders

If you have monthly goals without weekly planning, the app shows a friendly reminder with a direct link to plan your week - ensuring nothing falls through the cracks.

### Soft Delete Architecture

Tasks are never permanently deleted - they're archived instead. This:
- Preserves historical data for analytics
- Allows for potential recovery
- Maintains data integrity

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📧 Contact

For questions, suggestions, or issues:

- Open an issue on GitHub
- Create a discussion in the Discussions tab

---

## 🎯 Roadmap

Future features planned:

- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Export data to CSV/JSON
- [ ] Custom themes and color schemes
- [ ] Integration with calendar apps
- [ ] Pomodoro timer integration
- [ ] Goal templates
- [ ] Social sharing of achievements
- [ ] Weekly/monthly email reports

---

**Built with ❤️ for deep workers everywhere**

Start tracking your deep work today and build unstoppable momentum! 🚀✨
