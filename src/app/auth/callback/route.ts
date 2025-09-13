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

    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);
    
    if (user) {
      console.log(`🔐 [AUTH CALLBACK] User logged in successfully!`);
      console.log(`🔐 [AUTH CALLBACK] User ID: ${user.id}`);
      console.log(`🔐 [AUTH CALLBACK] User Email: ${user.email}`);
      console.log(`🔐 [AUTH CALLBACK] User ID will be used for all document operations`);
      
      // Store user ID in a cookie for persistence
      const response = NextResponse.redirect(`${requestUrl.origin}/home`);
      response.cookies.set('user-id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      return response;

    }
  }

  // If no code, redirect to home anyway (might be a refresh)
  return NextResponse.redirect(`${requestUrl.origin}/home`);
}