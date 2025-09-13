import { NextRequest, NextResponse } from 'next/server';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
});

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();

    if (!question || !context) {
      return NextResponse.json(
        { error: 'Question and context are required' },
        { status: 400 }
      );
    }

    const prompt = `Based on the following context, please answer the question:

Context:
${context}

Question: ${question}

Please provide a clear and concise answer based only on the given context. If the context doesn't contain enough information to answer the question, please state that clearly.`;

    const result = await ai.generate({
      prompt,
      model: 'googleai/gemini-1.5-flash',
    });

    return NextResponse.json({
      answer: result.text,
      success: true,
    });

  } catch (error) {
    console.error('Error generating answer:', error);
    return NextResponse.json(
      { error: 'Failed to generate answer', details: error },
      { status: 500 }
    );
  }
}