# Blob Storage Setup - Quick Start Guide

## What Was Created

This guide summarizes the blob storage setup with custom environment variable prefixes for the Musharaka Financial Services project.

### Files Created/Modified

#### 1. Documentation
- **[`BLOB_STORAGE_SETUP.md`](BLOB_STORAGE_SETUP.md)** - Complete English documentation
- **[`BLOB_STORAGE_SETUP_AR.md`](BLOB_STORAGE_SETUP_AR.md)** - Complete Arabic documentation
- **`QUICK_START_BLOB.md`** - This file (quick reference)

#### 2. Configuration Files
- **[`.env.example`](.env.example)** - Template for environment variables with `MUSHARAKA_` prefix
- **[`.gitignore`](.gitignore)** - Prevents committing sensitive `.env` files

#### 3. Code Updates
- **[`api/database.js`](api/database.js)** - Updated to support custom prefix with backward compatibility
- **[`api/blob-storage.js`](api/blob-storage.js)** - New utility module for blob storage operations
- **[`scripts/test-blob-storage.js`](scripts/test-blob-storage.js)** - Test script to verify setup

## Quick Start (3 Steps)

### Step 1: Copy Environment Template

```bash
# In your project root directory
cp .env.example .env
```

### Step 2: Fill in Your Credentials

Edit `.env` and add your Supabase credentials:

```env
MUSHARAKA_SUPABASE_URL=https://your-project-id.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Get these from:** Supabase Dashboard → Project Settings → API

### Step 3: Test the Connection

```bash
node scripts/test-blob-storage.js
```

If successful, you'll see:
```
✓ Environment variables configured
✓ Upload successful!
✓ Files listed successfully!
✓ Blob storage test complete!
```

## Using Blob Storage in Your Code

### Example 1: Upload a File

```javascript
const { uploadFile } = require('./api/blob-storage');
const fs = require('fs');

// Read file
const fileBuffer = fs.readFileSync('document.pdf');

// Upload to blob storage
const result = await uploadFile(fileBuffer, 'documents/my-file.pdf');

if (result.success) {
  console.log('File URL:', result.publicUrl);
}
```

### Example 2: Upload KYC Document

```javascript
const { uploadFile } = require('./api/blob-storage');

async function uploadKYC(userId, fileBuffer, fileName) {
  const path = `kyc/${userId}/${fileName}`;
  return await uploadFile(fileBuffer, path);
}
```

### Example 3: List Files

```javascript
const { listFiles } = require('./api/blob-storage');

const result = await listFiles('musharaka-uploads', 'kyc/user123');
console.log('Files:', result.files);
```

## Available Functions

The [`api/blob-storage.js`](api/blob-storage.js) module provides:

| Function | Description |
|----------|-------------|
| `uploadFile(fileData, fileName, bucket)` | Upload a file to storage |
| `downloadFile(fileName, bucket)` | Download a file from storage |
| `deleteFile(fileName, bucket)` | Delete a file from storage |
| `listFiles(bucket, path)` | List files in a directory |
| `generateSignedUrl(fileName, expiresIn, bucket)` | Create temporary access URL |

## Environment Variables

### Required (with MUSHARAKA_ prefix)

```env
MUSHARAKA_SUPABASE_URL=https://xxxxx.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### Optional

```env
MUSHARAKA_BLOB_READ_WRITE_TOKEN=token_here
MUSHARAKA_BLOB_STORE_URL=url_here
```

### Legacy Support (Deprecated)

The code still supports old variable names for backward compatibility:
```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

But using `MUSHARAKA_` prefix is **strongly recommended**.

## Security Checklist

- ✅ `.env` file added to `.gitignore`
- ✅ Service Role Key kept secret
- ✅ File validation before upload
- ✅ Bucket policies configured
- ✅ Different credentials for dev/prod

## Next Steps

1. **Read the full documentation:**
   - English: [`BLOB_STORAGE_SETUP.md`](BLOB_STORAGE_SETUP.md)
   - Arabic: [`BLOB_STORAGE_SETUP_AR.md`](BLOB_STORAGE_SETUP_AR.md)

2. **Configure your Supabase bucket:**
   - Create bucket named `musharaka-uploads`
   - Set appropriate permissions
   - Configure CORS if needed

3. **Deploy to production:**
   - Add environment variables to Vercel/your hosting platform
   - Use the `MUSHARAKA_` prefix for all variables
   - Test in staging environment first

4. **Integrate with your forms:**
   - Use blob storage for KYC documents
   - Store face verification videos
   - Handle user uploads securely

## Troubleshooting

### "Environment variables not set" error

**Solution:** Make sure `.env` file exists and contains the correct variable names with `MUSHARAKA_` prefix.

### "Permission denied" error

**Solution:** Check your Supabase bucket policies and ensure the Service Role Key has write access.

### "Module not found" error

**Solution:** Install dependencies:
```bash
npm install @supabase/supabase-js dotenv
```

## Need Help?

- 📖 Read the detailed guides: [`BLOB_STORAGE_SETUP.md`](BLOB_STORAGE_SETUP.md) or [`BLOB_STORAGE_SETUP_AR.md`](BLOB_STORAGE_SETUP_AR.md)
- 🧪 Run the test script: `node scripts/test-blob-storage.js`
- 🔍 Check Supabase dashboard logs
- 👥 Contact your development team

---

**Project:** Musharaka Financial Services  
**Created:** 2026-04-16  
**Version:** 1.0
