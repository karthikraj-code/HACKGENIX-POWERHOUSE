
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Domain } from '@/lib/domains';

type DomainCardProps = {
  domain: Domain;
};

export function DomainCard({ domain }: DomainCardProps) {
  const Icon = domain.icon;

  return (
    <Link href={`/domain/${domain.slug}`} className="group">
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
        <CardHeader className="flex-row items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-md">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-xl">{domain.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{domain.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
