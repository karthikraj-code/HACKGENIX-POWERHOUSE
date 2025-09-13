import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserAnalyticsDashboard } from "@/components/user-analytics-dashboard";
import { QuizProgressGraph } from "@/components/quiz-progress-graph";
import { QuizDebug } from "@/components/quiz-debug";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              {user.user_metadata?.full_name && (
                <p><span className="font-medium">Name:</span> {user.user_metadata.full_name}</p>
              )}
              
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <UserAnalyticsDashboard userId={user.id} />

        {/* Quiz Progress Graph */}
        <QuizProgressGraph userId={user.id} />

        {/* Debug Component - Remove this after testing */}
       
      </div>
    </div>
  );
}


