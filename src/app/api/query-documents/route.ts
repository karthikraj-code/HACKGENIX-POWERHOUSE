import { NextRequest, NextResponse } from 'next/server';
import { queryDocuments } from '@/app/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, limit, fileName, type } = body;

    if (!question) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Question is required',
          details: 'Please provide a valid question to search your documents.'
        },
        { status: 400 }
      );
    }

    console.log(`🔍 [API] Processing query request: ${question}`);
    console.log(`🔍 [API] Parameters: limit=${limit}, fileName=${fileName}, type=${type}`);

    const result = await queryDocuments({
      question,
      limit: limit || 5,
      fileName,
      type,
    });
    
    if (result.error) {
      console.error(`❌ [API] Query failed: ${result.error}`);
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          details: 'There was an issue processing your query. Please try again or check your document uploads.'
        },
        { status: 500 }
      );
    }

    console.log(`✅ [API] Query completed successfully. Found ${result.data?.sources?.length || 0} sources.`);

    return NextResponse.json({ 
      success: true,
      data: result.data,
      query: {
        question,
        limit: limit || 5,
        fileName,
        type
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [API] Error in query-documents API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: errorMessage,
        suggestion: 'Please try again later or contact support if the issue persists.'
      },
      { status: 500 }
    );
  }
}