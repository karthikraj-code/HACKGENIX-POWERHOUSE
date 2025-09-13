#!/usr/bin/env node

/**
 * Test filename filtering using curl commands
 * This script provides the exact curl commands to test the API
 */

const { execSync } = require('child_process');

function runCurlCommand(command) {
  try {
    const result = execSync(command, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    console.error('Error running curl:', error.message);
    return null;
  }
}

async function testFilenameFilterCurl() {
  console.log('🔍 Testing Filename Filter with curl commands...\n');
  console.log('📝 Copy and paste these commands to test the API:\n');

  const baseUrl = 'http://localhost:3000';

  // Test 1: Search without filename filter
  console.log('📋 Test 1: Search without filename filter');
  console.log(`curl -X POST "${baseUrl}/api/query-documents" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "tell me about payments", "fileName": null, "type": null}'`);
  console.log();

  // Test 2: Search with filename filter
  console.log('📋 Test 2: Search with filename filter');
  console.log(`curl -X POST "${baseUrl}/api/query-documents" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "tell me about payments", "fileName": "conservatio economics Payment Status.pdf", "type": null}'`);
  console.log();

  // Test 3: Test retriever endpoint without filter
  console.log('📋 Test 3: Test retriever endpoint without filter');
  console.log(`curl "${baseUrl}/api/test-retriever?action=search&q=payments&limit=5"`);
  console.log();

  // Test 4: Test retriever endpoint with filename filter
  console.log('📋 Test 4: Test retriever endpoint with filename filter');
  console.log(`curl "${baseUrl}/api/test-retriever?action=search&q=payments&limit=5&fileName=conservatio economics Payment Status.pdf"`);
  console.log();

  // Test 5: List all documents to see available filenames
  console.log('📋 Test 5: List all documents to see available filenames');
  console.log(`curl "${baseUrl}/api/test-retriever?action=list-all"`);
  console.log();

  console.log('🎯 Expected behavior:');
  console.log('==================');
  console.log('✅ Test 1 & 3: Should find documents across all files');
  console.log('✅ Test 2 & 4: Should only find documents in the specified file');
  console.log('✅ Test 5: Should show all uploaded documents with their filenames');
  console.log();
  console.log('📝 Run these commands in your terminal to verify the fix is working!');
}

// Run the test
if (require.main === module) {
  testFilenameFilterCurl();
}