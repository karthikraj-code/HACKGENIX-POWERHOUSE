'use server';
/**
 * @fileOverview Generates a mindmap from a given topic using AI.
 *
 * - generateMindmap - A function that generates a mindmap from a given topic.
 * - GenerateMindmapInput - The input type for the generateMindmap function.
 * - GenerateMindmapOutput - The return type for the generateMindmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMindmapInputSchema = z.object({
  topic: z.string().describe('The topic to generate a mindmap for.'),
});
export type GenerateMindmapInput = z.infer<typeof GenerateMindmapInputSchema>;

const GenerateMindmapOutputSchema = z.object({
  mindmap: z.string().describe('The generated mindmap in a structured format.'),
});
export type GenerateMindmapOutput = z.infer<typeof GenerateMindmapOutputSchema>;

export async function generateMindmap(input: GenerateMindmapInput): Promise<GenerateMindmapOutput> {
  return generateMindmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMindmapPrompt',
  input: {schema: GenerateMindmapInputSchema},
  output: {schema: GenerateMindmapOutputSchema},
  prompt: `You are an AI expert in creating mindmaps. Your task is to generate a mindmap for the given topic. The mindmap must be a hierarchical list using markdown's dash (-) syntax with indentation. Each item must be extremely concise (1-3 words maximum).

Example for "Linear Search":
- Linear Search
  - Concept
    - Sequential Check
  - Process
    - Start to End
    - Compare Items
  - Complexity
    - Best: O(1)
    - Worst: O(n)
  - Use Cases
    - Unsorted Data
    - Small Lists

Topic: {{{topic}}}

Mindmap:`,
});

const generateMindmapFlow = ai.defineFlow(
  {
    name: 'generateMindmapFlow',
    inputSchema: GenerateMindmapInputSchema,
    outputSchema: GenerateMindmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);