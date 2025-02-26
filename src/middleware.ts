import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Paths that require authentication
  const protectedPaths = [
    '/api/users/me',
    '/api/orders',
    '/profile',
    '/orders',
    '/checkout'
  ];

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  try {
    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Check for Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Set the session with the token
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    }
    
    // Use getUser() for better security
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      // If it's an API route, return 401
      if (request.nextUrl.pathname.startsWith('/api/')) {
        console.log('Auth failed for API route:', request.nextUrl.pathname);
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // If it's a page route, redirect to login
      console.log('Redirecting to login:', request.nextUrl.pathname);
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Add the user info to the request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    
    // Preserve the Authorization header if it exists
    if (authHeader) {
      requestHeaders.set('Authorization', authHeader);
    }

    // Return the response with the modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/api/:path*',
    '/profile',
    '/orders',
    '/checkout'
  ],
}; 