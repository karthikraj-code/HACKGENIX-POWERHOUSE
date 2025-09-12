import { domains } from "@/lib/domains";
import { DomainCard } from "@/components/domain-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  
  // If no session, redirect to landing page
  if (!data.session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Explore Tech Domains</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Discover paths, resources, and project ideas across software, cloud, AI, design, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <DomainCard key={domain.slug} domain={domain} />
        ))}
      </div>
    </div>
  );
}


