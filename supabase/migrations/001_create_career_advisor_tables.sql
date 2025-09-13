-- Create enum for learning styles
CREATE TYPE learning_style AS ENUM ('visual', 'hands-on', 'reading', 'mix');

-- Create career_advisor_responses table
CREATE TABLE career_advisor_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interests TEXT[] NOT NULL,
  current_skills TEXT NOT NULL,
  learning_style learning_style NOT NULL,
  recommended_path_slug TEXT NOT NULL,
  justification TEXT NOT NULL,
  skill_analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_analytics table
CREATE TABLE user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_career_advisor_sessions INTEGER DEFAULT 0,
  last_career_advisor_session TIMESTAMP WITH TIME ZONE,
  preferred_learning_style learning_style,
  top_interests TEXT[] DEFAULT '{}',
  skill_gaps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_career_advisor_responses_user_id ON career_advisor_responses(user_id);
CREATE INDEX idx_career_advisor_responses_created_at ON career_advisor_responses(created_at);
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE career_advisor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own career advisor responses
CREATE POLICY "Users can view their own career advisor responses" ON career_advisor_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career advisor responses" ON career_advisor_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career advisor responses" ON career_advisor_responses
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access their own analytics
CREATE POLICY "Users can view their own analytics" ON user_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" ON user_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics" ON user_analytics
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_career_advisor_responses_updated_at
  BEFORE UPDATE ON career_advisor_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_analytics_updated_at
  BEFORE UPDATE ON user_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
