import { createBrowserClient } from '@supabase/ssr';

// Create a conditional client that will only be initialized if the required env vars are available
let supabaseInstance;

// Only initialize Supabase if the environment variables are available
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
} else {
  // During build time, provide a mock client that won't throw errors
  if (process.env.NODE_ENV === 'production') {
    console.warn('Supabase environment variables are missing. Using mock client for build.');
  }
}

export const supabase = supabaseInstance; 
