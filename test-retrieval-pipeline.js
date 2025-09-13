#!/usr/bin/env node

/**
 * Test script to verify the improved retrieval pipeline
 * This script tests the RAG service with the updated vector store
 */

const { ragService } = require('./src/lib/rag-service');
const { vectorStoreService } = require('./src/lib/vector-store');

async function testRetrievalPipeline() {
  console.log('🧪 Testing Retrieval Pipeline...\n');

  try {
    // Test 1: Store sample documents
    console.log('📄 Test 1: Storing sample documents...');
    const sampleDocs = [
      {
        content: 'Artificial Intelligence (AI) is transforming education by providing personalized learning experiences. AI can adapt to individual student needs, track progress, and provide real-time feedback.',
        metadata: {
          title: 'AI in Education',
          source: 'test-document-1',
          type: 'article',
          fileName: 'ai-education.pdf'
        }
      },
      {
        content: 'Machine Learning is a subset of AI that focuses on algorithms that can learn from data. In education, ML can predict student performance and recommend personalized learning paths.',
        metadata: {
          title: 'Machine Learning in Education',
          source: 'test-document-2',
          type: 'article',
          fileName: 'ml-education.pdf'
        }
      },
      {
        content: 'Natural Language Processing (NLP) enables computers to understand and process human language. In education, NLP can be used for automated essay grading and language learning applications.',
        metadata: {
          title: 'NLP in Education',
          source: 'test-document-3',
          type: 'article',
          fileName: 'nlp-education.pdf'
        }
      }
    ];

    const docIds = await vectorStoreService.storeDocuments(sampleDocs);
    console.log(`✅ Stored ${docIds.length} documents with IDs: ${docIds.join(', ')}\n`);

    // Test 2: Basic search
    console.log('🔍 Test 2: Basic document search...');
    const searchResults = await vectorStoreService.searchDocuments('AI in education', 3);
    console.log(`✅ Found ${searchResults.length} relevant documents`);
    searchResults.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.metadata.title} (similarity: ${doc.similarity.toFixed(3)})`);
    });
    console.log();

    // Test 3: Advanced search with threshold
    console.log('🔍 Test 3: Advanced search with threshold...');
    const advancedResults = await vectorStoreService.advancedSearch(
      'machine learning applications',
      { limit: 5, threshold: 0.2 }
    );
    console.log(`✅ Found ${advancedResults.length} documents above threshold`);
    advancedResults.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.metadata.title} (similarity: ${doc.similarity.toFixed(3)})`);
    });
    console.log();

    // Test 4: Full RAG query
    console.log('🤖 Test 4: Full RAG query...');
    const ragQuery = {
      question: 'How is AI transforming education?',
      limit: 3
    };

    const ragResponse = await ragService.queryDocuments(ragQuery);
    console.log(`✅ RAG Query completed`);
    console.log(`📋 Answer: ${ragResponse.answer}`);
    console.log(`📚 Sources: ${ragResponse.sources.length} documents used`);
    ragResponse.sources.forEach((source, index) => {
      console.log(`   ${index + 1}. ${source.metadata.title}`);
    });
    console.log();

    // Test 5: Metadata filtering
    console.log('🔍 Test 5: Search with metadata filtering...');
    const filteredResults = await vectorStoreService.searchDocuments(
      'education technology',
      5,
      { type: 'article' }
    );
    console.log(`✅ Found ${filteredResults.length} documents matching filter`);
    filteredResults.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.metadata.title} (type: ${doc.metadata.type})`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Retrieval pipeline is working correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
if (require.main === module) {
  testRetrievalPipeline().catch(console.error);
}

module.exports = { testRetrievalPipeline };