'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { BookOpen, BrainCircuit, Loader2 } from 'lucide-react';

import { generateContent, ActionState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import FlashcardDeck from '@/components/flashcard-deck';
import MindmapDisplay from '@/components/mindmap-display';
import AttachmentUpload from '@/components/attachment-upload';
import FlashcardCountModal from '@/components/flashcard-count-modal';
import type { GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards-from-topic';
import type { GenerateMindmapOutput } from '@/ai/flows/generate-mindmap-from-topic';
import type { GenerateFlashcardsFromContentOutput } from '@/ai/flows/generate-flashcards-from-content';
import type { GenerateMindmapFromContentOutput } from '@/ai/flows/generate-mindmap-from-content';

function GenerationUI({ state, onAttachmentChange, attachment }: { 
  state: ActionState; 
  onAttachmentChange: (attachment: any) => void;
  attachment: any;
}) {
  const { pending } = useFormStatus();
  const [showFlashcardModal, setShowFlashcardModal] = React.useState(false);
  const [flashcardCount, setFlashcardCount] = React.useState(5);

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Start a new study session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">What do you want to learn about?</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., Quantum Mechanics for Beginners"
                required
                disabled={pending}
              />
            </div>
            
            
            {/* Attachment Upload Component */}
            <AttachmentUpload 
              onAttachmentChange={onAttachmentChange}
              disabled={pending}
            />
            
            {/* Hidden inputs for attachment data */}
            {attachment && (
              <>
                <input type="hidden" name="attachmentType" value={attachment.type} />
                <input type="hidden" name="attachmentData" value={JSON.stringify(attachment)} />
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
              <Button 
                type="button" 
                onClick={() => setShowFlashcardModal(true)} 
                disabled={pending} 
                className="w-full sm:w-auto"
              >
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                Generate Flashcards
              </Button>
              <Button type="submit" name="type" value="mindmap" disabled={pending} className="w-full sm:w-auto">
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                Generate Mindmap
              </Button>
            </div>
            
            {/* Hidden input for flashcard count */}
            <input type="hidden" name="numberOfCards" value={flashcardCount} />
          </div>
        </CardContent>
      </Card>

      {/* Flashcard Count Modal */}
      <FlashcardCountModal
        isOpen={showFlashcardModal}
        onClose={() => setShowFlashcardModal(false)}
        onConfirm={(count) => {
          setFlashcardCount(count);
          // Submit the form with flashcards type
          const form = document.querySelector('form') as HTMLFormElement;
          if (form) {
            const typeInput = document.createElement('input');
            typeInput.type = 'hidden';
            typeInput.name = 'type';
            typeInput.value = 'flashcards';
            form.appendChild(typeInput);
            form.requestSubmit();
          }
        }}
        defaultCount={flashcardCount}
      />

      <div className="mt-8 max-w-5xl mx-auto">
        {pending && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
        {state.data && !pending && (
          <>
            {state.type === 'flashcards' && (
              <FlashcardDeck data={state.data as GenerateFlashcardsOutput | GenerateFlashcardsFromContentOutput} />
            )}
            {state.type === 'mindmap' && (
              <MindmapDisplay mindmapString={(state.data as GenerateMindmapOutput | GenerateMindmapFromContentOutput).mindmap} />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function Home() {
  const { toast } = useToast();
  const initialState: ActionState = { data: null, error: null, type: null };
  const [state, formAction] = useActionState(generateContent, initialState);
  const [attachment, setAttachment] = React.useState<any>(null);

  const stateRef = React.useRef(state);
  React.useEffect(() => {
    if (state.error && state !== stateRef.current) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    stateRef.current = state;
  }, [state, toast]);

  const handleAttachmentChange = (newAttachment: any) => {
    setAttachment(newAttachment);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 md:p-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold font-headline text-primary">
          VersatileStudy
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Turn any topic into Flashcards 🎴 and Mindmaps 🧠 instantly. Upload PDFs or select from existing documents for content-specific generation.
        </p>
      </header>
      <main className="flex-grow w-full px-4 md:px-8 pb-8">
        <form action={formAction} className="w-full">
          <GenerationUI 
            state={state} 
            onAttachmentChange={handleAttachmentChange}
            attachment={attachment}
          />
        </form>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Powered by AI. Built for learners.</p>
      </footer>
    </div>
  );
}