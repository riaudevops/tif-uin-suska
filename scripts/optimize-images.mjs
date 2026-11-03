#!/usr/bin/env bun
/**
 * Image optimizer for files served from `public/`.
 *
 * Converts photographic assets to WebP at a width appropriate for how they are
 * displayed, and re-encodes the PNG logos in place. Originals are only removed
 * when `--prune` is passed, so the command can be reviewed before it deletes
 * anything.
 *
 * Usage:
 *   bun scripts/optimize-images.mjs           # convert + report, keep originals
 *   bun scripts/optimize-images.mjs --prune   # convert and delete originals
 *   bun scripts/optimize-images.mjs --check   # fail if originals still exist
 */

import sharp from "sharp";
import { readdir, stat, unlink, access } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = "public";
const args = new Set(process.argv.slice(2));
const PRUNE = args.has("--prune");
const CHECK = args.has("--check");

/**
 * Display-aware targets. `maxWidth` keeps retina screens sharp without shipping
 * a 2560px file into a 400px card.
 */
const TARGETS = [
  { dir: "public/laboratorium", maxWidth: 900, quality: 72 },
  { dir: "public/ruang-kelas", maxWidth: 900, quality: 72 },
  { dir: "public/dosen-pages", maxWidth: 1200, quality: 74 },
  { dir: "public/landing-pages", maxWidth: 1600, quality: 76 },
  { dir: "public/prestasi-pages", maxWidth: 1200, quality: 76 },
  { dir: "public/struktur-pages", maxWidth: 1400, quality: 80 },
];

/** Per-file overrides, keyed by basename. */
const OVERRIDES = {
  // Used as a 5%-opacity footer backdrop and as a card fallback, so detail is
  // irrelevant and the size matters.
  "gedung-faste.jpg": { maxWidth: 1200, quality: 60 },
};

/** PNG logos: keep the format (favicon/apple-touch-icon rely on it), shrink only. */
const PNG_DIRS = ["public/logo"];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function filesIn(dir) {
  try {
    return (await readdir(dir, { withFileTypes: true }))
      .filter((e) => e.isFile() && /\.(jpe?g)$/i.test(e.name))
      .map((e) => path.join(dir, e.name))
      .sort();
  } catch {
    return [];
  }
}

let beforeTotal = 0;
let afterTotal = 0;
let converted = 0;
const rows = [];

for (const groupConfig of TARGETS) {
  for (const file of await filesIn(groupConfig.dir)) {
    const target = { ...groupConfig, ...(OVERRIDES[path.basename(file)] || {}) };
    const before = (await stat(file)).size;
    const meta = await sharp(file).metadata();
    const out = file.replace(/\.(jpe?g)$/i, ".webp");

    // Never ship a "conversion" that is larger than the source: try the
    // configured quality first, then step down a few times.
    let buffer = null;
    let usedQuality = target.quality;
    for (const quality of [target.quality, target.quality - 8, target.quality - 16, 55]) {
      const candidate = await sharp(file)
        .resize({ width: target.maxWidth, withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toBuffer();
      if (!buffer || candidate.length < buffer.length) buffer = candidate;
      usedQuality = quality;
      if (candidate.length < before) {
        buffer = candidate;
        break;
      }
    }

    if (buffer.length >= before) {
      // Re-encoding does not help; keep the original JPEG.
      rows.push({
        file: path.relative(PUBLIC_DIR, file),
        out: path.relative(PUBLIC_DIR, file),
        dims: `${meta.width}x${meta.height} (kept: webp not smaller)`,
        before,
        after: before,
      });
      continue;
    }

    await Bun.write(out, buffer);

    beforeTotal += before;
    afterTotal += buffer.length;
    converted += 1;

    rows.push({
      file: path.relative(PUBLIC_DIR, file),
      out: path.relative(PUBLIC_DIR, out),
      dims: `${meta.width}x${meta.height} → ${Math.min(meta.width, target.maxWidth)}w q${usedQuality}`,
      before,
      after: buffer.length,
    });

    if (PRUNE) await unlink(file);
  }
}

for (const dir of PNG_DIRS) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    continue;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !/\.png$/i.test(entry.name)) continue;
    const file = path.join(dir, entry.name);
    const before = (await stat(file)).size;
    const meta = await sharp(file).metadata();

    const buffer = await sharp(file)
      .resize({ width: Math.min(meta.width, 512), withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, quality: 92 })
      .toBuffer();

    // Only keep the re-encode if it is genuinely smaller.
    if (buffer.length < before) {
      await Bun.write(file, buffer);
      beforeTotal += before;
      afterTotal += buffer.length;
      converted += 1;
      rows.push({
        file: path.relative(PUBLIC_DIR, file),
        out: path.relative(PUBLIC_DIR, file),
        dims: `${meta.width}x${meta.height}`,
        before,
        after: buffer.length,
      });
    }
  }
}

if (CHECK) {
  const leftovers = [];
  for (const target of TARGETS) {
    for (const file of await filesIn(target.dir)) leftovers.push(file);
  }
  if (leftovers.length > 0) {
    console.error(`\n${leftovers.length} unoptimized JPEG(s) remain:`);
    for (const file of leftovers) console.error(`  ${file}`);
    process.exit(1);
  }
  console.log("All photographic assets are WebP. ✔");
  process.exit(0);
}

const width = Math.max(0, ...rows.map((r) => r.out.length));
for (const row of rows) {
  const saved = ((1 - row.after / row.before) * 100).toFixed(0);
  console.log(
    `  ${row.out.padEnd(width)}  ${kb(row.before).padStart(8)} → ${kb(row.after).padStart(7)}  (-${saved.padStart(3)}%)  ${row.dims}`,
  );
}

console.log(
  `\n${converted} file(s) processed: ${(beforeTotal / 1048576).toFixed(1)} MB → ${(afterTotal / 1048576).toFixed(1)} MB` +
    ` (-${(100 - (afterTotal / beforeTotal) * 100).toFixed(0)}%)`,
);
if (!PRUNE) console.log("Originals kept. Re-run with --prune to delete them.");
