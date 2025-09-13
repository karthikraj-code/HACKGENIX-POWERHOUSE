import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserAnalyticsDashboard } from "@/components/user-analytics-dashboard";
import { QuizProgressGraph } from "@/components/quiz-progress-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/error-boundary";

export default async function ProfilePage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/auth");
  }

  const user = data.session.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Profile Header */}
          <Card className="bg-white border border-gray-200 shadow-md rounded-xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-gray-700">
                <span className="font-medium text-gray-900">Email:</span>{" "}
                {user.email}
              </p>
              {user.user_metadata?.full_name && (
                <p className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-gray-700">
                  <span className="font-medium text-gray-900">Name:</span>{" "}
                  {user.user_metadata.full_name}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <ErrorBoundary>
            <Card className="bg-white border border-gray-200 shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-800">
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserAnalyticsDashboard userId={user.id} />
              </CardContent>
            </Card>
          </ErrorBoundary>

          {/* Quiz Progress Graph */}
          <ErrorBoundary>
            <Card className="bg-white border border-gray-200 shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-800">
                  Quiz Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuizProgressGraph userId={user.id} />
              </CardContent>
            </Card>
          </ErrorBoundary>

        </div>
      </div>
    </div>
  );
}
