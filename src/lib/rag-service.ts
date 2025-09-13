import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { vectorStoreService } from "./vector-store";
import { Document } from "langchain/document";
import { getUserIdWithFallback } from "./auth-utils";

// Initialize Google Gemini
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn("GEMINI_API_KEY not found. RAG functionality will be limited.");
}

const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.7,
  apiKey: geminiApiKey,
});

// Create prompt template for RAG
const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context. 

Context:
{context}

Question: {input}

Please provide a comprehensive and accurate answer based on the given context. If the context doesn't contain enough information to answer the question, please state that clearly.

Answer:
`);

export interface RAGQuery {
  question: string;
  limit?: number;
  metadataFilter?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface RAGResponse {
  answer: string;
  sources: Array<{
    content: string;
    metadata: Record<string, any>;
    similarity: number;
  }>;
}

export class RAGService {
  /**
   * Generate an answer using RAG with conversation history context
   */
  async generateAnswer(question: string, documents: any[], conversationHistory?: ChatMessage[]): Promise<string> {
    try {
      console.log(`🤖 [RAG] Generating contextual answer...`);
      console.log(`🤖 [RAG] Question: "${question}"`);
      console.log(`🤖 [RAG] Documents: ${documents.length}`);
      console.log(`🤖 [RAG] History length: ${conversationHistory?.length || 0}`);

      // Build context from conversation history
      let historyContext = '';
      if (conversationHistory && conversationHistory.length > 0) {
        const recentMessages = conversationHistory.slice(-4); // Last 2 exchanges
        historyContext = recentMessages
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
      }

      // Prepare documents for context
      const context = documents.map((doc, index) => {
        const title = doc.metadata?.title || doc.metadata?.filename || `Document ${index + 1}`;
        return `Document: ${title}
Content: ${doc.content.substring(0, 1000)}${doc.content.length > 1000 ? '...' : ''}
Similarity: ${(doc.similarity * 100).toFixed(1)}%`;
      }).join('\n\n---\n\n');

      // Enhanced prompt with conversation history
      const enhancedPrompt = `
You are a helpful AI assistant that answers questions based on the provided documents and conversation history.

${historyContext ? `Previous conversation:\n${historyContext}\n\n` : ''}
Relevant documents:\n${context}

Current question: ${question}

Please provide a comprehensive and accurate answer based on the provided documents and conversation context. If the documents don't contain enough information, please state that clearly.

Answer:
`;

      const response = await chatModel.invoke([
        { role: 'user', content: enhancedPrompt }
      ]);

      return response.content as string;

    } catch (error) {
      console.error('❌ [RAG] Error generating answer:', error);
      throw error;
    }
  }

  /**
   * Query documents using RAG with optimized retrieval pipeline (without metadata filter by default)
   */
  async queryDocuments(query: RAGQuery): Promise<RAGResponse> {
    try {
      console.log(`🤖 [RAG] Starting optimized RAG query...`);
      console.log(`🤖 [RAG] Question: "${query.question}"`);
      console.log(`🤖 [RAG] Limit: ${query.limit || 5}`);
      console.log(`🤖 [RAG] Metadata Filter: ${query.metadataFilter ? 'Enabled' : 'Disabled (searching all documents)'}`);

      const startTime = Date.now();

      // Use advanced search for better retrieval - only apply filter if provided
      console.log(`🤖 [RAG] Searching for relevant documents...`);
      const relevantDocs = await vectorStoreService.advancedSearch(
        query.question,
        {
          limit: query.limit || 5,
          filter: query.metadataFilter, // Will be undefined when not provided
          threshold: 0.05, // Lower minimum similarity threshold to include more relevant documents
        }
      );

      const searchTime = Date.now() - startTime;
      console.log(`🤖 [RAG] Document search completed in ${searchTime}ms`);

      if (relevantDocs.length === 0) {
        console.log(`🤖 [RAG] No relevant documents found`);
        return {
          answer: "I couldn't find any relevant documents to answer your question. Please try uploading some documents first.",
          sources: [],
        };
      }

      console.log(`🤖 [RAG] Found ${relevantDocs.length} relevant documents`);

      // Prepare documents for RAG with better formatting
      const documents = relevantDocs.map((doc, index) => {
        console.log(`🤖 [RAG] Document ${index + 1}:`);
        console.log(`   - Content length: ${doc.content.length} characters`);
        console.log(`   - Similarity score: ${doc.similarity.toFixed(4)}`);
        console.log(`   - Title: ${doc.metadata.title || 'Untitled'}`);
        console.log(`   - Source: ${doc.metadata.source || 'Unknown'}`);
        
        return new Document({
          pageContent: doc.content,
          metadata: {
            ...doc.metadata,
            similarity: doc.similarity,
          },
        });
      });

      // Create optimized retrieval chain
      console.log(`🤖 [RAG] Creating optimized retrieval chain...`);
      const combineDocsChain = await createStuffDocumentsChain({
        llm: chatModel,
        prompt,
      });

      // Generate answer using the retrieved documents
      console.log(`🤖 [RAG] Generating answer with Gemini...`);
      const generationStart = Date.now();
      
      const answer = await combineDocsChain.invoke({
        input: query.question,
        context: documents,
      });

      const generationTime = Date.now() - generationStart;
      const totalTime = Date.now() - startTime;

      console.log(`🤖 [RAG] Answer generated in ${generationTime}ms`);
      console.log(`🤖 [RAG] Total RAG query time: ${totalTime}ms`);
      console.log(`🤖 [RAG] Answer length: ${answer.length} characters`);

      const response = {
        answer,
        sources: relevantDocs,
      };

      console.log(`🤖 [RAG] Query completed successfully`);
      return response;

    } catch (error) {
      console.error("❌ [RAG] Error querying documents with RAG:", error);
      
      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error("Google Gemini API key not configured. Please check your environment variables.");
        } else if (error.message.includes('network')) {
          throw new Error("Network error while querying documents. Please check your connection.");
        } else {
          throw new Error(`Failed to query documents: ${error.message}`);
        }
      }
      
      throw new Error("Failed to query documents");
    }
  }

  /**
   * Query documents with a specific context (e.g., from a specific file)
   */
  async queryDocumentsWithContext(
    question: string,
    context: {
      fileName?: string;
      type?: string;
      source?: string;
    }
  ): Promise<RAGResponse> {
    const filter: Record<string, any> = {};
    
    if (context.fileName) filter.fileName = context.fileName;
    if (context.type) filter.type = context.type;
    if (context.source) filter.source = context.source;

    return this.queryDocuments({
      question,
      metadataFilter: filter,
    });
  }

  /**
   * Get a summary of all stored documents for the current user with automatic user ID detection
   */
  async getDocumentsSummaryWithAuth(): Promise<{
    totalDocuments: number;
    documentTypes: Record<string, number>;
    recentUploads: Array<{
      title?: string;
      fileName?: string;
      uploadDate: string;
      type?: string;
    }>;
  }> {
    const userId = await getUserIdWithFallback();
    return this.getDocumentsSummary(userId);
  }

  /**
   * Get a summary of all stored documents for a specific user
   */
  async getDocumentsSummary(userId?: string): Promise<{
    totalDocuments: number;
    documentTypes: Record<string, number>;
    recentUploads: Array<{
      title?: string;
      fileName?: string;
      uploadDate: string;
      type?: string;
    }>;
  }> {
    try {
      const allDocs = await vectorStoreService.getAllDocuments(100, userId);
      
      const documentTypes: Record<string, number> = {};
      const recentUploads = allDocs
        .map(doc => ({
          title: doc.metadata.title,
          fileName: doc.metadata.fileName,
          uploadDate: doc.metadata.uploadDate,
          type: doc.metadata.type,
        }))
        .sort((a, b) => {
          const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
          const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 10);

      allDocs.forEach(doc => {
        const type = doc.metadata.type || 'unknown';
        documentTypes[type] = (documentTypes[type] || 0) + 1;
      });

      return {
        totalDocuments: allDocs.length,
        documentTypes,
        recentUploads: recentUploads.map(upload => ({
          ...upload,
          uploadDate: upload.uploadDate || new Date().toISOString() // Provide default value if uploadDate is undefined
        })),
      };
    } catch (error) {
      console.error("Error getting documents summary:", error);
      throw new Error("Failed to get documents summary");
    }
  }
}

// Export singleton instance
export const ragService = new RAGService();