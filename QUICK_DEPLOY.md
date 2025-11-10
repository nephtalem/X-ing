# ⚡ Quick Deploy Guide

Get X-ing deployed in under 10 minutes!

---

## 🎯 Step 1: Get Supabase Credentials (2 mins)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **Settings** → **API**
3. Copy these two values:
   - **Project URL**
   - **anon/public key**

---

## 🚀 Step 2: Deploy to Vercel (5 mins)

### Option A: One-Click Deploy

1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   ```
4. Click **Deploy**
5. Wait 2-3 minutes ☕

### Option B: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔐 Step 3: Update Supabase Settings (2 mins)

1. Go back to [app.supabase.com](https://app.supabase.com)
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`
4. Click **Save**

---

## ✅ Step 4: Test Your App (1 min)

1. Visit your Vercel URL
2. Sign up with an email
3. Create your first task
4. You're live! 🎉

---

## 🐛 Troubleshooting

### Build Failed?
```bash
# Check locally first
npm run lint
npm run build
```

### Auth Not Working?
- Check Supabase redirect URLs
- Clear browser cache
- Verify environment variables in Vercel

### Need More Help?
See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full guide.

---

## 🎉 You're Done!

Your X-ing app is now:
- ✅ Live on the internet
- ✅ Automatically deployed on every push
- ✅ Running on Vercel's global CDN
- ✅ Secured with Supabase authentication

**Share it with the world!** 🌍✨

