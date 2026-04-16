-- ============================================
-- Musharaka Financial Services - Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Account Applications Table
-- ============================================

CREATE TABLE IF NOT EXISTS account_applications (
  id BIGSERIAL PRIMARY KEY,
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  nationality VARCHAR(100),
  date_of_birth DATE,
  
  -- Account Details
  account_type VARCHAR(50) NOT NULL, -- 'individual' or 'entity'
  occupation VARCHAR(255),
  annual_income DECIMAL(15, 2),
  
  -- Application Status
  status VARCHAR(50) DEFAULT 'pending_review',
  -- Status values: 'pending_review', 'approved', 'rejected', 'needs_more_info'
  
  -- Documents (stored as JSONB)
  documents JSONB DEFAULT '{}'::jsonb,
  has_documents BOOLEAN DEFAULT FALSE,
  
  -- Admin Fields
  admin_notes TEXT,
  rejection_reason TEXT,
  reviewed_by VARCHAR(255),
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_applications_email ON account_applications(email);
CREATE INDEX idx_applications_phone ON account_applications(phone);
CREATE INDEX idx_applications_id_number ON account_applications(id_number);
CREATE INDEX idx_applications_status ON account_applications(status);
CREATE INDEX idx_applications_submitted_at ON account_applications(submitted_at DESC);

-- Add comment to table
COMMENT ON TABLE account_applications IS 'Stores account opening applications from users';

-- ============================================
-- 2. Users Table (for authenticated users)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Authentication (managed by Supabase Auth)
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  
  -- User Type
  user_type VARCHAR(50) DEFAULT 'individual', -- 'individual' or 'entity'
  
  -- KYC Status
  kyc_verified BOOLEAN DEFAULT FALSE,
  kyc_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Account Status
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_kyc_verified ON users(kyc_verified);

-- Comment
COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth';

-- ============================================
-- 3. Document Uploads Tracking
-- ============================================

CREATE TABLE IF NOT EXISTS document_uploads (
  id BIGSERIAL PRIMARY KEY,
  
  -- Reference
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  application_id BIGINT REFERENCES account_applications(id) ON DELETE CASCADE,
  
  -- Document Info
  document_type VARCHAR(100) NOT NULL, -- 'id_front', 'id_back', 'selfie', 'proof_of_address', etc.
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER, -- in bytes
  mime_type VARCHAR(100),
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by VARCHAR(255),
  verification_notes TEXT,
  
  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_user_id ON document_uploads(user_id);
CREATE INDEX idx_documents_application_id ON document_uploads(application_id);
CREATE INDEX idx_documents_type ON document_uploads(document_type);
CREATE INDEX idx_documents_verified ON document_uploads(is_verified);

-- Comment
COMMENT ON TABLE document_uploads IS 'Tracks all document uploads with verification status';

-- ============================================
-- 4. Activity Logs
-- ============================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- Reference
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  application_id BIGINT REFERENCES account_applications(id) ON DELETE SET NULL,
  
  -- Activity Details
  action VARCHAR(100) NOT NULL, -- 'application_submitted', 'status_changed', 'document_uploaded', etc.
  entity_type VARCHAR(50), -- 'application', 'user', 'document'
  entity_id BIGINT,
  
  -- Details
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_application_id ON activity_logs(application_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Comment
COMMENT ON TABLE activity_logs IS 'Audit trail for all important actions';

-- ============================================
-- 5. Admin Users Table
-- ============================================

CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  
  -- Credentials
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Profile
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin', 'reviewer'
  
  -- Permissions (stored as JSONB array)
  permissions JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);

-- Comment
COMMENT ON TABLE admins IS 'Admin users for the management panel';

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE account_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Account Applications Policies
-- ============================================

-- Users can view their own applications (by email match)
CREATE POLICY "Users can view own applications"
ON account_applications FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');

-- Anyone can insert applications (public form submission)
CREATE POLICY "Anyone can submit applications"
ON account_applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can update applications
CREATE POLICY "Admins can update applications"
ON account_applications FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email' 
    AND admins.is_active = true
  )
);

-- Only admins can delete applications
CREATE POLICY "Admins can delete applications"
ON account_applications FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email' 
    AND admins.is_active = true
  )
);

-- ============================================
-- Users Policies
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth_id = auth.uid());

-- Only admins can view all users
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email' 
    AND admins.is_active = true
  )
);

-- ============================================
-- Document Uploads Policies
-- ============================================

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON document_uploads FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Anyone can upload documents (for applications)
CREATE POLICY "Anyone can upload documents"
ON document_uploads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can update document verification
CREATE POLICY "Admins can verify documents"
ON document_uploads FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email' 
    AND admins.is_active = true
  )
);

-- ============================================
-- Activity Logs Policies
-- ============================================

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
ON activity_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email' 
    AND admins.is_active = true
  )
);

-- System can insert activity logs
CREATE POLICY "System can log activities"
ON activity_logs FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- ============================================
-- Admins Policies
-- ============================================

-- Admins can view their own profile
CREATE POLICY "Admins can view own profile"
ON admins FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');

-- Only super admins can manage other admins
CREATE POLICY "Super admins can manage admins"
ON admins FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email' 
    AND admins.role = 'super_admin'
    AND admins.is_active = true
  )
);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_account_applications_updated_at
  BEFORE UPDATE ON account_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert a test admin (password: Admin@123456)
-- Note: In production, use the create-first-admin.js script
INSERT INTO admins (username, password_hash, full_name, email, role)
VALUES (
  'admin',
  '$2a$10$YourHashedPasswordHere',
  'مدير النظام',
  'admin@musharaka.sa',
  'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- ============================================
-- Storage Bucket Setup
-- ============================================

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('musharaka-uploads', 'musharaka-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for musharaka-uploads bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'musharaka-uploads');

CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'musharaka-uploads');

CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'musharaka-uploads');

CREATE POLICY "Allow admin full access"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'musharaka-uploads' AND
  EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.jwt() ->> 'email' 
    AND admins.is_active = true
  )
);

-- ============================================
-- Views (Optional - for easier querying)
-- ============================================

-- View: Recent applications with stats
CREATE OR REPLACE VIEW recent_applications_stats AS
SELECT 
  DATE(submitted_at) as submission_date,
  COUNT(*) as total_applications,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
  COUNT(CASE WHEN status = 'pending_review' THEN 1 END) as pending_count
FROM account_applications
GROUP BY DATE(submitted_at)
ORDER BY submission_date DESC;

-- View: Application summary
CREATE OR REPLACE VIEW application_summary AS
SELECT 
  id,
  full_name,
  email,
  phone,
  account_type,
  status,
  has_documents,
  submitted_at,
  reviewed_at,
  CASE 
    WHEN reviewed_at IS NULL THEN EXTRACT(DAY FROM NOW() - submitted_at)
    ELSE EXTRACT(DAY FROM reviewed_at - submitted_at)
  END as processing_days
FROM account_applications
ORDER BY submitted_at DESC;

-- ============================================
-- Comments and Documentation
-- ============================================

COMMENT ON COLUMN account_applications.status IS 'Application status: pending_review, approved, rejected, needs_more_info';
COMMENT ON COLUMN account_applications.documents IS 'JSON object containing document URLs and metadata';
COMMENT ON COLUMN users.kyc_verified IS 'Whether the user has completed KYC verification';
COMMENT ON COLUMN admins.role IS 'Admin role: admin, super_admin, reviewer';

-- ============================================
-- Success Message
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Musharaka database schema created successfully!';
  RAISE NOTICE '📊 Tables created: account_applications, users, document_uploads, activity_logs, admins';
  RAISE NOTICE '🔐 Row Level Security enabled on all tables';
  RAISE NOTICE '📦 Storage bucket configured: musharaka-uploads';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update .env with your Service Role Key';
  RAISE NOTICE '2. Test connection: node scripts/test-blob-storage.js';
  RAISE NOTICE '3. Create first admin: node scripts/create-first-admin.js';
END $$;
