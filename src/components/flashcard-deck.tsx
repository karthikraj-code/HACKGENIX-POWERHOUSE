'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards-from-topic';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Flashcard from './flashcard';

interface FlashcardDeckProps {
  data: GenerateFlashcardsOutput;
}

export default function FlashcardDeck({ data }: FlashcardDeckProps) {
  const { flashcards } = data;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };
  
  const progressValue = useMemo(() => ((currentIndex + 1) / flashcards.length) * 100, [currentIndex, flashcards.length]);

  if (!flashcards || flashcards.length === 0) {
    return <p className="text-center text-muted-foreground">No flashcards were generated. Try a different topic.</p>;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div className="w-full">
        <Flashcard key={currentIndex} front={currentCard.front} back={currentCard.back} />
      </div>

      <div className="w-full flex items-center justify-between gap-4">
        <Button variant="outline" size="icon" onClick={goToPrevious} aria-label="Previous card">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-grow flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
            </p>
            <Progress value={progressValue} className="w-full h-2" />
        </div>
        <Button variant="outline" size="icon" onClick={goToNext} aria-label="Next card">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}