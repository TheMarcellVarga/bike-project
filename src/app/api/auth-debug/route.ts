import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Basic debug info
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      headers: {}
    };
    
    // Get headers
    debugInfo.headers.authorization = request.headers.get('Authorization') 
      ? 'Present (first 10 chars: ' + request.headers.get('Authorization')?.substring(0, 10) + '...)' 
      : 'Not present';
    
    // Cookie info without using getAll() to avoid linter errors
    const cookieStore = cookies();
    const sbAccessToken = cookieStore.get('sb-access-token');
    const sbRefreshToken = cookieStore.get('sb-refresh-token');
    
    debugInfo.cookies = {
      'sb-access-token': sbAccessToken ? 'Present' : 'Not present',
      'sb-refresh-token': sbRefreshToken ? 'Present' : 'Not present'
    };
    
    // Initialize Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {/* Not needed */},
          remove() {/* Not needed */}
        }
      }
    );
    
    // Check for auth from cookies
    debugInfo.cookieAuth = {};
    try {
      const { data, error } = await supabase.auth.getUser();
      debugInfo.cookieAuth.success = !error;
      debugInfo.cookieAuth.userId = data?.user?.id;
      debugInfo.cookieAuth.error = error ? error.message : null;
    } catch (err) {
      debugInfo.cookieAuth.error = err instanceof Error ? err.message : 'Unknown error';
    }
    
    // Check token auth if available
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      debugInfo.tokenAuth = {};
      
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: ''
        });
        
        debugInfo.tokenAuth.success = !error;
        debugInfo.tokenAuth.error = error ? error.message : null;
        
        if (!error) {
          const { data: userData } = await supabase.auth.getUser();
          debugInfo.tokenAuth.userId = userData?.user?.id;
        }
      } catch (err) {
        debugInfo.tokenAuth.error = err instanceof Error ? err.message : 'Unknown error';
      }
    }
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 