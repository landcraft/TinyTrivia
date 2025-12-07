
import { createClient } from '@supabase/supabase-js';
import { getEnv } from './utils/env';

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Key is missing. Check your environment variables or env-config.js. Auth and Database features will not work.");
}

// Fallback to a valid URL format if missing to prevent createClient from crashing the app immediately.
// Use a placeholder that won't actually work for requests, but satisfies the constructor.
const validUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(
  validUrl, 
  validKey
);
