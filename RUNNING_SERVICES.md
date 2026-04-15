# 🚀 Musharaka Project - Running Services

## ✅ All Services Are Now Running!

### 1. **Backend Server** (Node.js + Express)
- **Status:** ✅ Running
- **Port:** 3001
- **URL:** http://localhost:3001
- **Admin Panel:** http://localhost:3001/admin
- **Purpose:** Main backend API, serves static files, handles authentication

### 2. **API Service** (Node.js + Express)
- **Status:** ✅ Running
- **Port:** 3002
- **URL:** http://localhost:3002
- **Purpose:** Additional API endpoints (designed for Vercel serverless)

### 3. **Face Verification & KYC Server** (Python + Flask)
- **Status:** ✅ Running
- **Port:** 5001
- **URL:** http://localhost:5001
- **Purpose:** Handles face verification, KYC processing, and form submissions

---

## 📋 How to Access

### Main Website
Open your browser and navigate to:
- **Arabic Version:** http://localhost:3001/ar/
- **English Version:** http://localhost:3001/en/
- **Admin Panel:** http://localhost:3001/admin

### API Endpoints
- **Backend API:** http://localhost:3001/api/*
- **API Service:** http://localhost:3002/api/*
- **KYC/Face Verification:** http://localhost:5001/*

---

## ⚙️ Configuration Files Created

The following `.env` files have been created with placeholder values:

1. **backend/.env** - Backend configuration
2. **api/.env** - API service configuration  
3. **open-account/.env** - Flask server configuration

**⚠️ IMPORTANT:** You need to update these with your actual credentials:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `TELEGRAM_TOKEN` - Already configured (8660100340:AAEPj1rlH5PfPZ8StoztNi2m7ZmOOgzLrr4)
- `TELEGRAM_CHAT_ID` - Already configured (-1003890710277)

---

## 🛑 How to Stop Services

To stop any service, press `Ctrl+C` in its terminal window.

---

## 📝 Notes

1. **Database:** The services are configured to use Supabase. Without valid credentials, database operations will fail but the servers will still run.

2. **Static Files:** The backend server serves static HTML files from the project directories.

3. **Phone Numbers:** All phone numbers have been updated to **966595477843** ✅

4. **Port Changes:** 
   - Flask server changed from port 5000 to 5001 due to port conflict
   - API service runs on port 3002 (separate from backend on 3001)

---

## 🔧 Development Tips

- Use the backend server (port 3001) as your main development server
- The API service (port 3002) is optional for local development
- Flask server (port 5001) is only needed if you're testing face verification/KYC features
- For production deployment, use Vercel as configured in `vercel.json`
