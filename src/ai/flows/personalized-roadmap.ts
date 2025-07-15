'use server';

/**
 * @fileOverview A personalized roadmap AI agent.
 *
 * - personalizedRoadmap - A function that handles the personalized roadmap process.
 * - PersonalizedRoadmapInput - The input type for the personalizedRoadmap function.
 * - PersonalizedRoadmapOutput - The return type for the personalizedRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRoadmapInputSchema = z.object({
  domain: z.string().describe('The tech domain for the roadmap (e.g., Web Development, Machine Learning).'),
  interests: z.string().describe('The users specific interests within the domain.'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The users current experience level.'),
});
export type PersonalizedRoadmapInput = z.infer<typeof PersonalizedRoadmapInputSchema>;

const RoadmapStepSchema = z.object({
    title: z.string().describe("A concise title for this step of the roadmap (e.g., 'Master JavaScript Fundamentals')."),
    description: z.string().describe("A one or two-sentence description of what this step involves."),
    subPoints: z.array(z.string()).describe("A list of 3-5 specific sub-topics, skills, or projects to focus on within this step.")
});

const PersonalizedRoadmapOutputSchema = z.object({
    introduction: z.string().describe("A brief, encouraging introductory sentence for the roadmap."),
    steps: z.array(RoadmapStepSchema).describe("An array of 3 to 5 structured steps for the learning roadmap."),
    conclusion: z.string().describe("A brief, encouraging concluding sentence to motivate the user.")
});
export type PersonalizedRoadmapOutput = z.infer<typeof PersonalizedRoadmapOutputSchema>;

export async function personalizedRoadmap(input: PersonalizedRoadmapInput): Promise<PersonalizedRoadmapOutput> {
  return personalizedRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRoadmapPrompt',
  input: {schema: PersonalizedRoadmapInputSchema},
  output: {schema: PersonalizedRoadmapOutputSchema},
  prompt: `You are an expert in creating personalized learning roadmaps for various tech domains.

  Based on the user's domain, interests, and experience level, create a tailored learning path.
  The roadmap should be broken down into clear, actionable steps.
  Each step must have a title, a short description, and a list of specific sub-points.
  Keep the tone encouraging and motivational.

  Domain: {{{domain}}}
  Interests: {{{interests}}}
  Experience Level: {{{experienceLevel}}}
  `,
});

const personalizedRoadmapFlow = ai.defineFlow(
  {
    name: 'personalizedRoadmapFlow',
    inputSchema: PersonalizedRoadmapInputSchema,
    outputSchema: PersonalizedRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
