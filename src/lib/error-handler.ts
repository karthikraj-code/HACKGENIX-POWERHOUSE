// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    console.error('🚨 Promise rejection details:', {
      reason: event.reason,
      promise: event.promise,
      type: event.type
    });
    
    // Prevent the default behavior (which would log to console)
    event.preventDefault();
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('🚨 Uncaught Error:', event.error);
    console.error('🚨 Error details:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  console.log('✅ Global error handlers set up');
}

// Function to safely execute async operations
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await asyncFn();
  } catch (error) {
    console.error(`❌ Error in ${context || 'async operation'}:`, error);
    return fallback;
  }
}
