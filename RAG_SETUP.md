# RAG (Retrieval-Augmented Generation) Setup Guide

This guide explains how to set up the RAG functionality with Supabase vector store for the AI Summarizer.

## Prerequisites

1. **Supabase Project**: You need a Supabase project with the following:
   - A Supabase project with vector store support
   - Service role key (for server-side operations)

2. **Environment Variables**: Make sure these are set in your `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   # Optional: HUGGINGFACEHUB_API_KEY (only needed for higher rate limits)
   ```

## Database Setup

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store your documents
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT, -- corresponds to Document.pageContent
  metadata JSONB, -- corresponds to Document.metadata
  embedding VECTOR(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT NULL,
  filter JSONB DEFAULT '{}'
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  embedding JSONB,
  similarity FLOAT
)
LANGUAGE PLPGSQL
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    content,
    metadata,
    (embedding::TEXT)::JSONB AS embedding,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE metadata @> filter
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create an index for better performance
CREATE INDEX ON documents USING IVFFLAT (embedding VECTOR_COSINE_OPS);
```

## Features Implemented

### 1. Document Storage
- After summarizing any document, you can store it in the vector store using Hugging Face sentence transformers for embeddings
- Documents are stored with metadata including title, source, and summary

### 2. RAG Queries
- Ask questions about your stored documents using natural language with Hugging Face models
- Get context-aware answers based on your uploaded documents
- View relevant sources with similarity scores

### 3. File Support
- PDF files are supported for upload and processing
- Text extraction from PDFs using AI
- OCR support for scanned documents

### 4. Gemini + Hugging Face Integration
- **Embeddings**: Uses Hugging Face Inference API `sentence-transformers/all-MiniLM-L6-v2`
- **LLM**: Uses Google Gemini (`gemini-1.5-flash`) for intelligent responses
- **Cost-Effective**: Completely free public API (no key required) + Gemini's generous free tier
- **Reliability**: Stable cloud-based inference service

## Usage

### 1. Summarize Documents
1. Go to the Summarizer page
2. Upload a PDF or paste text content
3. Click "Summarize" to get the summary
4. Click "Store in Vector Store" to save the document

### 2. Ask Questions
1. Switch to the "Ask Questions" tab
2. Type your question about the documents
3. Click the search button to get answers
4. View the response with relevant sources

## API Endpoints

### Store Document
- **POST** `/api/store-document`
- **Body**: `{ content: string, metadata: object }`
- **Response**: `{ data: { documentId: string } }`

### Query Documents
- **POST** `/api/query-documents`
- **Body**: `{ question: string, limit?: number, fileName?: string, type?: string }`
- **Response**: `{ data: { answer: string, sources: array } }`

## Troubleshooting

### Common Issues

1. **Vector store not working**: Ensure the `pgvector` extension is enabled in Supabase
2. **Embeddings not storing**: Check your OpenAI API key and service role key
3. **Query returning no results**: Verify documents are properly stored and indexed

### Debug Steps

1. Check Supabase logs for any errors
2. Verify database schema matches the provided SQL
3. Ensure environment variables are correctly set
4. Check browser console for any JavaScript errors

## Advanced Configuration

### Custom Embeddings
To use different embedding models, update the vector dimension in:
- `src/lib/vector-store.ts` - change `1536` to your model's dimension
- SQL schema - update `VECTOR(1536)` to match your dimension

### Metadata Filtering
You can filter documents by metadata fields when querying:
```typescript
const response = await ragService.queryDocuments({
  question: "Your question",
  metadataFilter: {
    fileName: "specific-file.pdf",
    type: "summary"
  }
});
```

## Performance Tips

1. **Index Optimization**: Ensure the vector index is created for faster queries
2. **Batch Processing**: Store multiple documents in batches for better performance
3. **Metadata**: Use metadata to filter queries and improve relevance

## Next Steps

- Add support for more file types (DOCX, PPTX, etc.)
- Implement document deletion and management
- Add conversation history for follow-up questions
- Support for multiple document queries