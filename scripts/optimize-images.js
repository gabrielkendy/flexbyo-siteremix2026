const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const HOME = process.env.USERPROFILE || process.env.HOME || 'C:\\Users\\Gabriel';

const SOURCES = [
  {
    name: 'Logo',
    files: [
      { src: path.join(HOME, 'Downloads', 'FLEXBYO SITE 2026', 'logomarca flex', 'FLEXBYO_LOGO_RGB_NEGATIVA_PRETO-removebg - Copia.png'), dest: 'logo-negativa.png', maxW: 800 },
      { src: path.join(HOME, 'Downloads', 'FLEXBYO SITE 2026', 'logomarca flex', 'FLEXBYO_LOGO_RGB_PRIMARIA_COR - Copia.png'), dest: 'logo-primaria.png', maxW: 800 }
    ],
    destDir: path.resolve(__dirname, '../assets/images/logo')
  },
  {
    name: 'Socias',
    files: [
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'socias', 'freepik__photo-a-28yearold-caucasian-woman-with-blonde-hair__51077.png'), dest: 'socia-01.png', maxW: 800 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'socias', 'freepik__photo-a-35yearold-white-woman-with-brown-hair-in-a__51069.png'), dest: 'socia-02.png', maxW: 800 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'socias', 'freepik__photo-a-55yearold-caucasian-woman-with-brown-hair-__51073.png'), dest: 'socia-03.png', maxW: 800 }
    ],
    destDir: path.resolve(__dirname, '../assets/images/socias')
  },
  {
    name: 'Modalidades',
    files: [
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'modalidades', 'hotyoga.png'), dest: 'hot-yoga.png', maxW: 1200 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'modalidades', 'hotpilates.png'), dest: 'hot-pilates.png', maxW: 1200 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'modalidades', 'matpilates.png'), dest: 'mat-pilates.png', maxW: 1200 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'modalidades', 'mixpilates.png'), dest: 'mix-pilates.png', maxW: 1200 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'modalidades', 'powerpilates.png'), dest: 'power-pilates.png', maxW: 1200 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'modalidades', 'flowpilates.png'), dest: 'flow-pilates.png', maxW: 1200 },
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'modalidades', 'individual.png'), dest: 'individual.png', maxW: 1200 }
    ],
    destDir: path.resolve(__dirname, '../assets/images/modalidades')
  },
  {
    name: 'Studio',
    files: [
      { src: path.join(HOME, 'Downloads', 'fotos site flexbyo', 'fotos studio', 'horizontal', 'freepik__img1-1b3d5f82559b43d3b95e0cb596a1602dcreation-67ou__51110.png'), dest: 'studio-principal.png', maxW: 1600 }
    ],
    destDir: path.resolve(__dirname, '../assets/images/studio')
  }
];

function fmt(b) { return b < 1024*1024 ? (b/1024).toFixed(0)+'KB' : (b/(1024*1024)).toFixed(2)+'MB'; }

async function run() {
  console.log('Otimizando imagens...\n');
  let totalOrig = 0, totalNew = 0;

  for (const group of SOURCES) {
    console.log(`\n--- ${group.name} ---`);
    if (!fs.existsSync(group.destDir)) fs.mkdirSync(group.destDir, { recursive: true });

    for (const f of group.files) {
      if (!fs.existsSync(f.src)) { console.log(`  SKIP ${f.dest} (origem nao existe)`); continue; }
      const origSize = fs.statSync(f.src).size;
      totalOrig += origSize;
      const base = path.basename(f.dest, path.extname(f.dest));

      // JPG
      const jpgPath = path.join(group.destDir, base + '.jpg');
      await sharp(f.src).rotate().resize(f.maxW, null, { withoutEnlargement: true, fit: 'inside' }).jpeg({ quality: 85, progressive: true, mozjpeg: true }).toFile(jpgPath);
      const jpgSize = fs.statSync(jpgPath).size;

      // WebP
      const webpPath = path.join(group.destDir, base + '.webp');
      await sharp(f.src).rotate().resize(f.maxW, null, { withoutEnlargement: true, fit: 'inside' }).webp({ quality: 82, effort: 6 }).toFile(webpPath);
      const webpSize = fs.statSync(webpPath).size;

      totalNew += jpgSize + webpSize;
      console.log(`  ok ${base}.jpg (${fmt(origSize)} -> ${fmt(jpgSize)}) + .webp (${fmt(webpSize)})`);
    }
  }

  console.log(`\nTotal: ${fmt(totalOrig)} -> ${fmt(totalNew)} (${((1-totalNew/totalOrig)*100).toFixed(0)}% economia)`);
}

run().catch(e => { console.error('Erro:', e); process.exit(1); });
