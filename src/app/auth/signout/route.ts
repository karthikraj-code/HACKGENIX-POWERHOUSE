import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign out failed:', error);
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 });
  }
}
