# ✅ Pre-Deployment Checklist

Use this checklist before deploying X-ing to production.

---

## 🔍 Code Quality

- [ ] All linter errors fixed (`npm run lint`)
- [ ] App builds successfully (`npm run build`)
- [ ] No console errors in browser console
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] All components render correctly

---

## 🧪 Testing

- [ ] **Authentication**
  - [ ] User can sign up
  - [ ] User can log in
  - [ ] User can log out
  - [ ] Password validation works
  - [ ] Error messages display correctly

- [ ] **Tasks**
  - [ ] Can create new tasks
  - [ ] Can edit task details
  - [ ] Can archive (delete) tasks
  - [ ] Task colors work
  - [ ] Task list displays correctly

- [ ] **Goals**
  - [ ] Can create monthly goals
  - [ ] Can create multiple weekly goals per week
  - [ ] Can add weekly goals to existing weeks
  - [ ] Goals display in correct hierarchy
  - [ ] Progress calculations are accurate

- [ ] **Today View**
  - [ ] Tasks display correctly
  - [ ] Monthly goals show up
  - [ ] Weekly goals grouped correctly
  - [ ] Can add daily subtasks
  - [ ] Subtasks can be checked/unchecked
  - [ ] Reminder shows for goals without weekly plans
  - [ ] Stats calculate correctly

- [ ] **Calendar View**
  - [ ] Calendar renders correctly
  - [ ] X marks show on completed days
  - [ ] Streak calculation is accurate
  - [ ] Month navigation works
  - [ ] "Today" button works

- [ ] **Analytics Dashboard**
  - [ ] Charts render correctly
  - [ ] Data is accurate
  - [ ] Period selection works (7/30/90 days)
  - [ ] Stats cards show correct data

- [ ] **UI/UX**
  - [ ] Dark mode toggle works
  - [ ] Theme persists on page reload
  - [ ] All animations work smoothly
  - [ ] Loading skeletons display
  - [ ] Toast notifications appear
  - [ ] Responsive on mobile devices
  - [ ] No UI glitches or overlaps

---

## 🔐 Security

- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded credentials in code
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] API routes protected with authentication
- [ ] No sensitive data in client-side code

---

## 🗄️ Database

- [ ] All required tables created in Supabase
- [ ] RLS policies set up correctly
- [ ] Foreign key relationships configured
- [ ] Indexes added for performance
- [ ] Database migrations documented

### Required Tables:
- [ ] `tasks`
- [ ] `monthly_goals`
- [ ] `weekly_goals`
- [ ] `daily_subtasks`
- [ ] `daily_marks`

---

## 🌐 Supabase Configuration

- [ ] Project created
- [ ] Database tables set up
- [ ] RLS policies enabled
- [ ] Authentication enabled
- [ ] Email provider configured
- [ ] API keys copied

---

## 📝 Environment Variables

- [ ] Created `env.example` file
- [ ] Listed all required variables
- [ ] No sensitive values in `env.example`
- [ ] `.env.local` exists locally
- [ ] All variables have correct values

### Required Variables:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📦 Dependencies

- [ ] All dependencies up to date
- [ ] No critical security vulnerabilities (`npm audit`)
- [ ] `package-lock.json` committed
- [ ] Unused dependencies removed

---

## 🚀 Deployment Files

- [ ] `vercel.json` configured
- [ ] `.github/workflows/ci.yml` created
- [ ] `DEPLOYMENT.md` guide created
- [ ] `README.md` updated
- [ ] `LICENSE` file added

---

## 📱 Cross-Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 📊 Performance

- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] No unnecessary re-renders
- [ ] API calls optimized
- [ ] Bundle size reasonable

---

## 📚 Documentation

- [ ] README.md complete
- [ ] DEPLOYMENT.md guide written
- [ ] QUICK_DEPLOY.md created
- [ ] Code comments where needed
- [ ] API endpoints documented

---

## 🔄 Git & GitHub

- [ ] All changes committed
- [ ] Commit messages follow convention
- [ ] No sensitive files in commits
- [ ] `.gitignore` properly configured
- [ ] Remote repository set up

### GitHub Settings:
- [ ] Repository is private/public as intended
- [ ] Branch protection rules set (optional)
- [ ] Secrets added for CI/CD
- [ ] Collaborators added (if any)

---

## 🌍 Vercel Setup

- [ ] Account created
- [ ] GitHub connected
- [ ] Environment variables added
- [ ] Production domain configured (if custom)
- [ ] Preview deployments enabled

---

## 🎯 Post-Deployment

- [ ] Site URL added to Supabase redirect URLs
- [ ] Test signup/login on live site
- [ ] Test all major features on production
- [ ] Monitor for errors in Vercel logs
- [ ] Check analytics (if enabled)

---

## 🐛 Error Handling

- [ ] 404 page exists
- [ ] Error boundaries implemented
- [ ] API errors handled gracefully
- [ ] User-friendly error messages
- [ ] Network errors handled

---

## 📈 Monitoring (Optional)

- [ ] Vercel Analytics enabled
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Performance monitoring configured
- [ ] Uptime monitoring (optional)

---

## 🎨 Final Polish

- [ ] All placeholder text removed
- [ ] Images/logos in place
- [ ] Favicon set
- [ ] Meta tags for SEO
- [ ] Open Graph tags for social sharing

---

## ✨ Nice to Have

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Vercel)
- [ ] CDN optimization enabled
- [ ] Database backups scheduled
- [ ] Backup/restore plan documented

---

## 🚦 Ready to Deploy?

If you've checked off all the items above, you're ready to deploy! 🎉

### Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "chore: ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Click Deploy

3. **Test Production**
   - Visit your live URL
   - Test all major features
   - Check for any errors

4. **Update Supabase**
   - Add your production URL to Supabase settings

5. **Celebrate!** 🎉

---

## 📞 Support

If you encounter issues:

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review Vercel deployment logs
3. Check Supabase logs
4. Review browser console for errors

---

**Good luck with your deployment!** 🚀✨

