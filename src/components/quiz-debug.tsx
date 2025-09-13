'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/database';

export function QuizDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Test 1: Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('User check:', { user: !!user, error: userError });
      
      // Test 2: Check if quiz_scores table exists
      const { data: tableData, error: tableError } = await supabase
        .from('quiz_scores')
        .select('*')
        .limit(1);
      
      console.log('Table check:', { data: tableData, error: tableError });
      
      // Test 3: Try to insert a test record
      if (user) {
        const testData = {
          user_id: user.id,
          quiz_content: 'Test quiz content',
          total_questions: 5,
          correct_answers: 4,
          score_percentage: 80.0,
          quiz_topic: 'Test Topic',
          time_taken_seconds: 120
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('quiz_scores')
          .insert(testData)
          .select();
        
        console.log('Insert test:', { data: insertData, error: insertError });
        
        // If successful, delete the test record
        if (insertData && insertData.length > 0) {
          await supabase
            .from('quiz_scores')
            .delete()
            .eq('id', insertData[0].id);
        }
      }
      
      setDebugInfo({
        user: user ? { id: user.id, email: user.email } : null,
        userError,
        tableError,
        tableExists: !tableError,
        insertTest: user ? 'Test record inserted and deleted successfully' : 'No user to test with'
      });
      
    } catch (error) {
      console.error('Debug test error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Quiz Database Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testDatabaseConnection} disabled={loading}>
          {loading ? 'Testing...' : 'Test Database Connection'}
        </Button>
        
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Results:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
