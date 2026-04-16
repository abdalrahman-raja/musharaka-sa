# إعداد Supabase CLI - دليل كامل

## 📋 نظرة عامة

هذا الدليل يشرح كيفية إعداد Supabase CLI وربطه بمشروع مشاركة المالية.

---

## 🔑 معلومات المشروع

| المعلومة | القيمة |
|----------|--------|
| **رابط المشروع** | `https://awuqpxwfpsasvuulexdk.supabase.co` |
| **معرف المشروع** | `awuqpxwfpsasvuulexdk` |
| **المفتاح العام** | `sb_publishable_RxlvarRnfYX9My3lQiMtfg_dTBpknPw` |
| **سلسلة الاتصال** | `postgresql://postgres:[Jj3K8hH!4m/)Fa2]@db.awuqpxwfpsasvuulexdk.supabase.co:5432/postgres` |

---

## ⚙️ خطوات الإعداد

### الخطوة 1: تسجيل الدخول إلى Supabase

افتح Terminal/PowerShell ونفذ:

```bash
supabase login
```

سيتم فتح المتصفح لتسجيل الدخول بحسابك في Supabase.

---

### الخطوة 2: تهيئة المشروع (إذا لم يكن مهيأً)

```bash
cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa"
supabase init
```

هذا الأمر سينشئ مجلد `supabase/` مع ملفات التكوين الأساسية.

---

### الخطوة 3: ربط المشروع المحلي بالمشروع على السحابة

```bash
supabase link --project-ref awuqpxwfpsasvuulexdk
```

سيتم ربط النسخة المحلية بالنسخة السحابية من المشروع.

---

### الخطوة 4: التحقق من الربط

```bash
supabase status
```

يجب أن تظهر معلومات المشروع المرتبط.

---

## 🗄️ إدارة قاعدة البيانات

### تطبيق مخطط قاعدة البيانات

بعد ربط المشروع، يمكنك تطبيق ملف `database-schema.sql`:

```bash
# الطريقة 1: باستخدام SQL Editor في Dashboard
# انتقل إلى: https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
# انسخ محتوى database-schema.sql والصقه ثم اضغط Run

# الطريقة 2: باستخدام psql مباشرة
psql "postgresql://postgres:[Jj3K8hH!4m/)Fa2]@db.awuqpxwfpsasvuulexdk.supabase.co:5432/postgres" -f database-schema.sql
```

---

### إضافة المستخدم المسؤول

استخدم أحد الطريقتين:

#### الطريقة 1: SQL مباشر (موصى به)

افتح SQL Editor ونفذ:

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

#### الطريقة 2: Node.js Script

```bash
cd scripts
node add-admin-user.js
```

---

## 🛠️ أوامر Supabase CLI المفيدة

### إدارة المشروع

```bash
# عرض حالة المشروع
supabase status

# عرض معلومات المشروع
supabase projects list

# إيقاف المشروع المحلي (للتطوير)
supabase stop

# بدء المشروع المحلي
supabase start
```

### إدارة قاعدة البيانات

```bash
# إنشاء migration جديدة
supabase db diff -f my_migration_name

# تطبيق migrations على المشروع المحلي
supabase db reset

# تطبيق migrations على المشروع السحابي
supabase db push

# سحب schema من المشروع السحابي
supabase db pull
```

### إدارة الوظائف (Functions)

```bash
# نشر وظيفة
supabase functions deploy my-function

# اختبار وظيفة محلياً
supabase functions serve
```

### إدارة التخزين (Storage)

```bash
# إنشاء bucket جديد
supabase storage buckets create my-bucket

# رفع ملف
supabase storage cp local-file.txt remote/path/file.txt
```

---

## 📁 هيكل المجلدات بعد التهيئة

```
musharaka-sa/
├── supabase/
│   ├── config.toml          # إعدادات المشروع
│   ├── migrations/          # ملفات الـ migrations
│   ├── seed.sql            # بيانات أولية
│   └── functions/          # Edge Functions
├── .env                    # متغيرات البيئة
├── database-schema.sql     # مخطط قاعدة البيانات الكامل
└── scripts/
    ├── add-admin-user.js   # سكريبت إضافة المسؤول
    └── add-admin-user.sql  # SQL المباشر
```

---

## ⚠️ ملاحظات أمنية مهمة

1. **لا تشارك مفاتيح Service Role Key** مع أي شخص
2. **احتفظ بنسخة آمنة** من سلسلة الاتصال
3. **استخدم `.gitignore`** لاستبعاد ملف `.env` من Git
4. **غيّر كلمات المرور الافتراضية** في بيئة الإنتاج

---

## 🔍 استكشاف الأخطاء

### الخطأ: "supabase: command not found"

**الحل:** تثبيت Supabase CLI

```bash
# Windows (باستخدام winget)
winget install supabase

# أو تحميل مباشر من:
# https://github.com/supabase/cli/releases
```

### الخطأ: "Not logged in"

**الحل:** سجل الدخول مرة أخرى

```bash
supabase login
```

### الخطأ: "Project not found"

**الحل:** تأكد من معرف المشروع الصحيح

```bash
supabase link --project-ref awuqpxwfpsasvuulexdk
```

---

## 📚 روابط مفيدة

- **Dashboard:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk
- **SQL Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/awuqpxwfpsasvuulexdk/table-editor
- **API Docs:** https://supabase.com/docs/reference/javascript/introduction
- **CLI Docs:** https://supabase.com/docs/reference/cli/introduction

---

## ✅ قائمة التحقق

- [ ] تثبيت Supabase CLI
- [ ] تسجيل الدخول (`supabase login`)
- [ ] تهيئة المشروع (`supabase init`)
- [ ] ربط المشروع (`supabase link`)
- [ ] تطبيق database-schema.sql
- [ ] إضافة المستخدم المسؤول
- [ ] التحقق من الاتصال
- [ ] اختبار API

---

## 🎉 النتيجة النهائية

بعد إكمال الخطوات أعلاه، سيكون لديك:

✅ مشروع Supabase مُعد ومربوط  
✅ قاعدة بيانات جاهزة مع جميع الجداول  
✅ مستخدم مسؤول للإدارة  
✅ بيئة تطوير متكاملة  

**جاهز للاستخدام!** 🚀
