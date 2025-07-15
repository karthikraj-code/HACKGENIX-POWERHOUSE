
import { careerPaths, CareerPath } from '@/lib/career-paths';
import { domains } from '@/lib/domains';
import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { DomainCard } from '@/components/domain-card';
import { ToolCard } from '@/components/tool-card';
import { BookOpenCheck, Wrench } from 'lucide-react';


export async function generateStaticParams() {
  return careerPaths.map((path) => ({
    slug: path.slug,
  }));
}

function getPathFromSlug(slug: string): CareerPath | undefined {
  return careerPaths.find((path) => path.slug === slug);
}

export default function CareerPathPage({ params }: { params: { slug: string } }) {
  const path = getPathFromSlug(params.slug);

  if (!path) {
    notFound();
  }
  const Icon = path.icon;

  const relevantDomains = domains.filter(d => path.domains.includes(d.slug));
  const relevantTools = tools.filter(t => path.tools.includes(t.slug));

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <Icon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            {path.name}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{path.description}</p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center flex items-center justify-center gap-3">
            <BookOpenCheck className="h-8 w-8 text-primary" />
            Recommended Domains
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relevantDomains.length > 0 ? (
            relevantDomains.map((domain) => (
              <DomainCard key={domain.slug} domain={domain} />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center">No domains specified for this path.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold font-headline mb-8 text-center flex items-center justify-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            Essential Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relevantTools.length > 0 ? (
            relevantTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center">No tools specified for this path.</p>
          )}
        </div>
      </section>
      
    </div>
  );
}
