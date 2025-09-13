import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database, CareerAdvisorResponse, UserAnalytics } from './database.types';

// Server-side Supabase client
export const createServerClient = async () => {
  const cookieStore = await cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

// Get user's career advisor history (server-side)
export async function getUserCareerAdvisorHistory(userId: string): Promise<CareerAdvisorResponse[]> {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('career_advisor_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching career advisor history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserCareerAdvisorHistory:', error);
    return [];
  }
}

// Get user analytics (server-side)
export async function getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user analytics:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserAnalytics:', error);
    return null;
  }
}

// Get latest career advisor response (server-side)
export async function getLatestCareerAdvisorResponse(userId: string): Promise<CareerAdvisorResponse | null> {
  try {
    const supabase = await createServerClient();
    
    const { data, error } = await supabase
      .from('career_advisor_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest career advisor response:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getLatestCareerAdvisorResponse:', error);
    return null;
  }
}
