import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database, CareerAdvisorResponse, UserAnalytics, QuizScore } from './database.types';
import type { CareerAdvisorOutput } from '@/ai/flows/career-advisor-flow';

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>();

// Types for the career advisor data
export interface CareerAdvisorData {
  interests: string[];
  currentSkills: string;
  learningStyle: 'visual' | 'hands-on' | 'reading' | 'mix';
  results: CareerAdvisorOutput;
}

// Save career advisor response to database
export async function saveCareerAdvisorResponse(data: CareerAdvisorData, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    const responseData = {
      user_id: userId,
      interests: data.interests,
      current_skills: data.currentSkills,
      learning_style: data.learningStyle,
      recommended_path_slug: data.results.recommendedPathSlug,
      justification: data.results.justification,
      skill_analysis: {
        possessed: data.results.skillAnalysis.possessed,
        missing: data.results.skillAnalysis.missing,
      },
    };

    const { error } = await supabase
      .from('career_advisor_responses')
      .insert(responseData);

    if (error) {
      console.error('Error saving career advisor response:', error);
      return { success: false, error: error.message };
    }

    // Update user analytics
    await updateUserAnalytics(userId, data);

    return { success: true };
  } catch (error) {
    console.error('Error in saveCareerAdvisorResponse:', error);
    return { success: false, error: 'Failed to save career advisor response' };
  }
}

// Update user analytics
export async function updateUserAnalytics(userId: string, data: CareerAdvisorData): Promise<void> {
  try {
    const supabase = createClient();
    
    // Get current analytics
    const { data: currentAnalytics } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    const updateData = {
      user_id: userId,
      total_career_advisor_sessions: (currentAnalytics?.total_career_advisor_sessions || 0) + 1,
      last_career_advisor_session: new Date().toISOString(),
      preferred_learning_style: data.learningStyle,
      top_interests: data.interests,
      skill_gaps: data.results.skillAnalysis.missing,
    };

    if (currentAnalytics) {
      // Update existing analytics
      await supabase
        .from('user_analytics')
        .update(updateData)
        .eq('user_id', userId);
    } else {
      // Create new analytics record
      await supabase
        .from('user_analytics')
        .insert(updateData);
    }
  } catch (error) {
    console.error('Error updating user analytics:', error);
  }
}

// Types for quiz data
export interface QuizData {
  quizContent: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  quizTopic?: string;
  timeTakenSeconds?: number;
}

// Save quiz score to database
export async function saveQuizScore(data: QuizData, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔄 saveQuizScore called with data:', data);
    console.log('🔄 User ID:', userId);
    
    const supabase = createClient();
    
    const scoreData = {
      user_id: userId,
      quiz_content: data.quizContent,
      total_questions: data.totalQuestions,
      correct_answers: data.correctAnswers,
      score_percentage: data.scorePercentage,
      quiz_topic: data.quizTopic || null,
      time_taken_seconds: data.timeTakenSeconds || null,
    };

    console.log('📊 Score data to insert:', scoreData);

    const { data: insertedData, error } = await supabase
      .from('quiz_scores')
      .insert(scoreData)
      .select();

    if (error) {
      console.error('❌ Supabase error saving quiz score:', error);
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { success: false, error: error.message };
    }

    console.log('✅ Quiz score inserted successfully:', insertedData);
    
    // Note: User analytics are automatically updated by the database trigger
    // No need for manual update to avoid duplicates
    
    return { success: true };
  } catch (error) {
    console.error('❌ Exception in saveQuizScore:', error);
    return { success: false, error: 'Failed to save quiz score' };
  }
}

// Note: updateQuizAnalytics function removed - analytics are now handled by database trigger
// This prevents duplicate updates when saving quiz scores

// Get user's quiz scores for progress tracking
export async function getUserQuizScores(userId: string, limit: number = 10): Promise<QuizScore[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching quiz scores:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserQuizScores:', error);
    return [];
  }
}

// Get quiz statistics for a user
export async function getUserQuizStats(userId: string): Promise<{
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  recentScores: QuizScore[];
  improvementTrend: 'improving' | 'declining' | 'stable';
}> {
  try {
    const supabase = createClient();
    
    // Get recent scores for trend analysis
    const { data: recentScores, error: scoresError } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (scoresError) {
      console.error('Error fetching recent quiz scores:', scoresError);
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        recentScores: [],
        improvementTrend: 'stable'
      };
    }

    // Get analytics data
    let { data: analytics, error: analyticsError } = await supabase
      .from('user_analytics')
      .select('total_quiz_sessions, average_quiz_score, best_quiz_score')
      .eq('user_id', userId)
      .single();

    if (analyticsError) {
      console.error('Error fetching quiz analytics:', analyticsError);
    }

    // If analytics are missing or show 0 but we have quiz scores, recalculate
    if ((!analytics || analytics.total_quiz_sessions === 0) && recentScores && recentScores.length > 0) {
      console.log('🔄 Recalculating quiz analytics from actual scores...');
      await recalculateQuizAnalytics(userId);
      
      // Fetch updated analytics
      const { data: updatedAnalytics } = await supabase
        .from('user_analytics')
        .select('total_quiz_sessions, average_quiz_score, best_quiz_score')
        .eq('user_id', userId)
        .single();
      
      if (updatedAnalytics) {
        analytics = updatedAnalytics;
      }
    }

    // Calculate improvement trend
    let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentScores && recentScores.length >= 3) {
      const firstHalf = recentScores.slice(-3).reduce((sum, score) => sum + score.score_percentage, 0) / 3;
      const secondHalf = recentScores.slice(0, 2).reduce((sum, score) => sum + score.score_percentage, 0) / 2;
      
      if (secondHalf > firstHalf + 5) {
        improvementTrend = 'improving';
      } else if (secondHalf < firstHalf - 5) {
        improvementTrend = 'declining';
      }
    }

    return {
      totalQuizzes: analytics?.total_quiz_sessions || 0,
      averageScore: analytics?.average_quiz_score || 0,
      bestScore: analytics?.best_quiz_score || 0,
      recentScores: recentScores || [],
      improvementTrend
    };
  } catch (error) {
    console.error('Error in getUserQuizStats:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      recentScores: [],
      improvementTrend: 'stable'
    };
  }
}

// Recalculate quiz analytics from actual quiz scores
export async function recalculateQuizAnalytics(userId: string): Promise<void> {
  try {
    console.log('🔄 Recalculating quiz analytics for user:', userId);
    
    const supabase = createClient();
    
    // Get all quiz scores for this user
    const { data: allScores, error: scoresError } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (scoresError) {
      console.error('❌ Error fetching quiz scores for recalculation:', scoresError);
      return;
    }

    if (!allScores || allScores.length === 0) {
      console.log('ℹ️ No quiz scores found for user');
      return;
    }

    // Calculate statistics
    const totalQuizzes = allScores.length;
    const averageScore = allScores.reduce((sum, score) => sum + score.score_percentage, 0) / totalQuizzes;
    const bestScore = Math.max(...allScores.map(score => score.score_percentage));

    console.log('📊 Calculated stats:', { totalQuizzes, averageScore, bestScore });

    // Get current analytics
    const { data: currentAnalytics } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (currentAnalytics) {
      // Update existing analytics
      const { error: updateError } = await supabase
        .from('user_analytics')
        .update({
          total_quiz_sessions: totalQuizzes,
          average_quiz_score: averageScore,
          best_quiz_score: bestScore,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('❌ Error updating recalculated analytics:', updateError);
      } else {
        console.log('✅ Quiz analytics recalculated and updated successfully');
      }
    } else {
      // Create new analytics record
      const { error: insertError } = await supabase
        .from('user_analytics')
        .insert({
          user_id: userId,
          total_quiz_sessions: totalQuizzes,
          average_quiz_score: averageScore,
          best_quiz_score: bestScore,
          total_career_advisor_sessions: 0,
          top_interests: [],
          skill_gaps: []
        });

      if (insertError) {
        console.error('❌ Error creating recalculated analytics:', insertError);
      } else {
        console.log('✅ Quiz analytics recalculated and created successfully');
      }
    }
  } catch (error) {
    console.error('❌ Exception in recalculateQuizAnalytics:', error);
  }
}

