
import { tools, Tool } from '@/lib/tools';
import { notFound } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Book, Briefcase, ExternalLink } from 'lucide-react';

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

function getToolFromSlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolFromSlug(params.slug);

  if (!tool) {
    notFound();
  }
  const Icon = tool.icon;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <Icon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            {tool.name}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{tool.description}</p>
        <div className="mt-4">
            <Badge variant="secondary">{tool.category}</Badge>
        </div>
      </header>
      
      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-headline"><Book className="mr-2 h-5 w-5 text-primary" />Learning Resources</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3">
              {tool.resources.map((resource, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div>
                        <p className="font-semibold">{resource.title}</p>
                        <Badge variant="secondary">{resource.type}</Badge>
                    </div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                        Visit <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-headline"><Briefcase className="mr-2 h-5 w-5 text-primary" />Tips for Mastery</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              {tool.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
