# دليل إعداد تخزين الملفات السحابية (Blob Storage)

## نظرة عامة

يشرح هذا الدليل كيفية إعداد خدمة التخزين السحابي من Supabase لمشروع مشاركة المالية باستخدام بادئة مخصصة لمتغيرات البيئة.

## ما هي البادئة المخصصة؟

عند ربط خدمة التخزين السحابي من Supabase بمنصة النشر (مثل Vercel)، تقوم المنصة تلقائياً بإنشاء متغيرات بيئة. تتيح لك **البادئة المخصصة** تخصيص طريقة تسمية هذه المتغيرات.

### بدون بادئة مخصصة:
```env
BLOB_READ_WRITE_TOKEN=قيمة_الرمز
BLOB_STORE_URL=رابط_التخزين
```

### مع بادئة مخصصة (`MUSHARAKA_`):
```env
MUSHARAKA_BLOB_READ_WRITE_TOKEN=قيمة_الرمز
MUSHARAKA_BLOB_STORE_URL=رابط_التخزين
```

## فوائد استخدام البادئة المخصصة

1. **تنظيم أفضل**: تمنع التعارض مع خدمات أخرى
2. **تعدد التخزينات**: تسمح بربط عدة خدمات تخزين دون تعارض
3. **وضوح**: تجعل من الواضح لأي خدمة تنتمي المتغيرات
4. **سهولة التعاون**: تسهل على أعضاء الفريق فهم وظيفة كل متغير

## خطوات الإعداد

### الخطوة 1: إعداد مشروع Supabase

1. أنشئ مشروعاً على [supabase.com](https://supabase.com)
2. انتقل إلى **Storage** في القائمة الجانبية
3. أنشئ حاوية تخزين جديدة أو استخدم الحاوية الافتراضية
4. قم بتكوين أذونات الحاوية (عامة/خاصة حسب الحاجة)

### الخطوة 2: الحصول على بيانات الاعتماد

من لوحة تحكم Supabase:

1. اذهب إلى **Project Settings** → **API**
2. انسخ المعلومات التالية:
   - **Project URL** (مثال: `https://xxxxx.supabase.co`)
   - **Service Role Key** (احتفظ بهذا سرياً!)

### الخطوة 3: تكوين متغيرات البيئة

#### الخيار أ: النشر على Vercel

1. اذهب إلى لوحة تحكم مشروعك على Vercel
2. انتقل إلى **Settings** → **Environment Variables**
3. اضغط على **Add New**
4. أضف المتغيرات التالية مع البادئة `MUSHARAKA_`:

```env
MUSHARAKA_SUPABASE_URL=https://your-project.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=مفتاح_الخدمة_الخاص_بك
MUSHARAKA_BLOB_READ_WRITE_TOKEN=رمز_التخزين_الخاص_بك
```

5. اختر البيئات المناسبة (Production, Preview, Development)
6. اضغط **Save**

#### الخيار ب: التطوير المحلي (ملف .env)

أنشئ ملف `.env` في المجلد الرئيسي للمشروع:

```env
# تكوين Supabase مع بادئة مخصصة
MUSHARAKA_SUPABASE_URL=https://your-project.supabase.co
MUSHARAKA_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MUSHARAKA_BLOB_READ_WRITE_TOKEN=رمز_التخزين_الخاص_بك
```

**مهم:** أضف `.env` إلى ملف `.gitignore` لمنع رفع البيانات الحساسة.

### الخطوة 4: تحديث كود التطبيق

تم تحديث ملف [`api/database.js`](api/database.js) تلقائياً لدعم البادئة المخصصة مع الحفاظ على التوافق مع الإصدارات السابقة.

## أمثلة الاستخدام

### مثال 1: رفع مستندات معرفة العميل (KYC)

```javascript
const { uploadFile } = require('./api/blob-storage');

// رفع وثيقة هوية المستخدم
async function رفع_وثيقة_المعرفة(معرف_المستخدم, ملف, اسم_الملف) {
  const المسار = `kyc/${معرف_المستخدم}/${اسم_الملف}`;
  const النتيجة = await uploadFile(ملف, المسار);
  
  if (النتيجة.success) {
    console.log('تم رفع المستند:', النتيجة.publicUrl);
    return النتيجة.publicUrl;
  }
}
```

### مثال 2: رفع فيديو التحقق من الوجه

```javascript
const { uploadFile } = require('./api/blob-storage');

// رفع فيديو التحقق من الوجه
async function رفع_فيديو_التحقق(معرف_الطلب, فيديو) {
  const اسم_الملف = `face-verification/${معرف_الطلب}-${Date.now()}.webm`;
  const النتيجة = await uploadFile(فيديو, اسم_الملف);
  
  return النتيجة;
}
```

## أفضل ممارسات الأمان

### 1. سياسات الحاوية

قم بتكوين سياسات مناسبة للحاوية في Supabase:

```sql
-- السماح للمستخدمين المصادق عليهم برفع الملفات إلى مجلدهم الخاص
CREATE POLICY "المستخدمون يمكنهم رفع مستنداتهم"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'musharaka-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2. أمان متغيرات البيئة

- لا ترفع ملفات `.env` أبداً إلى نظام التحكم بالإصدارات
- استخدم بيانات اعتماد مختلفة للتطوير والاختبار والإنتاج
- قم بتحديث الرموز بشكل دوري
- استخدم متغيرات البيئة المشفرة في Vercel للإنتاج

### 3. التحقق من الملفات

تحقق دائماً من الملفات قبل الرفع:

```javascript
function التحقق_من_الملف(ملف, خيارات = {}) {
  const {
    الحجم_الأقصى = 10 * 1024 * 1024, // 10 ميجابايت افتراضياً
    الأنواع_المسموحة = ['image/jpeg', 'image/png', 'application/pdf']
  } = خيارات;
  
  if (ملف.size > الحجم_الأقصى) {
    throw new Error(`حجم الملف يتجاوز الحد الأقصى (${الحجم_الأقصى / 1024 / 1024} ميجابايت)`);
  }
  
  if (!الأنواع_المسموحة.includes(ملف.type)) {
    throw new Error(`نوع الملف ${ملف.type} غير مسموح`);
  }
  
  return true;
}
```

## استكشاف الأخطاء

### المشكلة: متغيرات البيئة لا تُحمّل

**الحل:**
1. تأكد من وجود ملف `.env` في المجلد الرئيسي
2. تحقق من تثبيت `dotenv`: `npm install dotenv`
3. تأكد من استدعاء `require('dotenv').config()` قبل الوصول للمتغيرات
4. أعد تشغيل خادم التطوير بعد إضافة المتغيرات

### المشكلة: أخطاء CORS

**الحل:**
قم بتكوين CORS في لوحة تحكم Supabase:
1. اذهب إلى **Storage** → **Configuration**
2. أضف نطاقك إلى الأصول المسموحة
3. حدد الطرق المناسبة (GET, POST, PUT, DELETE)

### المشكلة: رفض الإذن

**الحل:**
1. تحقق من تكوين سياسات الحاوية بشكل صحيح
2. تأكد من أن Service Role Key لديه الأذونات المناسبة
3. تأكد من وجود الحاوية وإمكانية الوصول إليها

## الاختبار

لاختبار اتصال التخزين السحابي:

```bash
node scripts/test-blob-storage.js
```

## موارد إضافية

- [توثيق Supabase Storage](https://supabase.com/docs/guides/storage)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [أفضل ممارسات متغيرات البيئة](https://12factor.net/config)

## الدعم

للحصول على المساعدة:
1. راجع قسم استكشاف الأخطاء أعلاه
2. اقرأ توثيق Supabase
3. تواصل مع قائد فريق التطوير

---

**آخر تحديث:** 2026-04-16  
**المشروع:** شركة مشاركة المالية  
**الإصدار:** 1.0
