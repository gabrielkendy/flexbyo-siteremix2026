const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const C = { tealDeep:'#0E6A75', tealBright:'#00A8AD', tealInk:'#083940', offWhite:'#F5F1EA', gold:'#C9A86B' };

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function grain() {
  const d = [];
  for (let i = 0; i < 600; i++) { d.push(`<circle cx="${(i*7919)%1200}" cy="${(i*6037)%630}" r="0.5" fill="white"/>`); }
  return d.join('');
}

function svg({ kicker, line1, line2, tagline, footer, accent }) {
  const ac = accent === 'gold' ? C.gold : C.tealBright;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.tealDeep}"/><stop offset="100%" stop-color="${C.tealInk}"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="${C.tealBright}" stop-opacity="0.25"/><stop offset="100%" stop-color="${C.tealBright}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g opacity="0.04">${grain()}</g>
  <circle cx="1050" cy="120" r="180" stroke="${ac}" stroke-width="1" fill="none" opacity="0.3"/>
  <circle cx="1050" cy="120" r="120" stroke="${ac}" stroke-width="1" fill="none" opacity="0.15"/>
  <line x1="80" y1="570" x2="280" y2="570" stroke="${ac}" stroke-width="1" opacity="0.4"/>
  <text x="80" y="110" style="font-family:Georgia,serif;font-weight:300;font-size:32px;fill:${C.offWhite}">Flex<tspan style="font-style:italic;fill:${ac}">byo</tspan></text>
  <text x="80" y="220" style="font-family:monospace;font-size:14px;fill:${ac};letter-spacing:5px">${esc(kicker.toUpperCase())}</text>
  <line x1="80" y1="240" x2="140" y2="240" stroke="${ac}" stroke-width="1"/>
  <text x="80" y="330" style="font-family:Georgia,serif;font-weight:300;font-size:68px;fill:${C.offWhite}">${esc(line1)}</text>
  <text x="80" y="410" style="font-family:Georgia,serif;font-style:italic;font-weight:300;font-size:68px;fill:${ac}">${esc(line2)}</text>
  <text x="80" y="480" style="font-family:sans-serif;font-weight:300;font-size:22px;fill:${C.offWhite};opacity:0.85">${esc(tagline)}</text>
  <text x="80" y="570" style="font-family:monospace;font-size:12px;fill:${C.offWhite};opacity:0.55;letter-spacing:3px">${esc(footer)}</text>
  <g transform="translate(1050,550)"><circle r="40" fill="${ac}" opacity="0.1"/><text text-anchor="middle" dy="12" style="font-family:Georgia,serif;font-style:italic;font-size:36px;fill:${ac}">F</text></g>
</svg>`;
}

const pages = [
  { slug:'home', kicker:'FlexByo Academy', line1:'Movimento, forca,', line2:'presenca.', tagline:'Pilates e Hot Yoga premium - 20+ anos em Curitiba', footer:'FLEXBYO.COM.BR - MOSSUNGUE - CURITIBA', accent:'bright' },
  { slug:'sobre', kicker:'Sobre nos', line1:'20 anos refinando', line2:'um metodo.', tagline:'Historia, filosofia, equipe e espaco', footer:'FLEXBYO.COM.BR - CONHECA NOSSA HISTORIA', accent:'bright' },
  { slug:'modalidades', kicker:'As 7 modalidades', line1:'Sete jornadas, uma', line2:'mesma essencia.', tagline:'Hot Yoga, Hot Pilates, Reformer, Mat, Flow e mais', footer:'FLEXBYO.COM.BR - HOT YOGA - HOT PILATES', accent:'bright' },
  { slug:'planos', kicker:'Planos e precos', line1:'Restart por', line2:'R$ 29,90.', tagline:'2 aulas experimentais - Sem fidelidade - Flex 8 desde R$ 392/mes', footer:'FLEXBYO.COM.BR - EXPERIMENTE SEM COMPROMISSO', accent:'gold' },
  { slug:'contato', kicker:'Agende sua aula', line1:'Vamos comecar', line2:'essa conversa?', tagline:'WhatsApp - ParkShoppingBarigui - Mossungue', footer:'FLEXBYO.COM.BR - (41) 99704-9069', accent:'bright' }
];

async function run() {
  const out = path.resolve(__dirname, '../assets/images/og');
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
  console.log('Gerando OG Images...\n');
  for (const p of pages) {
    const f = path.join(out, `og-${p.slug}.jpg`);
    await sharp(Buffer.from(svg(p))).jpeg({ quality: 88, progressive: true }).toFile(f);
    console.log(`  ok og-${p.slug}.jpg (${(fs.statSync(f).size/1024).toFixed(1)}kb)`);
  }
  console.log('\nOG Images geradas em:', out);
}

run().catch(e => { console.error('Erro:', e); process.exit(1); });
