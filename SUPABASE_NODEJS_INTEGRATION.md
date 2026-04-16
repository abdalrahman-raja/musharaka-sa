# Supabase Integration Guide for Node.js/Express

## Overview

This guide explains how to integrate Supabase into your Musharaka Financial Services project using **Node.js/Express** (not Next.js).

## Your Supabase Project

- **URL**: `https://awuqpxwfpsasvuulexdk.supabase.co`
- **Project Ref**: `awuqpxwfpsasvuulexdk`
- **Publishable Key**: `sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw`

---

## ✅ What's Already Done

1. ✅ `.env` file created with `MUSHARAKA_` prefix
2. ✅ `@supabase/supabase-js` package installed
3. ✅ Database client configured in [`api/database.js`](api/database.js)
4. ✅ Blob storage utilities in [`api/blob-storage.js`](api/blob-storage.js)
5. ✅ Client helpers created in [`api/supabase-client.js`](api/supabase-client.js)

---

## 📦 Installation (Already Complete)

The required packages are already installed in your `api/package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "dotenv": "^16.3.1"
  }
}
```

If you need to reinstall:

```bash
cd api
npm install
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

Your `.env` file is already configured:

```env
MUSHARAKA_SUPABASE_URL=https://awuqpxwfpsasvuulexdk.supabase.co
MUSHARAKA_SUPABASE_ANON_KEY=sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

**⚠️ Important:** Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual key from:
https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/settings/api

---

## 💻 Usage Examples

### Example 1: Using the Database Client

```javascript
// In your API routes or controllers
const supabase = require('./api/database');

// Query data
async function getApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Insert data
async function createApplication(applicationData) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select();
  
  if (error) throw error;
  return data[0];
}

// Update data
async function updateApplication(id, updates) {
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
}

// Delete data
async function deleteApplication(id) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}
```

### Example 2: Using Supabase Client Helpers

```javascript
const { createServerClient, createBrowserClient } = require('./api/supabase-client');

// Server-side operations (full access)
const serverClient = createServerClient();
const { data: users } = await serverClient.from('users').select('*');

// Client-side operations (RLS policies apply)
const browserClient = createBrowserClient();
const { data: publicData } = await browserClient.from('public_info').select('*');
```

### Example 3: File Upload with Blob Storage

```javascript
const { uploadFile } = require('./api/blob-storage');

async function handleFileUpload(req, res) {
  try {
    const file = req.files.document;
    const userId = req.body.userId;
    
    // Upload to Supabase Storage
    const result = await uploadFile(
      file.data,
      `documents/${userId}/${file.name}`,
      'musharaka-uploads'
    );
    
    if (result.success) {
      res.json({
        success: true,
        url: result.publicUrl,
        path: result.path
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Example 4: Authentication

```javascript
const { createBrowserClient } = require('./api/supabase-client');

// Sign up
async function signUp(email, password) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'User Name'
      }
    }
  });
  
  if (error) throw error;
  return data;
}

// Sign in
async function signIn(email, password) {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

// Sign out
async function signOut() {
  const supabase = createBrowserClient();
  await supabase.auth.signOut();
}

// Get current user
async function getCurrentUser() {
  const supabase = createBrowserClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
}
```

### Example 5: Real-time Subscriptions

```javascript
const supabase = require('./api/database');

// Subscribe to changes
const channel = supabase
  .channel('applications-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'applications'
    },
    (payload) => {
      console.log('Change received!', payload);
      // Handle the change (e.g., send WebSocket update)
    }
  )
  .subscribe();

// Unsubscribe when done
// channel.unsubscribe();
```

---

## 🚀 API Route Examples

### GET Route - Fetch Data

```javascript
const express = require('express');
const router = express.Router();
const supabase = require('../api/database');

router.get('/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

### POST Route - Create Record

```javascript
const express = require('express');
const router = express.Router();
const supabase = require('../api/database');

router.post('/applications', async (req, res) => {
  try {
    const applicationData = req.body;
    
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

### PUT Route - Update Record

```javascript
const express = require('express');
const router = express.Router();
const supabase = require('../api/database');

router.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

---

## 🗄️ Database Operations Cheat Sheet

### Select Queries

```javascript
// Select all
const { data } = await supabase.from('table').select('*');

// Select specific columns
const { data } = await supabase.from('table').select('id, name, email');

// With filters
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('status', 'active')
  .gte('age', 18);

// With joins
const { data } = await supabase
  .from('orders')
  .select('*, customers(name, email)');

// Pagination
const { data } = await supabase
  .from('table')
  .select('*')
  .range(0, 9); // First 10 records

// Count
const { count } = await supabase
  .from('table')
  .select('*', { count: 'exact', head: true });
```

### Insert Operations

```javascript
// Single record
const { data } = await supabase
  .from('table')
  .insert([{ name: 'John', email: 'john@example.com' }])
  .select();

// Multiple records
const { data } = await supabase
  .from('table')
  .insert([
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' }
  ])
  .select();
```

### Update Operations

```javascript
const { data } = await supabase
  .from('table')
  .update({ status: 'completed' })
  .eq('id', 123)
  .select();
```

### Delete Operations

```javascript
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', 123);
```

---

## 🔐 Security Best Practices

### 1. Use Service Role Key Only on Server

```javascript
// ✅ Good - Server-side only
const supabase = require('./api/database'); // Uses service role key

// ❌ Bad - Never expose service role key to client
<script>
  const supabase = createClient(url, SERVICE_ROLE_KEY); // DON'T DO THIS!
</script>
```

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on a table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view own applications"
ON applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for inserts
CREATE POLICY "Users can create own applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### 3. Validate Input Before Database Operations

```javascript
function validateApplication(data) {
  const errors = [];
  
  if (!data.full_name || data.full_name.length < 2) {
    errors.push('Full name is required (min 2 characters)');
  }
  
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.phone_number || data.phone_number.length < 10) {
    errors.push('Valid phone number is required');
  }
  
  return errors;
}

// Usage
router.post('/applications', async (req, res) => {
  const validationErrors = validateApplication(req.body);
  
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: validationErrors
    });
  }
  
  // Proceed with database operation...
});
```

---

## 🧪 Testing

### Test Database Connection

```javascript
const supabase = require('./api/database');

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

testConnection();
```

### Test File Upload

```bash
node scripts/test-blob-storage.js
```

---

## 📊 Common Use Cases for Musharaka

### 1. Save Account Opening Application

```javascript
const supabase = require('./api/database');

async function saveAccountApplication(formData) {
  const { data, error } = await supabase
    .from('account_applications')
    .insert([{
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      id_number: formData.idNumber,
      account_type: formData.accountType,
      status: 'pending',
      created_at: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
}
```

### 2. Upload KYC Documents

```javascript
const { uploadFile } = require('./api/blob-storage');

async function uploadKYCDocuments(userId, files) {
  const uploads = [];
  
  for (const [key, file] of Object.entries(files)) {
    const result = await uploadFile(
      file.buffer,
      `kyc/${userId}/${key}-${Date.now()}.${file.originalname.split('.').pop()}`,
      'musharaka-uploads'
    );
    
    if (result.success) {
      uploads.push({
        document_type: key,
        url: result.publicUrl,
        path: result.path
      });
    }
  }
  
  return uploads;
}
```

### 3. Get User Applications

```javascript
async function getUserApplications(userId) {
  const { data, error } = await supabase
    .from('account_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

### 4. Update Application Status

```javascript
async function updateApplicationStatus(applicationId, status, notes) {
  const { data, error } = await supabase
    .from('account_applications')
    .update({
      status: status,
      admin_notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select();
  
  if (error) throw error;
  return data[0];
}
```

---

## 🔗 Useful Resources

- **Supabase JavaScript Docs**: https://supabase.com/docs/reference/javascript/introduction
- **Your Dashboard**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **SQL Editor**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql
- **Storage**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot read property 'from' of undefined" | Check `.env` has correct credentials |
| "Invalid API key" | Verify Service Role Key is correct |
| "Bucket not found" | Create `musharaka-uploads` bucket |
| "Permission denied" | Check RLS policies in Supabase Dashboard |
| "Network error" | Check internet connection and Supabase URL |

---

**Last Updated**: 2026-04-16  
**Project**: Musharaka Financial Services  
**Architecture**: Node.js/Express (NOT Next.js)
