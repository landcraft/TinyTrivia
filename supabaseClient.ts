import { createClient } from '@supabase/supabase-js';
import { getEnv } from './utils/env';

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase Configuration Missing!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing");
  console.warn("Using placeholder Supabase URL. Authentication and Database features will not work.");
}

// Ensure URL has protocol
let validUrl = supabaseUrl || 'https://placeholder.supabase.co';
if (validUrl && !validUrl.startsWith('http')) {
    validUrl = `https://${validUrl}`;
}

const validKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(
  validUrl, 
  validKey
);