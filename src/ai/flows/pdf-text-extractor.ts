'use server';

/**
 * @fileOverview An AI agent that extracts text from PDF files.
 *
 * - pdfTextExtractor - A function that handles the text extraction process.
 * - PdfTextExtractorInput - The input type for the pdfTextExtractor function.
 * - PdfTextExtractorOutput - The return type for the pdfTextExtractor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfTextExtractorInputSchema = z.object({
  pdfContent: z
    .string()
    .describe('The base64 encoded content of the PDF file.'),
  fileName: z
    .string()
    .optional()
    .describe('The name of the PDF file for context.'),
});
export type PdfTextExtractorInput = z.infer<typeof PdfTextExtractorInputSchema>;

const PdfTextExtractorOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text content from the PDF.'),
  pageCount: z.number().optional().describe('The number of pages in the PDF.'),
  confidence: z.number().optional().describe('Confidence score of the extraction (0-1).'),
});
export type PdfTextExtractorOutput = z.infer<typeof PdfTextExtractorOutputSchema>;

export async function pdfTextExtractor(input: PdfTextExtractorInput): Promise<PdfTextExtractorOutput> {
  return pdfTextExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfTextExtractorPrompt',
  input: {schema: PdfTextExtractorInputSchema},
  output: {schema: PdfTextExtractorOutputSchema},
  prompt: `You are an expert PDF text extraction AI. Your task is to analyze the provided PDF content and extract all readable text from it.

Instructions:
1. Extract all text content from the PDF, maintaining the logical structure and flow
2. Preserve paragraph breaks and formatting where possible
3. Ignore images, charts, and non-text elements
4. If the PDF contains tables, convert them to readable text format
5. Provide a confidence score (0-1) indicating how well the text was extracted
6. Estimate the number of pages if possible

PDF File: {{{fileName}}}
PDF Content (Base64): {{{pdfContent}}}

Please extract and return the text content from this PDF.`,
});

const pdfTextExtractorFlow = ai.defineFlow(
  {
    name: 'pdfTextExtractorFlow',
    inputSchema: PdfTextExtractorInputSchema,
    outputSchema: PdfTextExtractorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    console.log('PDF Text Extraction Result:', {
      fileName: input.fileName,
      extractedTextLength: output!.extractedText.length,
      pageCount: output!.pageCount,
      confidence: output!.confidence,
    });
    return output!;
  }
);
