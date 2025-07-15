
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
import { PersonalizedRoadmapForm } from './personalized-roadmap-form';
import { Wand2 } from 'lucide-react';

export function PersonalizedRoadmapModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <Wand2 className="mr-2 h-5 w-5" />
          Get Your Personalized AI Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Create Your Personalized Roadmap</DialogTitle>
          <DialogDescription>
            Tell us about your interests and experience, and our AI will generate a custom learning path for you.
          </DialogDescription>
        </DialogHeader>
        <PersonalizedRoadmapForm />
      </DialogContent>
    </Dialog>
  );
}
