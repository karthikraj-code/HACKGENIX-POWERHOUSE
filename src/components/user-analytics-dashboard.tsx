'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Calendar,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Award,
  BarChart3,
  Clock,
  Users,
  Star,
  ArrowUp,
  Activity
} from 'lucide-react';
import { createClient } from '@/lib/database';
import type { UserAnalytics, CareerAdvisorResponse } from '@/lib/database.types';
import { careerPaths } from '@/lib/career-paths';

interface UserAnalyticsDashboardProps {
  userId: string;
}

export function UserAnalyticsDashboard({ userId }: UserAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [careerHistory, setCareerHistory] = useState<CareerAdvisorResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch user analytics
        const { data: analyticsData } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('user_id', userId)
          .single();

        // Fetch career advisor history
        const { data: historyData } = await supabase
          .from('career_advisor_responses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        setAnalytics(analyticsData);
        setCareerHistory(historyData || []);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!analytics) {
    return (
      <Card className="border-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Learning Analytics
          </CardTitle>
          <CardDescription className="text-base">
            Complete the Career Advisor to see your personalized analytics dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-5 shadow-xl">
              <Lightbulb className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Ready to Begin?</h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Start your journey by taking the Career Advisor assessment to unlock personalized insights, 
              recommendations, and track your progress over time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestResponse = careerHistory[0];
  const recommendedPath = careerPaths.find(p => p.slug === latestResponse?.recommended_path_slug);

  // Calculate some derived metrics for enhanced display
  const progressPercentage = Math.min((analytics.total_career_advisor_sessions * 20), 100);
  const skillDevelopmentProgress = analytics.skill_gaps ? Math.max(0, 100 - (analytics.skill_gaps.length * 10)) : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Your Learning Journey
        </h1>
        <p className="text-muted-foreground">Track your progress and discover new opportunities</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Sessions</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500 p-2 shadow-md">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{analytics.total_career_advisor_sessions}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <p className="text-xs text-muted-foreground">Career assessments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Learning Style</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500 p-2 shadow-md">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100 capitalize truncate">
              {analytics.preferred_learning_style?.replace('-', ' ') || 'Not set'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Your preference</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Interests</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500 p-2 shadow-md">
              <Star className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{analytics.top_interests?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Areas identified</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Skill Gaps</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-500 p-2 shadow-md">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{analytics.skill_gaps?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">To develop</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Quizzes</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500 p-2 shadow-md">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{analytics.total_quiz_sessions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Avg Score</CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-500 p-2 shadow-md">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{(analytics.average_quiz_score || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Quiz performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <BarChart3 className="h-5 w-5" />
              Learning Progress
            </CardTitle>
            <CardDescription>Your journey so far</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Assessment Completion</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Skill Development</span>
                <span className="font-medium">{skillDevelopmentProgress}%</span>
              </div>
              <Progress value={skillDevelopmentProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Clock className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>At a glance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">Total Assessments</span>
              <Badge variant="secondary" className="font-medium">{analytics.total_career_advisor_sessions}</Badge>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">Quiz Success Rate</span>
              <Badge variant="secondary" className="font-medium">{(analytics.average_quiz_score || 0).toFixed(0)}%</Badge>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">Active Skills</span>
              <Badge variant="secondary" className="font-medium">{analytics.top_interests?.length || 0}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Recommendation */}
      {latestResponse && recommendedPath && (
        <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30 border-emerald-200 dark:border-emerald-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <div className="h-8 w-8 rounded-full bg-emerald-500 p-2">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              Current Recommendation
            </CardTitle>
            <CardDescription>
              Based on your latest assessment • {new Date(latestResponse.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border">
                <recommendedPath.icon className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                    {recommendedPath.name}
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300">{recommendedPath.description}</p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border-l-4 border-emerald-500">
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">
                    "{latestResponse.justification}"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interests and Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Interests */}
        <Card className="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <div className="h-8 w-8 rounded-full bg-amber-500 p-2">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              Your Interests
            </CardTitle>
            <CardDescription>
              Areas that excite you most ({analytics.top_interests?.length || 0} identified)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.top_interests?.map((interest: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-sm bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                >
                  {interest.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
              ))}
              {(!analytics.top_interests || analytics.top_interests.length === 0) && (
                <p className="text-sm text-muted-foreground italic">Complete an assessment to discover your interests</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        <Card className="bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <div className="h-8 w-8 rounded-full bg-orange-500 p-2">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              Development Focus
            </CardTitle>
            <CardDescription>
              Skills to strengthen ({analytics.skill_gaps?.length || 0} identified)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.skill_gaps?.slice(0, 6).map((skill: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="h-2 w-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                  <span className="text-sm font-medium flex-1">{skill}</span>
                  <Badge variant="outline" className="text-xs">Focus</Badge>
                </div>
              ))}
              {analytics.skill_gaps && analytics.skill_gaps.length > 6 && (
                <div className="text-center pt-2">
                  <Badge variant="secondary" className="text-xs">
                    +{analytics.skill_gaps.length - 6} more skills to explore
                  </Badge>
                </div>
              )}
              {(!analytics.skill_gaps || analytics.skill_gaps.length === 0) && (
                <p className="text-sm text-muted-foreground italic">Great job! No major skill gaps identified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent History */}
      {careerHistory.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/20 dark:to-gray-950/20 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <div className="h-8 w-8 rounded-full bg-slate-500 p-2">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              Assessment History
            </CardTitle>
            <CardDescription>
              Your recent career advisor sessions ({careerHistory.length} shown)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {careerHistory.map((response: CareerAdvisorResponse, index: number) => {
                const path = careerPaths.find(p => p.slug === response.recommended_path_slug);
                const isLatest = index === 0;
                return (
                  <div key={response.id} className={`flex items-center gap-4 p-4 border rounded-xl transition-all hover:shadow-md ${
                    isLatest 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800' 
                      : 'bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      isLatest 
                        ? 'bg-blue-500 shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {path && <path.icon className={`h-6 w-6 ${isLatest ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{path?.name || response.recommended_path_slug}</h4>
                        {isLatest && <Badge className="bg-green-500 text-white text-xs">Current</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(response.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="capitalize text-xs">
                          {response.learning_style.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-2" {...({} as any)} />
        <Skeleton className="h-4 w-48 mx-auto" {...({} as any)} />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-16" {...({} as any)} />
              <Skeleton className="h-8 w-8 rounded-full" {...({} as any)} />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" {...({} as any)} />
              <Skeleton className="h-3 w-20" {...({} as any)} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" {...({} as any)} />
              <Skeleton className="h-4 w-24" {...({} as any)} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-full mb-2" {...({} as any)} />
                <Skeleton className="h-2 w-full" {...({} as any)} />
              </div>
              <div>
                <Skeleton className="h-4 w-full mb-2" {...({} as any)} />
                <Skeleton className="h-2 w-full" {...({} as any)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Large Cards */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" {...({} as any)} />
            <Skeleton className="h-4 w-64" {...({} as any)} />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" {...({} as any)} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" {...({} as any)} />
                <Skeleton className="h-4 w-48" {...({} as any)} />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" {...({} as any)} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}