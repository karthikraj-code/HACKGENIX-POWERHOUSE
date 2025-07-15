
import { domains } from '@/lib/domains';
import { DomainCard } from '@/components/domain-card';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Explore Tech Domains</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Discover a world of technology! Browse domains like Web Development, Machine Learning, Cloud, UI/UX, and more. Click any card to dive into roadmaps, resources, project ideas, and essential tools for each field.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {domains.map((domain) => (
          <DomainCard key={domain.slug} domain={domain} />
        ))}
      </div>
    </div>
  );
}
