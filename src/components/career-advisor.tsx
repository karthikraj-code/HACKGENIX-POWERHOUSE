
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getCareerAdvice, CareerAdvisorOutput } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { InterestsStep } from '@/components/career-advisor/interests-step';
import { SkillsStep } from '@/components/career-advisor/skills-step';
import { LearningStyleStep } from '@/components/career-advisor/learning-style-step';
import { ResultsDisplay } from '@/components/career-advisor/results-display';

const formSchema = z.object({
  interests: z.array(z.string()).min(1, 'Please select at least one interest.'),
  currentSkills: z.string().min(10, 'Please list some of your skills (min. 10 characters).'),
  learningStyle: z.enum(['visual', 'hands-on', 'reading', 'mix'], {
    required_error: 'Please select your preferred learning style.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 'interests', component: InterestsStep },
  { id: 'skills', component: SkillsStep },
  { id: 'learning-style', component: LearningStyleStep },
];

export function CareerAdvisor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CareerAdvisorOutput | null>(null);
  const { toast } = useToast();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
      currentSkills: '',
    },
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    const fields: (keyof FormValues)[] = Object.keys(formSchema.shape) as any;
    const currentField = fields[currentStep];
    const isValid = await trigger(currentField);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResults(null);
    const response = await getCareerAdvice(data);
    setIsLoading(false);

    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    } else if (response.data) {
      setResults(response.data);
      setCurrentStep(steps.length); // Move to results view
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setResults(null);
    methods.reset();
  }

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <FormProvider {...methods}>
      <Card>
        <CardContent className="p-4 sm:p-6 min-h-[450px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-semibold">Analyzing your profile...</h3>
                <p className="text-muted-foreground">Our AI is crafting your personalized career advice.</p>
              </motion.div>
            ) : results ? (
              <motion.div key="results">
                 <ResultsDisplay results={results} restart={restart} />
              </motion.div>
            ) : (
              <motion.form
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col h-full"
              >
                <div className="flex-grow">
                  <CurrentStepComponent />
                </div>
                
                <div className="mt-8 pt-4 border-t flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
                      Back
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button type="button" onClick={handleNext}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit">Get My Recommendation</Button>
                    )}
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
