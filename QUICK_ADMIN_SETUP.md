# 🎯 Quick Reference: Add Admin User

## 🔑 Credentials

```
Username: WailAdmin1000
Password: Zoro232594!@#$
Email: admin@musharaka.space
Role: super_admin
```

---

## ⚡ Fastest Method (SQL)

**1. Open SQL Editor:**
```
https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
```

**2. Run This Query:**

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

**3. Verify:**

```sql
SELECT * FROM admins WHERE username = 'WailAdmin1000';
```

✅ Done!

---

## 💻 Alternative Method (Node.js)

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa\scripts"
node add-admin-user.js
```

---

## ⚠️ Prerequisites

- [ ] Run `database-schema.sql` first
- [ ] Update `.env` with Supabase keys
- [ ] Install dependencies: `npm install @supabase/supabase-js bcryptjs dotenv`

---

## 🔗 Useful Links

- **Dashboard:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **Get Service Role Key:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/settings/api

---

## 📖 Full Guides

- Arabic: [`ADD_ADMIN_USER_GUIDE_AR.md`](./ADD_ADMIN_USER_GUIDE_AR.md)
- English: [`ADD_ADMIN_USER_GUIDE.md`](./ADD_ADMIN_USER_GUIDE.md)
