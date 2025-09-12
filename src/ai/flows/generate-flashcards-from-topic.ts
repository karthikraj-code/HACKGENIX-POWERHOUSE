'use server';
/**
 * @fileOverview Generates flashcards from a given topic.
 *
 * - generateFlashcards - A function that generates flashcards.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().describe('The topic to generate flashcards for.'),
  numberOfCards: z
    .number()
    .min(1)
    .max(20)
    .default(5) // Setting a default value
    .describe('The number of flashcards to generate.'),
});

export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
  front: z.string().describe('The question or keyword for the flashcard.'),
  back: z.string().describe('The answer or explanation for the flashcard.'),
});

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('The generated flashcards.'),
});

export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const generateFlashcardsPrompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert educator who can create helpful flashcards on any subject.

  Generate {{numberOfCards}} flashcards on the topic of {{{topic}}}. Each flashcard should have a front (question/keyword) and a back (answer/explanation).

  The flashcards should be formatted as a JSON array of objects, where each object has a "front" and "back" field.
  `,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await generateFlashcardsPrompt(input);
    return output!;
  }
);