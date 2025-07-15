
'use client';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BrainCircuit, Code2, Combine, Gamepad2, Layers, Monitor, Paintbrush, PenTool, Server } from 'lucide-react';

const interests = [
  { id: 'building-ui', label: 'Building beautiful and interactive user interfaces', icon: Monitor },
  { id: 'data-logic', label: 'Working with data, servers, and application logic', icon: Server },
  { id: 'full-stack', label: 'Seeing the big picture and building things end-to-end', icon: Layers },
  { id: 'problem-solving', label: 'Solving complex problems with data and algorithms', icon: BrainCircuit },
  { id: 'automation', label: 'Automating processes and managing infrastructure', icon: Combine },
  { id: 'visual-design', label: 'Creating visually appealing designs and user experiences', icon: PenTool },
  { id: 'game-dev', label: 'Building immersive games and interactive worlds', icon: Gamepad2 },
];

export function InterestsStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-headline">What excites you?</h2>
        <p className="text-muted-foreground">Select all the areas that spark your interest. This helps us find the best path for you.</p>
      </div>

      <FormField
        control={control}
        name="interests"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {interests.map((item) => (
                <FormField
                  key={item.id}
                  control={control}
                  name="interests"
                  render={({ field }) => {
                    return (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-3 cursor-pointer">
                            <item.icon className="h-6 w-6 text-primary" />
                            <span>{item.label}</span>
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage className="text-center pt-2" />
          </FormItem>
        )}
      />
    </div>
  );
}
