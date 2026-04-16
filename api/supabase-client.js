'use strict';

/**
 * Supabase Client Helpers for Node.js/Express
 * 
 * This module provides Supabase client instances configured with
 * custom MUSHARAKA_ prefixed environment variables.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration with custom prefix (MUSHARAKA_)
const supabaseUrl = process.env.MUSHARAKA_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.MUSHARAKA_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validation
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Warning: Supabase credentials not found. Please set MUSHARAKA_SUPABASE_URL and MUSHARAKA_SUPABASE_ANON_KEY in .env');
}

/**
 * Create a Supabase client for server-side use (with Service Role Key)
 * This has full access to your database and storage - use only on the server!
 * 
 * @returns {Object} Supabase client instance
 */
function createServerClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase server credentials. Check your .env file.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Create a Supabase client for client-side use (with Anon/Publishable Key)
 * This has limited permissions based on your RLS policies
 * 
 * @returns {Object} Supabase client instance
 */
function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase browser credentials. Check your .env file.');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  });
}

/**
 * Create a Supabase client with custom options
 * 
 * @param {Object} options - Custom configuration options
 * @param {string} options.url - Supabase URL (optional, uses env var by default)
 * @param {string} options.key - Supabase key (optional, uses env var by default)
 * @param {boolean} options.useServiceRole - Whether to use service role key (default: false)
 * @param {Object} options.auth - Auth configuration options
 * @returns {Object} Supabase client instance
 */
function createCustomClient(options = {}) {
  const {
    url = supabaseUrl,
    key = options.useServiceRole ? supabaseServiceRoleKey : supabaseAnonKey,
    auth = {}
  } = options;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials. Check your options or .env file.');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: auth.autoRefreshToken ?? true,
      persistSession: auth.persistSession ?? true,
      ...auth
    }
  });
}

module.exports = {
  createServerClient,
  createBrowserClient,
  createCustomClient,
  
  // Export raw credentials if needed
  config: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    serviceRoleKey: supabaseServiceRoleKey
  }
};
