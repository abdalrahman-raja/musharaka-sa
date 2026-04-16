# Supabase CLI Setup - Complete Guide

## 📋 Overview

This guide explains how to set up Supabase CLI and connect it to the Musharaka Financial project.

---

## 🔑 Project Information

| Item | Value |
|------|-------|
| **Project URL** | `https://awuqpxwfpsasvuulexdk.supabase.co` |
| **Project Reference** | `awuqpxwfpsasvuulexdk` |
| **Anon Key (Public)** | `sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw` |
| **Connection String** | `postgresql://postgres:[Jj3K8hH!4m/)Fa2]@db.awuqpxwfpsasvuulexdk.supabase.co:5432/postgres` |

---

## ⚙️ Setup Steps

### Step 1: Login to Supabase

Open Terminal/PowerShell and run:

```bash
supabase login
```

A browser window will open for you to login with your Supabase account.

---

### Step 2: Initialize Project (if not already initialized)

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa"
supabase init
```

This will create a `supabase/` directory with basic configuration files.

---

### Step 3: Link Local Project to Cloud Project

```bash
supabase link --project-ref awuqpxwfpsasvuulexdk
```

This links your local version to the cloud project.

---

### Step 4: Verify Connection

```bash
supabase status
```

You should see information about the linked project.

---

## 🗄️ Database Management

### Apply Database Schema

After linking the project, you can apply the `database-schema.sql` file:

```bash
# Method 1: Using SQL Editor in Dashboard
# Go to: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
# Copy contents of database-schema.sql, paste, and click Run

# Method 2: Using psql directly
psql "postgresql://postgres:[Jj3K8hH!4m/)Fa2]@db.awuqpxwfpsasvuulexdk.supabase.co:5432/postgres" -f database-schema.sql
```

---

### Add Admin User

Use one of these methods:

#### Method 1: Direct SQL (Recommended)

Open SQL Editor and run:

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
)
ON CONFLICT (username) DO NOTHING;
```

#### Method 2: Node.js Script

```bash
cd scripts
node add-admin-user.js
```

---

## 🛠️ Useful Supabase CLI Commands

### Project Management

```bash
# Show project status
supabase status

# List projects
supabase projects list

# Stop local project (for development)
supabase stop

# Start local project
supabase start
```

### Database Management

```bash
# Create new migration
supabase db diff -f my_migration_name

# Apply migrations to local project
supabase db reset

# Apply migrations to cloud project
supabase db push

# Pull schema from cloud project
supabase db pull
```

### Functions Management

```bash
# Deploy a function
supabase functions deploy my-function

# Test function locally
supabase functions serve
```

### Storage Management

```bash
# Create new bucket
supabase storage buckets create my-bucket

# Upload file
supabase storage cp local-file.txt remote/path/file.txt
```

---

## 📁 Directory Structure After Initialization

```
musharaka-sa/
├── supabase/
│   ├── config.toml          # Project configuration
│   ├── migrations/          # Migration files
│   ├── seed.sql            # Seed data
│   └── functions/          # Edge Functions
├── .env                    # Environment variables
├── database-schema.sql     # Complete database schema
└── scripts/
    ├── add-admin-user.js   # Admin user script
    └── add-admin-user.sql  # Direct SQL
```

---

## ⚠️ Important Security Notes

1. **Never share Service Role Key** with anyone
2. **Keep connection strings secure** in safe storage
3. **Use `.gitignore`** to exclude `.env` file from Git
4. **Change default passwords** in production environment

---

## 🔍 Troubleshooting

### Error: "supabase: command not found"

**Solution:** Install Supabase CLI

```bash
# Windows (using winget)
winget install supabase

# Or download directly from:
# https://github.com/supabase/cli/releases
```

### Error: "Not logged in"

**Solution:** Login again

```bash
supabase login
```

### Error: "Project not found"

**Solution:** Verify correct project reference

```bash
supabase link --project-ref awuqpxwfpsasvuulexdk
```

---

## 📚 Useful Links

- **Dashboard:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **SQL Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/table-editor
- **API Docs:** https://supabase.com/docs/reference/javascript/introduction
- **CLI Docs:** https://supabase.com/docs/reference/cli/introduction

---

## ✅ Checklist

- [ ] Install Supabase CLI
- [ ] Login (`supabase login`)
- [ ] Initialize project (`supabase init`)
- [ ] Link project (`supabase link`)
- [ ] Apply database-schema.sql
- [ ] Add admin user
- [ ] Verify connection
- [ ] Test API

---

## 🎉 Final Result

After completing the steps above, you will have:

✅ Supabase project configured and linked  
✅ Database ready with all tables  
✅ Admin user for management  
✅ Integrated development environment  

**Ready to use!** 🚀
