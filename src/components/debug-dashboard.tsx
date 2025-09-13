'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/database';
import { testDatabaseConnection } from '@/lib/database';

interface DebugDashboardProps {
  userId: string;
}

export function DebugDashboard({ userId }: DebugDashboardProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDebug = async () => {
      try {
        console.log('🔍 DebugDashboard: Starting debug for user:', userId);
        
        const supabase = createClient();
        console.log('🔍 DebugDashboard: Supabase client created:', !!supabase);
        
        const connectionTest = await testDatabaseConnection();
        console.log('🔍 DebugDashboard: Connection test result:', connectionTest);
        
        // Try a simple query
        const { data, error } = await supabase
          .from('user_analytics')
          .select('user_id')
          .limit(1);
        
        console.log('🔍 DebugDashboard: Simple query result:', { data, error });
        
        setDebugInfo({
          userId,
          supabaseClient: !!supabase,
          connectionTest,
          simpleQuery: { data, error }
        });
      } catch (error) {
        console.error('❌ DebugDashboard: Error during debug:', error);
        setDebugInfo({
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      } finally {
        setLoading(false);
      }
    };

    runDebug();
  }, [userId]);

  if (loading) {
    return <div>Debug: Loading...</div>;
  }

  return (
    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info</h3>
      <pre className="text-xs text-yellow-700 dark:text-yellow-300 overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
