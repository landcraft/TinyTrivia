import { createClient } from '@supabase/supabase-js';
import { getEnv } from './utils/env';

const rawUrl = getEnv('VITE_SUPABASE_URL');
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Helper to validate URL
const isValidUrl = (urlString: string) => {
  try { 
    return Boolean(new URL(urlString)); 
  } catch(e) { 
    return false; 
  }
};

let supabaseUrl = rawUrl;
let supabaseAnonKey = rawKey;

// Validation Logic
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url')) {
  console.warn("Supabase Configuration is missing or using default placeholders.");
  // We use a safe dummy URL to prevent the app from crashing on load, 
  // but Auth/DB calls will fail gracefully later.
  supabaseUrl = 'https://placeholder.supabase.co';
  supabaseAnonKey = 'placeholder-key';
} else if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);