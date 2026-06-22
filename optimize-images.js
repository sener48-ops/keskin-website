// Görselleri web için optimize eder: assets/images/<orijinal> -> assets/images/web/<yeni-ad>.jpg
// Çalıştırma: node optimize-images.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "assets", "images");
const OUT = path.join(SRC, "web");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// Makine / üretim fotoğrafları (galeri ve kartlar için) — sıralı
const machine = [
  "20190808_091300.jpg", // enjeksiyon makinesi yakın çekim
  "20190808_091212.jpg", // ekstrüzyon hattı makineleri
  "20190808_091218.jpg", // ekstrüzyon salonu
  "20190808_100024.jpg", // üretim salonu
  "20190808_092429.jpg", // polietilen üretim alanı
  "20190808_084955.jpg", // üretim hattı
  "20190808_091144.jpg", // makine salonu
  "20190808_090932.jpg", // üretim salonu
  "20190808_083154.jpg", // üretim alanı
  "20190808_083254.jpg", // konveyör hattı
  "20190808_082910.jpg"  // hammadde besleme / hopper
];

// Tesis / bina dış görünümleri
const facility = [
  "20190808_081146.jpg",
  "20190808_082437.jpg",
  "20190808_092514.jpg", // silolar
  "20190808_092752.jpg",
  "20190808_081404.jpg"
];

async function process(list, prefix) {
  let i = 0;
  for (const file of list) {
    i++;
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.log("ATLA (yok):", file); continue; }
    const num = String(i).padStart(2, "0");
    const out = path.join(OUT, `${prefix}-${num}.jpg`);
    await sharp(src)
      .rotate() // EXIF yönelimini uygula
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`${file} -> web/${prefix}-${num}.jpg (${kb} KB)`);
  }
}

(async () => {
  await process(machine, "makine");
  await process(facility, "tesis");
  console.log("Bitti.");
})().catch((e) => { console.error(e); process.exit(1); });
