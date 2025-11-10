/**
 * Authentication API helpers - SERVER SIDE ONLY
 * Use these in Server Components and API routes
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Get the current user (server-side)
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: error.message };
  }

  return { user, error: null };
}


