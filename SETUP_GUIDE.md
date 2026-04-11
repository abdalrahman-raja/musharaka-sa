# دليل التثبيت والنشر

## 📋 المتطلبات

- Python 3.7+
- Node.js (اختياري للأدوات الإضافية)
- متصفح حديث (Chrome, Firefox, Safari, Edge)
- اتصال إنترنت

---

## 🔧 خطوات التثبيت المحلي

### 1. استنساخ المشروع أو تحضير الملفات

```bash
# إنشاء مجلد للمشروع
mkdir investment-account-form
cd investment-account-form

# نسخ الملفات:
# - improved_form.html
# - server.py
# - requirements.txt
# - .env.example
# - assets/ (مجلد الصور)
```

### 2. تثبيت المتطلبات

```bash
# تثبيت Python dependencies
pip install -r requirements.txt

# أو استخدام virtual environment (موصى به)
python -m venv venv
source venv/bin/activate  # على Linux/Mac
# أو
venv\Scripts\activate  # على Windows

pip install -r requirements.txt
```

### 3. إعداد متغيرات البيئة

```bash
# نسخ ملف المثال
cp .env.example .env

# تحرير الملف وإدخال بيانات تيليجرام
nano .env
```

**محتوى `.env`:**
```
TELEGRAM_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### 4. التحقق من الصور

```bash
# التأكد من وجود مجلد الصور
ls -la assets/

# يجب أن تكون الملفات:
# - assets/id_card.jpg
# - assets/passport.png
# - assets/residence.jpg
```

### 5. تشغيل الخادم

```bash
# تشغيل Flask server
python server.py

# سيظهر:
# * Running on http://0.0.0.0:5000
# * Debug mode: on
```

### 6. فتح الموقع

```bash
# في المتصفح
http://localhost:5000/improved_form.html

# أو إذا كنت تستخدم خادم ويب آخر
http://your-domain.com/improved_form.html
```

---

## 🧪 الاختبار

### اختبار الخادم

```bash
# اختبار صحة الخادم
curl http://localhost:5000/api/health

# يجب أن ترى:
# {"status":"ok","message":"Server is running"}
```

### اختبار اتصال تيليجرام

```bash
# اختبار الاتصال بتيليجرام
curl http://localhost:5000/api/test-telegram

# يجب أن ترى معلومات البوت
```

### اختبار الإرسال

```bash
# إرسال بيانات اختبار
curl -X POST http://localhost:5000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "أحمد محمد",
    "age": "30",
    "nationality": "سعودي",
    "phone": "+966501234567",
    "email": "test@example.com",
    "capital": "50000",
    "offerType": "brokerage",
    "idType": "national_id"
  }'
```

---

## 🌐 النشر على الإنتاج

### الخيار 1: استخدام Heroku

#### 1. إنشاء حساب على Heroku
- اذهب إلى https://www.heroku.com
- أنشئ حساب جديد

#### 2. تثبيت Heroku CLI
```bash
# على Mac
brew install heroku/brew/heroku

# على Linux
curl https://cli-assets.heroku.com/install.sh | sh

# على Windows
# حمل من https://devcenter.heroku.com/articles/heroku-cli
```

#### 3. إنشاء Procfile
```bash
# في مجلد المشروع
echo "web: python server.py" > Procfile
```

#### 4. إنشاء runtime.txt
```bash
echo "python-3.11.0" > runtime.txt
```

#### 5. نشر على Heroku
```bash
# تسجيل الدخول
heroku login

# إنشاء تطبيق
heroku create your-app-name

# تعيين متغيرات البيئة
heroku config:set TELEGRAM_TOKEN=your_token
heroku config:set TELEGRAM_CHAT_ID=your_chat_id

# نشر الكود
git push heroku main

# فتح التطبيق
heroku open
```

### الخيار 2: استخدام AWS

#### 1. إنشاء EC2 Instance
- اذهب إلى AWS Console
- أنشئ instance جديد (Ubuntu 22.04)

#### 2. الاتصال بالـ Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### 3. تثبيت البرامج
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Python
sudo apt install python3-pip python3-venv -y

# تثبيت Nginx
sudo apt install nginx -y
```

#### 4. نسخ المشروع
```bash
# نسخ الملفات إلى الخادم
scp -i your-key.pem -r . ubuntu@your-instance-ip:/home/ubuntu/app
```

#### 5. إعداد التطبيق
```bash
cd /home/ubuntu/app

# إنشاء virtual environment
python3 -m venv venv
source venv/bin/activate

# تثبيت المتطلبات
pip install -r requirements.txt

# إنشاء ملف .env
cp .env.example .env
nano .env  # أدخل بيانات تيليجرام
```

#### 6. إعداد Nginx
```bash
# إنشاء ملف إعدادات Nginx
sudo nano /etc/nginx/sites-available/default
```

**محتوى الملف:**
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 7. تشغيل التطبيق
```bash
# تشغيل Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# تشغيل Flask (استخدم Gunicorn للإنتاج)
sudo pip install gunicorn

# تشغيل Gunicorn
gunicorn -w 4 -b 127.0.0.1:5000 server:app
```

### الخيار 3: استخدام Docker

#### 1. إنشاء Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=server.py

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "server:app"]
```

#### 2. إنشاء docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
      - FLASK_ENV=production
    volumes:
      - ./uploads:/app/uploads
```

#### 3. البناء والتشغيل
```bash
# بناء الصورة
docker build -t investment-form .

# تشغيل الحاوية
docker run -p 5000:5000 \
  -e TELEGRAM_TOKEN=your_token \
  -e TELEGRAM_CHAT_ID=your_chat_id \
  investment-form
```

---

## 🔒 الأمان في الإنتاج

### 1. استخدام HTTPS
```bash
# استخدام Let's Encrypt مع Certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d your-domain.com
```

### 2. تحديث Nginx
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... باقي الإعدادات
}
```

### 3. حماية متغيرات البيئة
```bash
# تأكد من أن .env لا يُرفع إلى Git
echo ".env" >> .gitignore
```

### 4. تحديد حد أقصى لحجم الملفات
```python
# في server.py
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB
```

### 5. تفعيل CORS بحذر
```python
# في server.py
CORS(app, origins=["https://your-domain.com"])
```

---

## 📊 المراقبة والصيانة

### عرض السجلات
```bash
# سجلات Flask
tail -f app.log

# سجلات Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### النسخ الاحتياطي
```bash
# نسخ احتياطي للملفات المرفوعة
tar -czf uploads_backup.tar.gz uploads/

# نسخ احتياطي لقاعدة البيانات (إن وجدت)
mysqldump -u user -p database > backup.sql
```

### التحديثات
```bash
# تحديث المتطلبات
pip install --upgrade -r requirements.txt

# تحديث النظام
sudo apt update && sudo apt upgrade -y
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: خطأ CORS
**الحل:**
```python
# تأكد من أن CORS مفعل
from flask_cors import CORS
CORS(app)
```

### المشكلة: لا يمكن الوصول إلى الكاميرا
**الحل:**
- استخدم HTTPS (الكاميرا تتطلب HTTPS)
- تحقق من أذونات المتصفح

### المشكلة: فشل إرسال البيانات إلى تيليجرام
**الحل:**
```bash
# اختبر الاتصال
curl http://localhost:5000/api/test-telegram

# تحقق من Token و Chat ID
# تأكد من أن البوت لديه إذن الإرسال
```

### المشكلة: حجم الملف كبير جداً
**الحل:**
```python
# زيادة الحد الأقصى
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB
```

---

## 📝 ملاحظات مهمة

1. **الأمان أولاً:**
   - استخدم HTTPS في الإنتاج
   - لا تضع بيانات حساسة في الكود
   - استخدم متغيرات البيئة

2. **الأداء:**
   - استخدم Gunicorn أو uWSGI في الإنتاج
   - استخدم Nginx كـ reverse proxy
   - فعّل caching حيث أمكن

3. **المراقبة:**
   - راقب السجلات بانتظام
   - استخدم أدوات مراقبة مثل Sentry
   - قم بنسخ احتياطي منتظمة

4. **الصيانة:**
   - حدّث المتطلبات بانتظام
   - نظّف الملفات المؤقتة
   - راقب استخدام الموارد

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من السجلات
2. اختبر الاتصال بـ API
3. تحقق من متغيرات البيئة
4. راجع الأخطاء الشائعة أعلاه

---

**آخر تحديث:** 2025-04-06
