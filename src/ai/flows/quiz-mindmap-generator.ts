'use server';
/**
 * @fileOverview Generates quizzes from a given content.
 *
 * - generateQuizzes - A function that generates quizzes.
 * - GenerateQuizzesInput - The input type for the generateQuizzes function.
 * - GenerateQuizzesOutput - The return type for the generateQuizzes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizzesInputSchema = z.object({
  content: z.string().describe('The content to generate quizzes from.'),
});

export type GenerateQuizzesInput = z.infer<typeof GenerateQuizzesInputSchema>;

const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The question text.'),
  options: z.array(z.string()).describe('The multiple choice options.'),
  answer: z.string().describe('The correct answer.'),
});

const GenerateQuizzesOutputSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe('The generated quiz questions.'),
});

export type GenerateQuizzesOutput = z.infer<typeof GenerateQuizzesOutputSchema>;

export async function generateQuizzes(input: GenerateQuizzesInput): Promise<GenerateQuizzesOutput> {
  return generateQuizzesFlow(input);
}

const generateQuizzesPrompt = ai.definePrompt({
  name: 'generateQuizzesPrompt',
  input: {schema: GenerateQuizzesInputSchema},
  output: {schema: GenerateQuizzesOutputSchema},
  prompt: `You are an expert educator who can create helpful quizzes on any subject.

  Generate a quiz with 5-10 multiple choice questions based on the following content: {{{content}}}

  Each question should have:
  - questionText: A clear, concise question
  - options: An array of 4 multiple choice options (A, B, C, D)
  - answer: The correct answer (should match one of the options exactly)

  The quiz should be formatted as a JSON object with a "quiz" field containing an array of question objects.
  `,
});

const generateQuizzesFlow = ai.defineFlow(
  {
    name: 'generateQuizzesFlow',
    inputSchema: GenerateQuizzesInputSchema,
    outputSchema: GenerateQuizzesOutputSchema,
  },
  async input => {
    const {output} = await generateQuizzesPrompt(input);
    return output!;
  }
);