# 🚀 البداية السريعة - مشروع مشاركة المالية

## ⚡ إعداد سريع (3 خطوات)

### الخطوة 1: تشغيل سكريبت الإعداد التلقائي

```powershell
.\setup-supabase-project.ps1
```

هذا السكريبت سيقوم بـ:
- ✅ التحقق من تثبيت Supabase CLI
- ✅ تسجيل الدخول إلى Supabase
- ✅ تهيئة المشروع
- ✅ ربط المشروع بالسحابة
- ✅ التحقق من الاتصال

---

### الخطوة 2: تطبيق مخطط قاعدة البيانات

1. افتح: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
2. انسخ محتوى [`database-schema.sql`](./database-schema.sql)
3. الصق واضغط "Run"

---

### الخطوة 3: إضافة المستخدم المسؤول

**الطريقة الأسهل (SQL):**

في نفس محرر SQL، نفذ:

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

**أو باستخدام Node.js:**

```bash
cd scripts
node add-admin-user.js
```

---

## 🔑 بيانات الدخول

بعد إضافة المستخدم:

```
Username: WailAdmin1000
Password: Zoro232594!@#$
```

---

## 📋 معلومات المشروع

| المعلومة | القيمة |
|----------|--------|
| **الرابط** | https://awuqpxwfpsasvuulexdk.supabase.co |
| **معرف المشروع** | awuqpxwfpsasvuulexdk |
| **المفتاح العام** | `sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw` |

---

## 🛠️ أوامر مفيدة

```bash
# عرض حالة المشروع
supabase status

# إعادة ربط المشروع
supabase link --project-ref awuqpxwfpsasvuulexdk

# تطبيق migrations
supabase db push

# سحب schema من السحابة
supabase db pull
```

---

## 📚 الوثائق الكاملة

- 📘 **إعداد Supabase CLI (عربي):** [`SUPABASE_CLI_SETUP_AR.md`](./SUPABASE_CLI_SETUP_AR.md)
- 📗 **Supabase CLI Setup (English):** [`SUPABASE_CLI_SETUP.md`](./SUPABASE_CLI_SETUP.md)
- 📙 **إضافة مستخدم مسؤول:** [`ADD_ADMIN_USER_GUIDE_AR.md`](./ADD_ADMIN_USER_GUIDE_AR.md)
- 📕 **Admin User Guide:** [`ADD_ADMIN_USER_GUIDE.md`](./ADD_ADMIN_USER_GUIDE.md)

---

## ⚠️ متطلبات مسبقة

- [ ] تثبيت Supabase CLI: `winget install supabase`
- [ ] تثبيت Node.js dependencies: `npm install @supabase/supabase-js bcryptjs dotenv`
- [ ] حساب Supabase نشط

---

## 🔗 روابط سريعة

- **Dashboard:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **SQL Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/table-editor

---

## ✨ تم!

بعد إكمال الخطوات الثلاث أعلاه، سيكون مشروعك جاهزاً للاستخدام! 🎉
