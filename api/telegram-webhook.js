const db = require('./database');
const axios = require('axios');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const reshaper = require('arabic-reshaper');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8660100340:AAEPj1rlH5PfPZ8StoztNi2m7ZmOOgzLrr4';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const TAJAWAL_REGULAR_URL = 'https://github.com/googlefonts/tajawal/raw/main/fonts/ttf/Tajawal-Regular.ttf';
const TAJAWAL_BOLD_URL = 'https://github.com/googlefonts/tajawal/raw/main/fonts/ttf/Tajawal-Bold.ttf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const update = req.body;

  try {
    // Handle Callback Query
    if (update.callback_query) {
      const { id, data, message } = update.callback_query;
      const chatId = message.chat.id;

      if (data.startsWith('gen_pdf_')) {
        const recordId = data.replace('gen_pdf_', '');

        // 1. Answer Callback Query (to stop loading spinner)
        await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
          callback_query_id: id,
          text: 'جاري إنشاء العقد... يرجى الانتظار ⏳',
          show_alert: false
        });

        if (recordId === 'unknown') {
          return await sendTelegramMessage(chatId, '❌ عذراً، لم يتم العثور على سجل لهذا الطلب في قاعدة البيانات.');
        }

        // 2. Fetch Data from Supabase
        const { data: request, error: dbError } = await db
          .from('account_requests')
          .select('*')
          .eq('id', recordId)
          .single();

        if (dbError || !request) {
          console.error('Supabase Fetch Error:', dbError);
          return await sendTelegramMessage(chatId, '❌ فشل جلب البيانات من قاعدة البيانات.');
        }

        // 3. Generate PDF
        const pdfBytes = await generateContractPDF(request);

        // 4. Save PDF to /tmp
        const pdfPath = path.join('/tmp', `contract_${request.ref_no}.pdf`);
        fs.writeFileSync(pdfPath, pdfBytes);

        // 5. Send PDF to Telegram
        await sendTelegramDocument(chatId, pdfPath, `عقد فتح حساب - ${request.full_name || request.entity_name}\nرقم المرجع: ${request.ref_no}`);
        
        // Clean up
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(200).json({ success: false, error: error.message }); // Return 200 to Telegram even on error to avoid retries
  }
}

async function getFontBytes(url, name) {
  const tmpPath = path.join('/tmp', name);
  if (fs.existsSync(tmpPath)) {
    return fs.readFileSync(tmpPath);
  }
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const bytes = Buffer.from(response.data);
  fs.writeFileSync(tmpPath, bytes);
  return bytes;
}

async function generateContractPDF(data) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Fetch fonts with local caching in /tmp
  const [regularFontBytes, boldFontBytes] = await Promise.all([
    getFontBytes(TAJAWAL_REGULAR_URL, 'Tajawal-Regular.ttf'),
    getFontBytes(TAJAWAL_BOLD_URL, 'Tajawal-Bold.ttf')
  ]);

  const regularFont = await pdfDoc.embedFont(regularFontBytes);
  const boldFont = await pdfDoc.embedFont(boldFontBytes);

  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // Helper for Arabic text (reshaping + reversing)
  const arabicText = (text) => {
    if (!text) return 'N/A';
    const reshaped = reshaper.convert(text);
    return reshaped.split('').reverse().join('');
  };

  // Header - Arabic Branding
  const branding = arabicText('مشاركة المالية');
  page.drawText(branding, {
    x: width - 50 - regularFont.widthOfTextAtSize(branding, 24),
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.5)
  });

  const title = arabicText('عقد فتح حساب استثماري');
  page.drawText(title, {
    x: width - 50 - regularFont.widthOfTextAtSize(title, 18),
    y: height - 85,
    size: 18,
    font: boldFont
  });

  page.drawLine({
    start: { x: 50, y: height - 100 },
    end: { x: width - 50, y: height - 100 },
    thickness: 2,
    color: rgb(0.1, 0.2, 0.5)
  });

  let y = height - 140;
  const lineGap = 30;

  const drawField = (label, value) => {
    const reshapedLabel = arabicText(label);
    const reshapedValue = arabicText(String(value || 'غير متوفر'));
    
    // Label on the right
    page.drawText(reshapedLabel, { 
      x: width - 180 - regularFont.widthOfTextAtSize(reshapedLabel, 12), 
      y, 
      size: 12, 
      font: boldFont 
    });

    // Value on the left of label
    page.drawText(reshapedValue, { 
      x: 50, 
      y, 
      size: 12, 
      font: regularFont 
    });
    
    y -= lineGap;
  };

  drawField('رقم المرجع', data.ref_no);
  drawField('نوع الحساب', data.type === 'entity' ? 'مؤسسة / شركة' : 'فرد');
  
  if (data.type === 'individual') {
    drawField('الاسم الكامل', data.full_name);
    drawField('رقم الهوية / الإقامة', data.national_id);
  } else {
    drawField('اسم المنشأة', data.entity_name);
    drawField('رقم السجل التجاري', data.cr_number);
  }

  drawField('الجنسية', data.nationality);
  drawField('رقم الجوال', data.phone);
  drawField('البريد الإلكتروني', data.email);
  drawField('تاريخ التقديم', new Date(data.submitted_at).toLocaleDateString('ar-SA'));
  drawField('عنوان IP', data.ip_address);
  drawField('الحالة الحالية', data.status === 'pending' ? 'قيد المراجعة' : data.status);

  y -= 30;
  const declarationTitle = arabicText('إقرار وموافقة:');
  page.drawText(declarationTitle, { 
    x: width - 50 - regularFont.widthOfTextAtSize(declarationTitle, 14), 
    y, 
    size: 14, 
    font: boldFont 
  });
  
  y -= 25;
  const declarationText = arabicText('يقر العميل بصحة كافة البيانات والمعلومات المقدمة، وتعتبر هذه الوثيقة سجلاً رقمياً لطلب فتح الحساب.');
  page.drawText(declarationText, { 
    x: 50, 
    y, 
    size: 11, 
    font: regularFont, 
    maxWidth: width - 100 
  });

  y -= 80;
  const signatureTitle = arabicText('التوقيع الرقمي:');
  page.drawText(signatureTitle, { 
    x: width - 50 - regularFont.widthOfTextAtSize(signatureTitle, 12), 
    y, 
    size: 12, 
    font: boldFont 
  });
  
  const clientName = arabicText(`${data.full_name || data.entity_name}`);
  page.drawText(clientName, { 
    x: width - 50 - regularFont.widthOfTextAtSize(clientName, 14), 
    y - 25, 
    size: 14, 
    font: boldFont, 
    color: rgb(0.1, 0.1, 0.1) 
  });
  
  const dateStr = arabicText('التاريخ: ' + new Date().toLocaleDateString('ar-SA'));
  page.drawText(dateStr, { 
    x: 50, 
    y: y - 25, 
    size: 10, 
    font: regularFont 
  });

  return await pdfDoc.save();
}

async function sendTelegramMessage(chatId, text) {
  return await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  });
}

async function sendTelegramDocument(chatId, filePath, caption) {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('caption', caption);
  formData.append('document', fs.createReadStream(filePath));

  return await axios.post(`${TELEGRAM_API}/sendDocument`, formData, {
    headers: formData.getHeaders()
  });
}
