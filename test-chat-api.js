// Test script for the chat API with conversation history
const axios = require('axios');

const API_BASE = 'http://localhost:9004';

async function testChatAPI() {
  console.log('🧪 Testing Chat API with conversation history...\n');

  try {
    // Test 1: Simple question without history
    console.log('1. Testing simple question...');
    const response1 = await axios.post(`${API_BASE}/api/chat`, {
      question: "What is this document about?",
      history: []
    });
    console.log('✅ Response received:', response1.data.answer.substring(0, 100) + '...');

    // Test 2: Question with conversation history
    console.log('\n2. Testing with conversation history...');
    const history = [
      {
        id: '1',
        content: "Tell me about machine learning",
        role: 'user',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        content: "Machine learning is a subset of artificial intelligence...",
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
    ];

    const response2 = await axios.post(`${API_BASE}/api/chat`, {
      question: "Can you give me more examples?",
      history: history
    });
    console.log('✅ Response with context:', response2.data.answer.substring(0, 100) + '...');

    // Test 3: Question with file filter
    console.log('\n3. Testing with file name filter...');
    const response3 = await axios.post(`${API_BASE}/api/chat`, {
      question: "What are the key points?",
      history: [],
      fileName: 'sample-document.pdf'
    });
    console.log('✅ Response with file filter:', response3.data.answer.substring(0, 100) + '...');

    console.log('\n🎉 All chat API tests passed!');
    console.log('📊 Summary:');
    console.log(`   - Simple questions: ✅`);
    console.log(`   - With history: ✅`);
    console.log(`   - With file filter: ✅`);

  } catch (error) {
    console.error('❌ Chat API test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testChatAPI();
}

module.exports = { testChatAPI };