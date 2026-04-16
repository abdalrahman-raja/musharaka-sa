# 🚀 Supabase Setup - Complete Guide for Musharaka

## Quick Overview

Your Supabase integration is **ready to use**! This guide walks you through the final setup steps.

---

## ✅ What's Already Done

1. ✅ `.env` file configured with your Supabase credentials
2. ✅ `@supabase/supabase-js` package installed
3. ✅ Database client helpers created
4. ✅ Blob storage utilities ready
5. ✅ Complete database schema prepared
6. ✅ Example API routes created

---

## 📋 Final Setup Steps (5 Minutes)

### Step 1: Get Your Service Role Key ⚠️ REQUIRED

**This is the only manual step you need to do!**

1. Open: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/settings/api
2. Find the **"Service Role Key"** section
3. Click **"Reveal"** button
4. Copy the entire key (starts with `eyJ...`)
5. Open `.env` file in your project
6. Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual key:

```env
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here
```

7. Save the file

---

### Step 2: Run Database Schema

1. Open SQL Editor: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql
2. Copy the entire contents of [`database-schema.sql`](database-schema.sql)
3. Paste it into the SQL Editor
4. Click **"Run"** button
5. Wait for success message

This will create:
- ✅ All required tables
- ✅ Security policies (RLS)
- ✅ Storage bucket
- ✅ Helper functions
- ✅ Indexes for performance

---

### Step 3: Test Connection

Open your terminal and run:

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa"
node scripts/test-blob-storage.js
```

**Expected output:**
```
Testing Blob Storage Connection...

✓ Checking environment variables...
✓ Environment variables configured

✓ Testing file upload...
✓ Upload successful!
  Path: test/test-file.txt
  URL: https://awuqpxwfpsasvuulexdk.supabase.co/storage/...

✓ Testing file listing...
✓ Files listed successfully!
  Found 1 files

✓ Blob storage test complete!
```

If you see errors, check the [Troubleshooting](#troubleshooting) section below.

---

### Step 4: Create First Admin User

Run this script to create your admin account:

```bash
node scripts/create-first-admin.js
```

**Default credentials:**
- Username: `admin`
- Password: `Admin@123456`

⚠️ **Change the password after first login!**

---

### Step 5: Start Your Server

```bash
# For API server
cd api
npm start

# Or for backend server
cd backend
npm start
```

Your server should start without errors. If you see credential warnings, double-check your `.env` file.

---

## 📁 Project Structure

```
musharaka-sa/
├── .env                              # ← Your credentials (DO NOT COMMIT!)
├── .env.example                      # Template for reference
├── database-schema.sql               # ← Run this in Supabase SQL Editor
│
├── api/
│   ├── database.js                   # Supabase database client
│   ├── blob-storage.js               # File upload utilities
│   ├── supabase-client.js            # Client helpers
│   └── routes/
│       └── account-applications.example.js  # Example API routes
│
├── scripts/
│   ├── test-blob-storage.js          # Test connection
│   └── create-first-admin.js         # Create admin user
│
└── Documentation/
    ├── SUPABASE_CONNECTION_GUIDE.md     # Detailed setup guide
    ├── SUPABASE_NODEJS_INTEGRATION.md   # Usage examples
    ├── BLOB_STORAGE_SETUP.md            # Blob storage docs
    └── QUICK_START_SUPABASE.md          # Quick reference
```

---

## 💻 How to Use Supabase in Your Code

### Example 1: Query Database

```javascript
const supabase = require('./api/database');

// Get all applications
const { data, error } = await supabase
  .from('account_applications')
  .select('*')
  .order('submitted_at', { ascending: false });

if (error) throw error;
console.log(data);
```

### Example 2: Insert Record

```javascript
const { data, error } = await supabase
  .from('account_applications')
  .insert([{
    full_name: 'Ahmed Mohammed',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    id_number: '1234567890',
    account_type: 'individual'
  }])
  .select();

if (error) throw error;
console.log('Created:', data[0]);
```

### Example 3: Upload File

```javascript
const { uploadFile } = require('./api/blob-storage');

const result = await uploadFile(
  fileBuffer,
  'documents/id-card.jpg',
  'musharaka-uploads'
);

if (result.success) {
  console.log('File URL:', result.publicUrl);
}
```

### Example 4: Authentication

```javascript
const { createBrowserClient } = require('./api/supabase-client');
const supabase = createBrowserClient();

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword'
});
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Your Dashboard** | https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk |
| **SQL Editor** | https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql |
| **Storage** | https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage |
| **Table Editor** | https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/editor |
| **Authentication** | https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/auth/users |
| **API Settings** | https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/settings/api |

---

## 📚 Documentation

- **[SUPABASE_CONNECTION_GUIDE.md](SUPABASE_CONNECTION_GUIDE.md)** - Complete setup guide
- **[SUPABASE_NODEJS_INTEGRATION.md](SUPABASE_NODEJS_INTEGRATION.md)** - Code examples & usage
- **[BLOB_STORAGE_SETUP.md](BLOB_STORAGE_SETUP.md)** - File storage documentation
- **[BLOB_STORAGE_SETUP_AR.md](BLOB_STORAGE_SETUP_AR.md)** - دليل الإعداد بالعربية
- **[QUICK_START_SUPABASE.md](QUICK_START_SUPABASE.md)** - Quick reference card
- **[SUPABASE_SETUP_CHECKLIST.md](SUPABASE_SETUP_CHECKLIST.md)** - Setup checklist

---

## 🆘 Troubleshooting

### ❌ "Missing Supabase credentials"

**Problem:** Environment variables not loaded

**Solution:**
1. Check `.env` file exists in project root
2. Verify these lines are present:
   ```env
   MUSHARAKA_SUPABASE_URL=https://awuqpxwfpsasvuulexdk.supabase.co
   MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=your_actual_key
   ```
3. Restart your Node.js server

---

### ❌ "Invalid API key" or "JWT expired"

**Problem:** Service Role Key is incorrect or expired

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Re-copy the Service Role Key
3. Update `.env` file
4. Remove any extra spaces
5. Restart server

---

### ❌ "Bucket not found" or "Storage object not found"

**Problem:** Storage bucket doesn't exist

**Solution:**
1. Run the [`database-schema.sql`](database-schema.sql) file in SQL Editor
2. OR manually create bucket:
   - Go to Storage section
   - Click "New Bucket"
   - Name: `musharaka-uploads`
   - Click "Create"

---

### ❌ "Permission denied" or "new row violates row-level security policy"

**Problem:** RLS policies blocking access

**Solution:**
1. Check if you're using Service Role Key (not Anon key) for server operations
2. Review RLS policies in Dashboard → Authentication → Policies
3. For testing, temporarily disable RLS:
   ```sql
   ALTER TABLE account_applications DISABLE ROW LEVEL SECURITY;
   ```

---

### ❌ "Cannot read property 'from' of undefined"

**Problem:** Supabase client not initialized

**Solution:**
```javascript
// Make sure you're requiring the correct file
const supabase = require('./api/database'); // ✅ Correct
// NOT
const supabase = require('./api/supabase-client'); // ❌ Wrong
```

---

### ❌ Database tables don't exist

**Problem:** Schema not run yet

**Solution:**
1. Open SQL Editor: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql
2. Copy entire [`database-schema.sql`](database-schema.sql) file
3. Paste and click "Run"
4. Refresh Table Editor to see new tables

---

### ❌ File uploads fail silently

**Problem:** Missing error handling

**Solution:**
```javascript
const result = await uploadFile(file, path);

if (!result.success) {
  console.error('Upload failed:', result.error);
  // Handle error appropriately
}
```

---

## 🔐 Security Checklist

- ✅ `.env` file in `.gitignore` (won't be committed)
- ✅ Service Role Key kept secret (server-side only)
- ✅ RLS policies enabled on all tables
- ✅ Different keys for dev/prod environments
- ✅ File validation before upload
- ✅ Input sanitization implemented

---

## 🎯 Next Steps

Now that Supabase is connected:

1. **Test the connection** - Run `node scripts/test-blob-storage.js`
2. **Create admin user** - Run `node scripts/create-first-admin.js`
3. **Review example code** - Check [`api/routes/account-applications.example.js`](api/routes/account-applications.example.js)
4. **Integrate with your forms** - Use the examples in [`SUPABASE_NODEJS_INTEGRATION.md`](SUPABASE_NODEJS_INTEGRATION.md)
5. **Deploy to production** - Add environment variables to your hosting platform

---

## 💡 Pro Tips

### Tip 1: Use Environment-Specific Keys

Create separate `.env` files:
- `.env.development` - For local development
- `.env.production` - For production (add to Vercel/hosting platform)

### Tip 2: Monitor Your Usage

Check your Supabase dashboard regularly:
- Database size
- Storage usage
- API requests
- Active connections

### Tip 3: Enable Backups

In Supabase Dashboard → Settings → Database:
- Enable automatic backups
- Set backup retention period
- Test restore procedure

### Tip 4: Use Database Functions

For complex operations, create PostgreSQL functions:
```sql
CREATE OR REPLACE FUNCTION get_application_stats()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'total', (SELECT COUNT(*) FROM account_applications),
    'pending', (SELECT COUNT(*) FROM account_applications WHERE status = 'pending_review'),
    'approved', (SELECT COUNT(*) FROM account_applications WHERE status = 'approved')
  );
END;
$$ LANGUAGE plpgsql;
```

Call from Node.js:
```javascript
const { data } = await supabase.rpc('get_application_stats');
```

---

## 📞 Need Help?

1. **Check the docs** - See documentation files listed above
2. **Run diagnostics** - `node scripts/test-blob-storage.js`
3. **Check Supabase logs** - Dashboard → Logs
4. **Review error messages** - They usually point to the solution
5. **Contact your team** - Reach out to your development team lead

---

## ✨ Success Indicators

You know everything is working when:

- ✅ `test-blob-storage.js` runs without errors
- ✅ You can create an admin user
- ✅ Server starts without credential warnings
- ✅ You can query the database from your code
- ✅ File uploads work correctly
- ✅ Admin panel loads and connects

---

**Project**: Musharaka Financial Services  
**Supabase Project**: awuqpxwfpsasvuulexdk  
**Setup Date**: 2026-04-16  
**Status**: Ready for Development 🚀
