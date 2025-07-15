
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
import { getProjectIdea } from '@/app/actions';
import { domains } from '@/lib/domains';
import { Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import type { ProjectIdeaGeneratorOutput } from '@/ai/flows/project-idea-generator';

const FormSchema = z.object({
  domain: z.string({ required_error: 'Please select a domain.' }),
  technologies: z.string().min(2, 'Please list at least one technology.'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

export function ProjectIdeaForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState<ProjectIdeaGeneratorOutput | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      technologies: '',
      experienceLevel: 'beginner',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setIdea(null);
    const result = await getProjectIdea(data);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setIdea(result.data);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
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
                            <SelectValue placeholder="Select a domain for your project" />
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
                    name="technologies"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Technologies You Want to Use</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 'React', 'Node.js', 'Firebase'" {...field} />
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
                    Generate Project Idea
                </Button>
                </form>
            </Form>
        </CardContent>
      </Card>

      {isLoading && (
          <div className="text-center p-8">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground mt-2">Generating your custom project...</p>
          </div>
      )}

      {idea && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className='font-headline text-2xl'>{idea.title}</CardTitle>
                <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-3">Key Features to Build:</h4>
            <ul className="space-y-2">
                {idea.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
