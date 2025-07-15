'use server';

/**
 * @fileOverview A chatbot that provides the latest tech news.
 *
 * - techNewsBot - A function that handles the chatbot interaction.
 * - TechNewsBotInput - The input type for the techNewsBot function.
 * - TechNewsBotOutput - The return type for the techNewsBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TechNewsBotInputSchema = z.object({
  query: z.string().describe("The user's question about tech news."),
});
export type TechNewsBotInput = z.infer<typeof TechNewsBotInputSchema>;

const NewsItemSchema = z.object({
    title: z.string().describe('The headline of the news article.'),
    summary: z.string().describe('A brief summary of the news article.'),
    source: z.string().optional().describe('The source of the news (e.g., The Verge, TechCrunch).'),
});

const TechNewsBotOutputSchema = z.object({
  intro: z.string().describe("A friendly introductory sentence before listing the news items."),
  news: z.array(NewsItemSchema).describe("A list of the latest tech news articles related to the user's query."),
});
export type TechNewsBotOutput = z.infer<typeof TechNewsBotOutputSchema>;

export async function techNewsBot(input: TechNewsBotInput): Promise<TechNewsBotOutput> {
  return techNewsBotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'techNewsBotPrompt',
  input: {schema: TechNewsBotInputSchema},
  output: {schema: TechNewsBotOutputSchema},
  prompt: `You are "Techie," a friendly and knowledgeable AI chatbot expert on the latest technology news.
Your role is to provide users with concise and accurate updates on what's happening in the tech world.
Based on the user's query, find relevant recent news and present it as a list of items.
Start with a friendly introductory sentence.

User query: {{{query}}}`,
});

const techNewsBotFlow = ai.defineFlow(
  {
    name: 'techNewsBotFlow',
    inputSchema: TechNewsBotInputSchema,
    outputSchema: TechNewsBotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
