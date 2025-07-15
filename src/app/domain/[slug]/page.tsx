
import { domains, Domain } from '@/lib/domains';
import { notFound } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Book, Brain, Briefcase, ExternalLink, Lightbulb, List, Milestone, Wrench } from 'lucide-react';
import { ExplainButton } from '@/components/explain-button';

export async function generateStaticParams() {
  return domains.map((domain) => ({
    slug: domain.slug,
  }));
}

function getDomainFromSlug(slug: string): Domain | undefined {
  return domains.find((domain) => domain.slug === slug);
}

export default function DomainPage({ params }: { params: { slug: string } }) {
  const domain = getDomainFromSlug(params.slug);

  if (!domain) {
    notFound();
  }
  const Icon = domain.icon;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <Icon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            {domain.name}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{domain.description}</p>
      </header>
      
      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-headline"><Milestone className="mr-2 h-5 w-5 text-primary" />Beginner Roadmap</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4 pl-6">
              {domain.roadmap.map((step, index) => (
                <li key={index} className="relative pl-6">
                  <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{step.title}</h4>
                    <ExplainButton concept={step.title} />
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-headline"><Book className="mr-2 h-5 w-5 text-primary" />Best Resources</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3">
              {domain.resources.map((resource, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2">
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

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-headline"><Lightbulb className="mr-2 h-5 w-5 text-primary" />Project Ideas</AccordionTrigger>
          <AccordionContent>
             <ul className="space-y-4">
              {domain.projectIdeas.map((project, index) => (
                <li key={index} className="p-3 bg-card rounded-md border">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{project.title}</h4>
                      <ExplainButton concept={project.title} />
                    </div>
                    <Badge variant={project.difficulty === 'Beginner' ? 'outline' : 'default'} className="capitalize">{project.difficulty}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{project.description}</p>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl font-headline"><Wrench className="mr-2 h-5 w-5 text-primary" />Tools Needed</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3">
              {domain.tools.map((tool, index) => (
                <li key={index} className="flex items-center gap-2">
                  <p><span className="font-semibold">{tool.name}:</span> <span className="text-muted-foreground">{tool.description}</span></p>
                  <ExplainButton concept={tool.name} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-xl font-headline"><Briefcase className="mr-2 h-5 w-5 text-primary" />Personal Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              {domain.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
