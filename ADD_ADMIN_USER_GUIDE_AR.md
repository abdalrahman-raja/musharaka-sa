# إضافة مستخدم مسؤول (Admin) إلى قاعدة البيانات

## 📋 نظرة عامة

هذا الدليل يشرح كيفية إضافة مستخدم مسؤول (Admin) إلى نظام إدارة مشاركة المالية.

---

## 🔑 بيانات المسؤول المراد إضافتها

| الحقل | القيمة |
|-------|--------|
| **اسم المستخدم** | `WailAdmin1000` |
| **كلمة المرور** | `Zoro232594!@#$` |
| **الاسم الكامل** | Wail Admin |
| **البريد الإلكتروني** | `admin@musharaka.space` |
| **الدور** | `super_admin` |
| **الصلاحيات** | كاملة (all) |

---

## ⚠️ متطلبات مسبقة

قبل إضافة المستخدم المسؤول، تأكد من:

1. ✅ تشغيل ملف `database-schema.sql` في محرر SQL الخاص بـ Supabase
2. ✅ تحديث ملف `.env` بمفاتيح Supabase الصحيحة
3. ✅ تثبيت dependencies المطلوبة (`@supabase/supabase-js`, `bcryptjs`, `dotenv`)

---

## 🚀 الطريقة 1: باستخدام SQL (مباشرة في Supabase Dashboard) - **الأفضل**

### الخطوة 1: افتح محرر SQL

انتقل إلى:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
```

### الخطوة 2: انسخ والصق الكود التالي

```sql
-- ============================================
-- إضافة مستخدم مسؤول
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

-- التحقق من الإضافة
SELECT id, username, full_name, email, role, is_active, created_at 
FROM admins 
WHERE username = 'WailAdmin1000';
```

### الخطوة 3: اضغط على "Run"

سيظهر لك نتيجة تؤكد إضافة المستخدم بنجاح.

---

## 💻 الطريقة 2: باستخدام Node.js Script

### الخطوة 1: تأكد من تثبيت dependencies

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa"
npm install @supabase/supabase-js bcryptjs dotenv
```

### الخطوة 2: تأكد من تحديث ملف .env

تأكد من أن ملف `.env` يحتوي على:

```env
MUSHARAKA_SUPABASE_URL=https://your-project-id.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### الخطوة 3: شغل السكريبت

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa\scripts"
node add-admin-user.js
```

إذا نجحت العملية، ستظهر رسالة تأكيد مع تفاصيل المستخدم.

---

## ✅ التحقق من الإضافة

بعد إضافة المستخدم، يمكنك التحقق من نجاح العملية بطريقتين:

### الطريقة 1: عبر SQL Editor

```sql
SELECT * FROM admins WHERE username = 'WailAdmin1000';
```

### الطريقة 2: عبر Dashboard

1. اذهب إلى: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/table-editor`
2. اختر جدول `admins`
3. ابحث عن المستخدم `WailAdmin1000`

---

## 🔐 تسجيل الدخول

بعد إضافة المستخدم بنجاح، يمكنك تسجيل الدخول باستخدام:

- **اسم المستخدم:** `WailAdmin1000`
- **كلمة المرور:** `Zoro232594!@#$`

---

## ⚠️ ملاحظات أمنية مهمة

1. **تغيير كلمة المرور:** يجب تغيير كلمة المرور الافتراضية في بيئة الإنتاج
2. **حماية المفاتيح:** لا تشارك مفاتيح Service Role Key مع أي شخص
3. **النسخ الاحتياطي:** احتفظ بنسخة آمنة من بيانات الاعتماد
4. **الصلاحيات:** المستخدم لديه صلاحيات `super_admin` كاملة

---

## 🛠️ استكشاف الأخطاء

### الخطأ: "Could not find the table 'public.admins'"

**السبب:** لم يتم تشغيل ملف `database-schema.sql`

**الحل:**
1. افتح: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new`
2. انسخ محتوى ملف `database-schema.sql`
3. الصقه واضغط "Run"

### الخطأ: "MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY is not set"

**السبب:** ملف `.env` غير محدث

**الحل:**
1. افتح ملف `.env`
2. أضف مفتاح Service Role من Dashboard
3. احفظ الملف وأعد المحاولة

### الخطأ: "Admin user already exists"

**السبب:** المستخدم موجود مسبقاً

**الحل:** استخدم بيانات الدخول الموجودة أو احذف المستخدم القديم وأعد الإضافة

---

## 📚 ملفات ذات صلة

- [`database-schema.sql`](../database-schema.sql) - مخطط قاعدة البيانات الكامل
- [`scripts/add-admin-user.js`](./add-admin-user.js) - سكريبت Node.js لإضافة المسؤول
- [`scripts/add-admin-user.sql`](./add-admin-user.sql) - سكريبت SQL المباشر
- [`.env.example`](../.env.example) - مثال لملف البيئة

---

## ✨ النتيجة النهائية

بعد اتباع الخطوات أعلاه، سيكون لديك:

✅ مستخدم مسؤول مُضاف إلى قاعدة البيانات  
✅ كلمة مرور مشفرة ومحمية  
✅ صلاحيات كاملة للإدارة  
✅ جاهز لتسجيل الدخول  

**تم الانتهاء بنجاح!** 🎉
