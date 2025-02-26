const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if needed
// require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to the migration file
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20000000000002_create_orders_tables.sql');
console.log(`Reading migration from: ${migrationPath}`);

// Read the migration SQL
let sql;
try {
  sql = fs.readFileSync(migrationPath, 'utf8');
  console.log('Successfully read migration file');
} catch (error) {
  console.error('Error reading migration file:', error);
  process.exit(1);
}

// Apply the migration
async function applyMigration() {
  console.log('Applying migration...');
  console.log('-'.repeat(50));
  console.log(sql);
  console.log('-'.repeat(50));
  
  try {
    // Execute the SQL directly using the Supabase REST API
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error applying migration:', error);
      return;
    }
    
    console.log('Migration applied successfully!');
    
    // Verify the tables were created
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
      
    if (ordersError) {
      console.error('Error verifying orders table:', ordersError);
    } else {
      console.log('Orders table exists and is accessible');
    }
    
    const { data: orderItemsData, error: orderItemsError } = await supabase
      .from('order_items')
      .select('id')
      .limit(1);
      
    if (orderItemsError) {
      console.error('Error verifying order_items table:', orderItemsError);
    } else {
      console.log('Order_items table exists and is accessible');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

applyMigration().catch(console.error); 