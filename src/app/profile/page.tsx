import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="mt-4 space-y-1">
        <p><span className="font-medium">Email:</span> {user.email}</p>
        {user.user_metadata?.full_name && (
          <p><span className="font-medium">Name:</span> {user.user_metadata.full_name}</p>
        )}
      </div>
    </div>
  );
}


