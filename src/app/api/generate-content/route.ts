import { NextResponse } from 'next/server';
import { generateQuizzes } from '@/ai/flows/quiz-mindmap-generator';

export async function POST(req: Request) {
  const { content, feature } = await req.json();
  try {
    if (feature === 'quizzes') {
      // Pass content as an object with content property to match schema
      const result = await generateQuizzes({ content });
      return NextResponse.json({ result });
    } else {
      return NextResponse.json({ error: 'Feature not supported.' }, { status: 400 });
    }
  } catch (error) {
    // Log error details for debugging
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to generate content.', details: String(error) }, { status: 500 });
  }
}