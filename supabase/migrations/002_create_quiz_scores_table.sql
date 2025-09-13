-- Create quiz_scores table
CREATE TABLE quiz_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_content TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage DECIMAL(5,2) NOT NULL,
  quiz_topic TEXT,
  time_taken_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add quiz analytics columns to user_analytics table
ALTER TABLE user_analytics 
ADD COLUMN IF NOT EXISTS total_quiz_sessions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_quiz_score DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS best_quiz_score DECIMAL(5,2) DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX idx_quiz_scores_user_id ON quiz_scores(user_id);
CREATE INDEX idx_quiz_scores_created_at ON quiz_scores(created_at);
CREATE INDEX idx_quiz_scores_score_percentage ON quiz_scores(score_percentage);

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quiz_scores
CREATE POLICY "Users can view their own quiz scores" ON quiz_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz scores" ON quiz_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz scores" ON quiz_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update user analytics when quiz score is inserted
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

-- Create trigger to automatically update user analytics
CREATE TRIGGER update_user_quiz_analytics_trigger
  AFTER INSERT ON quiz_scores
  FOR EACH ROW EXECUTE FUNCTION update_user_quiz_analytics();
