import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          },
        },
      }
    );

    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's profile data
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        name,
        role,
        created_at
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    if (!profileData) {
      // If profile doesn't exist, create it
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || '',
            role: user.user_metadata?.role || 'USER',
            created_at: user.created_at
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Profile creation error:', createError);
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }

      profileData = newProfile;
    }

    // Transform the data into the expected format
    const response: UserResponse = {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      role: profileData.role,
      createdAt: profileData.created_at,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 