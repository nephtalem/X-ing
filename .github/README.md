# 🔄 GitHub Workflows

This directory contains CI/CD automation workflows for X-ing.

---

## 📁 Workflows

### `ci.yml` - Continuous Integration

**Triggers:**
- Every push to `main` or `develop` branches
- Every pull request to `main` or `develop` branches

**What It Does:**

1. ✅ **Checkout Code** - Gets the latest code
2. 📦 **Setup Node.js** - Installs Node.js 20.x
3. 📥 **Install Dependencies** - Runs `npm ci`
4. 🧹 **Run Linter** - Checks code quality with ESLint
5. 🏗️ **Build Application** - Ensures the app builds successfully

**Why It Matters:**

This workflow catches bugs before they reach production. If any step fails, the pull request is blocked, ensuring only quality code gets merged.

---

## 🔐 Required Secrets

To make CI work, add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value | Where to Get |
|------------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Supabase Dashboard → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase Dashboard → API |

---

## 📊 Viewing Workflow Status

- **Badge in README**: Shows CI status at a glance
- **Actions Tab**: See detailed logs for each run
- **Pull Requests**: Status checks appear automatically

---

## 🚀 Adding More Workflows

Want to add more automation? Here are some ideas:

### Test Workflow
```yaml
- name: 🧪 Run Tests
  run: npm test
```

### Type Check
```yaml
- name: 🔍 Type Check
  run: npx tsc --noEmit
```

### Security Audit
```yaml
- name: 🔒 Security Audit
  run: npm audit --audit-level=moderate
```

---

## 🛠️ Customizing the Workflow

Edit `.github/workflows/ci.yml` to customize:

- Change Node.js version in the matrix
- Add more steps (testing, security checks, etc.)
- Modify trigger branches
- Add caching for faster builds

---

## 📚 Learn More

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Workflow Syntax](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions)
- [CI Best Practices](https://docs.github.com/actions/guides/about-continuous-integration)

---

**Happy Automating!** 🤖✨

