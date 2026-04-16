# 📋 Scripts Documentation

This directory contains utility scripts for managing the Musharaka project.

## 🔧 Available Scripts

### 1. Create First Admin User

**File:** `create-first-admin.js`

This script creates the first administrator account in the database with default credentials.

#### When to Use:
- After initial deployment
- When setting up a new environment
- If you need to reset admin access

#### Prerequisites:
1. Ensure Supabase is configured in `.env` files
2. Backend dependencies are installed (`npm install`)

#### How to Run:

```bash
cd c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa
node scripts/create-first-admin.js
```

#### Default Credentials Created:
- **Username:** `admin`
- **Password:** `Admin@123456`
- **Name:** مدير النظام
- **Role:** super_admin

⚠️ **IMPORTANT:** Change the password immediately after first login!

#### What It Does:
1. Checks if an admin user already exists
2. Hashes the password using bcrypt (10 rounds)
3. Inserts the admin record into the database
4. Displays the credentials and next steps

#### Output Example:
```
✅ SUCCESS! Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Login Credentials:
   Username: admin
   Password: Admin@123456
   Name: مدير النظام
   Role: super_admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANT: Please change the password after first login!

🌐 Admin Panel URL: http://localhost:3001/admin/
```

---

### 2. Test Blob Storage Connection

**File:** `test-blob-storage.js`

This script tests the Supabase Blob Storage connection and verifies that file upload/listing operations work correctly.

#### When to Use:
- After setting up blob storage configuration
- To verify environment variables are correct
- To troubleshoot storage connectivity issues

#### Prerequisites:
1. Ensure `.env` file has Supabase credentials with `MUSHARAKA_` prefix
2. Dependencies are installed (`npm install`)

#### How to Run:

```bash
node scripts/test-blob-storage.js
```

#### What It Tests:
1. ✅ Environment variables are configured
2. ✅ File upload functionality
3. ✅ File listing functionality
4. ✅ Connection to Supabase storage

#### Output Example:
```
Testing Blob Storage Connection...

✓ Checking environment variables...
✓ Environment variables configured

✓ Testing file upload...
✓ Upload successful!
  Path: test/test-file.txt
  URL: https://xxxxx.supabase.co/storage/v1/object/public/musharaka-uploads/test/test-file.txt

✓ Testing file listing...
✓ Files listed successfully!
  Found 1 files

✓ Blob storage test complete!
```

#### Troubleshooting:
- **"Environment variables not set"**: Check `.env` file has `MUSHARAKA_SUPABASE_URL` and `MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY`
- **"Upload failed"**: Verify bucket exists and permissions are correct
- **"Connection error"**: Check your internet connection and Supabase URL

---

## 🔐 Security Notes

1. **Never commit actual credentials to version control**
2. **Change default passwords immediately**
3. **Use strong passwords in production**
4. **Store .env files securely**
5. **Rotate credentials regularly**

---

## 🛠️ Troubleshooting

### Error: "Missing Supabase credentials"
**Solution:** Make sure your `.env` file has:
```env
MUSHARAKA_SUPABASE_URL=https://your-project.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Error: "relation 'admins' does not exist"
**Solution:** Run the database migration first to create the required tables.

### Error: "Admin user already exists"
**Solution:** The admin was already created. Use those credentials or reset the password from the admin panel.

### Error: "Blob storage connection failed"
**Solution:** 
1. Verify `.env` has correct Supabase credentials
2. Check that the bucket `musharaka-uploads` exists
3. Run `node scripts/test-blob-storage.js` to diagnose

---

## 📝 Creating Custom Admin Users

You can modify the script to create users with different credentials:

```javascript
const ADMIN_USERNAME = 'your_username';
const ADMIN_PASSWORD = 'your_secure_password';
const ADMIN_NAME = 'Your Name';
const ADMIN_ROLE = 'super_admin'; // or 'admin'
```

Then run the script again.

---

## 🔗 Related Files

- Backend Server: `backend/server.js`
- API Service: `api/index.js`
- Database Config: `api/database.js`
- Blob Storage: `api/blob-storage.js`
- Admin Panel: `admin/index.html`
- Environment Config: `.env`, `.env.example`
- Setup Guides: `BLOB_STORAGE_SETUP.md`, `BLOB_STORAGE_SETUP_AR.md`
