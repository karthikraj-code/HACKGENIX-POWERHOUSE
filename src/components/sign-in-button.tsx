'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

interface SignInButtonProps {
  redirectTo?: string;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SignInButton({ 
  redirectTo,
  onError,
  onSuccess,
  disabled = false,
  className = ""
}: SignInButtonProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const signInWithGoogle = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      onSuccess?.();
    } catch (error) {
      console.error('Sign in error:', error);
      onError?.(error instanceof Error ? error : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const baseClassName = `
    group relative inline-flex items-center rounded-xl 
    bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
    p-[2px] transition-transform duration-300 
    hover:scale-105 hover:shadow-2xl 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={disabled || isLoading}
      aria-label={isLoading ? "Signing in..." : "Sign in with Google"}
      className={baseClassName}
    >
      <span className="inline-flex items-center gap-3 rounded-[10px] bg-white px-7 py-3 text-slate-900 font-semibold text-lg tracking-wide">
        {isLoading ? (
          <div className="h-6 w-6 animate-spin">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
            <path 
              fill="#EA4335" 
              d="M12 10.2v3.9h5.5c-.22 1.4-1.67 4.1-5.5 4.1-3.31 0-6-2.74-6-6.1s2.69-6.1 6-6.1c1.89 0 3.16.8 3.89 1.49l2.65-2.56C16.8 3.2 14.6 2.2 12 2.2 6.98 2.2 2.9 6.29 2.9 11.3S6.98 20.4 12 20.4c6.18 0 8.1-4.33 8.1-6.5 0-.44-.05-.73-.11-1.05H12z"
            />
            <path 
              fill="#34A853" 
              d="M3.7 7.7l3.2 2.3C7.5 8.2 8.6 6.8 10.5 6.8c1.14 0 1.93.49 2.38.9l2.67-2.59C14.6 3.8 13.07 3 11 3 7.76 3 5.04 4.86 3.7 7.7z"
            />
            <path 
              fill="#4285F4" 
              d="M12 20.4c2.55 0 4.69-.84 6.25-2.28l-2.87-2.35c-.77.53-1.76.9-3.38.9-2.58 0-4.77-1.74-5.55-4.1H3.07v2.57C4.6 18.7 8 20.4 12 20.4z"
            />
            <path 
              fill="#FBBC05" 
              d="M6.45 12.57c-.18-.53-.28-1.1-.28-1.67s.1-1.14.28-1.67V6.66H3.07C2.39 8.02 2 9.61 2 11.3s.39 3.28 1.07 4.64l3.38-3.37z"
            />
          </svg>
        )}
        <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
      </span>
    </button>
  );
}