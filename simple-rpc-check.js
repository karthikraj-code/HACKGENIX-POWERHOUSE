#!/usr/bin/env node

/**
 * Simple check for Supabase vector store RPC function
 * Uses the exact code provided in the user request
 */

const { createClient } = require('@supabase/supabase-js');

async function simpleRPCCheck() {
  console.log('🔍 Testing Supabase RPC function with provided code...\n');

  try {
    // Load environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing environment variables:');
      console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
      console.log('   SUPABASE_SERVICE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use the exact code provided
    console.log('📋 Running: await supabase.rpc(\'match_documents\', {\n   query_embedding: Array(384).fill(0.5),\n   match_count: 5, \n   filter: { topic: "ml" } \n });\n');

    const { data, error } = await supabase.rpc('match_documents', { 
      query_embedding: Array(384).fill(0.5), // test embedding 
      match_count: 5, 
      filter: { topic: "ml" } 
    });

    console.log('✅ Results:');
    console.log({ data, error });

    if (error) {
      console.error('\n❌ Error Details:');
      console.error('   Message:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Check if match_documents function exists in Supabase');
      console.log('   2. Verify database permissions');
      console.log('   3. Check RAG_SETUP.md for SQL setup');
    } else {
      console.log('\n✅ Success!');
      console.log(`   Found ${data?.length || 0} matching documents`);
      
      if (data && data.length > 0) {
        console.log('\n📄 Documents found:');
        data.forEach((doc, index) => {
          console.log(`   ${index + 1}. ${doc.title || 'Untitled'} (similarity: ${doc.similarity?.toFixed(3)})`);
        });
      } else {
        console.log('   No documents found with "ml" topic');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the check
simpleRPCCheck();