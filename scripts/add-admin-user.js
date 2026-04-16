#!/usr/bin/env node

/**
 * Add Admin User Script
 * 
 * This script adds an admin user to the Supabase database.
 * Run with: node scripts/add-admin-user.js
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

// ============================================
// Configuration
// ============================================

const SUPABASE_URL = process.env.MUSHARAKA_SUPABASE_URL || 'https://awuqpxwfpsasvuulexdk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY is not set in .env file');
  console.error('Please update your .env file with the Service Role Key from Supabase Dashboard');
  process.exit(1);
}

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Admin user details
const adminUser = {
  username: 'WailAdmin1000',
  password: 'Zoro232594!@#$',
  full_name: 'Wail Admin',
  email: 'admin@musharaka.space',
  role: 'super_admin',
  permissions: ['all'], // Full permissions
  is_active: true
};

// ============================================
// Main Function
// ============================================

async function addAdminUser() {
  try {
    console.log('🔐 Adding Admin User to Supabase...\n');
    console.log('Username:', adminUser.username);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('---\n');

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminUser.password, saltRounds);
    console.log('✅ Password hashed successfully\n');

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .or(`username.eq.${adminUser.username},email.eq.${adminUser.email}`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine
      throw new Error(`Error checking existing admin: ${checkError.message}`);
    }

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Existing admin details:');
      console.log('  - ID:', existingAdmin.id);
      console.log('  - Username:', existingAdmin.username);
      console.log('  - Email:', existingAdmin.email);
      console.log('  - Role:', existingAdmin.role);
      console.log('  - Active:', existingAdmin.is_active);
      console.log('\n💡 To update the password, you would need to run an UPDATE query manually.');
      return;
    }

    // Insert new admin user
    const { data, error } = await supabase
      .from('admins')
      .insert([
        {
          username: adminUser.username,
          password_hash: passwordHash,
          full_name: adminUser.full_name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          is_active: adminUser.is_active
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error adding admin user: ${error.message}`);
    }

    console.log('✅ Admin user added successfully!\n');
    console.log('Admin Details:');
    console.log('  - ID:', data.id);
    console.log('  - Username:', data.username);
    console.log('  - Full Name:', data.full_name);
    console.log('  - Email:', data.email);
    console.log('  - Role:', data.role);
    console.log('  - Active:', data.is_active);
    console.log('  - Created At:', data.created_at);
    console.log('\n🎉 You can now login with these credentials:');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log('\n⚠️  IMPORTANT: Change this password in production!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
addAdminUser();
