#!/usr/bin/env node

/**
 * Check the Supabase vector store RPC function 'match_documents'
 * This script verifies that the vector store is properly configured
 * and the RPC function is working correctly.
 */

const { createClient } = require('@supabase/supabase-js');

async function checkVectorStoreRPC() {
  console.log('🔍 Checking Supabase Vector Store RPC Function...\n');

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fyvzgnemarofwqjhcsjf.supabase.co';
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dnpnbmVtYXJvZndxamhjc2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTUxOTQsImV4cCI6MjA3MzIzMTE5NH0.7cXXrSe6hJjWilFcsweXjPnDhkqYllg8wvqozso-Kzw';
    // process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }

    if (!supabaseServiceKey) {
      throw new Error('Missing SUPABASE_SERVICE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('✅ Supabase client initialized');
    console.log(`   URL: ${supabaseUrl}`);

    // Test 1: Check if the documents table exists
    console.log('\n📊 Checking documents table...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('documents')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Documents table error:', tableError.message);
      console.log('   This might indicate the table does not exist or has permission issues');
    } else {
      console.log('✅ Documents table exists');
      console.log(`   Found ${tableCheck?.length || 0} documents`);
    }

    // Test 2: Check if the match_documents RPC function exists
    console.log('\n⚡ Testing match_documents RPC function...');
    
    // Create a test embedding (384 dimensions for all-MiniLM-L6-v2)
    const testEmbedding = Array(384).fill(0.5);
    
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: testEmbedding,
      match_count: 5,
      filter: { topic: "ml" }
    });

    console.log('📋 RPC Function Test Results:');
    console.log({ data, error });

    if (error) {
      console.error('❌ RPC function error:', error.message);
      
      // Provide troubleshooting guidance
      if (error.message.includes('permission denied')) {
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check if the RPC function exists in your Supabase SQL');
        console.log('   2. Verify database permissions');
        console.log('   3. Check if vector extension is enabled');
      } else if (error.message.includes('function does not exist')) {
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Run the SQL setup script to create the match_documents function');
        console.log('   2. Check function name spelling: match_documents');
        console.log('   3. Verify function signature matches expected parameters');
      }
    } else {
      console.log('✅ RPC function working correctly');
      if (data) {
        console.log(`   Found ${data.length} matching documents`);
        
        // Display sample results
        if (data.length > 0) {
          console.log('\n📄 Sample results:');
          data.slice(0, 2).forEach((doc, index) => {
            console.log(`   ${index + 1}. ${doc.title || 'Untitled'} (similarity: ${doc.similarity?.toFixed(3) || 'N/A'})`);
          });
        }
      }
    }

    // Test 3: Check vector extension
    console.log('\n🔧 Checking vector extension...');
    const { data: extensionCheck, error: extensionError } = await supabase
      .rpc('select', { query: 'SELECT * FROM pg_extension WHERE extname = \'vector\'' });

    if (!extensionError) {
      console.log('✅ Vector extension check completed');
    }

    // Test 4: Check table structure
    console.log('\n📋 Checking documents table structure...');
    const { data: structure, error: structureError } = await supabase
      .from('documents')
      .select('id, content, metadata, embedding')
      .limit(0);

    if (!structureError) {
      console.log('✅ Documents table structure accessible');
    }

    console.log('\n🎯 Vector Store Check Summary:');
    console.log('================================');
    console.log('✅ Supabase client configured');
    console.log(tableError ? '❌ Documents table issue' : '✅ Documents table accessible');
    console.log(error ? '❌ RPC function issue' : '✅ RPC function working');
    console.log('\n📖 Next Steps:');
    console.log('   - If RPC function is missing, run the SQL setup script');
    console.log('   - Check RAG_SETUP.md for complete setup instructions');
    console.log('   - Use test-retrieval-pipeline.js for full pipeline testing');

  } catch (error) {
    console.error('❌ Vector store check failed:', error.message);
    console.log('\n🔧 Quick Fix Steps:');
    console.log('   1. Ensure .env.local has correct Supabase credentials');
    console.log('   2. Run: npm install @supabase/supabase-js');
    console.log('   3. Check RAG_SETUP.md for SQL setup instructions');
    console.log('   4. Verify Supabase project has vector extension enabled');
  }
}

// Run the check
if (require.main === module) {
  checkVectorStoreRPC().catch(console.error);
}

module.exports = { checkVectorStoreRPC };