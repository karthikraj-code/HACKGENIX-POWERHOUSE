import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { Document } from "langchain/document";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { getUserIdWithFallback } from "./auth-utils";

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseServiceKey) {
  throw new Error("Missing SUPABASE_SERVICE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Hugging Face Inference embeddings (free API)
const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: process.env.HUGGINGFACEHUB_API_KEY, // Optional, uses public API if not provided
});

// Initialize Supabase vector store
const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents",
  queryName: "match_documents",
});

export interface DocumentMetadata {
  title?: string;
  source?: string;
  type?: string;
  uploadDate?: string;
  fileName?: string;
  fileSize?: number;
  summary?: string;
  [key: string]: any;
}

export interface VectorDocument {
  content: string;
  metadata: DocumentMetadata;
}

export class VectorStoreService {
  /**
   * Store a document in the vector store with automatic user ID detection
   */
  async storeDocumentWithAuth(document: VectorDocument): Promise<string> {
    const userId = await getUserIdWithFallback();
    return this.storeDocument(document, userId);
  }

  /**
   * Store a document in the vector store
   */
  async storeDocument(document: VectorDocument, userId: string): Promise<string> {
    try {
      if (!userId) {
        throw new Error("User ID is required to store documents");
      }
      console.log(`📄 [VECTOR STORE] Storing document...`);
      console.log(`📄 [VECTOR STORE] Content length: ${document.content.length} characters`);
      console.log(`📄 [VECTOR STORE] Title: ${document.metadata.title || 'Untitled'}`);
      console.log(`📄 [VECTOR STORE] Source: ${document.metadata.source || 'Unknown'}`);
      console.log(`📄 [VECTOR STORE] User ID: ${userId}`);

      // Ensure we're storing the full content
      if (!document.content || document.content.trim().length === 0) {
        throw new Error("Document content is empty or invalid");
      }

      // Generate embedding for the document
      const embedding = await embeddings.embedQuery(document.content);
      console.log(`📄 [VECTOR STORE] Generated embedding with ${embedding.length} dimensions`);

      // Prepare metadata
      const metadata = {
        ...document.metadata,
        uploadDate: new Date().toISOString(),
        originalLength: document.content.length,
        userId: userId,
      };

      // Insert directly into the database with proper user_id
      const { data, error } = await supabaseClient
        .from('documents')
        .insert({
          content: document.content,
          metadata: metadata,
          embedding: embedding,
          user_id: userId, // This is the key fix - pass user_id directly
        })
        .select('id')
        .single();

      if (error) {
        console.error("❌ [VECTOR STORE] Database insert error:", error);
        throw new Error(`Failed to insert document: ${error.message}`);
      }

      console.log(`✅ [VECTOR STORE] Document stored successfully`);
      console.log(`✅ [VECTOR STORE] Document ID: ${data.id}`);
      console.log(`✅ [VECTOR STORE] Stored content length: ${document.content.length} characters`);
      
      return data.id.toString();
    } catch (error) {
      console.error("❌ [VECTOR STORE] Error storing document:", error);
      throw new Error("Failed to store document in vector store");
    }
  }

  /**
   * Store multiple documents in the vector store with automatic user ID detection
   */
  async storeDocumentsWithAuth(documents: VectorDocument[]): Promise<string[]> {
    const userId = await getUserIdWithFallback();
    return this.storeDocuments(documents, userId);
  }

  /**
   * Store multiple documents in the vector store
   */
  async storeDocuments(documents: VectorDocument[], userId: string): Promise<string[]> {
    try {
      if (!userId) {
        throw new Error("User ID is required to store documents");
      }
      console.log(`📄 [VECTOR STORE] Storing ${documents.length} documents...`);
      console.log(`📄 [VECTOR STORE] User ID: ${userId}`);
      
      const totalContentLength = documents.reduce((sum, doc) => sum + (doc.content?.length || 0), 0);
      console.log(`📄 [VECTOR STORE] Total content length: ${totalContentLength} characters`);

      const documentInserts = [];
      
      for (const doc of documents) {
        if (!doc.content || doc.content.trim().length === 0) {
          throw new Error(`Document "${doc.metadata.title || 'Untitled'}" has empty content`);
        }

        // Generate embedding for each document
        const embedding = await embeddings.embedQuery(doc.content);
        
        // Prepare metadata
        const metadata = {
          ...doc.metadata,
          uploadDate: new Date().toISOString(),
          originalLength: doc.content.length,
          userId: userId,
        };

        documentInserts.push({
          content: doc.content,
          metadata: metadata,
          embedding: embedding,
          user_id: userId, // Pass user_id directly
        });
      }

      // Insert all documents at once
      const { data, error } = await supabaseClient
        .from('documents')
        .insert(documentInserts)
        .select('id');

      if (error) {
        console.error("❌ [VECTOR STORE] Database insert error:", error);
        throw new Error(`Failed to insert documents: ${error.message}`);
      }

      const ids = data.map(row => row.id.toString());
      
      console.log(`✅ [VECTOR STORE] ${documents.length} documents stored successfully`);
      console.log(`✅ [VECTOR STORE] Stored document IDs: ${ids.join(', ')}`);
      
      return ids;
    } catch (error) {
      console.error("❌ [VECTOR STORE] Error storing documents:", error);
      throw new Error("Failed to store documents in vector store");
    }
  }

  /**
   * Search for similar documents using optimized retrieval (without metadata filter)
   */
  async searchDocuments(
    query: string,
    limit: number = 5,
    filter?: Partial<DocumentMetadata> // Optional filter, defaults to undefined
  ): Promise<Array<{
    content: string;
    metadata: DocumentMetadata;
    similarity: number;
  }>> {
    try {
      console.log(`🔍 [RETRIEVER] Starting optimized document search...`);
      console.log(`🔍 [RETRIEVER] Query: "${query}"`);
      console.log(`🔍 [RETRIEVER] Limit: ${limit}`);
      console.log(`🔍 [RETRIEVER] Filter: ${filter ? 'Enabled' : 'Disabled (searching all documents)'}`);
      if (filter) {
        console.log(`🔍 [RETRIEVER] Filter details:`, JSON.stringify(filter, null, 2));
      }

      const startTime = Date.now();
      
      // Generate embedding for the query
      const queryEmbedding = await embeddings.embedQuery(query);
      console.log(`🔍 [RETRIEVER] Generated query embedding with ${queryEmbedding.length} dimensions`);

      // Use the match_documents function with the correct signature
      const filterObject: any = {};
      
      // Build filter object for the function
      if (filter?.userId) {
        filterObject.userId = filter.userId;
      }
      if (filter?.title) {
        filterObject.title = filter.title;
      }
      if (filter?.source) {
        filterObject.source = filter.source;
      }
      if (filter?.type) {
        filterObject.type = filter.type;
      }
      if (filter?.fileName) {
        filterObject.fileName = filter.fileName;
      }

      console.log(`🔍 [RETRIEVER] Using match_documents function with filter:`, filterObject);

      const { data, error } = await supabaseClient.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_count: limit * 2, // Get more results to filter
        filter: filterObject
      });

      if (error) {
        console.error("❌ [RETRIEVER] Database search error:", error);
        throw new Error(`Failed to search documents: ${error.message}`);
      }

      const searchTime = Date.now() - startTime;
      console.log(`🔍 [RETRIEVER] Search completed in ${searchTime}ms`);
      console.log(`🔍 [RETRIEVER] Found ${data?.length || 0} documents`);

      if (!data || data.length === 0) {
        return [];
      }

      // Process results - the function already returns similarity scores
      const formattedResults = data.map((row: any, index: number) => {
        const similarityScore = row.similarity || 0;
        
        console.log(`🔍 [RETRIEVER] Document ${index + 1}:`);
        console.log(`   - Similarity: ${similarityScore.toFixed(4)}`);
        console.log(`   - Title: ${row.metadata?.title || 'Untitled'}`);
        console.log(`   - Source: ${row.metadata?.source || 'Unknown'}`);
        console.log(`   - Content length: ${row.content?.length || 0} characters`);
        
        return {
          content: row.content,
          metadata: row.metadata as DocumentMetadata,
          similarity: similarityScore,
        };
      });

      // Sort by similarity score (descending) and limit results
      formattedResults.sort((a: any, b: any) => b.similarity - a.similarity);
      const limitedResults = formattedResults.slice(0, limit);

      console.log(`🔍 [RETRIEVER] Top ${Math.min(3, limitedResults.length)} results:`);
      limitedResults.slice(0, 3).forEach((doc: any, idx: number) => {
        console.log(`   ${idx + 1}. ${doc.metadata.title || 'Untitled'} (similarity: ${doc.similarity.toFixed(4)})`);
      });

      return limitedResults;

    } catch (error) {
      console.error("❌ [RETRIEVER] Error searching documents:", error);
      
      // Provide more detailed error information
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      }
      
      throw new Error(`Failed to search documents in vector store: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Advanced search with multiple query strategies (without metadata filter by default)
   */
  async advancedSearch(
    query: string,
    options: {
      limit?: number;
      filter?: Partial<DocumentMetadata>;
      threshold?: number;
      includeMetadata?: boolean;
    } = {}
  ): Promise<Array<{
    content: string;
    metadata: DocumentMetadata;
    similarity: number;
  }>> {
    const {
      limit = 5,
      filter,
      threshold = 0.05, // Lower minimum similarity threshold to include more relevant documents
      includeMetadata = true,
    } = options;

    try {
      console.log(`🔍 [ADVANCED SEARCH] Starting advanced search...`);
      console.log(`🔍 [ADVANCED SEARCH] Query: "${query}"`);
      console.log(`🔍 [ADVANCED SEARCH] Limit: ${limit}`);
      console.log(`🔍 [ADVANCED SEARCH] Threshold: ${threshold}`);
      console.log(`🔍 [ADVANCED SEARCH] Filter: ${filter ? 'Enabled' : 'Disabled (searching all documents)'}`);
      if (filter) {
        console.log(`🔍 [ADVANCED SEARCH] Filter details:`, JSON.stringify(filter, null, 2));
      }
      
      // Perform the search - filter is optional and will be undefined when not provided
      const results = await this.searchDocuments(query, limit * 2, filter);
      
      // Filter by similarity threshold
      const filteredResults = results.filter(doc => doc.similarity >= threshold);
      
      // Return top results within limit
      const finalResults = filteredResults.slice(0, limit);
      
      console.log(`🔍 [ADVANCED SEARCH] Found ${finalResults.length} documents above threshold ${threshold}`);
      console.log(`🔍 [ADVANCED SEARCH] All results: ${results.length}, Filtered: ${finalResults.length}`);
      
      // Show similarity scores for debugging
      if (results.length > 0) {
        console.log(`🔍 [ADVANCED SEARCH] Similarity scores:`, results.slice(0, 3).map(doc => ({
          title: doc.metadata.title || 'Untitled',
          similarity: doc.similarity.toFixed(4),
          aboveThreshold: doc.similarity >= threshold
        })));
      }
      
      return finalResults;
    } catch (error) {
      console.error("❌ [ADVANCED SEARCH] Error in advanced search:", error);
      throw error;
    }
  }

  /**
   * Delete documents by metadata filter
   */
  async deleteDocuments(filter: Partial<DocumentMetadata>): Promise<void> {
    try {
      await vectorStore.delete({ ids: [] }); // Delete documents matching filter - currently limited by API
    } catch (error) {
      console.error("Error deleting documents from vector store:", error);
      throw new Error("Failed to delete documents from vector store");
    }
  }

  /**
   * Get all documents for the current user with automatic user ID detection
   */
  async getAllDocumentsWithAuth(limit: number = 100): Promise<Array<{
    content: string;
    metadata: DocumentMetadata;
  }>> {
    const userId = await getUserIdWithFallback();
    return this.getAllDocuments(limit, userId);
  }

  /**
   * Get all documents for a specific user
   */
  async getAllDocuments(limit: number = 100, userId?: string): Promise<Array<{
    content: string;
    metadata: DocumentMetadata;
  }>> {
    try {
      let query = supabaseClient
        .from("documents")
        .select("content, metadata")
        .limit(limit);

      // Filter by user_id if provided
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.map((doc: any) => ({
        content: doc.content,
        metadata: doc.metadata as DocumentMetadata,
      }));
    } catch (error) {
      console.error("Error getting all documents from vector store:", error);
      throw new Error("Failed to get documents from vector store");
    }
  }

  /**
   * Verify that full document content is stored by checking content length
   */
  async verifyDocumentContent(documentId: string, expectedLength: number): Promise<{
    isComplete: boolean;
    storedLength: number;
    expectedLength: number;
    contentPreview: string;
  }> {
    try {
      const { data, error } = await supabaseClient
        .from("documents")
        .select("content, metadata")
        .eq("id", documentId)
        .single();

      if (error) {
        throw error;
      }

      const storedLength = data.content?.length || 0;
      const isComplete = storedLength === expectedLength;

      console.log(`🔍 [VERIFICATION] Document ID: ${documentId}`);
      console.log(`🔍 [VERIFICATION] Expected length: ${expectedLength} characters`);
      console.log(`🔍 [VERIFICATION] Stored length: ${storedLength} characters`);
      console.log(`🔍 [VERIFICATION] Content complete: ${isComplete ? '✅ YES' : '❌ NO'}`);

      return {
        isComplete,
        storedLength,
        expectedLength,
        contentPreview: data.content?.substring(0, 200) + "..." || "",
      };
    } catch (error) {
      console.error("Error verifying document content:", error);
      throw new Error("Failed to verify document content");
    }
  }
}

// Export singleton instance
export const vectorStoreService = new VectorStoreService();

// Export the vector store for direct use if needed
export { vectorStore };