# Blob Storage Setup Guide with Custom Prefix

## Overview

This guide explains how to configure Supabase Blob Storage for the Musharaka Financial Services project using custom environment variable prefixes.

## What is a Custom Prefix?

When connecting Supabase Blob Store to your deployment platform (Vercel, Netlify, etc.), the platform automatically creates environment variables. A **Custom Prefix** allows you to customize the naming convention of these auto-generated variables.

### Default vs. Custom Prefix

**Without Custom Prefix:**
```env
BLOB_READ_WRITE_TOKEN=token_value
BLOB_STORE_URL=url_value
BLOB_STORE_ID=id_value
```

**With Custom Prefix (`MUSHARAKA_`):**
```env
MUSHARAKA_BLOB_READ_WRITE_TOKEN=token_value
MUSHARAKA_BLOB_STORE_URL=url_value
MUSHARAKA_BLOB_STORE_ID=id_value
```

## Benefits of Using Custom Prefix

1. **Namespace Organization**: Prevents conflicts with other services
2. **Multiple Stores**: Allows connecting multiple blob stores without variable name collisions
3. **Clarity**: Makes it immediately clear which service the variables belong to
4. **Team Collaboration**: Easier for team members to understand variable purposes

## Configuration Steps

### Step 1: Set Up Supabase Project

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Navigate to **Storage** in the left sidebar
3. Create a new bucket or use the default one
4. Configure bucket permissions (public/private as needed)

### Step 2: Get Credentials

From your Supabase dashboard:

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Service Role Key** (keep this secret!)

### Step 3: Configure Environment Variables

#### Option A: Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add the following variables with the `MUSHARAKA_` prefix:

```env
MUSHARAKA_SUPABASE_URL=https://your-project.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
MUSHARAKA_BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

5. Select the appropriate environments (Production, Preview, Development)
6. Click **Save**

#### Option B: Local Development (.env file)

Create a `.env` file in your project root:

```env
# Supabase Configuration with Custom Prefix
MUSHARAKA_SUPABASE_URL=https://your-project.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MUSHARAKA_BLOB_READ_WRITE_TOKEN=your_blob_token_here

# Optional: Additional blob store settings
MUSHARAKA_BLOB_STORE_URL=https://your-store.blob.vercel-storage.com
MUSHARAKA_BLOB_STORE_ID=store_id_here
```

**Important:** Add `.env` to your `.gitignore` file to prevent committing sensitive data.

### Step 4: Update Application Code

Update your database configuration to use the prefixed environment variables:

**File: `api/database.js`**

```javascript
'use strict';
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use custom prefix for environment variables
const SUPABASE_URL = process.env.MUSHARAKA_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('✗ Supabase credentials missing (MUSHARAKA_SUPABASE_URL, MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY) in .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = supabase;
```

### Step 5: Implement Blob Storage Operations

Create a blob storage utility module:

**File: `api/blob-storage.js`** (New File)

```javascript
'use strict';
const supabase = require('./database');

/**
 * Upload file to Supabase Blob Storage
 * @param {Buffer|Blob} fileData - The file data to upload
 * @param {string} fileName - The name of the file
 * @param {string} bucket - The bucket name (default: 'musharaka-uploads')
 * @returns {Object} Upload result with public URL
 */
async function uploadFile(fileData, fileName, bucket = 'musharaka-uploads') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Download file from Supabase Blob Storage
 * @param {string} fileName - The name of the file
 * @param {string} bucket - The bucket name
 * @returns {Object} File data
 */
async function downloadFile(fileName, bucket = 'musharaka-uploads') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .download(fileName);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete file from Supabase Blob Storage
 * @param {string} fileName - The name of the file
 * @param {string} bucket - The bucket name
 * @returns {Object} Deletion result
 */
async function deleteFile(fileName, bucket = 'musharaka-uploads') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw error;
    }

    return {
      success: true,
      deleted: data
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List files in a bucket
 * @param {string} bucket - The bucket name
 * @param {string} path - Optional path prefix
 * @returns {Array} List of files
 */
async function listFiles(bucket = 'musharaka-uploads', path = '') {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .list(path);

    if (error) {
      throw error;
    }

    return {
      success: true,
      files: data
    };
  } catch (error) {
    console.error('List files error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles
};
```

## Usage Examples

### Example 1: Upload KYC Document

```javascript
const { uploadFile } = require('./blob-storage');

// Upload a user's ID document
async function uploadKYCDocument(userId, fileBuffer, fileName) {
  const path = `kyc/${userId}/${fileName}`;
  const result = await uploadFile(fileBuffer, path);
  
  if (result.success) {
    console.log('Document uploaded:', result.publicUrl);
    return result.publicUrl;
  } else {
    throw new Error(result.error);
  }
}
```

### Example 2: Upload Face Verification Video

```javascript
const { uploadFile } = require('./blob-storage');

// Upload face verification video
async function uploadFaceVerification(applicationId, videoBlob) {
  const fileName = `face-verification/${applicationId}-${Date.now()}.webm`;
  const result = await uploadFile(videoBlob, fileName);
  
  return result;
}
```

### Example 3: API Endpoint for File Upload

```javascript
// In your API routes
const express = require('express');
const multer = require('multer');
const { uploadFile } = require('./blob-storage');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-document', upload.single('document'), async (req, res) => {
  try {
    const { userId, documentType } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileName = `${documentType}/${userId}/${Date.now()}-${file.originalname}`;
    const result = await uploadFile(file.buffer, fileName);
    
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
});

module.exports = router;
```

## Security Best Practices

### 1. Bucket Policies

Configure appropriate bucket policies in Supabase:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'musharaka-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'musharaka-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2. Environment Variable Security

- Never commit `.env` files to version control
- Use different credentials for development, staging, and production
- Rotate tokens regularly
- Use Vercel's encrypted environment variables for production

### 3. File Validation

Always validate files before uploading:

```javascript
function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  } = options;
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed (${maxSize / 1024 / 1024}MB)`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }
  
  return true;
}
```

## Troubleshooting

### Issue: Environment Variables Not Loading

**Solution:**
1. Verify `.env` file exists in project root
2. Check that `dotenv` is installed: `npm install dotenv`
3. Ensure `require('dotenv').config()` is called before accessing variables
4. Restart your development server after adding variables

### Issue: CORS Errors

**Solution:**
Configure CORS in Supabase dashboard:
1. Go to **Storage** → **Configuration**
2. Add your domain to allowed origins
3. Set appropriate methods (GET, POST, PUT, DELETE)

### Issue: Permission Denied

**Solution:**
1. Verify bucket policies are correctly configured
2. Check that Service Role Key has appropriate permissions
3. Ensure the bucket exists and is accessible

### Issue: Large File Uploads Fail

**Solution:**
1. Increase timeout settings in your server configuration
2. Implement chunked uploads for large files
3. Consider using presigned URLs for direct client-to-storage uploads

## Testing

### Test Blob Storage Connection

Create a test script:

**File: `scripts/test-blob-storage.js`**

```javascript
require('dotenv').config();
const { uploadFile, listFiles } = require('../api/blob-storage');
const fs = require('fs');
const path = require('path');

async function testBlobStorage() {
  console.log('Testing Blob Storage Connection...\n');
  
  // Check environment variables
  console.log('✓ Checking environment variables...');
  if (!process.env.MUSHARAKA_SUPABASE_URL) {
    console.error('✗ MUSHARAKA_SUPABASE_URL not set');
    return;
  }
  if (!process.env.MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('✗ MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY not set');
    return;
  }
  console.log('✓ Environment variables configured\n');
  
  // Test upload
  console.log('✓ Testing file upload...');
  try {
    const testFile = Buffer.from('Test content for blob storage');
    const result = await uploadFile(testFile, 'test/test-file.txt');
    
    if (result.success) {
      console.log('✓ Upload successful!');
      console.log('  Path:', result.path);
      console.log('  URL:', result.publicUrl);
    } else {
      console.error('✗ Upload failed:', result.error);
    }
  } catch (error) {
    console.error('✗ Upload error:', error.message);
  }
  
  // Test list files
  console.log('\n✓ Testing file listing...');
  try {
    const result = await listFiles('musharaka-uploads', 'test');
    
    if (result.success) {
      console.log('✓ Files listed successfully!');
      console.log('  Found', result.files.length, 'files');
    } else {
      console.error('✗ List failed:', result.error);
    }
  } catch (error) {
    console.error('✗ List error:', error.message);
  }
  
  console.log('\n✓ Blob storage test complete!');
}

testBlobStorage().catch(console.error);
```

Run the test:
```bash
node scripts/test-blob-storage.js
```

## Migration Guide

If you're migrating from non-prefixed to prefixed environment variables:

### Step 1: Update Environment Variables

Add new prefixed variables alongside old ones:
```env
# Old (will be deprecated)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# New (with prefix)
MUSHARAKA_SUPABASE_URL=...
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=...
```

### Step 2: Update Code with Fallback

```javascript
// Support both old and new variable names during migration
const SUPABASE_URL = process.env.MUSHARAKA_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
```

### Step 3: Deploy and Test

1. Deploy with both sets of variables
2. Verify everything works
3. Remove old variables after confirmation

### Step 4: Clean Up

Remove old environment variables from all environments.

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [Environment Variables Best Practices](https://12factor.net/config)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Contact your development team lead

---

**Last Updated:** 2026-04-16  
**Project:** Musharaka Financial Services  
**Version:** 1.0
