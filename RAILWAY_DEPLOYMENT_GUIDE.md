# Railway Deployment Guide

## 📋 Pre-Deployment Checklist

- [x] Git repository pushed to GitHub
- [x] Environment variables configured
- [x] CORS settings updated for Railway
- [x] Package.json has production start script

## 🚂 Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Step 2: Deploy from GitHub

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose repository: `my_full_stack`
4. Set Root Directory: `backend`
5. Railway auto-detects Node.js project

### Step 3: Environment Variables

Add in Railway Variables tab:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/mydatabase
JWT_SECRET = your-secret-key-here
NODE_ENV = production
PORT = ${{ PORT }}
```

### Step 4: Build Configuration

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Step 5: Deploy

- Railway automatically deploys
- Get your backend URL: `https://yourapp.up.railway.app`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import `my_full_stack` repository
3. Configure:
   - Root Directory: `Frontend/frontend`
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

### Step 3: Environment Variables

Add in Vercel:

```
REACT_APP_API_URL = https://your-railway-backend-url.up.railway.app
```

### Step 4: Deploy

- Click "Deploy"
- Get your frontend URL: `https://yourapp.vercel.app`

## ⚙️ Post-Deployment Configuration

### Update CORS (Option 1 - Environment Variable)

In Railway, add:

```
FRONTEND_URL = https://your-vercel-frontend-url.vercel.app
```

### Update CORS (Option 2 - Code Update)

Replace the allowedOrigins array with your actual URLs:

```javascript
const allowedOrigins = [
  "http://localhost:3000", // Development
  "https://your-actual-frontend.vercel.app", // Production frontend
  process.env.FRONTEND_URL,
].filter(Boolean);
```

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Error**: Update allowedOrigins with actual deployment URLs
2. **Environment Variables**: Make sure all variables are set in both platforms
3. **Build Fails**: Check Node.js version compatibility
4. **API Not Working**: Verify REACT_APP_API_URL points to Railway backend

### Railway Free Tier Limits:

- $5 free credit per month
- Automatic sleep after 10 minutes of inactivity
- 1GB RAM, 1 vCPU

### Vercel Free Tier:

- Unlimited deployments
- 100GB bandwidth per month
- Automatic HTTPS

## 📱 Testing Deployment

1. Visit your Vercel frontend URL
2. Test login/register functionality
3. Check browser console for errors
4. Verify API calls to Railway backend

## 🎉 Your App is Live!

- Frontend: https://yourapp.vercel.app
- Backend: https://yourapp.up.railway.app
