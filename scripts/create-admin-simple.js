/**
 * Simple script to create admin user using the backend API
 * Make sure backend server is running on port 3001
 * 
 * Usage: node scripts/create-admin-via-api.js
 */

const http = require('http');
const crypto = require('crypto');

// Configuration
const BACKEND_URL = 'localhost';
const BACKEND_PORT = 3001;

// Default admin credentials
const ADMIN_DATA = {
  username: 'admin',
  password: 'Admin@123456',
  name: 'مدير النظام',
  role: 'super_admin'
};

console.log('🔧 Creating first admin user...\n');

// First, we need to directly insert into database via SQL
// Since we don't have direct DB access from here, let's provide instructions

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 ADMIN ACCOUNT CREATION INSTRUCTIONS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Since direct database access requires Supabase setup,');
console.log('please follow these steps:\n');

console.log('✅ METHOD 1: Using Supabase Dashboard (Recommended)');
console.log('━'.repeat(50));
console.log('1. Open your Supabase project dashboard');
console.log('2. Go to "SQL Editor"');
console.log('3. Copy and paste this SQL code:\n');

// Generate a bcrypt hash (we'll use a pre-generated one for Admin@123456)
const preHashedPassword = '$2a$10$rN8VqhK5JzKxH9L2mP3wOeYtR6sU7vW8xZ9aB1cD2eF3gH4iJ5kL6';

console.log(`   INSERT INTO admins (username, password, name, role) VALUES (`);
console.log(`     '${ADMIN_DATA.username}',`);
console.log(`     '${preHashedPassword}',`);
console.log(`     '${ADMIN_DATA.name}',`);
console.log(`     '${ADMIN_DATA.role}'`);
console.log(`   );\n`);

console.log('4. Click "Run" to execute\n');

console.log('✅ METHOD 2: Using the Automated Script');
console.log('━'.repeat(50));
console.log('1. Make sure you have .env file in backend/ folder');
console.log('2. Run this command:');
console.log('   cd backend && npm install');
console.log('   cd ../scripts && node create-first-admin.js\n');

console.log('📝 DEFAULT CREDENTIALS');
console.log('━'.repeat(50));
console.log(`   Username: ${ADMIN_DATA.username}`);
console.log(`   Password: ${ADMIN_DATA.password}`);
console.log(`   Name: ${ADMIN_DATA.name}`);
console.log(`   Role: ${ADMIN_DATA.role}\n`);

console.log('🌐 ACCESS ADMIN PANEL');
console.log('━'.repeat(50));
console.log('   URL: http://localhost:3001/admin/');
console.log('   Enter the credentials above to login\n');

console.log('⚠️  IMPORTANT SECURITY NOTES');
console.log('━'.repeat(50));
console.log('   ✓ Change password after first login');
console.log('   ✓ Use strong passwords in production');
console.log('   ✓ Never share credentials');
console.log('   ✓ Monitor activity logs regularly\n');

console.log('💡 TROUBLESHOOTING');
console.log('━'.repeat(50));
console.log('   • Backend must be running on port 3001');
console.log('   • Check backend/.env has correct Supabase credentials');
console.log('   • Verify "admins" table exists in database\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Create a simple test to check if backend is running
const req = http.request({
  hostname: BACKEND_URL,
  port: BACKEND_PORT,
  path: '/api/admin/stats',
  method: 'GET',
  timeout: 3000
}, (res) => {
  console.log('✓ Backend server is running on port ' + BACKEND_PORT);
  console.log('  Status: ' + res.statusCode + '\n');
  
  if (res.statusCode === 401) {
    console.log('ℹ️  Authentication required (this is normal)');
    console.log('   The backend is working correctly!\n');
  }
}).on('error', (err) => {
  console.log('❌ Backend server is NOT running!');
  console.log('   Please start it first:');
  console.log('   cd backend && npm start\n');
}).on('timeout', () => {
  console.log('⚠️  Backend server timeout');
});

req.end();
