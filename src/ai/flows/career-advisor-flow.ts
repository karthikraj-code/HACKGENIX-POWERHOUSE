
'use server';

/**
 * @fileOverview An AI agent that recommends a career path and analyzes skill gaps.
 *
 * - careerAdvisor - A function that handles the career advice process.
 * - CareerAdvisorInput - The input type for the careerAdvisor function.
 * - CareerAdvisorOutput - The return type for the careerAdvisor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { careerPaths } from '@/lib/career-paths';

const allPathSlugs = careerPaths.map(p => p.slug) as [string, ...string[]];
const allPathSkills = [...new Set(careerPaths.flatMap(p => p.skills))];

const CareerAdvisorInputSchema = z.object({
  interests: z.array(z.string()).describe('A list of the user\'s selected interests.'),
  currentSkills: z.string().describe('A string where the user lists their current skills and experience.'),
  learningStyle: z.string().describe('The user\'s preferred learning style (e.g., visual, hands-on).'),
});
export type CareerAdvisorInput = z.infer<typeof CareerAdvisorInputSchema>;

const CareerAdvisorOutputSchema = z.object({
  recommendedPathSlug: z.enum(allPathSlugs).describe('The slug of the recommended career path.'),
  justification: z.string().describe('A brief, one-sentence justification for why this path was recommended, written in an encouraging tone.'),
  skillAnalysis: z.object({
    possessed: z.array(z.string()).describe('A list of skills the user likely possesses that are relevant to the recommended path.'),
    missing: z.array(z.string()).describe('A list of skills the user likely needs to learn for the recommended path.'),
  }),
});
export type CareerAdvisorOutput = z.infer<typeof CareerAdvisorOutputSchema>;

export async function careerAdvisor(input: CareerAdvisorInput): Promise<CareerAdvisorOutput> {
  return careerAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerAdvisorPrompt',
  input: { schema: CareerAdvisorInputSchema },
  output: { schema: CareerAdvisorOutputSchema },
  prompt: `You are an expert career advisor for people entering the tech industry.
Your goal is to recommend the best career path based on the user's interests and skills.
You will also perform a skill-gap analysis.

Analyze the user's input:
- Interests: {{{json interests}}}
- Current Skills: "{{{currentSkills}}}"
- Learning Style: "{{{learningStyle}}}"

Here are the available career paths and their required skills:
{{#each C.careerPaths}}
- Path: {{this.name}} (slug: {{this.slug}})
  - Required Skills: {{json this.skills}}
{{/each}}

Based on all the information, perform the following tasks:

1.  **Recommend a Career Path**: Choose the single best career path slug from the available list that aligns with the user's interests.

2.  **Justify Your Recommendation**: Write a short, encouraging, one-sentence explanation for your choice. For example, "Because you enjoy building interfaces and have some design skills, Frontend Development is a great fit!"

3.  **Analyze Skills**:
    - Compare the user's "Current Skills" with the "Required Skills" for your recommended path.
    - Identify which skills the user seems to have (possessed).
    - Identify which skills the user seems to be missing.
    - The available skills to choose from are: {{json C.allPathSkills}}
    - Be realistic. If the user only mentions "Python", don't assume they also know "Pandas" and "NumPy" unless they state it.

Return the final output in the required JSON format.
`,
});

const careerAdvisorFlow = ai.defineFlow(
  {
    name: 'careerAdvisorFlow',
    inputSchema: CareerAdvisorInputSchema,
    outputSchema: CareerAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, {
      C: {
        careerPaths,
        allPathSkills,
      },
    });
    return output!;
  }
);
