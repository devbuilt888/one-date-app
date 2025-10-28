# OneDate App - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings (auto-detected for React)
5. Deploy

### 3. Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
# Required Variables
REACT_APP_SUPABASE_URL=https://your-prod-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_production_anon_key
REACT_APP_OPENAI_API_KEY=your_openai_api_key

# Optional Variables
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

### 4. Production Supabase Setup

#### Create Production Supabase Project:
1. Go to [supabase.com](https://supabase.com)
2. Create new project for production
3. Run the database schema from `supabase/database-schema.sql`
4. Run the foreign key fixes from `supabase/fix-all-foreign-keys.sql`
5. Configure RLS policies
6. Set up authentication settings

#### Update Supabase Settings:
- Enable email authentication
- Configure email templates
- Set up proper CORS settings
- Enable real-time subscriptions

### 5. Security Configuration

#### Supabase Security:
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

#### Vercel Security Headers:
Already configured in `vercel.json` and `public/_headers`

### 6. Domain Configuration (Optional)

#### Custom Domain:
1. In Vercel Dashboard → Domains
2. Add your custom domain
3. Configure DNS settings
4. Enable SSL (automatic with Vercel)

### 7. Monitoring Setup

#### Recommended Services:
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior tracking
- **Vercel Analytics**: Performance monitoring
- **Supabase Dashboard**: Database monitoring

#### Add to your app:
```javascript
// src/utils/analytics.js
export const initAnalytics = () => {
  if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
    // Initialize Google Analytics
  }
  
  if (process.env.REACT_APP_SENTRY_DSN) {
    // Initialize Sentry
  }
}
```

## 🔧 Build Configuration

### Vercel Build Settings:
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Package.json Scripts:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "vercel-build": "npm run build"
  }
}
```

## 🛡️ Security Checklist

### Pre-Deployment:
- [ ] Remove hardcoded API keys
- [ ] Set up production Supabase project
- [ ] Configure environment variables
- [ ] Test all functionality
- [ ] Review RLS policies
- [ ] Enable security headers

### Post-Deployment:
- [ ] Test authentication
- [ ] Verify real-time functionality
- [ ] Check security headers
- [ ] Monitor error logs
- [ ] Test on different devices
- [ ] Verify HTTPS is working

## 📊 Performance Optimization

### Vercel Optimizations:
- Automatic image optimization
- Edge caching
- CDN distribution
- Automatic HTTPS

### React Optimizations:
- Code splitting (already implemented)
- Lazy loading components
- Image optimization
- Bundle size optimization

## 🚨 Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Import/export issues
```

#### 2. Environment Variables Not Working
```bash
# Ensure variables start with REACT_APP_
# Redeploy after adding new variables
# Check variable names match exactly
```

#### 3. Supabase Connection Issues
```bash
# Verify Supabase URL and key
# Check CORS settings in Supabase
# Ensure RLS policies are correct
```

#### 4. Real-time Not Working
```bash
# Check Supabase real-time is enabled
# Verify WebSocket connections
# Check browser console for errors
```

## 📈 Monitoring and Maintenance

### Regular Tasks:
- Monitor error rates
- Check performance metrics
- Update dependencies
- Review security logs
- Backup database regularly

### Updates:
```bash
# Update dependencies
npm update

# Test locally
npm start

# Deploy updates
vercel --prod
```

## 🎯 Production Checklist

### Before Going Live:
- [ ] All environment variables set
- [ ] Production Supabase configured
- [ ] Security headers enabled
- [ ] Error monitoring set up
- [ ] Performance monitoring active
- [ ] All features tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested

### After Going Live:
- [ ] Monitor for errors
- [ ] Check user feedback
- [ ] Monitor performance
- [ ] Review security logs
- [ ] Plan for scaling
