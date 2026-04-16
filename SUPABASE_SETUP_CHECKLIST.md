# ✅ Supabase Setup Checklist

Use this checklist to ensure your Supabase connection is properly configured.

## Project Information

- **Project URL**: https://awuqpxwfpsasvuulexdk.supabase.co
- **Project Reference**: `awuqpxwfpsasvuulexdk`
- **Publishable Key**: `sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw`

---

## Setup Steps

### 1. Environment Configuration ✅

- [ ] `.env` file created in project root
- [ ] `MUSHARAKA_SUPABASE_URL` set to `https://awuqpxwfpsasvuulexdk.supabase.co`
- [ ] `MUSHARAKA_SUPABASE_ANON_KEY` set to publishable key
- [ ] `MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY` obtained from dashboard and added
- [ ] Database password updated in `MUSHARAKA_DATABASE_URL` (if using)

**How to get Service Role Key:**
1. Go to https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/settings/api
2. Click "Reveal" next to Service Role Key
3. Copy the key (starts with `eyJ...`)
4. Paste it in `.env` file

---

### 2. Storage Bucket Creation ✅

- [ ] Bucket named `musharaka-uploads` created
- [ ] Bucket visibility set (Public or Private)
- [ ] Storage policies configured

**Create bucket via Dashboard:**
1. Go to https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage
2. Click "New Bucket"
3. Name: `musharaka-uploads`
4. Toggle Public/Private as needed
5. Click "Create bucket"

**Or via SQL:**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('musharaka-uploads', 'musharaka-uploads', true);
```

---

### 3. Dependencies Installation ✅

- [ ] Node.js installed (v16 or higher)
- [ ] Project dependencies installed (`npm install`)
- [ ] `@supabase/supabase-js` package installed
- [ ] `dotenv` package installed

**Install dependencies:**
```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa\api"
npm install

cd "../backend"
npm install
```

---

### 4. Supabase CLI Setup (Optional) ✅

- [ ] Supabase CLI installed
- [ ] Logged in to Supabase (`supabase login`)
- [ ] Project initialized (`supabase init`)
- [ ] Project linked (`supabase link --project-ref awuqpxwfpsasvuulexdk`)

**Quick install (Windows):**
```powershell
.\setup-supabase-cli.ps1
```

**Or manually:**
```bash
npm install -g supabase
supabase login
supabase init
supabase link --project-ref awuqpxwfpsasvuulexdk
```

---

### 5. Testing ✅

- [ ] Test script runs successfully
- [ ] File upload works
- [ ] File listing works
- [ ] No console errors

**Run test:**
```bash
node scripts/test-blob-storage.js
```

**Expected output:**
```
✓ Checking environment variables...
✓ Environment variables configured
✓ Upload successful!
✓ Files listed successfully!
✓ Blob storage test complete!
```

---

### 6. Security Verification ✅

- [ ] `.env` file is in `.gitignore`
- [ ] Service Role Key is NOT exposed in client-side code
- [ ] Different keys used for development/production
- [ ] Storage bucket has appropriate policies
- [ ] CORS configured if needed

**Verify .gitignore:**
```bash
git check-ignore .env
# Should output: .env
```

---

### 7. Application Integration ✅

- [ ] `api/database.js` uses `MUSHARAKA_` prefixed variables
- [ ] `api/blob-storage.js` is available for use
- [ ] Code examples tested and working
- [ ] Error handling implemented

**Test database connection:**
```javascript
const supabase = require('./api/database');

async function test() {
  const { data, error } = await supabase.from('test').select('*');
  console.log(error || 'Connected!');
}
test();
```

---

## Common Issues & Solutions

### ❌ "Missing Supabase credentials"

**Solution:** Check `.env` file has these variables:
```env
MUSHARAKA_SUPABASE_URL=https://awuqpxwfpsasvuulexdk.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=your_actual_key_here
```

### ❌ "Bucket not found"

**Solution:** Create the `musharaka-uploads` bucket in Supabase Dashboard

### ❌ "Permission denied"

**Solution:** 
1. Check bucket policies in Dashboard → Storage → Policies
2. Verify Service Role Key is correct
3. Restart your server after updating `.env`

### ❌ "Invalid API key"

**Solution:**
1. Re-copy the Service Role Key from Dashboard
2. Remove any extra spaces in `.env`
3. Ensure you're using Service Role Key, not Anon Key

---

## Quick Start Commands

```bash
# 1. Navigate to project
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa"

# 2. Install dependencies (if not done)
cd api && npm install
cd ../backend && npm install
cd ..

# 3. Update .env with your Service Role Key
# Edit .env file and replace YOUR_SERVICE_ROLE_KEY_HERE

# 4. Test connection
node scripts/test-blob-storage.js

# 5. Start development server
cd api
npm start
```

---

## Resources

- 📖 Full Setup Guide: [`SUPABASE_CONNECTION_GUIDE.md`](SUPABASE_CONNECTION_GUIDE.md)
- 📖 Blob Storage Docs: [`BLOB_STORAGE_SETUP.md`](BLOB_STORAGE_SETUP.md)
- 📖 Arabic Guide: [`BLOB_STORAGE_SETUP_AR.md`](BLOB_STORAGE_SETUP_AR.md)
- 🔗 Your Dashboard: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- 🔗 Storage: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage
- 🔗 SQL Editor: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql

---

## Completion Status

Copy this checklist and track your progress:

```
Setup Progress: [__/7] Complete

□ Environment Configuration
□ Storage Bucket Creation  
□ Dependencies Installation
□ Supabase CLI Setup
□ Testing
□ Security Verification
□ Application Integration
```

When all boxes are checked, your Supabase integration is complete! 🎉

---

**Last Updated**: 2026-04-16  
**Project**: Musharaka Financial Services  
**Supabase Project**: awuqpxwfpsasvuulexdk
