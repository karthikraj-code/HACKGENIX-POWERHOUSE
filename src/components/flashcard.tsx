'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export default function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className="group w-full h-80 [perspective:1000px] cursor-pointer"
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={isFlipped ? 'Showing back of card. Press space or enter to flip.' : 'Showing front of card. Press space or enter to flip.'}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center p-6 bg-card">
          <CardContent className="text-center">
            <p className="text-2xl font-semibold font-headline">{front}</p>
          </CardContent>
          <div className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
             <RefreshCw size={16} /> <span className="text-xs">Flip</span>
          </div>
        </Card>

        {/* Back of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center p-6 bg-secondary">
          <CardContent className="text-center">
            <p className="text-lg">{back}</p>
          </CardContent>
           <div className="absolute bottom-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
             <RefreshCw size={16} /> <span className="text-xs">Flip</span>
          </div>
        </Card>
      </div>
    </div>
  );
}