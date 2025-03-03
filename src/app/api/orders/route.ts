import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface OrderRequest {
  items: OrderItem[];
  shippingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  total: number;
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/orders - Request received');
    
    // Get auth user
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
            // Not needed for this endpoint
          },
          remove(name: string, options: any) {
            // Not needed for this endpoint
          },
        },
      }
    );
    
    // Get user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Unauthorized order attempt:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the order request data
    let orderData: OrderRequest;
    try {
      orderData = await request.json();
      console.log('Order data received:', JSON.stringify(orderData, null, 2));
    } catch (error) {
      console.error('Invalid request data:', error);
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    
    // Validate the order data
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }
    
    console.log('Attempting to create order in database...');
    console.log('User ID:', user.id);
    
    // DEBUG: Check if the orders table exists
    const { data: tablesData, error: tablesError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
      
    if (tablesError) {
      console.error('Error checking orders table:', tablesError);
      return NextResponse.json(
        { error: 'Database table check failed', details: tablesError.message, code: tablesError.code },
        { status: 500 }
      );
    }
    
    console.log('Orders table exists, proceeding with order creation');
    
    // Create the order in the database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'PENDING',
        total: orderData.total,
        shipping_address: `${orderData.shippingDetails.address}, ${orderData.shippingDetails.city}, ${orderData.shippingDetails.state} ${orderData.shippingDetails.zipCode}, ${orderData.shippingDetails.country}`,
        shipping_name: `${orderData.shippingDetails.firstName} ${orderData.shippingDetails.lastName}`,
        shipping_email: orderData.shippingDetails.email,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Failed to create order:', JSON.stringify(orderError, null, 2));
      console.error('Error code:', orderError.code);
      console.error('Error message:', orderError.message);
      console.error('Error details:', orderError.details);
      return NextResponse.json(
        { 
          error: 'Failed to create order', 
          details: orderError.message,
          code: orderError.code,
          fullError: JSON.stringify(orderError) 
        },
        { status: 500 }
      );
    }
    
    console.log('Order created successfully, ID:', order.id);
    console.log('Creating order items...');
    
    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      product_name: item.name,
      product_image: item.image
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Failed to create order items:', JSON.stringify(itemsError, null, 2));
      // Since the order was created but items failed, we should handle this better in production
      // For now, we'll just return an error
      return NextResponse.json(
        { 
          error: 'Failed to create order items', 
          details: itemsError.message,
          code: itemsError.code,
          fullError: JSON.stringify(itemsError)
        },
        { status: 500 }
      );
    }
    
    console.log('Order items created successfully');
    
    // Return the created order
    return NextResponse.json({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.created_at,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Failed to process order', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
} 