
'use client';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export function SkillsStep() {
  const { control } = useFormContext();
  return (
    <div className="space-y-6">
        <div className="text-center">
            <h2 className="text-2xl font-bold font-headline">What are your current skills?</h2>
            <p className="text-muted-foreground">List any technologies, programming languages, or concepts you're familiar with. Be honest!</p>
        </div>
      <FormField
        control={control}
        name="currentSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Current Skills</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Python, basic HTML/CSS, Git, Figma, SQL, studied data structures in college..."
                className="min-h-[200px] resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage className='text-center' />
          </FormItem>
        )}
      />
    </div>
  );
}
