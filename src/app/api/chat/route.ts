import { NextRequest, NextResponse } from 'next/server';
import { vectorStoreService } from '@/lib/vector-store';
import { ragService } from '@/lib/rag-service';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface ChatRequest {
  question: string;
  history: ChatMessage[];
  fileName?: string;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { question, history, fileName, sessionId } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    console.log('Chat API received:', {
      question: question.substring(0, 100) + '...',
      historyLength: history?.length || 0,
      fileName,
      sessionId
    });

    // Build context from conversation history
    let conversationContext = '';
    if (history && history.length > 0) {
      const recentMessages = history.slice(-6); // Last 3 exchanges
      conversationContext = recentMessages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
    }

    // Create enhanced query with context
    const enhancedQuery = conversationContext 
      ? `Previous conversation:\n${conversationContext}\n\nCurrent question: ${question}`
      : question;

    // Search for relevant documents
    const searchResults = await vectorStoreService.searchDocuments(
      enhancedQuery,
      5,
      0.7,
      fileName ? { filename: fileName } : undefined
    );

    console.log('Found relevant documents:', searchResults.length);

    if (searchResults.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find any relevant information in the uploaded documents to answer your question. Please try rephrasing your question or check if the documents contain the information you're looking for.",
        sources: [],
        sessionId
      });
    }

    // Generate answer using RAG with conversation history
    const answer = await ragService.generateAnswer(question, searchResults, history);

    // Format sources for response
    const sources = searchResults.map(result => ({
      title: result.metadata?.title || 'Document',
      fileName: result.metadata?.filename || 'Unknown',
      similarity: result.similarity || 0,
      chunkIndex: result.metadata?.chunkIndex || 0
    }));

    console.log('Generated answer with sources:', sources.length);

    return NextResponse.json({
      answer,
      sources,
      sessionId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // In a real app, you'd fetch from a database
      // For now, we'll return a simple response
      return NextResponse.json({
        messages: [],
        sessionId
      });
    }

    return NextResponse.json({
      sessions: []
    });

  } catch (error) {
    console.error('Chat GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat data' },
      { status: 500 }
    );
  }
}