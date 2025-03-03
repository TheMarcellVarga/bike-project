const fs = require('fs');
const path = require('path');

// Path to the migration file
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20000000000002_create_orders_tables.sql');
console.log(`Reading migration from: ${migrationPath}`);

// Read the migration SQL
try {
  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log('Migration SQL:');
  console.log('-'.repeat(80));
  console.log(sql);
  console.log('-'.repeat(80));
  console.log('\nInstructions:');
  console.log('1. Copy the SQL above');
  console.log('2. Go to your Supabase dashboard: https://app.supabase.com/');
  console.log('3. Navigate to your project > SQL Editor');
  console.log('4. Create a new query, paste the SQL, and run it');
  console.log('5. Return to your application and try creating an order again');
} catch (error) {
  console.error('Error reading migration file:', error);
} 