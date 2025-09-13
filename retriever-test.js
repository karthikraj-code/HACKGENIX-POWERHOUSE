// Retriever Test Script
// Run this in your browser console or use the API endpoints

class RetrieverTester {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  async testSystem() {
    console.log('🔍 Starting Retriever System Test...\n');
    
    try {
      // Step 1: Check system stats
      console.log('📊 Step 1: Checking system stats...');
      const stats = await this.getSystemStats();
      console.log('System Stats:', stats);
      
      // Step 2: List all documents
      console.log('\n📋 Step 2: Listing all documents...');
      const allDocs = await this.listAllDocuments();
      console.log(`Found ${allDocs.totalDocuments} documents`);
      
      if (allDocs.totalDocuments === 0) {
        console.log('⚠️ No documents found. Adding test documents...');
        await this.addTestDocuments();
      } else {
        console.log('Sample documents:', allDocs.documents.slice(0, 3));
      }
      
      // Step 3: Test search functionality
      console.log('\n🔍 Step 3: Testing search...');
      const searchResults = await this.searchDocuments('learning', 3);
      console.log(`Search found ${searchResults.found} documents`);
      console.log('Search results:', searchResults.results);
      
      // Step 4: Test RAG query
      console.log('\n🤖 Step 4: Testing RAG query...');
      const ragResults = await this.testRagQuery('What is machine learning?');
      console.log('RAG Response:', ragResults);
      
      console.log('\n✅ Retriever test completed successfully!');
      
    } catch (error) {
      console.error('❌ Retriever test failed:', error);
    }
  }

  async getSystemStats() {
    const response = await fetch('/api/test-retriever?action=stats');
    return response.json();
  }

  async listAllDocuments() {
    const response = await fetch('/api/test-retriever?action=list-all');
    return response.json();
  }

  async searchDocuments(query, limit = 5) {
    const response = await fetch(`/api/test-retriever?action=search&q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.json();
  }

  async addTestDocuments() {
    const testDocs = [
      {
        content: `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves. The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide. The primary aim is to allow the computers learn automatically without human intervention or assistance and adjust actions accordingly.`,
        title: 'Introduction to Machine Learning'
      },
      {
        content: `Deep learning is a subset of machine learning that uses neural networks with multiple layers (hence "deep") to progressively extract higher-level features from raw input. For example, in image processing, lower layers may identify edges, while higher layers may identify human-relevant concepts such as digits or faces. Deep learning models are trained by using large sets of labeled data and neural network architectures that learn features directly from the data without the need for manual feature extraction.`,
        title: 'Deep Learning Fundamentals'
      },
      {
        content: `Natural Language Processing (NLP) is a branch of artificial intelligence that helps computers understand, interpret and manipulate human language. NLP draws from many disciplines, including computer science and computational linguistics, to fill the gap between human communication and computer understanding. Applications of NLP include machine translation, sentiment analysis, chatbots, and text summarization.`,
        title: 'Natural Language Processing Overview'
      }
    ];

    for (const doc of testDocs) {
      await this.storeTestDocument(doc.content, doc.title);
    }
    
    console.log('✅ Added 3 test documents');
  }

  async storeTestDocument(content, title) {
    const response = await fetch('/api/test-retriever', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'store-test',
        content,
        title
      })
    });
    return response.json();
  }

  async testRagQuery(query) {
    const response = await fetch('/api/test-retriever', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'query-test',
        query
      })
    });
    return response.json();
  }

  // Manual testing functions
  async manualSearch(query) {
    try {
      const results = await this.searchDocuments(query);
      console.log(`Search results for "${query}":`, results);
      return results;
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  async manualStore(content, title = 'Manual Test') {
    try {
      const result = await this.storeTestDocument(content, title);
      console.log('Stored document:', result);
      return result;
    } catch (error) {
      console.error('Store failed:', error);
    }
  }
}

// Usage Instructions:
console.log(`
🔧 RETRIEVER TESTING INSTRUCTIONS

1. Open browser console (F12)
2. Copy this entire script and paste in console
3. Run: const tester = new RetrieverTester();
4. Run: await tester.testSystem();

Manual testing:
- Store document: await tester.manualStore('Your content here', 'Title')
- Search: await tester.manualSearch('your search query')
- List all: await tester.listAllDocuments()

API Endpoints:
- GET /api/test-retriever?action=stats
- GET /api/test-retriever?action=list-all
- GET /api/test-retriever?action=search&q=query&limit=5
- POST /api/test-retriever with JSON body

Common issues to check:
1. Database connection
2. Environment variables
3. Document content length
4. Search query relevance
5. Similarity thresholds
`);

// Make it globally available for testing
if (typeof window !== 'undefined') {
  window.RetrieverTester = RetrieverTester;
}