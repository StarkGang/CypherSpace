import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function getImageUrl(path) {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/uploads/${path}`;
  }
  return path;
}
