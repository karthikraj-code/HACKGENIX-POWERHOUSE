'use server';

/**
 * @fileOverview A chatbot that provides the latest tech news using News API.
 *
 * - techNewsBot - A function that handles the chatbot interaction.
 * - TechNewsBotInput - The input type for the techNewsBot function.
 * - TechNewsBotOutput - The return type for the techNewsBot function.
 */

import { z } from 'zod';

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
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NEWS_API_KEY is not set in environment variables.');
  }

  const query = input.query || 'technology';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${apiKey}&pageSize=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`News API error: ${response.statusText}`);
    }
    const data = await response.json();

    const news = data.articles.map((article: any) => ({
      title: article.title,
      summary: article.description || 'No summary available.',
      source: article.source.name,
    }));

    return {
      intro: `Here are the latest tech news articles related to "${query}":`,
      news,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch tech news. Please try again later.');
  }
}
