'use server';

/**
 * @fileOverview An AI agent that generates personalized project ideas.
 *
 * - projectIdeaGenerator - A function that handles the project idea generation process.
 * - ProjectIdeaGeneratorInput - The input type for the projectIdeaGenerator function.
 * - ProjectIdeaGeneratorOutput - The return type for the projectIdeaGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectIdeaGeneratorInputSchema = z.object({
  domain: z.string().describe('The tech domain for the project idea (e.g., Web Development, Machine Learning).'),
  technologies: z.string().describe('The specific technologies the user wants to use.'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The users current experience level.'),
});
export type ProjectIdeaGeneratorInput = z.infer<typeof ProjectIdeaGeneratorInputSchema>;

const ProjectIdeaGeneratorOutputSchema = z.object({
  title: z.string().describe("A catchy title for the project."),
  description: z.string().describe("A brief, one-paragraph description of the project."),
  features: z.array(z.string()).describe("A list of 3-5 key features to implement in the project."),
});
export type ProjectIdeaGeneratorOutput = z.infer<typeof ProjectIdeaGeneratorOutputSchema>;

export async function projectIdeaGenerator(input: ProjectIdeaGeneratorInput): Promise<ProjectIdeaGeneratorOutput> {
  return projectIdeaGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectIdeaGeneratorPrompt',
  input: {schema: ProjectIdeaGeneratorInputSchema},
  output: {schema: ProjectIdeaGeneratorOutputSchema},
  prompt: `You are an expert project mentor for students and new learners in technology.
Your task is to generate a personalized project idea based on the user's preferences.
The project should be challenging but achievable for their experience level.

Domain: {{{domain}}}
Technologies: {{{technologies}}}
Experience Level: {{{experienceLevel}}}

Generate a project with a title, a short description, and a list of 3-5 key features.`,
});

const projectIdeaGeneratorFlow = ai.defineFlow(
  {
    name: 'projectIdeaGeneratorFlow',
    inputSchema: ProjectIdeaGeneratorInputSchema,
    outputSchema: ProjectIdeaGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
