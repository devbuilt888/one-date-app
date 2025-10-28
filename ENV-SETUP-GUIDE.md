# Environment Variables Setup Guide

## 🔧 Required Environment Variables

Since we've removed hardcoded fallbacks, you **MUST** set up environment variables for the app to work.

### **Create `.env` File**

Create a `.env` file in your project root with these variables:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://etxohseimtmngwkfioiu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0eG9oc2VpbXRtbmd3a2Zpb2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDE1MjcsImV4cCI6MjA3NjA3NzUyN30.ZpSPQ23Ip9oP6nPxa5XoPcUWwCQE8EPtbJ8DE8TndhA

# OpenAI Configuration (for AI Dating Coach)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Analytics and Monitoring
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

## 🚨 Important Changes Made

### **1. Removed Hardcoded Fallbacks**
- **Before**: `process.env.REACT_APP_SUPABASE_URL || 'hardcoded_url'`
- **After**: `process.env.REACT_APP_SUPABASE_URL` (no fallback)

### **2. Added Validation**
- App will throw an error if environment variables are missing
- Forces proper configuration before running

### **3. Updated Instructions**
- Clear instructions for setting up `.env` file
- Production deployment guidance

## 📋 Setup Steps

### **For Development:**
1. Create `.env` file in project root
2. Copy the variables above
3. Replace `your_openai_api_key_here` with your actual OpenAI API key
4. Run `npm start`

### **For Production (Vercel):**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add the same variables (without `your_openai_api_key_here` placeholder)
3. Deploy

## 🔍 What Happens Now

### **✅ With Environment Variables:**
- App works normally
- Uses your configured values
- Secure and flexible

### **❌ Without Environment Variables:**
- App will throw an error on startup
- Forces proper configuration
- No hardcoded secrets

## 🛡️ Security Benefits

1. **No Hardcoded Secrets**: All configuration comes from environment
2. **Environment-Specific**: Different values for dev/staging/production
3. **Validation**: App fails fast if misconfigured
4. **Flexibility**: Easy to change without code changes

## 🚀 Next Steps

1. **Create `.env` file** with the variables above
2. **Test locally** with `npm start`
3. **Deploy to Vercel** with environment variables set
4. **Verify production** works correctly

The app is now properly configured for environment-based deployment!
