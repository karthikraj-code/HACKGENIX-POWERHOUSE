'use server';

/**
 * @fileOverview An AI agent that explains technical concepts.
 *
 * - conceptExplainer - A function that handles the explanation process.
 * - ConceptExplainerInput - The input type for the conceptExplainer function.
 * - ConceptExplainerOutput - The return type for the conceptExplainer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConceptExplainerInputSchema = z.object({
  concept: z.string().describe('The technical concept to be explained.'),
});
export type ConceptExplainerInput = z.infer<typeof ConceptExplainerInputSchema>;

const ConceptExplainerOutputSchema = z.object({
  overview: z.string().describe("A brief, one-paragraph overview of the concept."),
  keyPoints: z.array(z.object({
    point: z.string().describe("The main idea of the key point."),
    detail: z.string().describe("A short elaboration on the key point.")
  })).describe("A list of 3-5 key points that break down the concept."),
  analogy: z.string().describe("A simple analogy to help understand the concept in relatable terms."),
});
export type ConceptExplainerOutput = z.infer<typeof ConceptExplainerOutputSchema>;

export async function conceptExplainer(input: ConceptExplainerInput): Promise<ConceptExplainerOutput> {
  return conceptExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conceptExplainerPrompt',
  input: {schema: ConceptExplainerInputSchema},
  output: {schema: ConceptExplainerOutputSchema},
  prompt: `You are an expert teacher who excels at explaining complex technical topics in a simple, clear, and concise way for beginners.
Your goal is to make intimidating concepts easy to understand.
Break down the concept into an overview, a few key points, and a simple analogy.

Explain the following concept: {{{concept}}}`,
});

const conceptExplainerFlow = ai.defineFlow(
  {
    name: 'conceptExplainerFlow',
    inputSchema: ConceptExplainerInputSchema,
    outputSchema: ConceptExplainerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
