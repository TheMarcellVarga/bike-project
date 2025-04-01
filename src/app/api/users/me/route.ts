import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Simplified interface for the response
interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  orders?: any[];
}

export async function GET(request: Request) {
  try {
    console.log('GET /api/users/me - Request received');
    
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
            // Note: We can't actually set cookies in a Server Component route handler
            // This is only used by Supabase client internally
          },
          remove(name: string, options: any) {
            // Note: We can't actually remove cookies in a Server Component route handler
            // This is only used by Supabase client internally
          },
        },
      }
    );

    // Get the authorization header from the request
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization header present:', !!authHeader);
    
    // Check for user in the cookie first
    const { data: { user: cookieUser }, error: cookieUserError } = await supabase.auth.getUser();
    console.log('Cookie user found:', !!cookieUser);
    
    // If we have a user from cookies, use that
    if (cookieUser && !cookieUserError) {
      console.log('Using authenticated user from cookie');
      const user = cookieUser;
      
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
        
        // Check if the error is a not found error
        if (profileError.code === 'PGRST116') {
          // If profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || '',
                role: user.user_metadata?.role || 'USER',
                created_at: new Date().toISOString()
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
        } else {
          return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
          );
        }
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
              created_at: new Date().toISOString()
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
        createdAt: profileData.created_at
      };

      // Get user's orders (if needed)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total,
          created_at,
          order_items (
            id,
            quantity,
            price,
            product_id,
            product_name,
            product_image
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!ordersError && orders) {
        response.orders = orders.map(order => ({
          id: order.id,
          createdAt: order.created_at,
          status: order.status,
          total: order.total,
          items: order.order_items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            product: {
              id: item.product_id,
              name: item.product_name,
              image: item.product_image
            }
          }))
        }));
      }

      return NextResponse.json(response);
    }
    
    // If no cookie user, try to use the token from the Authorization header
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      console.log('Token from Authorization header:', token ? token.substring(0, 10) + '...' : 'none');
      
      // If a token is provided in the header, set it for this request
      if (token) {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return NextResponse.json(
            { error: 'Invalid token', details: sessionError.message },
            { status: 401 }
          );
        }

        console.log('Session set successfully:', !!sessionData);
        
        // Get authenticated user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Failed to get user after setting session:', userError);
          return NextResponse.json(
            { error: 'Unauthorized', details: userError?.message || 'User not found after token validation' },
            { status: 401 }
          );
        }

        console.log('User retrieved successfully:', user.id);
        
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
          
          // Check if the error is a not found error
          if (profileError.code === 'PGRST116') {
            // If profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata?.name || '',
                  role: user.user_metadata?.role || 'USER',
                  created_at: new Date().toISOString()
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
          } else {
            return NextResponse.json(
              { error: 'Failed to fetch user profile' },
              { status: 500 }
            );
          }
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
                created_at: new Date().toISOString()
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
          createdAt: profileData.created_at
        };

        // Get user's orders (if needed)
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            total,
            created_at,
            order_items (
              id,
              quantity,
              price,
              product_id,
              product_name,
              product_image
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!ordersError && orders) {
          response.orders = orders.map(order => ({
            id: order.id,
            createdAt: order.created_at,
            status: order.status,
            total: order.total,
            items: order.order_items.map(item => ({
              id: item.id,
              quantity: item.quantity,
              price: item.price,
              product: {
                id: item.product_id,
                name: item.product_name,
                image: item.product_image
              }
            }))
          }));
        }

        return NextResponse.json(response);
      }
    }
    
    // If we get here, authentication failed
    console.log('Authentication failed - no valid user found');
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: 'No valid user or token found'
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 