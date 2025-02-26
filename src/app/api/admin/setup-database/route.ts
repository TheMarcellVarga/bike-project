import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
            // Not needed
          },
          remove(name: string, options: any) {
            // Not needed
          },
        },
      }
    );
    
    // Get the user - we'll only allow this for authenticated users for security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Create the full SQL to execute
    const fullSql = `
    -- Create orders table
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id),
      status TEXT NOT NULL,
      total NUMERIC(10, 2) NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_name TEXT NOT NULL,
      shipping_email TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Create order_items table
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      product_name TEXT NOT NULL,
      product_image TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Set up RLS policies for orders
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

    CREATE POLICY IF NOT EXISTS "Users can view their own orders"
      ON orders FOR SELECT
      USING (auth.uid() = user_id);
      
    CREATE POLICY IF NOT EXISTS "Users can insert their own orders"
      ON orders FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Set up RLS policies for order_items
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

    CREATE POLICY IF NOT EXISTS "Users can view their own order items"
      ON order_items FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
      ));
      
    CREATE POLICY IF NOT EXISTS "Users can insert their own order items"
      ON order_items FOR INSERT
      WITH CHECK (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
      ));

    -- Create indices for better performance
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    `;
    
    // Execute the SQL using the REST API
    const { error: sqlError } = await supabase.rpc('exec_sql', { 
      sql: fullSql 
    });
    
    if (sqlError) {
      console.error('Failed to execute SQL:', sqlError);
      
      // If RPC fails, try the SQL API (needs Supabase v2)
      try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'X-Client-Info': 'setup-database-api'
          },
          body: JSON.stringify({
            query: fullSql
          })
        });
        
        if (!result.ok) {
          const errorData = await result.json();
          return NextResponse.json(
            { error: 'Failed to execute SQL', details: errorData },
            { status: 500 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { 
            error: 'Failed to create database schema', 
            details: sqlError,
            message: 'Please run the SQL directly in the Supabase SQL Editor'
          },
          { status: 500 }
        );
      }
    }
    
    // Check if the tables now exist
    const { data: tablesData, error: tablesError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
      
    if (tablesError) {
      return NextResponse.json(
        { 
          error: 'Tables may not have been created correctly', 
          details: tablesError,
          message: 'Please run the SQL directly in the Supabase SQL Editor' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Database setup completed successfully',
      tables: ['orders', 'order_items'],
      policies: ['Users can view their own orders', 'Users can insert their own orders', 
                'Users can view their own order items', 'Users can insert their own order items'],
      indices: ['idx_orders_user_id', 'idx_order_items_order_id']
    });
    
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { 
        error: 'Failed to set up database', 
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'Please run the SQL directly in the Supabase SQL Editor'
      },
      { status: 500 }
    );
  }
} 