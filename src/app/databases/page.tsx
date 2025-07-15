
import { tools } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';

export default function DatabasesPage() {
  const databases = tools.filter(tool => tool.category === 'Database');
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Databases</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
          Explore essential databases for storing, managing, and retrieving data.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {databases.map((database) => (
          <ToolCard key={database.slug} tool={database} />
        ))}
      </div>
    </div>
  );
}
