# Environment Configuration Guide

## Overview
Both the frontend and backend now use **single environment files** with easy toggles between local and production configurations.

## Files
- **Frontend**: `/CareConnect/.env.local`
- **Backend**: `/care-connect-backend/.env`

## How to Switch Environments

### Frontend (.env.local)

**To use PRODUCTION backend:**
```env
# NEXT_PUBLIC_API_URL= http://localhost:4000
NEXT_PUBLIC_API_URL = https://keel-backend.onrender.com
```

**To use LOCAL backend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
# NEXT_PUBLIC_API_URL=https://keel-backend.onrender.com
```

After changing, restart: `npm run dev`

---

### Backend (.env)

**To use PRODUCTION frontend:**
```env
# FRONTEND_URL=http://localhost:3000
FRONTEND_URL=https://keel-ten.vercel.app

# GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
GOOGLE_CALLBACK_URL=https://keel-backend.onrender.com/auth/google/callback
```

**To use LOCAL frontend:**
```env
FRONTEND_URL=http://localhost:3000
# FRONTEND_URL=https://keel-ten.vercel.app

GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
# GOOGLE_CALLBACK_URL=https://keel-backend.onrender.com/auth/google/callback
```

After changing, restart: `npm run start:dev`

---

## Common Configurations

### Full Local Development
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000`
- Backend `.env`: `FRONTEND_URL=http://localhost:3000`
- **Requires**: Both frontend and backend running locally

### Local Frontend + Production Backend
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL=https://keel-backend.onrender.com`
- Backend `.env`: `FRONTEND_URL=http://localhost:3000`
- **Requires**: Only frontend running locally

### Production (Vercel + Render)
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL=https://keel-backend.onrender.com`
- Backend `.env`: `FRONTEND_URL=https://keel-ten.vercel.app`
- **Requires**: Both deployed

---

## Current Configuration
✅ **Frontend**: Using LOCAL backend (`http://localhost:4000`)
✅ **Backend**: Using LOCAL frontend (`http://localhost:3000`)

**Note**: To login successfully, you need to either:
1. Start your local backend server, OR
2. Switch frontend to use production backend
