import { NextRequest, NextResponse } from 'next/server';
import { getUserIdWithFallback } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdWithFallback();
    console.log(`📄 [API] Getting documents for user: ${userId}`);

    // Import the vector store service
    const { vectorStoreService } = await import('@/lib/vector-store');
    
    // Get all documents for the user
    const documents = await vectorStoreService.getAllDocumentsWithAuth();
    
    // Extract file names from metadata
    const documentList = documents
      .map(doc => ({
        id: doc.metadata.fileName || 'unknown',
        fileName: doc.metadata.fileName || 'Untitled Document',
        title: doc.metadata.title || doc.metadata.fileName || 'Untitled Document',
        type: doc.metadata.type || 'unknown',
        uploadDate: doc.metadata.uploadDate || new Date().toISOString(),
      }))
      .filter(doc => doc.fileName !== 'unknown') // Only include documents with file names
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()); // Sort by upload date

    console.log(`📄 [API] Found ${documentList.length} documents with file names`);

    return NextResponse.json({
      success: true,
      documents: documentList
    });

  } catch (error: any) {
    console.error('❌ [API] Error getting documents:', error);
    
    // Handle authentication errors specifically
    if (error.message === 'User not authenticated') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          documents: []
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch documents',
        documents: []
      },
      { status: 500 }
    );
  }
}
