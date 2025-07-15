
'use client';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen, DraftingCompass, Hand, SlidersHorizontal } from 'lucide-react';

const learningStyles = [
  { value: 'visual', label: 'Visual', description: 'I learn best by watching videos and seeing examples.', icon: DraftingCompass },
  { value: 'hands-on', label: 'Hands-on', description: 'I learn best by doing and building projects.', icon: Hand },
  { value: 'reading', label: 'Reading', description: 'I learn best by reading articles and documentation.', icon: BookOpen },
  { value: 'mix', label: 'A Mix of Everything', description: 'I like a balanced approach using all methods.', icon: SlidersHorizontal },
];

export function LearningStyleStep() {
  const { control } = useFormContext();
  return (
    <div className="space-y-6">
        <div className="text-center">
            <h2 className="text-2xl font-bold font-headline">How do you like to learn?</h2>
            <p className="text-muted-foreground">Your preferred learning style helps us tailor resource suggestions.</p>
        </div>
        <FormField
            control={control}
            name="learningStyle"
            render={({ field }) => (
            <FormItem className="space-y-3">
                <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {learningStyles.map((style) => (
                    <FormItem key={style.value} className="flex items-center space-x-3 space-y-0">
                        <label className="flex flex-col justify-between items-start p-4 border rounded-lg cursor-pointer w-full transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <div className="flex items-center justify-between w-full">
                                <div className='flex items-center gap-3'>
                                    <style.icon className="h-6 w-6 text-primary" />
                                    <FormLabel className="font-semibold text-lg cursor-pointer">{style.label}</FormLabel>
                                </div>
                                <FormControl>
                                    <RadioGroupItem value={style.value} />
                                </FormControl>
                            </div>
                            <p className="text-muted-foreground mt-2">{style.description}</p>
                        </label>
                    </FormItem>
                    ))}
                </RadioGroup>
                </FormControl>
                <FormMessage className="text-center" />
            </FormItem>
            )}
        />
    </div>
  );
}
