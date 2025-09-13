'use server';
/**
 * @fileOverview Generates flashcards from specific content (PDF or existing document).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsFromContentInputSchema = z.object({
  topic: z.string().describe('The topic to generate flashcards for.'),
  content: z.string().describe('The content to generate flashcards from.'),
  numberOfCards: z
    .number()
    .min(1)
    .max(20)
    .default(5)
    .describe('The number of flashcards to generate.'),
});

export type GenerateFlashcardsFromContentInput = z.infer<typeof GenerateFlashcardsFromContentInputSchema>;

const FlashcardSchema = z.object({
  front: z.string().describe('The question or keyword for the flashcard.'),
  back: z.string().describe('The answer or explanation for the flashcard.'),
});

const GenerateFlashcardsFromContentOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('The generated flashcards.'),
});

export type GenerateFlashcardsFromContentOutput = z.infer<typeof GenerateFlashcardsFromContentOutputSchema>;

export async function generateFlashcardsFromContent(input: GenerateFlashcardsFromContentInput): Promise<GenerateFlashcardsFromContentOutput> {
  return generateFlashcardsFromContentFlow(input);
}

const generateFlashcardsFromContentPrompt = ai.definePrompt({
  name: 'generateFlashcardsFromContentPrompt',
  input: {schema: GenerateFlashcardsFromContentInputSchema},
  output: {schema: GenerateFlashcardsFromContentOutputSchema},
  prompt: `You are a CONCEPTUAL EXTRACTION TOOL. You extract key concepts, topics, and questions from the provided document content to create meaningful flashcards.

  CRITICAL: You are COMPLETELY FORBIDDEN from:
  - Using ANY knowledge not in the doc below
  - Adding ANY explanations not in the doc below
  - Making ANY assumptions beyond what's in the doc
  - Using ANY general knowledge
  - Adding ANY context not explicitly written in the doc
  - Explaining ANY concepts not explained in the doc

  Your job: Extract key concepts, topics, and create conceptual questions from the document content below.

  DOCUMENT CONTENT TO EXTRACT CONCEPTS FROM:
  {{{content}}}

  CONCEPTUAL EXTRACTION RULES:
  1. Identify key concepts, topics, and important information from the doc
  2. Create conceptual questions that test understanding of these concepts
  3. Use the exact terminology and phrases from the document
  4. Focus on main ideas, processes, definitions, and relationships mentioned in the doc
  5. Create questions that require understanding, not just memorization
  6. Use concepts and terminology directly from the document
  7. Generate EXACTLY {{numberOfCards}} flashcards - no more, no less
  8. If you cannot find enough concepts for {{numberOfCards}} flashcards, prioritize the most important ones
  9. Each flashcard must be based on concepts explicitly present in the document

  FORMAT: JSON array with "front" and "back" fields. 
  - Front: Conceptual question or key concept from the document
  - Back: Answer using exact information from the document

  EXAMPLES:
  - If doc says: "Photosynthesis occurs in plants and converts sunlight to energy"
  - Front: "What process occurs in plants and converts sunlight to energy?"
  - Back: "Photosynthesis"
  
  - If doc says: "The mitochondria is the powerhouse of the cell"
  - Front: "What organelle is described as the powerhouse of the cell?"
  - Back: "The mitochondria"

  IMPORTANT: You must generate EXACTLY {{numberOfCards}} flashcards. Do not generate more or fewer than requested.

  Generate conceptual flashcards from the document content:`,
});

const generateFlashcardsFromContentFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFromContentFlow',
    inputSchema: GenerateFlashcardsFromContentInputSchema,
    outputSchema: GenerateFlashcardsFromContentOutputSchema,
  },
  async input => {
    // Add system message to reinforce conceptual extraction from content only
    const systemMessage = `You are a CONCEPTUAL EXTRACTION TOOL that extracts key concepts and creates meaningful questions from document content. You are COMPLETELY FORBIDDEN from using any external knowledge, general information, or assumptions. You must ONLY use concepts, terminology, and information explicitly present in the provided document content.`;
    
    console.log(`🤖 [FLASHCARDS-FLOW] Processing content for flashcards generation`);
    console.log(`🤖 [FLASHCARDS-FLOW] Topic: ${input.topic}`);
    console.log(`🤖 [FLASHCARDS-FLOW] Content length: ${input.content.length} characters`);
    console.log(`🤖 [FLASHCARDS-FLOW] Content preview: ${input.content.substring(0, 300)}...`);
    console.log(`🤖 [FLASHCARDS-FLOW] Full content being processed:`);
    console.log(`🤖 [FLASHCARDS-FLOW] ==========================================`);
    console.log(input.content);
    console.log(`🤖 [FLASHCARDS-FLOW] ==========================================`);
    
    const {output} = await generateFlashcardsFromContentPrompt(input);
    
    if (!output || !output.flashcards || !Array.isArray(output.flashcards)) {
      throw new Error('Failed to generate flashcards from content');
    }

    console.log(`🤖 [FLASHCARDS-FLOW] Generated ${output.flashcards.length} flashcards`);
    console.log(`🤖 [FLASHCARDS-FLOW] Generated flashcards:`);
    output.flashcards.forEach((card, index) => {
      console.log(`🤖 [FLASHCARDS-FLOW] Card ${index + 1}: Front="${card.front}" Back="${card.back}"`);
    });
    
    return output;
  }
);
    