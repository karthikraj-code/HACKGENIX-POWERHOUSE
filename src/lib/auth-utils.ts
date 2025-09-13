import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current user ID for logged-in users
 * Returns a consistent user ID without complex authentication checks
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    
    // First, try to get the persistent user ID from our custom cookie
    const persistentUserId = cookieStore.get('user-id')?.value;
    if (persistentUserId) {
      console.log(`✅ [AUTH] Using persistent user ID: ${persistentUserId}`);
      return persistentUserId;
    }
    
    // Fallback: Try to get access token first, then refresh token
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    const token = accessToken || refreshToken;
    
    if (!token) {
      console.log('🔍 [AUTH] No authentication token found');
      return null;
    }

    // Get user from token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.log(`❌ [AUTH] Error getting user: ${error.message}`);
      return null;
    }
    
    if (!user) {
      console.log('❌ [AUTH] No user found in token');
      return null;
    }

    console.log(`✅ [AUTH] User authenticated: ${user.id} (${user.email})`);
    return user.id;
    
  } catch (error) {
    console.error('❌ [AUTH] Error in getCurrentUserId:', error);
    return null;
  }
}

/**
 * Get user ID with fallback to a default user ID for development
 * This ensures we always have a user ID to work with
 */
export async function getUserIdWithFallback(): Promise<string> {
  const userId = await getCurrentUserId();
  
  if (userId) {
    return userId;
  }
  
  // Fallback to a default user ID for development/testing
  // In production, you might want to redirect to login instead
  const fallbackUserId = 'default-user-id';
  console.log(`⚠️ [AUTH] No authenticated user, using fallback ID: ${fallbackUserId}`);
  return fallbackUserId;
}

/**
 * Check if user is authenticated
 */
export async function isUserAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId !== null;
}
