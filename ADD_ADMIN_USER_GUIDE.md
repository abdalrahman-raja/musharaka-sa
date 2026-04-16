# Add Admin User to Database

## 📋 Overview

This guide explains how to add an admin user to the Musharaka Financial management system.

---

## 🔑 Admin User Credentials

| Field | Value |
|-------|--------|
| **Username** | `WailAdmin1000` |
| **Password** | `Zoro232594!@#$` |
| **Full Name** | Wail Admin |
| **Email** | `admin@musharaka.space` |
| **Role** | `super_admin` |
| **Permissions** | Full (all) |

---

## ⚠️ Prerequisites

Before adding the admin user, ensure:

1. ✅ You have run `database-schema.sql` in Supabase SQL Editor
2. ✅ Your `.env` file is updated with correct Supabase keys
3. ✅ Required dependencies are installed (`@supabase/supabase-js`, `bcryptjs`, `dotenv`)

---

## 🚀 Method 1: Using SQL (Directly in Supabase Dashboard) - **Recommended**

### Step 1: Open SQL Editor

Navigate to:
```
https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
```

### Step 2: Copy and Paste This Code

```sql
-- ============================================
-- Add Admin User
-- ============================================

INSERT INTO admins (username, password_hash, full_name, email, role, permissions, is_active)
VALUES (
  'WailAdmin1000',
  '$2b$10$/fmtxEKL1YyuGLIQPGqcX.NPIZDfDIkF/oEMp7sKe31SUltl71l7S',
  'Wail Admin',
  'admin@musharaka.space',
  'super_admin',
  '["all"]'::jsonb,
  true
)
ON CONFLICT (username) DO NOTHING;

-- Verify the insertion
SELECT id, username, full_name, email, role, is_active, created_at 
FROM admins 
WHERE username = 'WailAdmin1000';
```

### Step 3: Click "Run"

You should see a confirmation result showing the user was added successfully.

---

## 💻 Method 2: Using Node.js Script

### Step 1: Ensure Dependencies Are Installed

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa"
npm install @supabase/supabase-js bcryptjs dotenv
```

### Step 2: Verify .env File Is Updated

Make sure your `.env` file contains:

```env
MUSHARAKA_SUPABASE_URL=https://awuqpxwfpsasvuulexdk.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Run the Script

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa\scripts"
node add-admin-user.js
```

If successful, you'll see a confirmation message with user details.

---

## ✅ Verify the Addition

After adding the user, verify success using one of these methods:

### Method 1: Via SQL Editor

```sql
SELECT * FROM admins WHERE username = 'WailAdmin1000';
```

### Method 2: Via Dashboard

1. Go to: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/table-editor
2. Select the `admins` table
3. Search for user `WailAdmin1000`

---

## 🔐 Login Credentials

After successfully adding the user, login with:

- **Username:** `WailAdmin1000`
- **Password:** `Zoro232594!@#$`

---

## ⚠️ Important Security Notes

1. **Change Password:** Change the default password in production environment
2. **Protect Keys:** Never share Service Role Key with anyone
3. **Backup:** Keep secure backups of credentials
4. **Permissions:** This user has full `super_admin` privileges

---

## 🛠️ Troubleshooting

### Error: "Could not find the table 'public.admins'"

**Cause:** `database-schema.sql` has not been executed

**Solution:**
1. Open: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
2. Copy contents of `database-schema.sql`
3. Paste and click "Run"

### Error: "MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY is not set"

**Cause:** `.env` file is not updated

**Solution:**
1. Open `.env` file
2. Add Service Role Key from Dashboard
3. Save and retry

### Error: "Admin user already exists"

**Cause:** User already exists in database

**Solution:** Use existing credentials or delete old user and re-add

---

## 📚 Related Files

- [`database-schema.sql`](./database-schema.sql) - Complete database schema
- [`scripts/add-admin-user.js`](./scripts/add-admin-user.js) - Node.js script to add admin
- [`scripts/add-admin-user.sql`](./scripts/add-admin-user.sql) - Direct SQL script
- [`.env.example`](./.env.example) - Environment file example

---

## ✨ Final Result

After following the steps above, you will have:

✅ Admin user added to database  
✅ Password encrypted and secured  
✅ Full administrative permissions  
✅ Ready to login  

**Successfully completed!** 🎉
