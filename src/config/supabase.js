// Supabase Configuration
// These values should come from environment variables (.env file for development, Vercel for production)

export const SUPABASE_CONFIG = {
  // Your Supabase project URL
  url: process.env.REACT_APP_SUPABASE_URL,
  
  // Your Supabase anon public key
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  
}

// Instructions:
// 1. Create a .env file in your project root
// 2. Add REACT_APP_SUPABASE_URL=your_supabase_url
// 3. Add REACT_APP_SUPABASE_ANON_KEY=your_anon_key
// 4. For production, set these in Vercel environment variables
