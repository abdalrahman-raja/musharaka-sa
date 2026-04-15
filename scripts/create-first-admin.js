/**
 * Script to create the first admin user in the database
 * Run this from the backend directory
 * 
 * Usage: cd backend && node ../scripts/create-first-admin.js
 */

const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables from backend
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('Please check: backend/.env');
  console.error('\nRequired variables:');
  console.error('  SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Default admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123456'; // Change this after first login!
const ADMIN_NAME = 'مدير النظام';
const ADMIN_ROLE = 'super_admin';

async function createFirstAdmin() {
  try {
    console.log('🔍 Checking if admin user already exists...');
    
    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id, username')
      .eq('username', ADMIN_USERNAME)
      .single();

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   ID: ${existingAdmin.id}`);
      console.log('\n💡 If you forgot the password, you can reset it from the admin panel.');
      console.log('\n📋 Default Credentials:');
      console.log(`   Username: ${ADMIN_USERNAME}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`\n🌐 Admin Panel: http://localhost:3001/admin/`);
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    console.log('✓ Password hashed successfully');

    // Create the admin user
    console.log('\n📝 Creating admin user...');
    const { data: newAdmin, error: insertError } = await supabase
      .from('admins')
      .insert({
        username: ADMIN_USERNAME,
        password: hashedPassword,
        name: ADMIN_NAME,
        role: ADMIN_ROLE
      })
      .select('id, username, name, role')
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('\n✅ SUCCESS! Admin user created successfully!');
    console.log('\n' + '━'.repeat(60));
    console.log('📋 Login Credentials:');
    console.log('━'.repeat(60));
    console.log(`   👤 Username: ${newAdmin.username}`);
    console.log(`   🔑 Password: ${ADMIN_PASSWORD}`);
    console.log(`   📛 Name: ${newAdmin.name}`);
    console.log(`   🎭 Role: ${newAdmin.role}`);
    console.log('━'.repeat(60));
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
    console.log(`\n🌐 Admin Panel URL: http://localhost:3001/admin/`);
    console.log('\n💡 How to access:');
    console.log('   1. Open your browser');
    console.log('   2. Go to: http://localhost:3001/admin/');
    console.log('   3. Enter the credentials above');
    console.log('   4. Change your password immediately!\n');

  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error.message || error);
    if (error.details) {
      console.error('Details:', error.details);
    }
    console.error('\n💡 Make sure:');
    console.error('   - Backend server is running');
    console.error('   - Supabase credentials are correct');
    console.error('   - Database tables are created');
    process.exit(1);
  }
}

createFirstAdmin();
