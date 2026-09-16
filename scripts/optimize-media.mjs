/**
 * Optimisation des visuels du site public.
 *
 * Les photos de stock arrivent en JPG de 6 à 15 Mo — inutilisable sur un
 * marché majoritairement mobile et souvent en réseau contraint. Ce script
 * produit pour chaque source deux WebP :
 *
 *   nom.webp      2000 px — bannières pleine largeur
 *   nom@sm.webp   1100 px — photos de corps de page (cartes, vignettes)
 *
 * Usage :
 *   node scripts/optimize-media.mjs                  → traite tout JPG/PNG
 *                                                      sans .webp associé
 *   node scripts/optimize-media.mjs src.jpg=slug ... → renomme à la volée
 *
 * Les sources sont ensuite déplacées dans `../.media-originaux/`, hors du
 * dossier servi, pour ne jamais partir en production.
 */

import { readdir, mkdir, rename, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MEDIA = path.resolve("public/media");
const ORIGINS = path.resolve("../.media-originaux");
const VARIANTS = [
  { suffix: "", width: 2000, quality: 78 },
  { suffix: "@sm", width: 1100, quality: 74 },
];

const ko = (n) => `${(n / 1024).toFixed(0)} ko`;

/** `fichier.jpg=slug` en argument, sinon le nom du fichier sert de slug. */
function parseArgs(argv) {
  const map = new Map();
  for (const a of argv) {
    const [file, slug] = a.split("=");
    map.set(file, slug ?? path.parse(file).name);
  }
  return map;
}

async function main() {
  const explicit = parseArgs(process.argv.slice(2));
  const files = explicit.size
    ? [...explicit.keys()]
    : (await readdir(MEDIA)).filter((f) => /\.(jpe?g|png)$/i.test(f));

  if (!files.length) return console.log("Rien à traiter.");
  await mkdir(ORIGINS, { recursive: true });

  for (const file of files) {
    const src = path.join(MEDIA, file);
    if (!existsSync(src)) {
      console.log(`✗ ${file} — introuvable`);
      continue;
    }
    const slug = explicit.get(file) ?? path.parse(file).name;

    // Sans argument explicite, on ne retouche pas ce qui est déjà converti.
    if (!explicit.size && existsSync(path.join(MEDIA, `${slug}.webp`))) continue;

    const avant = (await stat(src)).size;
    const sorties = [];
    for (const v of VARIANTS) {
      const out = path.join(MEDIA, `${slug}${v.suffix}.webp`);
      await sharp(src)
        .resize({ width: v.width, withoutEnlargement: true })
        .webp({ quality: v.quality })
        .toFile(out);
      sorties.push(`${slug}${v.suffix}.webp ${ko((await stat(out)).size)}`);
    }

    await rename(src, path.join(ORIGINS, file));
    console.log(`✓ ${file}\n  ${ko(avant)} → ${sorties.join(" · ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
