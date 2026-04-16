-- ============================================
-- Add Admin User Script
-- ============================================
-- Run this SQL directly in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
-- ============================================

-- IMPORTANT: Before running this, make sure you have executed database-schema.sql
-- to create the admins table and all other required tables.

-- Step 1: Check if admins table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admins'
) AS table_exists;

-- If the above returns false, run database-schema.sql first!

-- Step 2: Insert admin user
-- Password: Zoro232594!@#$
-- Hash generated with bcryptjs (10 rounds)

INSERT INTO admins (username, password_hash, full_name, email, role, permissions, is_active)
VALUES (
  'WailAdmin1000',
  '$2b$10$/fmtxEKL1YyuGLIQPGqcX.NPIZDfDIkF/oEMp7sKe31SUltl71l7S',
  'Wail Admin',
  'admin@musharaka.space',
  'super_admin',
  '["all"]'::jsonb,
  true
)
ON CONFLICT (username) DO NOTHING;

-- Step 3: Verify the admin was created
SELECT id, username, full_name, email, role, is_active, created_at 
FROM admins 
WHERE username = 'WailAdmin1000';

-- Success! You should see the admin user details in the result.
-- Login credentials:
-- Username: WailAdmin1000
-- Password: Zoro232594!@#$
