/**
 * Génère les icônes PWA (192x192 et 512x512) à partir d'un SVG inline.
 * Usage : node scripts/generate-icons.mjs
 * Nécessite : npm install -D sharp
 */
import sharp from "sharp";
import { writeFileSync } from "fs";

// SVG de l'icône Malaykaa (fond indigo + éclair blanc)
const SVG = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#6366f1"/>
  <text x="50%" y="55%" font-size="${size * 0.5}" font-family="sans-serif"
        fill="white" text-anchor="middle" dominant-baseline="middle">✦</text>
</svg>`;

async function generate() {
  for (const size of [96, 192, 512]) {
    const svg = Buffer.from(SVG(size));
    const output = `public/pwa-${size}.png`;
    await sharp(svg).png().toFile(output);
    console.log(`✅ ${output}`);
  }
}

generate().catch(console.error);
