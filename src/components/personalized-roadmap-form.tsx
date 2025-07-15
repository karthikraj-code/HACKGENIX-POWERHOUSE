
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { getPersonalizedRoadmap } from '@/app/actions';
import { domains } from '@/lib/domains';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { PersonalizedRoadmapOutput } from '@/ai/flows/personalized-roadmap';

const FormSchema = z.object({
  domain: z.string({ required_error: 'Please select a domain.' }),
  interests: z.string().min(10, 'Please describe your interests in at least 10 characters.'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

type PersonalizedRoadmapFormProps = {
  defaultDomain?: string;
  defaultExperience?: 'beginner' | 'intermediate' | 'advanced';
};

export function PersonalizedRoadmapForm({ defaultDomain, defaultExperience }: PersonalizedRoadmapFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmapOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      domain: defaultDomain || undefined,
      interests: '',
      experienceLevel: defaultExperience || 'beginner',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setRoadmap(null);
    const result = await getPersonalizedRoadmap(data);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setRoadmap(result.data);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Domain</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a domain to learn" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {domains.map(d => <SelectItem key={d.slug} value={d.name}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Interests within {form.getValues('domain') || 'this domain'}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 'building interactive UIs', 'data visualization'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Roadmap
          </Button>
        </form>
      </Form>

      {roadmap && (
        <Card className="mt-6 border-primary">
            <CardHeader>
                <CardTitle className='font-headline text-xl'>Your Personalized Roadmap</CardTitle>
            </CardHeader>
          <CardContent className="space-y-6">
             <p className='italic text-muted-foreground'>{roadmap.introduction}</p>
             <div className="space-y-6">
                {roadmap.steps.map((step, index) => (
                    <div key={index} className="relative pl-8">
                        <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                            {index + 1}
                        </div>
                        <h4 className="font-bold font-headline text-lg">{step.title}</h4>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        <ul className="space-y-2">
                            {step.subPoints.map((point, subIndex) => (
                                <li key={subIndex} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
             </div>
             <p className='italic text-muted-foreground'>{roadmap.conclusion}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
