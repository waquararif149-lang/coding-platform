# Vercel Deployment Guide

## Overview
This guide explains how to deploy the Coding Platform frontend to Vercel.

## Files Created/Modified for Deployment

### 1. `vercel.json` (Root Level)
Configuration file for Vercel deployment:
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite"
}
```

### 2. `.vercelignore`
Specifies files/folders to ignore during build (backend, docs, etc.)

### 3. `.nvmrc`
Specifies Node.js version 18 for consistency

### 4. `frontend/vite.config.js`
Updated with proper build configuration:
- Output directory: `dist`
- Minification enabled
- Production-ready optimizations

### 5. `frontend/.env.example`
Template for environment variables (copy to `.env` locally)

## Deployment Steps

### Option 1: Deploy from Root Directory (Using vercel.json)
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set root directory to `/` (default)
4. Vercel will automatically detect and build using `vercel.json`
5. Output directory: `frontend/dist`

### Option 2: Deploy Frontend Folder Only (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set root directory to `frontend/`
4. Vercel will auto-detect Vite framework
5. Build command: `npm run build`
6. Output directory: `dist`

## Environment Variables

### Add to Vercel Dashboard:
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-api.com`)

### Example for Local Development:
Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000
```

## Build Troubleshooting

### If Build Still Fails:

1. **Clear cache and reinstall dependencies:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json dist
   npm install
   npm run build
   ```

2. **Check for large assets:**
   - Vite warns about large chunks
   - Check `frontend/dist` folder for massive files
   - Consider code splitting or optimization

3. **Verify All Dependencies:**
   - Run `npm install` in frontend folder
   - Ensure all imports are correct
   - Check for circular dependencies

4. **Check Vercel Logs:**
   - View detailed build logs in Vercel dashboard
   - Look for specific error messages
   - Common issues: missing dependencies, path problems

## Features Configured

✅ React 19 with Vite
✅ React Router for navigation
✅ Axios for API calls
✅ Monaco Editor for code editing
✅ Production minification
✅ Sourcemap disabled for smaller bundle
✅ Node.js 18+ support
✅ Automatic framework detection

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Backend API URL configured correctly
- [ ] All dependencies installed
- [ ] Build command tested locally: `npm run build`
- [ ] No TypeScript/ESLint errors
- [ ] All images and assets are loading
- [ ] API calls working with correct CORS headers

## Useful Commands

```bash
# Build locally to test
npm run build

# Preview production build
npm run preview

# Check for linting issues
npm run lint

# Clear Vercel cache (in Vercel dashboard)
# Settings > Deployments > Redeploy > Clear cache & redeploy
```

## Notes

- The build process takes ~2-3 minutes on Vercel
- Check build logs if deployment fails
- Frontend is optimized for production with tree-shaking
- Source maps are disabled to reduce bundle size
- Consider adding environmental detection for different API endpoints
