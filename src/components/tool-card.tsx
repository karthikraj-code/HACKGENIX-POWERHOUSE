
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Tool } from '@/lib/tools';

type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link href={`/tools/${tool.slug}`} className="group">
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
        <CardHeader className="flex-row items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-md">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-xl">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
