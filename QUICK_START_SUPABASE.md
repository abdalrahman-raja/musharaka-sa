# 🚀 Quick Start - Supabase Connection

## Your Supabase Project

**URL**: https://awuqpxwfpsasvuulexdk.supabase.co  
**Project Ref**: `awuqpxwfpsasvuulexdk`

---

## ⚡ 3-Minute Setup

### Step 1: Get Your Service Role Key (1 min)

1. Open: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/settings/api
2. Find **Service Role Key**
3. Click **Reveal**
4. Copy the key (starts with `eyJ...`)

### Step 2: Update .env File (1 min)

Open `.env` and replace this line:
```env
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

With your actual key:
```env
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key
```

Save the file.

### Step 3: Test Connection (1 min)

```bash
node scripts/test-blob-storage.js
```

✅ If you see "✓ Blob storage test complete!" - You're done!

---

## 📦 Create Storage Bucket

Before uploading files, create the bucket:

1. Go to: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage
2. Click **New Bucket**
3. Name: `musharaka-uploads`
4. Click **Create**

---

## 💻 Using in Code

### Upload a File

```javascript
const { uploadFile } = require('./api/blob-storage');

const result = await uploadFile(fileBuffer, 'documents/file.pdf');
console.log(result.publicUrl); // Public URL of uploaded file
```

### Connect to Database

```javascript
const supabase = require('./api/database');

const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

---

## 🔧 Install Dependencies

```bash
cd api
npm install

cd ../backend
npm install
```

---

## 📚 Documentation

- **Full Guide**: [`SUPABASE_CONNECTION_GUIDE.md`](SUPABASE_CONNECTION_GUIDE.md)
- **Checklist**: [`SUPABASE_SETUP_CHECKLIST.md`](SUPABASE_SETUP_CHECKLIST.md)
- **Blob Storage**: [`BLOB_STORAGE_SETUP.md`](BLOB_STORAGE_SETUP.md)
- **Arabic Guide**: [`BLOB_STORAGE_SETUP_AR.md`](BLOB_STORAGE_SETUP_AR.md)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing credentials" | Check `.env` has `MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY` |
| "Bucket not found" | Create `musharaka-uploads` bucket in Dashboard |
| "Invalid API key" | Re-copy Service Role Key, remove extra spaces |
| "Permission denied" | Check bucket policies in Storage → Policies |

---

## 🔗 Quick Links

- **Dashboard**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **Storage**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/storage
- **SQL Editor**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql
- **Settings/API**: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/settings/api

---

## ✅ Environment Variables

Your `.env` file should have:

```env
MUSHARAKA_SUPABASE_URL=https://awuqpxwfpsasvuulexdk.supabase.co
MUSHARAKA_SUPABASE_ANON_KEY=sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=eyJ...[your_key_here]
```

⚠️ **Never commit `.env` to Git!** (Already in `.gitignore`)

---

**Need Help?** Run: `node scripts/test-blob-storage.js`
