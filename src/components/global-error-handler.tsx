'use client';

import { useEffect } from 'react';
import { setupGlobalErrorHandlers } from '@/lib/error-handler';

export function GlobalErrorHandler() {
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  return null; // This component doesn't render anything
}
