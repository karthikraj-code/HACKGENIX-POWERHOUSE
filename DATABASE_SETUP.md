# Database Setup for User Analytics

This document explains how to set up the database tables for tracking user analytics from the Career Advisor.

## Database Tables

### 1. Career Advisor Responses Table
Stores individual career advisor session data:
- `id`: UUID primary key
- `user_id`: References auth.users(id)
- `interests`: Array of selected interests
- `current_skills`: Text description of user's skills
- `learning_style`: Enum (visual, hands-on, reading, mix)
- `recommended_path_slug`: Recommended career path
- `justification`: AI explanation for recommendation
- `skill_analysis`: JSON object with possessed/missing skills
- `created_at` / `updated_at`: Timestamps

### 2. User Analytics Table
Aggregated analytics per user:
- `id`: UUID primary key
- `user_id`: References auth.users(id) - unique
- `total_career_advisor_sessions`: Count of completed sessions
- `last_career_advisor_session`: Timestamp of most recent session
- `preferred_learning_style`: Most common learning style
- `top_interests`: Array of user's interests
- `skill_gaps`: Array of skills to develop
- `created_at` / `updated_at`: Timestamps

## Setup Instructions

### 1. Run the Migration
Execute the SQL migration file in your Supabase dashboard:

```sql
-- Copy and paste the contents of supabase/migrations/001_create_career_advisor_tables.sql
-- into the SQL Editor in your Supabase dashboard and run it
```

### 2. Verify Tables
After running the migration, verify the tables were created:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('career_advisor_responses', 'user_analytics');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('career_advisor_responses', 'user_analytics');
```

### 3. Test the Setup
1. Complete a Career Advisor session
2. Check the `career_advisor_responses` table for new data
3. Check the `user_analytics` table for updated analytics
4. Visit the Profile page to see the analytics dashboard

## Features

### Automatic Data Collection
- Every Career Advisor completion automatically saves data
- User analytics are updated in real-time
- No manual intervention required

### Privacy & Security
- Row Level Security (RLS) enabled
- Users can only access their own data
- All data is tied to authenticated user sessions

### Analytics Dashboard
- Overview cards showing key metrics
- Current career recommendation
- Interest and skill gap analysis
- Session history timeline

## Data Flow

1. **User completes Career Advisor** → Form data collected
2. **AI generates recommendation** → Results processed
3. **Data saved to database** → `career_advisor_responses` table
4. **Analytics updated** → `user_analytics` table
5. **Dashboard displays insights** → Profile page shows analytics

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check if RLS policies are properly set up

2. **Missing Data**
   - Verify the migration was run successfully
   - Check browser console for errors
   - Ensure Supabase environment variables are set

3. **Analytics Not Updating**
   - Check if `updateUserAnalytics` function is being called
   - Verify database permissions
   - Check for JavaScript errors in browser console

### Debug Queries

```sql
-- Check recent career advisor responses
SELECT * FROM career_advisor_responses 
ORDER BY created_at DESC 
LIMIT 5;

-- Check user analytics
SELECT * FROM user_analytics 
ORDER BY updated_at DESC 
LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename IN ('career_advisor_responses', 'user_analytics');
```

## Future Enhancements

- Add more detailed skill tracking
- Implement learning progress tracking
- Add goal setting and achievement tracking
- Create personalized learning recommendations
- Add social features (compare with peers)
