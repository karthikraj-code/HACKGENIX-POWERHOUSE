
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { CareerPath } from '@/lib/career-paths';

type CareerPathCardProps = {
  path: CareerPath;
};

export function CareerPathCard({ path }: CareerPathCardProps) {
  const Icon = path.icon;

  return (
    <Link href={`/career-paths/${path.slug}`} className="group">
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
        <CardHeader className="flex-row items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-md">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-xl">{path.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{path.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
