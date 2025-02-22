import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

interface SupabaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface SupabaseOrderItem {
  id: string;
  quantity: number;
  price: number;
  product: SupabaseProduct;
}

interface SupabaseOrder {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: SupabaseOrderItem[];
}

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: string;
  };
  created_at: string;
  orders: SupabaseOrder[];
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  orders: {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    items: {
      id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
      };
    }[];
  }[];
}

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user data from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        user_metadata,
        created_at,
        orders (
          id,
          created_at,
          status,
          total_amount,
          items (
            id,
            quantity,
            price,
            product (
              id,
              name,
              description,
              price,
              images
            )
          )
        )
      `)
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Cast the data to our expected type
    const user = userData as unknown as SupabaseUser;

    // Transform the data into the expected format
    const response: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      role: user.user_metadata?.role || 'USER',
      createdAt: user.created_at,
      orders: (user.orders || []).map(order => ({
        id: order.id,
        createdAt: order.created_at,
        status: order.status,
        totalAmount: order.total_amount,
        items: (order.items || []).map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            image: item.product.images[0] || ''
          }
        }))
      }))
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