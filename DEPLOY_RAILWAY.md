# Deploying to Railway

## Quick Deploy (5 minutes)

### 1. Push to GitHub

Your code is already on GitHub: https://github.com/antonio59/jamjar

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `antonio59/jamjar`
5. Railway auto-detects it's a Node.js app

### 3. Set Environment Variables

In your Railway project dashboard:

1. Click the **"Variables"** tab
2. Add these variables:

```
YOUTUBE_API_KEY=your_key_here (optional)
INTERNXT_EMAIL=your@email.com (optional)
INTERNXT_PASSWORD=your_password (optional)
INTERNXT_APP_KEY=your_app_key (optional)
JWT_SECRET=generate-random-string-here
NODE_ENV=production
```

**Don't add:** `PORT`, `DOWNLOAD_DIR`, or `DB_PATH` — Railway sets these automatically.

### 4. Add Persistent Storage

The SQLite database needs persistent storage:

1. Click **"Settings"** tab
2. Scroll to **"Persistent Storage"**
3. Click **"Add Volume"**
4. Mount path: `/app/data`
5. This ensures the database survives restarts

### 5. Deploy!

Railway auto-deploys when you push to `main`. Watch the logs in the dashboard.

Your app will be live at: `https://your-project-name.up.railway.app`

### 6. Seed the Database (First Time Only)

After deployment, seed the database with default accounts:

**Option A: Railway Shell**
1. Click the **"Shell"** tab in Railway
2. Run: `npm run seed`

**Option B: Manual curl**
```bash
curl -X POST https://your-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"parent","pin":"9999"}'
```

If login works, the database is seeded.

### 7. Add Custom Domain (Optional)

1. Go to **"Settings"** → **"Domains"**
2. Click **"Generate Domain"** for a free `*.railway.app` subdomain
3. Or add your own domain (e.g., `music.antoniosmith.xyz`)

## Updating the App

Every time you push to GitHub `main`:
- Railway auto-deploys
- Zero downtime
- Database persists

## Cost

- **Free tier:** 500 execution hours/month (~20 days)
- **Hobby plan:** $5/month for always-on
- Your app uses ~1GB RAM — well within free tier

## Troubleshooting

**Database not persisting:**
- Make sure you added persistent storage mounted at `/app/data`
- Check that `DB_PATH` is set to `/app/data/jamjar.db`

**Port errors:**
- Railway sets the `PORT` env var automatically
- The app reads this — no config needed

**Can't login:**
- Run `npm run seed` in Railway Shell
- Check logs for errors

**YouTube search not working:**
- Add `YOUTUBE_API_KEY` to Railway variables
- Without it, mock data is used (still works!)

## Architecture

```
User Browser → Railway (Express + SQLite) → Internxt (files)
                     ↑
                /app/data/ (persistent)
                /app/downloads/ (temp)
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ Yes | Session security key |
| `YOUTUBE_API_KEY` | Optional | Real YouTube search |
| `INTERNXT_EMAIL` | Optional | Cloud storage email |
| `INTERNXT_PASSWORD` | Optional | Cloud storage password |
| `INTERNXT_APP_KEY` | Optional | Cloud storage app key |
| `NODE_ENV` | Auto | Set to `production` |
| `PORT` | Auto | Set by Railway |
| `DB_PATH` | Auto | Set to `/app/data/jamjar.db` |

## Default PINs (After Seeding)

| User | PIN | Profile |
|------|-----|---------|
| parent | 9999 | Parent dashboard |
| cristina | 1234 | Yoto player |
| isabella | 5678 | iPod |

**Change these in production!** Edit `seed.js` and re-run.
