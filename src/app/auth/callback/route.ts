import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('Auth callback received:', { code: !!code, error, errorDescription, origin: requestUrl.origin });

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${requestUrl.origin}/?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`);
  }

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError);
        return NextResponse.redirect(`${requestUrl.origin}/?error=session_exchange_failed`);
      }

      // Verify session was created successfully
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No session created after code exchange');
        return NextResponse.redirect(`${requestUrl.origin}/?error=no_session_created`);
      }

      // Small delay to ensure session is properly established
      await new Promise(resolve => setTimeout(resolve, 100));

      // URL to redirect to after sign in process completes
      return NextResponse.redirect(`${requestUrl.origin}/home`);
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/?error=auth_callback_failed`);
    }
  }

  // If no code, redirect to home anyway (might be a refresh)
  return NextResponse.redirect(`${requestUrl.origin}/home`);
}