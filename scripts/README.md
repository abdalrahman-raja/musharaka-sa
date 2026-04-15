# 📋 Scripts Documentation

This directory contains utility scripts for managing the Musharaka project.

## 🔧 Available Scripts

### 1. Create First Admin User

**File:** `create-first-admin.js`

This script creates the first administrator account in the database with default credentials.

#### When to Use:
- After initial deployment
- When setting up a new environment
- If you need to reset admin access

#### Prerequisites:
1. Ensure Supabase is configured in `.env` files
2. Backend dependencies are installed (`npm install`)

#### How to Run:

```bash
cd c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa
node scripts/create-first-admin.js
```

#### Default Credentials Created:
- **Username:** `admin`
- **Password:** `Admin@123456`
- **Name:** مدير النظام
- **Role:** super_admin

⚠️ **IMPORTANT:** Change the password immediately after first login!

#### What It Does:
1. Checks if an admin user already exists
2. Hashes the password using bcrypt (10 rounds)
3. Inserts the admin record into the database
4. Displays the credentials and next steps

#### Output Example:
```
✅ SUCCESS! Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Login Credentials:
   Username: admin
   Password: Admin@123456
   Name: مدير النظام
   Role: super_admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANT: Please change the password after first login!

🌐 Admin Panel URL: http://localhost:3001/admin/
```

---

## 🔐 Security Notes

1. **Never commit actual credentials to version control**
2. **Change default passwords immediately**
3. **Use strong passwords in production**
4. **Store .env files securely**
5. **Rotate credentials regularly**

---

## 🛠️ Troubleshooting

### Error: "Missing Supabase credentials"
**Solution:** Make sure your `.env` file has:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Error: "relation 'admins' does not exist"
**Solution:** Run the database migration first to create the required tables.

### Error: "Admin user already exists"
**Solution:** The admin was already created. Use those credentials or reset the password from the admin panel.

---

## 📝 Creating Custom Admin Users

You can modify the script to create users with different credentials:

```javascript
const ADMIN_USERNAME = 'your_username';
const ADMIN_PASSWORD = 'your_secure_password';
const ADMIN_NAME = 'Your Name';
const ADMIN_ROLE = 'super_admin'; // or 'admin'
```

Then run the script again.

---

## 🔗 Related Files

- Backend Server: `backend/server.js`
- API Service: `api/index.js`
- Admin Panel: `admin/index.html`
- Environment Config: `backend/.env`, `api/.env`
