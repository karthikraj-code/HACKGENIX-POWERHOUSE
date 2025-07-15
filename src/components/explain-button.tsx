
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getConceptExplanation } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import type { ConceptExplainerOutput } from '@/ai/flows/concept-explainer';

type ExplainButtonProps = {
  concept: string;
};

export function ExplainButton({ concept }: ExplainButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<ConceptExplainerOutput | null>(null);
  const { toast } = useToast();

  const handleFetchExplanation = async () => {
    if (explanation) return; // Don't re-fetch if we already have it

    setIsLoading(true);
    const result = await getConceptExplanation({ concept });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setOpen(false); // Close dialog on error
    } else if (result.data) {
      setExplanation(result.data);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      handleFetchExplanation();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0">
          <Wand2 className="h-4 w-4 text-accent" />
          <span className="sr-only">Explain {concept}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-accent" />
            Explain: {concept}
          </DialogTitle>
          <DialogDescription>
            Here's a simple explanation of this concept, provided by our AI tutor.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          {explanation && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2 font-headline">Overview</h4>
                <p className="text-muted-foreground">{explanation.overview}</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3 font-headline">Key Points</h4>
                <ul className="space-y-3">
                  {explanation.keyPoints.map((kp, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className='mt-1 h-2 w-2 rounded-full bg-primary shrink-0' />
                        <div>
                            <span className="font-semibold">{kp.point}:</span>{' '}
                            <span className="text-muted-foreground">{kp.detail}</span>
                        </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 font-headline">Analogy</h4>
                <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                    "{explanation.analogy}"
                </blockquote>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
