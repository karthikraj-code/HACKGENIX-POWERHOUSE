'use client';

import { useEffect, useState } from 'react';

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
    currentDomain: string;
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    currentDomain: '',
  });

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      currentDomain: window.location.origin,
    });
  }, []);

  // Only show in development or when there are issues
  if (process.env.NODE_ENV === 'production' && envStatus.supabaseUrl && envStatus.supabaseKey) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-sm z-50">
      <div className="font-semibold mb-2">Environment Check</div>
      <div className="space-y-1">
        <div className={`flex items-center gap-2 ${envStatus.supabaseUrl ? 'text-green-400' : 'text-red-400'}`}>
          <span>{envStatus.supabaseUrl ? '✓' : '✗'}</span>
          Supabase URL
        </div>
        <div className={`flex items-center gap-2 ${envStatus.supabaseKey ? 'text-green-400' : 'text-red-400'}`}>
          <span>{envStatus.supabaseKey ? '✓' : '✗'}</span>
          Supabase Key
        </div>
        <div className="text-gray-300">
          Domain: {envStatus.currentDomain}
        </div>
        <div className="text-gray-300">
          Expected callback: {envStatus.currentDomain}/auth/callback
        </div>
      </div>
    </div>
  );
}
