import { NextRequest, NextResponse } from 'next/server';
import { storeDocument } from '@/app/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, metadata } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await storeDocument({ content, metadata });
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Error in store-document API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}