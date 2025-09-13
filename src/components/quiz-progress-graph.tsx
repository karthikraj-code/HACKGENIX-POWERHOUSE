'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trophy, 
  Target,
  Clock,
  BarChart3
} from 'lucide-react';
import { createClient, getUserQuizStats } from '@/lib/database';
import type { QuizScore } from '@/lib/database.types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface QuizProgressGraphProps {
  userId: string;
}

export function QuizProgressGraph({ userId }: QuizProgressGraphProps) {
  const [quizStats, setQuizStats] = useState<{
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    recentScores: QuizScore[];
    improvementTrend: 'improving' | 'declining' | 'stable';
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizStats = async () => {
      try {
        console.log('🔍 QuizProgressGraph: Starting to fetch quiz stats for user:', userId);
        const stats = await getUserQuizStats(userId);
        console.log('✅ QuizProgressGraph: Successfully fetched quiz stats:', stats);
        setQuizStats(stats);
      } catch (error) {
        console.error('❌ QuizProgressGraph: Error fetching quiz stats:', error);
        console.error('❌ QuizProgressGraph: Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          userId
        });
        // Set default stats on error
        setQuizStats({
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          recentScores: [],
          improvementTrend: 'stable'
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchQuizStats();
    }
  }, [userId]);

  if (loading) {
    return <QuizProgressSkeleton />;
  }

  if (!quizStats || quizStats.totalQuizzes === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quiz Progress
          </CardTitle>
          <CardDescription>
            Your quiz performance and improvement over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Complete your first quiz to see your progress tracking here!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const chartData = quizStats.recentScores.map((score, index) => ({
    name: `Quiz ${quizStats.recentScores.length - index}`,
    score: score.score_percentage,
    correct: score.correct_answers,
    total: score.total_questions,
    date: new Date(score.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  })).reverse();

  const getTrendIcon = () => {
    switch (quizStats.improvementTrend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (quizStats.improvementTrend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendText = () => {
    switch (quizStats.improvementTrend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs Focus';
      default:
        return 'Stable';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizStats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              Quizzes completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizStats.averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizStats.bestScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Personal best
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            {getTrendIcon()}
          </CardHeader>
          <CardContent>
            <Badge className={`${getTrendColor()} border`}>
              {getTrendText()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Recent performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Trend</CardTitle>
            <CardDescription>
              Your quiz scores over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Score']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Performance</CardTitle>
            <CardDescription>
              Last 5 quiz results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Score']}
                    labelFormatter={(label) => `Quiz: ${label}`}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quiz Details */}
      {quizStats.recentScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Quiz Details
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your recent quiz attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizStats.recentScores.slice(0, 3).map((score, index) => (
                <div key={score.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      score.score_percentage >= 80 ? 'bg-green-100 text-green-600' :
                      score.score_percentage >= 60 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {score.score_percentage}%
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {score.quiz_topic || 'Quiz'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {score.correct_answers}/{score.total_questions} correct answers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(score.created_at).toLocaleDateString()}
                    </p>
                    {score.time_taken_seconds && (
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(score.time_taken_seconds / 60)}m {score.time_taken_seconds % 60}s
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QuizProgressSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
