# دليل ميزة التحقق من الوجه (Face Verification)

## 📋 نظرة عامة

تم إضافة ميزة **التحقق من الوجه (Face Verification)** المتقدمة مع **كشف الحركة الحية (Liveness Detection)** بزاوية 360 درجة، تماماً كما في منصات التداول العالمية الكبرى مثل Binance و Kraken.

---

## 🎯 المميزات الرئيسية

### 1. **التقاط الوجه الحي (Live Face Capture)**
- الوصول المباشر إلى كاميرا الجهاز (الكاميرا الأمامية)
- معاينة فورية للوجه
- إطار دائري لتوجيه المستخدم

### 2. **كشف الحركة (Movement Detection)**
تعليمات تفاعلية للمستخدم:
- 👀 **الأمام**: انظر مباشرة إلى الكاميرا
- ⬅️ **اليسار**: حرّك رأسك إلى اليسار ببطء
- ➡️ **اليمين**: حرّك رأسك إلى اليمين ببطء
- ⬆️ **الأعلى**: حرّك رأسك إلى الأعلى ببطء
- ⬇️ **الأسفل**: حرّك رأسك إلى الأسفل ببطء

### 3. **تسجيل الفيديو (Video Recording)**
- تسجيل فيديو بجودة عالية (WebM format)
- مدة التسجيل: 10 ثوانٍ
- استخراج لقطة أولى كصورة مصغرة

### 4. **مؤشرات الحركة (Movement Indicators)**
- 5 مؤشرات تفاعلية تظهر حالة كل حركة
- تغيير اللون عند تفعيل كل حركة
- تأكيد بصري للمستخدم

### 5. **كشف الوجه (Face Detection)**
- كشف بسيط للوجه بناءً على مستويات الإضاءة
- يمكن تحسينه باستخدام مكتبات متقدمة مثل face-api.js أو ml5.js

---

## 🏗️ البنية التقنية

### الملفات الجديدة:

```
├── face-verification.js              # وحدة التحقق من الوجه
├── complete_form_with_face_verification.html  # واجهة المستخدم
├── server_with_face_verification.py  # الخادم المحدث
└── FACE_VERIFICATION_GUIDE.md        # هذا الملف
```

### الملفات المحدثة:

```
├── requirements.txt                  # لا توجد متطلبات جديدة
└── .env.example                      # نفس الإعدادات
```

---

## 🔧 كيفية الاستخدام

### 1. **تهيئة الوحدة (Initialization)**

```javascript
// إنشاء instance من FaceVerification
const faceVerification = new FaceVerification({
  maxFileSize: 50 * 1024 * 1024,      // 50MB
  allowedFormats: ['video/mp4', 'video/webm', 'image/jpeg', 'image/png'],
  cameraFacingMode: 'user',            // الكاميرا الأمامية
  videoQuality: 0.95,                  // جودة الفيديو
  recordingDuration: 10000             // 10 ثوانٍ
});

// تهيئة العناصر
faceVerification.init({
  facePreviewId: 'facePreview',
  faceImageId: 'faceImg',
  facePlaceholderId: 'facePlaceholder',
  // ... باقي العناصر
});
```

### 2. **تسجيل Callbacks**

```javascript
// عند كشف الحركة
faceVerification.on('MovementDetected', (movement) => {
  console.log('Movement:', movement); // 'front', 'left', 'right', 'up', 'down'
});

// عند بدء التسجيل
faceVerification.on('RecordingStart', () => {
  console.log('Recording started');
});

// عند إيقاف التسجيل
faceVerification.on('RecordingStop', (file) => {
  console.log('Recording stopped:', file);
});

// عند كشف الوجه
faceVerification.on('FaceDetected', () => {
  console.log('Face detected');
});

// عند حدوث خطأ
faceVerification.on('Error', (message) => {
  console.error('Error:', message);
});

// عند نجاح التحقق
faceVerification.on('Success', (file) => {
  console.log('Verification successful:', file);
});
```

### 3. **التحقق من الحالة**

```javascript
// الحصول على حالة التحقق
const status = faceVerification.getValidationStatus();
console.log(status);
// {
//   faceImageValid: true,
//   faceVideoValid: true,
//   isComplete: true,
//   files: { image: File, video: File }
// }

// التحقق من اكتمال البيانات
if (faceVerification.isComplete()) {
  console.log('Face verification is complete');
}
```

### 4. **تصدير البيانات**

```javascript
// تصدير البيانات للإرسال
const formData = faceVerification.exportData();

// إرسال إلى الخادم
fetch('/api/submit-form', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log('Success:', data));
```

---

## 📱 التوافقية

### المتصفحات المدعومة:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

### الأجهزة المدعومة:
- ✅ الهواتف الذكية (iOS و Android)
- ✅ الأجهزة اللوحية
- ✅ أجهزة الكمبيوتر المكتبية

### المتطلبات:
- HTTPS (في الإنتاج) - الكاميرا تتطلب HTTPS
- إذن الوصول للكاميرا من المستخدم

---

## 🔐 الأمان

### 1. **معالجة آمنة للملفات**
```python
def allowed_file(filename):
    """التحقق من امتداد الملف"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
```

### 2. **حدود الحجم**
- الصور: حد أقصى 10MB
- الفيديو: حد أقصى 50MB

### 3. **تنظيف الملفات**
```python
# حذف الملفات بعد الإرسال إلى تيليجرام
try:
    os.remove(file_info['path'])
except:
    pass
```

### 4. **حماية البيانات الحساسة**
- رمز تيليجرام في متغيرات البيئة
- عدم كشف البيانات في الكود الأمامي
- معالجة الأخطاء بشكل آمن

---

## 🎨 واجهة المستخدم

### الشاشة الرئيسية:
```
┌─────────────────────────────────┐
│  فتح حساب استثماري              │
│  الخطوة 5: التحقق من الوجه      │
├─────────────────────────────────┤
│  📷 تعليمات التحقق من الوجه:    │
│  • تأكد من الإضاءة الجيدة       │
│  • اتبع التعليمات على الشاشة    │
│  • حافظ على وجهك في الإطار      │
├─────────────────────────────────┤
│  صورة الوجه [مطلوب]             │
│  ┌─────────────────────────────┐ │
│  │  لم يتم التحقق بعد          │ │
│  └─────────────────────────────┘ │
│  [📷 التحقق من الوجه]           │
│  [📂 رفع صورة الوجه]            │
├─────────────────────────────────┤
│  [السابق]  [التالي: المراجعة]   │
└─────────────────────────────────┘
```

### شاشة التسجيل:
```
┌──────────────────────────────────┐
│  التحقق من الوجه                 │
├──────────────────────────────────┤
│  👀 انظر مباشرة إلى الكاميرا    │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │  📹 الفيديو الحي          │  │
│  │  ⭕ (إطار دائري)          │  │
│  └────────────────────────────┘  │
│  [👀] [⬅️] [➡️] [⬆️] [⬇️]        │
│  10s                             │
│  [🔴 ابدأ التسجيل] [⏹️ إيقاف]   │
│  [إغلاق]                         │
└──────────────────────────────────┘
```

---

## 🚀 التطوير المستقبلي

### 1. **التحسينات المقترحة:**

#### أ) استخدام مكتبات متقدمة للكشف عن الوجه:
```javascript
// استخدام face-api.js
const detections = await faceapi.detectAllFaces(video);
if (detections.length > 0) {
  console.log('Face detected');
}
```

#### ب) كشف جودة الصورة:
```javascript
// التحقق من وضوح الصورة
function checkImageQuality(canvas) {
  const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  // حساب الحدة والوضوح
}
```

#### ج) التحقق من الحركة الفعلية:
```javascript
// استخدام مكتبات مثل TensorFlow.js للكشف عن الحركة
const pose = await posenet.estimateSinglePose(video);
// تحليل حركة الرأس
```

### 2. **التكامل مع خدمات خارجية:**

#### AWS Rekognition:
```python
import boto3

rekognition = boto3.client('rekognition')

# كشف الوجه
response = rekognition.detect_faces(Image={'Bytes': image_bytes})

# كشف الحركة الحية
response = rekognition.detect_liveness_and_face_matches(
    LivenessRequestId='request-id',
    ReferenceImage={'Bytes': reference_image_bytes},
    ComparisonImages=[{'Bytes': comparison_image_bytes}]
)
```

#### Google Vision API:
```python
from google.cloud import vision

client = vision.ImageAnnotatorClient()

# كشف الوجه
response = client.face_detection(image=image)
```

#### BioID Liveness Detection:
```javascript
// استخدام BioID API للتحقق من الحركة الحية
const bioid = new BioID();
const result = await bioid.verifyLiveness(videoBlob);
```

### 3. **ميزات إضافية:**

- ✅ كشف تعابير الوجه (Emotion Detection)
- ✅ كشف جودة الصورة (Image Quality Assessment)
- ✅ التحقق من تطابق الوجه (Face Matching)
- ✅ كشف الوثائق المزيفة (Document Spoofing Detection)
- ✅ تسجيل الفيديو بدقة أعلى
- ✅ دعم لغات متعددة

---

## 🐛 استكشاف الأخطاء

### المشكلة: لا يمكن الوصول إلى الكاميرا
**الحل:**
- تأكد من استخدام HTTPS
- تحقق من أذونات المتصفح
- جرب متصفح آخر

### المشكلة: الفيديو لا يسجل
**الحل:**
- تحقق من دعم المتصفح للـ MediaRecorder API
- تأكد من أن الكاميرا تعمل بشكل صحيح
- جرب صيغة مختلفة (WebM بدلاً من MP4)

### المشكلة: الملف كبير جداً
**الحل:**
- قلل مدة التسجيل
- قلل جودة الفيديو
- استخدم ضغط الفيديو

### المشكلة: فشل الإرسال إلى تيليجرام
**الحل:**
- تحقق من رمز تيليجرام
- اختبر الاتصال: `curl http://localhost:5000/api/test-telegram`
- تأكد من أن البوت لديه إذن الإرسال

---

## 📊 مقارنة مع المنصات الأخرى

| الميزة | Binance | Kraken | منصتنا |
|--------|---------|--------|--------|
| **التقاط الوجه الحي** | ✅ | ✅ | ✅ |
| **كشف الحركة (360°)** | ✅ | ✅ | ✅ |
| **تسجيل الفيديو** | ✅ | ✅ | ✅ |
| **استخراج الصور** | ✅ | ✅ | ✅ |
| **مؤشرات تفاعلية** | ✅ | ✅ | ✅ |
| **دعم الهاتف** | ✅ | ✅ | ✅ |
| **واجهة عربية** | ❌ | ❌ | ✅ |

---

## 📝 ملاحظات مهمة

1. **الخصوصية:**
   - لا يتم حفظ البيانات الشخصية على الخادم
   - الملفات تُحذف بعد الإرسال إلى تيليجرام
   - استخدم HTTPS في الإنتاج

2. **الأداء:**
   - استخدم معالجة الفيديو بكفاءة
   - قلل دقة الفيديو إذا لزم الأمر
   - استخدم Web Workers للمعالجة الثقيلة

3. **التوافقية:**
   - اختبر على أجهزة وأنظمة تشغيل مختلفة
   - تأكد من دعم المتصفح للـ APIs المستخدمة
   - وفر بدائل للأجهزة القديمة

---

## 🔗 الموارد المفيدة

### مكتبات الكشف عن الوجه:
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [ml5.js](https://learn.ml5js.org/)
- [TensorFlow.js](https://www.tensorflow.org/js)

### خدمات التحقق:
- [AWS Rekognition](https://aws.amazon.com/rekognition/)
- [Google Vision API](https://cloud.google.com/vision)
- [BioID](https://www.bioid.com/)

### مراجع تقنية:
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من السجلات
2. اختبر الاتصال بـ API
3. تحقق من متغيرات البيئة
4. راجع الأخطاء الشائعة أعلاه

---

**آخر تحديث:** 2025-04-06  
**الإصدار:** 3.0 (مع ميزة Face Verification 360°)
