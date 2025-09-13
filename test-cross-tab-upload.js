const axios = require('axios');

async function testCrossTabUpload() {
  console.log('🧪 Testing Cross-Tab Upload Consistency...\n');

  try {
    // Test 1: Check if files stored via "Ask Question" tab can be queried
    console.log('1. Testing file upload via Ask Question tab...');
    
    // Simulate a simple text file upload
    const testContent = "This is a test document about machine learning and AI applications.";
    const testFileName = "test-cross-tab-upload.txt";
    
    // Store document via API (simulating Ask Question tab upload)
    const storeResponse = await axios.post('http://localhost:9004/api/store-document', {
      content: testContent,
      metadata: {
        title: testFileName,
        source: 'summarizer',
        type: 'text/plain',
        fileName: testFileName, // Using camelCase
        uploadDate: new Date().toISOString(),
        fileSize: testContent.length,
        originalLength: testContent.length,
      }
    });

    console.log('✅ Document stored successfully');
    console.log('Response:', storeResponse.data);

    // Test 2: Query the document using filename filter
    console.log('\n2. Testing document query with filename filter...');
    
    const queryResponse = await axios.post('http://localhost:9004/api/query-documents', {
      question: "What is this document about?",
      fileName: testFileName,
      limit: 5
    });

    console.log('✅ Query completed');
    console.log('Found documents:', queryResponse.data.sources?.length || 0);
    
    if (queryResponse.data.sources && queryResponse.data.sources.length > 0) {
      console.log('✅ Cross-tab upload is working correctly!');
      console.log('First result:', queryResponse.data.sources[0]);
    } else {
      console.log('❌ No documents found - potential issue detected');
    }

    // Test 3: Check metadata consistency
    console.log('\n3. Checking metadata consistency...');
    
    // Query without filename filter to see all stored documents
    const allDocsResponse = await axios.post('http://localhost:9004/api/query-documents', {
      question: "test",
      limit: 10
    });
    
    console.log('Total documents in store:', allDocsResponse.data.sources?.length || 0);
    
    if (allDocsResponse.data.sources) {
      const testDoc = allDocsResponse.data.sources.find(doc => 
        doc.metadata?.fileName === testFileName || doc.metadata?.filename === testFileName
      );
      
      if (testDoc) {
        console.log('✅ Document found with correct metadata');
        console.log('Metadata:', testDoc.metadata);
      } else {
        console.log('❌ Document metadata inconsistency detected');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testCrossTabUpload();