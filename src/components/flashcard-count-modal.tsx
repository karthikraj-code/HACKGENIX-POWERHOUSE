'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FlashcardCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (count: number) => void;
  defaultCount?: number;
}

export default function FlashcardCountModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  defaultCount = 5 
}: FlashcardCountModalProps) {
  const [count, setCount] = useState(defaultCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count >= 1 && count <= 20) {
      onConfirm(count);
      onClose();
    }
  };

  const handleClose = () => {
    setCount(defaultCount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Number of Flashcards</DialogTitle>
          <DialogDescription>
            How many flashcards would you like to generate? (1-20)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="count" className="text-right">
                Count
              </Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={count < 1 || count > 20}>
              Generate {count} Flashcard{count !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
