
import { tools } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';

export default function LanguagesPage() {
  const languages = tools.filter(tool => tool.category === 'Programming Language');
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Programming Languages</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Explore foundational programming languages for various tech domains.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {languages.map((language) => (
          <ToolCard key={language.slug} tool={language} />
        ))}
      </div>
    </div>
  );
}
