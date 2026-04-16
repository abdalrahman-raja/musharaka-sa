# Supabase Connection Setup Guide

## Your Project Details

- **Project URL**: `https://awuqpxwfpsasvuulexdk.supabase.co`
- **Project Reference**: `awuqpxwfpsasvuulexdk`
- **Publishable Key**: `sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw`
- **Database**: `postgresql://postgres:[YOUR-PASSWORD]@db.awuqpxwfpsasvuulexdk.supabase.co:5432/postgres`

## Quick Setup (3 Steps)

### Step 1: Get Your Service Role Key

The `.env` file has been created but you need to add your **Service Role Key**:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk)
2. Click on **Settings** (gear icon in left sidebar)
3. Click on **API**
4. Find the **Service Role Key** section
5. Click **Reveal** to show the key
6. Copy the key (it starts with `eyJ...`)

### Step 2: Update .env File

Open the `.env` file and replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual Service Role Key:

```env
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_actual_key_here
```

Also update your database password if you want to use direct database access:

```env
MUSHARAKA_DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.awuqpxwfpsasvuulexdk.supabase.co:5432/postgres
```

### Step 3: Test the Connection

Run the test script to verify everything is working:

```bash
node scripts/test-blob-storage.js
```

Expected output:
```
Testing Blob Storage Connection...

✓ Checking environment variables...
✓ Environment variables configured

✓ Testing file upload...
✓ Upload successful!
  Path: test/test-file.txt
  URL: https://awuqpxwfpsasvuulexdk.supabase.co/storage/v1/object/public/musharaka-uploads/test/test-file.txt

✓ Blob storage test complete!
```

## Supabase CLI Setup (Optional)

If you want to use the Supabase CLI for local development and migrations:

### Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using homebrew (Mac)
brew install supabase/tap/supabase

# Or using winget (Windows)
winget install Supabase.CLI
```

### Login to Supabase

```bash
supabase login
```

This will open a browser window. Log in with your Supabase account.

### Initialize Supabase in Your Project

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa"
supabase init
```

This creates a `supabase` directory with configuration files.

### Link to Your Project

```bash
supabase link --project-ref awuqpxwfpsasvuulexdk
```

You'll be prompted for your database password. Enter the password for your PostgreSQL database.

### Verify Connection

```bash
supabase status
```

You should see your project details and connection status.

## Create Storage Bucket

Before uploading files, you need to create the storage bucket:

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to [Storage Section](https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage)
2. Click **New Bucket**
3. Name it: `musharaka-uploads`
4. Set visibility: **Public** (or Private if you prefer)
5. Click **Create bucket**

### Option 2: Via SQL Editor

Run this SQL in the Supabase SQL Editor:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('musharaka-uploads', 'musharaka-uploads', true);

-- Set up policies for authenticated users
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'musharaka-uploads');

CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'musharaka-uploads');

CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'musharaka-uploads');

CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'musharaka-uploads');

-- For public access (if bucket is public)
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'musharaka-uploads');
```

## Configure CORS (If Needed)

If you're accessing the storage from a different domain, configure CORS:

1. Go to **Settings** → **API**
2. Scroll to **CORS Configuration**
3. Add your domains:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)
4. Save changes

## Environment Variables Summary

Your `.env` file now contains:

```env
# Required
MUSHARAKA_SUPABASE_URL=https://awuqpxwfpsasvuulexdk.supabase.co
MUSHARAKA_SUPABASE_ANON_KEY=sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=[Get from Dashboard]

# Optional (for direct DB access)
MUSHARAKA_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.awuqpxwfpsasvuulexdk.supabase.co:5432/postgres
```

## Security Checklist

- ✅ `.env` file created with `MUSHARAKA_` prefix
- ✅ `.env` added to `.gitignore` (won't be committed)
- ⚠️ Replace `YOUR_SERVICE_ROLE_KEY_HERE` with actual key
- ⚠️ Replace `YOUR_PASSWORD` in database URL if using
- ⚠️ Never share your Service Role Key
- ⚠️ Use different keys for production

## Testing Your Setup

### Test 1: Basic Connection

```javascript
const supabase = require('./api/database');

async function testConnection() {
  const { data, error } = await supabase.from('test_table').select('*').limit(1);
  
  if (error) {
    console.error('Connection error:', error.message);
  } else {
    console.log('Connected successfully!');
  }
}

testConnection();
```

### Test 2: Storage Upload

```bash
node scripts/test-blob-storage.js
```

### Test 3: Start Your Server

```bash
# For API server
cd api
npm start

# For backend server
cd backend
npm start
```

## Troubleshooting

### "Invalid API key" Error

**Solution:** 
- Verify your Service Role Key is correct
- Make sure there are no extra spaces in the `.env` file
- Restart your Node.js server after changing `.env`

### "Bucket not found" Error

**Solution:**
- Create the `musharaka-uploads` bucket in Supabase Dashboard
- Check the bucket name matches exactly (case-sensitive)

### "Permission denied" Error

**Solution:**
- Check bucket policies in Supabase Dashboard → Storage → Policies
- Ensure the Service Role Key has appropriate permissions
- For testing, you can temporarily make the bucket public

### "Cannot connect to database" Error

**Solution:**
- Verify your database password is correct
- Check that your IP is allowed (Supabase allows all by default)
- Ensure the database URL format is correct

## Next Steps

1. ✅ Get your Service Role Key from Supabase Dashboard
2. ✅ Update `.env` file with the key
3. ✅ Create the `musharaka-uploads` storage bucket
4. ✅ Run the test script: `node scripts/test-blob-storage.js`
5. ✅ Start developing! 🚀

## Useful Links

- **Your Project Dashboard**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **Storage Management**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage
- **SQL Editor**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql
- **API Documentation**: https://supabase.com/docs/reference/javascript/introduction
- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli

## Need Help?

- 📖 Read the full blob storage guide: [`BLOB_STORAGE_SETUP.md`](BLOB_STORAGE_SETUP_SETUP.md)
- 📖 Arabic guide: [`BLOB_STORAGE_SETUP_AR.md`](BLOB_STORAGE_SETUP_AR.md)
- 🧪 Test your setup: `node scripts/test-blob-storage.js`
- 💬 Contact your development team

---

**Project**: Musharaka Financial Services  
**Supabase Project**: awuqpxwfpsasvuulexdk  
**Created**: 2026-04-16
