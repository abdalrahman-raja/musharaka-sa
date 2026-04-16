'use strict';
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Support both custom prefix (MUSHARAKA_) and legacy variable names for backward compatibility
const SUPABASE_URL = process.env.MUSHARAKA_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('✗ Supabase credentials missing. Please set either:');
  console.error('  - MUSHARAKA_SUPABASE_URL and MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY (recommended)');
  console.error('  - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (legacy)');
  // On Vercel, we shouldn't exit the process as it's a serverless environment, but this check is useful for logs
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = supabase;
