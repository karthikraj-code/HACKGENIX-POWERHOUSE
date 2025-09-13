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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Decorative gradient blobs for uniqueness */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 -right-24 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Profile Header */}
          <Card className="bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-3xl overflow-hidden transition hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <CardTitle className="text-3xl font-extrabold text-white tracking-wide">
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 shadow-inner text-gray-800">
                <span className="font-semibold text-blue-700">Email:</span>{" "}
                {user.email}
              </p>
              {user.user_metadata?.full_name && (
                <p className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 shadow-inner text-gray-800">
                  <span className="font-semibold text-purple-700">Name:</span>{" "}
                  {user.user_metadata.full_name}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <ErrorBoundary>
            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-lg shadow-lg border border-blue-200/40 transition hover:shadow-xl">
              <h2 className="text-xl font-bold text-blue-600 mb-4">
                📊 Your Analytics
              </h2>
              <UserAnalyticsDashboard userId={user.id} />
            </div>
          </ErrorBoundary>

          {/* Quiz Progress Graph */}
          <ErrorBoundary>
            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-lg shadow-lg border border-purple-200/40 transition hover:shadow-xl">
              <h2 className="text-xl font-bold text-purple-600 mb-4">
                📈 Quiz Progress
              </h2>
              <QuizProgressGraph userId={user.id} />
            </div>
          </ErrorBoundary>

        </div>
      </div>
    </div>
  );
}
