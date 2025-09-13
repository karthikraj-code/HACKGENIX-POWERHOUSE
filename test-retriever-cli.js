#!/usr/bin/env node

/**
 * Retriever CLI Test Script
 * Run with: node test-retriever-cli.js
 */

const { vectorStoreService } = require('./src/lib/vector-store');
const { ragService } = require('./src/lib/rag-service');

async function runRetrieverTests() {
  console.log('🔍 Starting Retriever CLI Tests...\n');

  try {
    // Test 1: Check if documents exist
    console.log('📋 Test 1: Checking existing documents...');
    const allDocs = await vectorStoreService.getAllDocuments(10);
    console.log(`Found ${allDocs.length} documents`);
    
    if (allDocs.length === 0) {
      console.log('⚠️ No documents found. Adding test documents...');
      await addTestDocuments();
    } else {
      console.log('Existing documents:');
      allDocs.forEach((doc, i) => {
        console.log(`  ${i + 1}. ${doc.metadata.title || 'Untitled'} (${doc.content.length} chars)`);
      });
    }

    // Test 2: Test search functionality
    console.log('\n🔍 Test 2: Testing search...');
    const searchQuery = 'machine learning';
    console.log(`Searching for: "${searchQuery}"`);
    
    const searchResults = await vectorStoreService.searchDocuments(searchQuery, 3);
    console.log(`Found ${searchResults.length} results:`);
    searchResults.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.metadata.title || 'Untitled'} (similarity: ${result.similarity.toFixed(3)})`);
      console.log(`     Preview: ${result.content.substring(0, 100)}...`);
    });

    // Test 3: Test RAG functionality
    console.log('\n🤖 Test 3: Testing RAG query...');
    const ragQuery = 'What is machine learning?';
    console.log(`Query: "${ragQuery}"`);
    
    const ragResults = await ragService.queryDocuments(ragQuery, 3);
    console.log(`Answer: ${ragResults.answer}`);
    console.log(`Sources: ${ragResults.sources.length} documents`);

    // Test 4: System summary
    console.log('\n📊 Test 4: System summary...');
    const summary = await ragService.getDocumentsSummary();
    console.log('Summary:', JSON.stringify(summary, null, 2));

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if Supabase is running');
    console.error('2. Verify environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_KEY');
    console.error('   - HUGGINGFACEHUB_API_KEY (optional)');
    console.error('3. Check network connectivity');
    console.error('4. Verify database permissions');
  }
}

async function addTestDocuments() {
  console.log('Adding test documents...');
  
  const testDocs = [
    {
      content: `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide.`,
      metadata: {
        title: 'Machine Learning Basics',
        source: 'test-cli',
        type: 'educational',
      }
    },
    {
      content: `Deep learning is a subset of machine learning that uses neural networks with multiple layers to progressively extract higher-level features from raw input. These neural networks are inspired by the structure and function of the human brain, with interconnected nodes that process and transmit information. Deep learning has revolutionized fields like computer vision, natural language processing, and speech recognition.`,
      metadata: {
        title: 'Deep Learning Introduction',
        source: 'test-cli',
        type: 'educational',
      }
    }
  ];

  for (const doc of testDocs) {
    const id = await vectorStoreService.storeDocument(doc);
    console.log(`  Stored: ${doc.metadata.title} (ID: ${id})`);
  }
  
  console.log('✅ Test documents added successfully');
}

// Environment check
function checkEnvironment() {
  console.log('🔧 Environment Check:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');
  console.log('HUGGINGFACEHUB_API_KEY:', process.env.HUGGINGFACEHUB_API_KEY ? '✅ Set' : '❌ Optional');
}

// Run tests
if (require.main === module) {
  console.log('Retriever CLI Test Tool');
  console.log('======================');
  checkEnvironment();
  console.log('');
  runRetrieverTests();
}

module.exports = { runRetrieverTests };