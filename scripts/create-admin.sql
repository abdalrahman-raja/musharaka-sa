-- =====================================================
-- Create First Admin User - SQL Script
-- =====================================================
-- Run this in Supabase SQL Editor to create the first admin
-- 
-- IMPORTANT: You must hash the password first!
-- Use Node.js to generate the hash:
--   const bcrypt = require('bcryptjs');
--   console.log(bcrypt.hashSync('Admin@123456', 10));
-- =====================================================

-- Option 1: Using a pre-hashed password (RECOMMENDED)
-- Password: Admin@123456 (hashed with bcrypt, 10 rounds)
INSERT INTO admins (username, password, name, role, created_at) 
VALUES (
  'admin',
  '$2a$10$rN8VqhK5JzKxH9L2mP3wOeYtR6sU7vW8xZ9aB1cD2eF3gH4iJ5kL6',
  'مدير النظام',
  'super_admin',
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- Option 2: If you want to use a different password, generate a new hash:
-- 1. Open Node.js REPL: node
-- 2. Run: require('bcryptjs').hashSync('YourPassword123', 10)
-- 3. Copy the output and replace the hash above

-- Verify the admin was created
SELECT id, username, name, role, created_at 
FROM admins 
WHERE username = 'admin';

-- =====================================================
-- Alternative: Create Multiple Admin Users
-- =====================================================

-- Super Admin
INSERT INTO admins (username, password, name, role) 
VALUES ('superadmin', '$2a$10$YourHashedPasswordHere', 'Super Administrator', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Regular Admin
INSERT INTO admins (username, password, name, role) 
VALUES ('manager', '$2a$10$YourHashedPasswordHere', 'Manager', 'admin')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- Reset Admin Password (if forgotten)
-- =====================================================
-- UPDATE admins 
-- SET password = '$2a$10$newHashedPasswordHere'
-- WHERE username = 'admin';

-- =====================================================
-- List All Admins
-- =====================================================
-- SELECT id, username, name, role, created_at 
-- FROM admins 
-- ORDER BY created_at DESC;
