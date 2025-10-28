# Security Guide for OneDate App

## 🔒 Security Checklist for Vercel Deployment

### ✅ Pre-Deployment Security

#### 1. Environment Variables
- [ ] Set up environment variables in Vercel dashboard
- [ ] Remove hardcoded API keys from source code
- [ ] Use different Supabase projects for dev/staging/production
- [ ] Rotate API keys before production deployment

#### 2. Supabase Security
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Review and test RLS policies
- [ ] Set up proper authentication policies
- [ ] Enable real-time subscriptions securely
- [ ] Configure CORS settings in Supabase

#### 3. API Security
- [ ] OpenAI API key should be server-side only (move to backend)
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Use HTTPS only

### 🛡️ Production Security Measures

#### Environment Variables to Set in Vercel:
```bash
# Supabase (Production)
REACT_APP_SUPABASE_URL=https://your-prod-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_production_anon_key

# OpenAI (Move to backend)
REACT_APP_OPENAI_API_KEY=your_openai_key

# Optional
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

#### Security Headers (Already configured in vercel.json):
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: Configured for Supabase and OpenAI

### 🚨 Critical Security Issues to Address

#### 1. OpenAI API Key Exposure
**Issue**: OpenAI API key is exposed in client-side code
**Solution**: Move to backend API or use Supabase Edge Functions

#### 2. Supabase Configuration
**Issue**: API keys in source code
**Solution**: Use environment variables only

#### 3. Input Validation
**Issue**: Limited input validation
**Solution**: Add comprehensive validation

### 🔧 Security Improvements Needed

#### 1. Move OpenAI to Backend
Create a Supabase Edge Function for OpenAI calls:

```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { message } = await req.json()
  
  // Validate input
  if (!message || typeof message !== 'string') {
    return new Response('Invalid message', { status: 400 })
  }
  
  // Call OpenAI API server-side
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
    }),
  })
  
  return new Response(JSON.stringify(await response.json()))
})
```

#### 2. Add Rate Limiting
Implement rate limiting in Supabase Edge Functions or use Vercel's built-in rate limiting.

#### 3. Input Sanitization
Add input validation for all user inputs:

```javascript
// utils/validation.js
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  return input.trim().slice(0, 1000) // Limit length
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### 📋 Deployment Checklist

#### Before Deploying:
- [ ] Remove all hardcoded secrets
- [ ] Set up production Supabase project
- [ ] Configure environment variables in Vercel
- [ ] Test all functionality with production config
- [ ] Review and update RLS policies
- [ ] Set up monitoring and logging

#### After Deploying:
- [ ] Test authentication flows
- [ ] Verify real-time functionality
- [ ] Check security headers
- [ ] Monitor for errors
- [ ] Set up alerts for security issues

### 🚀 Vercel Deployment Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required environment variables

3. **Configure Domain**
   - Set up custom domain if needed
   - Configure SSL/TLS settings

4. **Monitor Deployment**
   - Check build logs for errors
   - Test all functionality
   - Monitor performance

### 🔍 Security Monitoring

#### Set up monitoring for:
- Failed authentication attempts
- Unusual API usage patterns
- Error rates and types
- Performance metrics

#### Recommended tools:
- Sentry for error tracking
- Google Analytics for usage monitoring
- Supabase dashboard for database monitoring
- Vercel Analytics for performance monitoring
