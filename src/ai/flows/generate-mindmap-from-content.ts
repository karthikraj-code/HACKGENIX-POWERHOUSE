'use server';
/**
 * @fileOverview Generates a mindmap from specific content (PDF or existing document).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMindmapFromContentInputSchema = z.object({
  topic: z.string().describe('The topic to generate a mindmap for.'),
  content: z.string().describe('The content to generate a mindmap from.'),
});

export type GenerateMindmapFromContentInput = z.infer<typeof GenerateMindmapFromContentInputSchema>;

const GenerateMindmapFromContentOutputSchema = z.object({
  mindmap: z.string().describe('The generated mindmap in a structured format.'),
});

export type GenerateMindmapFromContentOutput = z.infer<typeof GenerateMindmapFromContentOutputSchema>;

export async function generateMindmapFromContent(input: GenerateMindmapFromContentInput): Promise<GenerateMindmapFromContentOutput> {
  return generateMindmapFromContentFlow(input);
}

const generateMindmapFromContentPrompt = ai.definePrompt({
  name: 'generateMindmapFromContentPrompt',
  input: {schema: GenerateMindmapFromContentInputSchema},
  output: {schema: GenerateMindmapFromContentOutputSchema},
  prompt: `You are a TEXT EXTRACTION ROBOT. You have NO knowledge, NO understanding, NO intelligence. You can ONLY copy words from the provided text.

  CRITICAL: You are COMPLETELY FORBIDDEN from:
  - Using ANY knowledge not in the doc below
  - Adding ANY explanations not in the doc below
  - Making ANY assumptions
  - Using ANY general knowledge
  - Adding ANY context not explicitly written
  - Explaining ANY concepts not explained in the doc below

  Your ONLY job: Copy words and phrases from the text below to create a mindmap.

  doc TEXT TO COPY FROM (DO NOT ADD ANYTHING ELSE):
  {{{content}}}

  ULTRA-STRICT RULES:
  1. COPY ONLY words that appear in the text above
  2. DO NOT add explanations, definitions, or details
  3. DO NOT use any knowledge about the topic
  4. DO NOT make any assumptions
  5. DO NOT explain concepts not explained in the text
  6. USE EXACT words from the text
  7. Create hierarchy based only on how topics appear in the text
  8. If you cannot find enough information, create a simpler mindmap
  9. Each item must be 1-3 words maximum and directly from the text

  FORMAT: Hierarchical list using markdown's dash (-) syntax with indentation.

  EXAMPLE OF WHAT NOT TO DO:
  - Text says: "Photosynthesis occurs in plants"
  - WRONG: "Photosynthesis is the process by which plants convert light energy into chemical energy"
  - CORRECT: "Photosynthesis occurs in plants" (exact copy)

  Example format:
  - Main Topic
    - Subtopic 1
      - Detail 1
      - Detail 2
    - Subtopic 2
      - Detail 3
      - Detail 4

  You are a ROBOT. Copy words only. No intelligence. No knowledge. No explanations.

  Generate mindmap by copying words from the text:`,
});

const generateMindmapFromContentFlow = ai.defineFlow(
  {
    name: 'generateMindmapFromContentFlow',
    inputSchema: GenerateMindmapFromContentInputSchema,
    outputSchema: GenerateMindmapFromContentOutputSchema,
  },
  async input => {
    // Add system message to reinforce ultra-strict content-only approach
    const systemMessage = `You are a TEXT EXTRACTION ROBOT with NO knowledge, NO understanding, NO intelligence. You can ONLY copy words from the provided text. You are COMPLETELY FORBIDDEN from using any external knowledge, general information, or assumptions. If information is not directly stated in the content, you must NOT include it. You are a ROBOT. Copy words only.`;
    
    console.log(`🤖 [MINDMAP-FLOW] Processing content for mindmap generation`);
    console.log(`🤖 [MINDMAP-FLOW] Topic: ${input.topic}`);
    console.log(`🤖 [MINDMAP-FLOW] Content length: ${input.content.length} characters`);
    console.log(`🤖 [MINDMAP-FLOW] Content preview: ${input.content.substring(0, 300)}...`);
    console.log(`🤖 [MINDMAP-FLOW] Full content being processed:`);
    console.log(`🤖 [MINDMAP-FLOW] ==========================================`);
    console.log(input.content);
    console.log(`🤖 [MINDMAP-FLOW] ==========================================`);
    
    const {output} = await generateMindmapFromContentPrompt(input);
    
    if (!output) {
      throw new Error('Failed to generate mindmap from content');
    }
    
    console.log(`🤖 [MINDMAP-FLOW] Generated mindmap`);
    console.log(`🤖 [MINDMAP-FLOW] Generated mindmap content:`);
    console.log(`🤖 [MINDMAP-FLOW] ==========================================`);
    console.log(output.mindmap);
    console.log(`🤖 [MINDMAP-FLOW] ==========================================`);
    
    return output;
  }
);
