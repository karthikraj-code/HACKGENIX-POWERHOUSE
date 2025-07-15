'use server';

/**
 * @fileOverview An AI agent that summarizes learning resources.
 *
 * - aiResourceSummarizer - A function that handles the summarization process.
 * - AiResourceSummarizerInput - The input type for the aiResourceSummarizer function.
 * - AiResourceSummarizerOutput - The return type for the aiResourceSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiResourceSummarizerInputSchema = z.object({
  resourceContent: z
    .string()
    .describe('The content of the learning resource (article, blog post).'),
});
export type AiResourceSummarizerInput = z.infer<typeof AiResourceSummarizerInputSchema>;

const AiResourceSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the learning resource.'),
});
export type AiResourceSummarizerOutput = z.infer<typeof AiResourceSummarizerOutputSchema>;

export async function aiResourceSummarizer(input: AiResourceSummarizerInput): Promise<AiResourceSummarizerOutput> {
  return aiResourceSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiResourceSummarizerPrompt',
  input: {schema: AiResourceSummarizerInputSchema},
  output: {schema: AiResourceSummarizerOutputSchema},
  prompt: `You are an expert summarizer of learning resources.

You will be provided with the content of a learning resource (article, blog post).
Your task is to create a concise and informative summary of the resource, highlighting the key concepts and takeaways.

Resource Content: {{{resourceContent}}}`,
});

const aiResourceSummarizerFlow = ai.defineFlow(
  {
    name: 'aiResourceSummarizerFlow',
    inputSchema: AiResourceSummarizerInputSchema,
    outputSchema: AiResourceSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
