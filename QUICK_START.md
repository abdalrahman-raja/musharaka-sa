# 🚀 Quick Start - Musharaka Financial Project

## ⚡ Quick Setup (3 Steps)

### Step 1: Run Automated Setup Script

```powershell
.\setup-supabase-project.ps1
```

This script will:
- ✅ Check Supabase CLI installation
- ✅ Login to Supabase
- ✅ Initialize project
- ✅ Link to cloud project
- ✅ Verify connection

---

### Step 2: Apply Database Schema

1. Open: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
2. Copy contents of [`database-schema.sql`](./database-schema.sql)
3. Paste and click "Run"

---

### Step 3: Add Admin User

**Easiest Method (SQL):**

In the same SQL Editor, run:

```sql
INSERT INTO admins (username, password_hash, full_name, email, role, permissions, is_active)
VALUES (
  'WailAdmin1000',
  '$2b$10$/fmtxEKL1YyuGLIQPGqcX.NPIZDfDIkF/oEMp7sKe31SUltl71l7S',
  'Wail Admin',
  'admin@musharaka.space',
  'super_admin',
  '["all"]'::jsonb,
  true
);
```

**Or using Node.js:**

```bash
cd scripts
node add-admin-user.js
```

---

## 🔑 Login Credentials

After adding the user:

```
Username: WailAdmin1000
Password: Zoro232594!@#$
```

---

## 📋 Project Information

| Item | Value |
|------|-------|
| **URL** | https://awuqpxwfpsasvuulexdk.supabase.co |
| **Project ID** | awuqpxwfpsasvuulexdk |
| **Anon Key** | `sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw` |

---

## 🛠️ Useful Commands

```bash
# Show project status
supabase status

# Re-link project
supabase link --project-ref awuqpxwfpsasvuulexdk

# Apply migrations
supabase db push

# Pull schema from cloud
supabase db pull
```

---

## 📚 Full Documentation

- 📘 **Supabase CLI Setup (Arabic):** [`SUPABASE_CLI_SETUP_AR.md`](./SUPABASE_CLI_SETUP_AR.md)
- 📗 **Supabase CLI Setup (English):** [`SUPABASE_CLI_SETUP.md`](./SUPABASE_CLI_SETUP.md)
- 📙 **Add Admin User (Arabic):** [`ADD_ADMIN_USER_GUIDE_AR.md`](./ADD_ADMIN_USER_GUIDE_AR.md)
- 📕 **Admin User Guide (English):** [`ADD_ADMIN_USER_GUIDE.md`](./ADD_ADMIN_USER_GUIDE.md)

---

## ⚠️ Prerequisites

- [ ] Install Supabase CLI: `winget install supabase`
- [ ] Install Node.js dependencies: `npm install @supabase/supabase-js bcryptjs dotenv`
- [ ] Active Supabase account

---

## 🔗 Quick Links

- **Dashboard:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **SQL Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/table-editor

---

## ✨ Done!

After completing the three steps above, your project will be ready to use! 🎉
