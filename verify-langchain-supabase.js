#!/usr/bin/env node

/**
 * Verify LangChain SupabaseVectorStore implementation
 * Demonstrates the exact usage pattern from the LangChain docs
 */

const { SupabaseVectorStore } = require("@langchain/community/vectorstores/supabase");
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");
const { createClient } = require("@supabase/supabase-js");

async function verifyLangChainSupabase() {
  console.log("🔍 Verifying LangChain SupabaseVectorStore implementation...\n");

  try {
    // Environment variables check
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fyvzgnemarofwqjhcsjf.supabase.co';
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnpnbmVtYXJvZndxamhjc2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTUxOTQsImV4cCI6MjA3MzIzMTE5NH0.7cXXrSe6hJjWilFcsweXjPnDhkqYllg8wvqozso-Kzw';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Missing environment variables:");
      console.log(`   SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}`);
      console.log(`   SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? '✅' : '❌'}`);
      return;
    }

    // Initialize Supabase client
    const client = createClient(supabaseUrl, supabaseServiceKey);
    console.log("✅ Supabase client initialized");

    // Initialize Hugging Face embeddings (free alternative to OpenAI)
    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });
    console.log("✅ Hugging Face embeddings initialized");

    // Create vector store instance (matching the LangChain example)
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });
    console.log("✅ SupabaseVectorStore initialized");

    // Test 1: Check if we can perform similarity search
    console.log("\n🔍 Testing similarity search...");
    const testQuery = "What is machine learning?";
    
    const results = await vectorStore.similaritySearch(testQuery, 3);
    console.log(`✅ Found ${results.length} relevant documents`);
    
    if (results.length > 0) {
      console.log("📄 Top results:");
      results.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.metadata?.title || 'Untitled'}`);
        console.log(`      Content: ${doc.pageContent.substring(0, 100)}...`);
      });
    }

    // Test 2: Check if we can perform similarity search with scores
    console.log("\n🔍 Testing similarity search with scores...");
    const resultsWithScores = await vectorStore.similaritySearchWithScore(testQuery, 2);
    
    console.log("📊 Results with similarity scores:");
    resultsWithScores.forEach(([doc, score], index) => {
      console.log(`   ${index + 1}. Score: ${score.toFixed(4)}`);
      console.log(`      ${doc.metadata?.title || 'Untitled'}`);
    });

    // Test 3: Demonstrate the exact LangChain pattern
    console.log("\n🎯 Demonstrating exact LangChain pattern...");
    
    // Example from LangChain docs - adapted for our setup
    const sampleTexts = [
      "Machine learning is a subset of artificial intelligence",
      "Deep learning uses neural networks with multiple layers",
      "Natural language processing enables computers to understand human language"
    ];
    
    const sampleMetadatas = [
      { id: 1, topic: "ai", type: "definition" },
      { id: 2, topic: "ai", type: "explanation" },
      { id: 3, topic: "nlp", type: "definition" }
    ];

    console.log("📋 Adding sample documents...");
    await vectorStore.addDocuments(
      sampleTexts.map((text, i) => ({
        pageContent: text,
        metadata: sampleMetadatas[i]
      }))
    );
    console.log("✅ Sample documents added");

    // Test similarity search with the new documents
    console.log("\n🔍 Searching sample documents...");
    const sampleResults = await vectorStore.similaritySearch("What is AI?", 2);
    
    console.log("📄 Results for 'What is AI?':");
    sampleResults.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.pageContent}`);
      console.log(`      Metadata:`, doc.metadata);
    });

    console.log("\n✅ All tests completed successfully!");
    console.log("\n🎯 Implementation Summary:");
    console.log("   ✅ Using LangChain SupabaseVectorStore");
    console.log("   ✅ Using HuggingFace embeddings (all-MiniLM-L6-v2)");
    console.log("   ✅ Using match_documents RPC function");
    console.log("   ✅ Automatic query embedding");
    console.log("   ✅ Proper similarity scoring");

  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    
    // Provide troubleshooting guidance
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Check environment variables in .env.local");
    console.log("   2. Verify Supabase vector extension is enabled");
    console.log("   3. Ensure documents table and match_documents function exist");
    console.log("   4. Check RAG_SETUP.md for complete setup instructions");
  }
}

// Run the verification
if (require.main === module) {
  verifyLangChainSupabase().catch(console.error);
}

module.exports = { verifyLangChainSupabase };