-- Fix Duplicate Quiz Analytics Triggers
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what triggers exist on the quiz_scores table
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'quiz_scores';

-- 2. Drop ALL existing triggers on quiz_scores table
DROP TRIGGER IF EXISTS update_user_quiz_analytics_trigger ON quiz_scores;

-- 3. Recreate the function (in case it was duplicated too)
CREATE OR REPLACE FUNCTION update_user_quiz_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user analytics with new quiz data
  INSERT INTO user_analytics (
    user_id,
    total_quiz_sessions,
    average_quiz_score,
    best_quiz_score
  )
  VALUES (
    NEW.user_id,
    1,
    NEW.score_percentage,
    NEW.score_percentage
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_quiz_sessions = user_analytics.total_quiz_sessions + 1,
    average_quiz_score = (
      (user_analytics.average_quiz_score * user_analytics.total_quiz_sessions + NEW.score_percentage) 
      / (user_analytics.total_quiz_sessions + 1)
    ),
    best_quiz_score = GREATEST(user_analytics.best_quiz_score, NEW.score_percentage),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Create ONLY ONE trigger
CREATE TRIGGER update_user_quiz_analytics_trigger
  AFTER INSERT ON quiz_scores
  FOR EACH ROW EXECUTE FUNCTION update_user_quiz_analytics();

-- 5. Verify only one trigger exists now
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'quiz_scores';
