const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const C = { tealDeep:'#0E6A75', tealBright:'#00A8AD', offWhite:'#F5F1EA' };

function masterSvg(sz) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 512 512">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${C.tealDeep}"/><stop offset="100%" stop-color="#062c31"/>
  </linearGradient></defs>
  <rect width="512" height="512" rx="96" ry="96" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="210" fill="none" stroke="${C.tealBright}" stroke-width="2" opacity="0.2"/>
  <text text-anchor="middle" x="256" y="340" style="font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:360px;fill:${C.offWhite}">F</text>
  <circle cx="420" cy="420" r="10" fill="${C.tealBright}"/>
</svg>`;
}

function smallSvg(sz) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" ry="6" fill="${C.tealDeep}"/>
  <text text-anchor="middle" x="16" y="24" style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:24px;fill:${C.offWhite}">F</text>
</svg>`;
}

async function run() {
  const out = path.resolve(__dirname, '../assets/images/favicons');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
  console.log('Gerando Favicons...\n');

  fs.writeFileSync(path.join(out, 'favicon.svg'), masterSvg(512));
  console.log('  ok favicon.svg');

  const sizes = [
    { name:'favicon-16x16.png', size:16, small:true },
    { name:'favicon-32x32.png', size:32, small:true },
    { name:'apple-touch-icon.png', size:180, small:false },
    { name:'icon-192.png', size:192, small:false },
    { name:'icon-512.png', size:512, small:false }
  ];

  for (const s of sizes) {
    const svg = s.small ? smallSvg(s.size) : masterSvg(s.size);
    await sharp(Buffer.from(svg)).resize(s.size, s.size).png({ compressionLevel: 9 }).toFile(path.join(out, s.name));
    console.log(`  ok ${s.name} (${s.size}x${s.size})`);
  }

  await sharp(Buffer.from(smallSvg(32))).resize(32,32).png().toFile(path.join(out, 'favicon.ico'));
  console.log('  ok favicon.ico');

  console.log('\nFavicons gerados em:', out);
}

run().catch(e => { console.error('Erro:', e); process.exit(1); });
