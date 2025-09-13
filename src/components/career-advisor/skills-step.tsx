
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
            <p className="text-sm text-muted-foreground mt-2">
              💡 <strong>Tip:</strong> Don't worry about capitalization - just list what you know (e.g., "html, css, javascript, python, react")
            </p>
        </div>
      <FormField
        control={control}
        name="currentSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Current Skills</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., html, css, javascript, python, react, git, figma, sql, node.js, docker, aws, data structures..."
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
