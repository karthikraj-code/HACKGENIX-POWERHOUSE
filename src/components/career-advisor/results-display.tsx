
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Lightbulb, Loader2, Milestone, Circle as CircleIcon } from 'lucide-react';
import type { CareerAdvisorOutput } from '@/ai/flows/career-advisor-flow';
import { careerPaths } from '@/lib/career-paths';
import { PersonalizedRoadmapForm } from '@/components/personalized-roadmap-form';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Badge } from '../ui/badge';
import Link from 'next/link';

type ResultsDisplayProps = {
  results: CareerAdvisorOutput;
  restart: () => void;
};

const chartConfig = {
  value: { label: 'Skills' },
  possessed: { label: 'You Have', color: 'hsl(var(--primary))' },
  missing: { label: 'To Learn', color: 'hsl(var(--muted))' },
};

export function ResultsDisplay({ results, restart }: ResultsDisplayProps) {
  const recommendedPath = careerPaths.find((p) => p.slug === results.recommendedPathSlug);

  if (!recommendedPath) {
    return (
      <div className="text-center">
        <p>Could not find details for the recommended path.</p>
        <Button onClick={restart}>Try Again</Button>
      </div>
    );
  }

  const chartData = recommendedPath.skills.map(skill => {
    const hasSkill = results.skillAnalysis.possessed.includes(skill);
    return {
      name: skill,
      possessed: hasSkill ? 1 : 0,
      missing: hasSkill ? 0 : 1
    };
  });

  const Icon = recommendedPath.icon;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={restart}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Start Over</span>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-background">
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle className="text-2xl font-headline flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span>Your Recommended Path: {recommendedPath.name}</span>
              </CardTitle>
              <CardDescription className="mt-2 ml-16">Based on your interests and skills, this is a great place to start your journey.</CardDescription>
            </div>
            <Link href={`/career-paths/${recommendedPath.slug}`}>
              <Button variant="outline">View Full Path Details</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-2 pl-4 italic text-muted-foreground ml-16">
            "{results.justification}"
          </blockquote>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Skill Gap Analysis</CardTitle>
          <CardDescription>
            Here's a breakdown of the skills required for a {recommendedPath.name} and how your current skills stack up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <h4 className='font-semibold mb-3 flex items-center gap-2'><CheckCircle className="text-green-500 h-5 w-5" /> Skills You Have</h4>
                    <div className='flex flex-wrap gap-2'>
                        {results.skillAnalysis.possessed.length > 0 ? (
                            results.skillAnalysis.possessed.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)
                        ) : (
                            <p className='text-sm text-muted-foreground'>No matching skills identified. That's okay, everyone starts somewhere!</p>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className='font-semibold mb-3 flex items-center gap-2'><Milestone className="text-primary h-5 w-5" /> Skills to Learn</h4>
                    <div className='flex flex-wrap gap-2'>
                         {results.skillAnalysis.missing.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                    </div>
                </div>
            </div>

             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} interval={0} width={120} />
                        <Bar dataKey="possessed" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} />
                        <Bar dataKey="missing" stackId="a" fill="hsl(var(--muted))" radius={[4, 4, 4, 4]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Lightbulb className="text-accent h-5 w-5" />
            Your Personalized AI Roadmap
          </CardTitle>
          <CardDescription>
            Fill out the form below to get a step-by-step learning plan generated by our AI, tailored to your recommended path and learning style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalizedRoadmapForm
            defaultDomain={recommendedPath.name}
            defaultExperience="beginner"
          />
        </CardContent>
      </Card>
    </div>
  );
}
