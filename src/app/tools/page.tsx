
import { tools } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';

export default function ToolsPage() {
  const filteredTools = tools.filter(tool => tool.category !== 'Programming Language' && tool.category !== 'Database');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Tools Explorer</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Discover essential tools for developers, designers, and creators.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
