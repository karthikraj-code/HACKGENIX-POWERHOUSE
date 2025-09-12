import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError);
        return NextResponse.redirect(`${requestUrl.origin}/?error=session_exchange_failed`);
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/?error=auth_callback_failed`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/home`);
}