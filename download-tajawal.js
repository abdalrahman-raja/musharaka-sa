const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = String.raw`C:\Users\ALBASHA CENTER\Desktop\شركة مشاركة\musharaka.sa\wp-content\themes\musharka-theme\assets\fonts\arabic-fonts`;

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    const reqOpts = {
      hostname: opts.hostname,
      path: opts.pathname + opts.search,
      headers: headers || {}
    };
    https.get(reqOpts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const browserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  console.log('Fetching Google Fonts CSS...');
  const cssBuffer = await httpsGet(
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap',
    { 'User-Agent': browserAgent }
  );
  const cssContent = cssBuffer.toString('utf-8');
  console.log('CSS length:', cssContent.length);
  console.log('--- CSS Content ---');
  console.log(cssContent);
  console.log('--- End CSS ---');

  // Extract all font-face blocks to map weight -> url
  const fontFaceBlocks = [...cssContent.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(m => m[1]);
  console.log(`\nFound ${fontFaceBlocks.length} @font-face blocks`);

  // Map weight number to file name
  const weightMap = {
    '300': 'tajawal-light.woff2',
    '400': 'tajawal-regular.woff2',
    '500': 'tajawal-medium.woff2',
    '700': 'tajawal-bold.woff2',
    '800': 'tajawal-extrabold.woff2'
  };

  const results = [];

  // Only process Arabic subset blocks (comment before block will be "/* arabic */")
  // We detect Arabic blocks by checking if the unicode-range contains Arabic codepoints
  const seenWeights = new Set();
  for (const block of fontFaceBlocks) {
    const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    // Only pick the Arabic subset: unicode-range contains U+0600 (Arabic block start)
    const isArabic = block.includes('U+0600');
    if (urlMatch && weightMatch && isArabic) {
      const weight = weightMatch[1];
      const url = urlMatch[1];
      const fileName = weightMap[weight];
      if (fileName && !seenWeights.has(weight)) {
        seenWeights.add(weight);
        console.log(`\nWeight ${weight} (Arabic) -> ${fileName}`);
        console.log('URL:', url);
        const filePath = path.join(fontsDir, fileName);
        console.log('Downloading...');
        const data = await httpsGet(url, { 'User-Agent': browserAgent });
        fs.writeFileSync(filePath, data);
        const size = fs.statSync(filePath).size;
        console.log(`Saved: ${filePath} (${size} bytes)`);
        results.push({ weight, fileName, filePath, size, url });
      }
    }
  }

  console.log('\n=== DOWNLOAD SUMMARY ===');
  for (const r of results) {
    console.log(`[weight ${r.weight}] ${r.fileName} -> ${r.filePath} (${r.size} bytes)`);
  }

  console.log('\n=== CSS @font-face DECLARATIONS ===');
  console.log("/* Tajawal Arabic Font */");
  const cssDeclarations = [
    { weight: '300', file: 'tajawal-light.woff2' },
    { weight: '400', file: 'tajawal-regular.woff2' },
    { weight: '500', file: 'tajawal-medium.woff2' },
    { weight: '700', file: 'tajawal-bold.woff2' },
    { weight: '800', file: 'tajawal-extrabold.woff2' },
  ];
  for (const d of cssDeclarations) {
    console.log(`@font-face {
    font-family: 'Tajawal';
    font-style: normal;
    font-weight: ${d.weight};
    font-display: swap;
    src: url('../fonts/arabic-fonts/${d.file}') format('woff2');
    unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+0025-00FF;
}`);
  }
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
