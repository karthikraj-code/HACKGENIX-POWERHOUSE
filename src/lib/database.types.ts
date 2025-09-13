export interface Database {
  public: {
    Tables: {
      career_advisor_responses: {
        Row: {
          id: string;
          user_id: string;
          interests: string[];
          current_skills: string;
          learning_style: 'visual' | 'hands-on' | 'reading' | 'mix';
          recommended_path_slug: string;
          justification: string;
          skill_analysis: {
            possessed: string[];
            missing: string[];
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          interests: string[];
          current_skills: string;
          learning_style: 'visual' | 'hands-on' | 'reading' | 'mix';
          recommended_path_slug: string;
          justification: string;
          skill_analysis: {
            possessed: string[];
            missing: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          interests?: string[];
          current_skills?: string;
          learning_style?: 'visual' | 'hands-on' | 'reading' | 'mix';
          recommended_path_slug?: string;
          justification?: string;
          skill_analysis?: {
            possessed: string[];
            missing: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      user_analytics: {
        Row: {
          id: string;
          user_id: string;
          total_career_advisor_sessions: number;
          last_career_advisor_session: string;
          preferred_learning_style: 'visual' | 'hands-on' | 'reading' | 'mix' | null;
          top_interests: string[];
          skill_gaps: string[];
          total_quiz_sessions: number;
          average_quiz_score: number;
          best_quiz_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_career_advisor_sessions?: number;
          last_career_advisor_session?: string;
          preferred_learning_style?: 'visual' | 'hands-on' | 'reading' | 'mix' | null;
          top_interests?: string[];
          skill_gaps?: string[];
          total_quiz_sessions?: number;
          average_quiz_score?: number;
          best_quiz_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_career_advisor_sessions?: number;
          last_career_advisor_session?: string;
          preferred_learning_style?: 'visual' | 'hands-on' | 'reading' | 'mix' | null;
          top_interests?: string[];
          skill_gaps?: string[];
          total_quiz_sessions?: number;
          average_quiz_score?: number;
          best_quiz_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_scores: {
        Row: {
          id: string;
          user_id: string;
          quiz_content: string;
          total_questions: number;
          correct_answers: number;
          score_percentage: number;
          quiz_topic: string | null;
          time_taken_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_content: string;
          total_questions: number;
          correct_answers: number;
          score_percentage: number;
          quiz_topic?: string | null;
          time_taken_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_content?: string;
          total_questions?: number;
          correct_answers?: number;
          score_percentage?: number;
          quiz_topic?: string | null;
          time_taken_seconds?: number | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      learning_style: 'visual' | 'hands-on' | 'reading' | 'mix';
    };
  };
}

export type CareerAdvisorResponse = Database['public']['Tables']['career_advisor_responses']['Row'];
export type UserAnalytics = Database['public']['Tables']['user_analytics']['Row'];
export type QuizScore = Database['public']['Tables']['quiz_scores']['Row'];
