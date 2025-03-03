import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Simplified interface for the response
interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    console.log('GET /api/users/me-token - Request received');
    
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Authorization header found');
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }
    
    // Extract token
    const token = authHeader.slice(7);
    console.log('Token received (first 10 chars):', token.substring(0, 10) + '...');
    
    // Create a standalone Supabase client - no cookie handling
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Set the session with the token
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    });
    
    if (sessionError) {
      console.error('Token validation error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid token', details: sessionError.message },
        { status: 401 }
      );
    }
    
    console.log('Token validated successfully');
    
    // Get the user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return NextResponse.json(
        { error: 'Failed to get user data', details: userError?.message },
        { status: 401 }
      );
    }
    
    console.log('User retrieved:', user.id);
    
    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, role, created_at')
      .eq('id', user.id)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile data', details: profileError.message },
        { status: 500 }
      );
    }
    
    // If profile doesn't exist, return basic user info
    if (!profileData) {
      console.log('No profile found, returning basic user info');
      const response: UserResponse = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        role: user.user_metadata?.role || 'USER',
        createdAt: user.created_at || new Date().toISOString()
      };
      
      return NextResponse.json(response);
    }
    
    // Return profile data
    const response: UserResponse = {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      role: profileData.role,
      createdAt: profileData.created_at
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 