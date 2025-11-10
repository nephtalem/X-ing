# 🚀 X-ing Deployment Guide

Complete guide to deploy your X-ing deep work tracking app with CI/CD automation.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Deploying to Vercel](#deploying-to-vercel)
- [Setting Up CI/CD](#setting-up-cicd)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [x] Node.js 20.x or higher installed
- [x] A GitHub account
- [x] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] A Supabase project (create at [supabase.com](https://supabase.com))
- [x] Git installed on your machine

---

## 🔐 Environment Variables

X-ing requires the following environment variables:

| Variable                        | Description                 | Where to Find                                                        |
| ------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL   | Supabase Dashboard → Settings → API → Project URL                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Supabase Dashboard → Settings → API → Project API keys → anon/public |

### Getting Your Supabase Credentials:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

---

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Xing
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local with your actual values
# (Use your favorite text editor)
```

Example `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app! 🎉

---

## 🌐 Deploying to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Push Your Code to GitHub**

```bash
git add .
git commit -m "Initial commit - Ready for deployment"
git push origin main
```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your GitHub repository
   - Select the **X-ing** repository

3. **Configure Project**

   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**

   Click **"Environment Variables"** and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
   ```

   **Important**: Add these for all environments (Production, Preview, Development)

5. **Deploy**

   Click **"Deploy"** and wait for the build to complete (2-3 minutes)

6. **Get Your Live URL**

   Once deployed, you'll get a URL like: `https://xing-username.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## ⚙️ Setting Up CI/CD

Your app now has automated CI/CD! Here's what happens automatically:

### GitHub Actions (CI) - Already Configured ✅

The `.github/workflows/ci.yml` file runs on every push and pull request:

1. **Linting** - Checks code quality
2. **Building** - Ensures the app builds successfully
3. **Testing** - Runs all tests (when you add them)

### Vercel (CD) - Already Configured ✅

Vercel automatically deploys:

- **Production deployments** - Every push to `main` branch
- **Preview deployments** - Every pull request gets a unique URL

### Adding GitHub Secrets for CI

To make CI work properly, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

   | Name                            | Value                  |
   | ------------------------------- | ---------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase URL      |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

---

## 🎯 Post-Deployment

### 1. Update Supabase Authentication Settings

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Add your Vercel URL to **Site URL**:
   ```
   https://xing-username.vercel.app
   ```
5. Add redirect URLs under **Redirect URLs**:
   ```
   https://xing-username.vercel.app/auth/callback
   https://xing-username.vercel.app/**
   ```

### 2. Test Your Deployment

- [ ] Visit your live URL
- [ ] Test user signup/login
- [ ] Create a task and add goals
- [ ] Test the Calendar view
- [ ] Test the Analytics dashboard
- [ ] Toggle dark mode
- [ ] Test on mobile devices

### 3. Set Up a Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Navigate to **Settings** → **Domains**
3. Add your custom domain (e.g., `xing.yourdomain.com`)
4. Follow Vercel's DNS configuration instructions

---

## 🔄 Deployment Workflow

### Daily Development

```bash
# 1. Make changes locally
# 2. Test locally
npm run dev

# 3. Lint your code
npm run lint

# 4. Build to check for errors
npm run build

# 5. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 6. Vercel automatically deploys! ✨
```

### Preview Deployments (PRs)

```bash
# 1. Create a feature branch
git checkout -b feature/my-new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: my new feature"
git push origin feature/my-new-feature

# 3. Open a Pull Request on GitHub
# 4. Vercel automatically creates a preview deployment
# 5. Test the preview URL
# 6. Merge PR → Automatically deployed to production
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Problem**: Build fails with linting errors

**Solution**:

```bash
# Run locally to see errors
npm run lint

# Fix the errors, then redeploy
git add .
git commit -m "fix: linting errors"
git push
```

### Environment Variables Not Working

**Problem**: App shows "Invalid credentials" or connection errors

**Solution**:

1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure all variables are added for Production, Preview, and Development
3. Redeploy the project (Settings → Deployments → ... → Redeploy)

### Authentication Not Working After Deployment

**Problem**: Users can't sign up or log in

**Solution**:

1. Check Supabase Dashboard → Authentication → URL Configuration
2. Ensure your Vercel URL is added to Site URL and Redirect URLs
3. Clear browser cache and try again

### Database Connection Issues

**Problem**: "Database connection failed"

**Solution**:

1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Check Supabase project is active (not paused)
4. Verify Row Level Security (RLS) policies are enabled

### Preview Deployments Not Working

**Problem**: Pull requests don't get preview deployments

**Solution**:

1. Check Vercel Dashboard → Settings → Git
2. Ensure "Automatically create Preview Deployments" is enabled
3. Check GitHub permissions for Vercel app

---

## 📊 Monitoring Your Deployment

### Vercel Analytics (Recommended)

1. Go to your project in Vercel Dashboard
2. Navigate to **Analytics** tab
3. Enable Vercel Analytics for free
4. Get insights on performance and usage

### GitHub Actions Status

- Check CI status on every commit: GitHub → Actions tab
- Failed builds will show up with ❌
- Successful builds show ✅

---

## 🔒 Security Best Practices

- ✅ **Never commit `.env.local`** - It's already in `.gitignore`
- ✅ **Use environment variables** - Never hardcode credentials
- ✅ **Enable Supabase RLS** - Protect your database
- ✅ **Keep dependencies updated** - Run `npm audit` regularly
- ✅ **Use strong Supabase passwords** - Enable 2FA if available

---

## 🎉 Success!

Your X-ing app is now deployed with:

- ✅ Automatic deployments on every push
- ✅ CI/CD pipeline with linting and building
- ✅ Preview deployments for pull requests
- ✅ Production-ready with security headers
- ✅ Fast global CDN via Vercel Edge Network

**Next Steps:**

1. Share your app URL with users
2. Monitor analytics and performance
3. Keep building amazing features!

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/actions)

---

**Need Help?**

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Support: [supabase.com/support](https://supabase.com/support)
- Next.js Discord: [nextjs.org/discord](https://nextjs.org/discord)

Happy Deploying! 🚀✨
