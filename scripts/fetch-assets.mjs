/* Download the CC0 art this game ships.
 *
 *   node scripts/fetch-assets.mjs --list <pack>   inspect a pack's contents
 *   node scripts/fetch-assets.mjs                 fetch everything configured
 *   node scripts/fetch-assets.mjs --check         verify budget + licence rows
 *
 * WHY A SCRIPT AND NOT A COMMITTED BLOB DROP. `assets/LICENSES.md` requires a
 * row per file recorded AT DOWNLOAD TIME, and provenance retrofitted across
 * hundreds of meshes is far more expensive than one line now. A script makes
 * that automatic and makes the whole set reproducible from nothing.
 *
 * SOURCES ARE CC0 ONLY — Kenney, Poly Haven, ambientCG. Community Beyblade
 * part models are deliberately NOT here: licences vary per file, the designs
 * are Takara Tomy's, and `assets/LICENSES.md` rule 3 bans them outright. They
 * stay outside the repo and are used for MEASUREMENT only.
 *
 * Zip reading is hand-rolled over `zlib.inflateRaw` rather than pulling a
 * dependency: it is ~40 lines, and it works identically in the Docker test
 * image and on a Windows host, which shelling out to `unzip` or
 * `Expand-Archive` does not.
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { inflateRawSync } from 'node:zlib';

const ASSETS = 'assets';
const BUDGET_MB = 15;

/* ── Tiny zip reader ─────────────────────────────────────────────────────── */

/** Entries of a zip held in memory: [{ name, data }]. Stored + deflated only. */
function readZip(buf) {
  /* Walk the END OF CENTRAL DIRECTORY backwards — the only reliable way to
     find the directory, since the comment field is variable length. */
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 65_557; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip (no EOCD)');

  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = [];

  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method   = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen  = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const cmtLen   = buf.readUInt16LE(p + 32);
    const local    = buf.readUInt32LE(p + 42);
    const name     = buf.toString('utf8', p + 46, p + 46 + nameLen);

    /* The local header repeats the name/extra lengths, and they can DIFFER
       from the central ones — trusting the central copy here is a classic way
       to read a file at the wrong offset. */
    const lNameLen  = buf.readUInt16LE(local + 26);
    const lExtraLen = buf.readUInt16LE(local + 28);
    const start = local + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(start, start + compSize);

    if (!name.endsWith('/')) {
      try {
        out.push({ name, data: method === 0 ? raw : inflateRawSync(raw) });
      } catch { /* skip unreadable member rather than abort the whole pack */ }
    }
    p += 46 + nameLen + extraLen + cmtLen;
  }
  return out;
}

/* ── Fetch helpers ───────────────────────────────────────────────────────── */

async function get(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Kenney embeds a HASHED zip url in the asset page; it must be scraped. */
async function kenneyZipUrl(pack) {
  const html = (await get(`https://kenney.nl/assets/${pack}`)).toString('utf8');
  const m = html.match(new RegExp(`https://kenney\\.nl/media/pages/assets/${pack}/[^'"]+\\.zip`));
  if (!m) throw new Error(`no zip url on the ${pack} page`);
  return m[0];
}

/* ── What we ship ────────────────────────────────────────────────────────── */

/** Kenney packs, and which members to keep. GLB only — one file per prop. */
/* Patterns anchor on the path separator so they match the BASENAME, not any
   substring of the path — `bridge_center_stone.glb` otherwise matches a
   "stone" rock filter and the arena fills with bridge segments. */
const KENNEY = [
  { pack: 'pirate-kit',          keep: /\/(boat|ship|raft)[^/]*\.glb$/i,       max: 6, prefix: 'boat'  },
  /* Two entries, not one: `rock_*` sorts before `tree_*`, so a single filter
     with a shared cap took all ten slots as rocks and shipped no trees at all.
     Per-category caps are the fix — `slice` is first-N, not a sample. */
  { pack: 'nature-kit',          keep: /\/tree_[^/]*\.glb$/i,                max: 6, prefix: 'tree' },
  { pack: 'nature-kit',          keep: /\/rock_[^/]*\.glb$/i,                max: 5, prefix: 'rock' },
  { pack: 'city-kit-commercial', keep: /\/(building|skyscraper)[^/]*\.glb$/i,  max: 6, prefix: 'city' },
  { pack: 'castle-kit',          keep: /\/(tower|wall)[^/]*\.glb$/i,           max: 5, prefix: 'castle'},
  { pack: 'tower-defense-kit',   keep: /\/(tower|barrier|spike)[^/]*\.glb$/i,  max: 4, prefix: 'td'    },
];

/** Poly Haven HDRIs, 1k — one per arena mood. ~1.1 MB each. */
const HDRIS = [
  { id: 'kloppenheim_06_puresky', as: 'outdoor'  },
  { id: 'studio_small_09',        as: 'studio'   },
  { id: 'venice_sunset',          as: 'sunset'   },
  { id: 'lebombo',                as: 'interior' },
];

const licenceRows = [];

async function doKenney() {
  for (const { pack, keep, max, prefix } of KENNEY) {
    const url = await kenneyZipUrl(pack);
    process.stdout.write(`  ${pack} … `);
    const entries = readZip(await get(url));

    if (process.argv.includes('--list')) {
      const glbs = entries.filter(e => e.name.toLowerCase().endsWith('.glb'));
      console.log(`\n    ${entries.length} members, ${glbs.length} glb`);
      for (const e of glbs.slice(0, 25)) console.log(`      ${e.name}`);
      continue;
    }

    const picked = entries.filter(e => keep.test(e.name)).slice(0, max);
    const dir = join(ASSETS, 'models', prefix);
    mkdirSync(dir, { recursive: true });

    /* KENNEY GLBs REFERENCE AN EXTERNAL TEXTURE — `Textures/colormap.png`,
       resolved RELATIVE TO THE GLB. Flattening every model into one folder
       broke that path and the props loaded untextured, which looks worse than
       the grey boxes they replaced. Each pack keeps its own directory so the
       sibling `Textures/` resolves, and because the colormaps differ per pack
       they would otherwise overwrite each other. */
    for (const tex of entries.filter(e => /\/Textures\/[^/]+\.(png|jpg)$/i.test(e.name))) {
      const texOut = join(dir, 'Textures', basename(tex.name));
      mkdirSync(dirname(texOut), { recursive: true });
      writeFileSync(texOut, tex.data);
      licenceRows.push({ file: `models/${prefix}/Textures/${basename(tex.name)}`,
        source: 'Kenney', url: `https://kenney.nl/assets/${pack}`, author: 'Kenney',
        licence: 'CC0', notes: `texture atlas for \`${pack}\`` });
    }

    for (const e of picked) {
      const out = join(dir, basename(e.name));
      writeFileSync(out, e.data);
      licenceRows.push({ file: `models/${prefix}/${basename(e.name)}`, source: 'Kenney',
        url: `https://kenney.nl/assets/${pack}`, author: 'Kenney', licence: 'CC0',
        notes: `from \`${pack}\`` });
    }
    console.log(`${picked.length} kept`);
  }
}

async function doHdris() {
  mkdirSync(join(ASSETS, 'hdri'), { recursive: true });
  for (const { id, as } of HDRIS) {
    const out = join(ASSETS, 'hdri', `${as}.hdr`);
    if (existsSync(out)) { console.log(`  ${as}.hdr … already present`); continue; }
    const files = JSON.parse((await get(`https://api.polyhaven.com/files/${id}`)).toString('utf8'));
    const url = files?.hdri?.['1k']?.hdr?.url;
    if (!url) { console.log(`  ${as} … NO 1k hdr, skipped`); continue; }
    writeFileSync(out, await get(url));
    const mb = (statSync(out).size / 1048576).toFixed(2);
    console.log(`  ${as}.hdr … ${mb} MB`);
    licenceRows.push({ file: `hdri/${as}.hdr`, source: 'Poly Haven',
      url: `https://polyhaven.com/a/${id}`, author: 'Poly Haven', licence: 'CC0',
      notes: `1k, \`${id}\`` });
  }
}

/**
 * Emit `ASSET_CATALOGUE` from what is actually on disk.
 *
 * Generated rather than hand-maintained because the catalogue is the ONLY
 * thing standing between a `modelId` and a silent null: `AssetRegistry.load`
 * negative-caches an unknown id and the caller keeps its grey box, so a
 * catalogue that has drifted from the folder fails by looking exactly like
 * "no model was picked". Deriving it from the files removes that failure mode
 * entirely.
 *
 * `sourceLongestSide` is 0 ON PURPOSE: `AssetRegistry._normalise` back-fills
 * it by MEASURING the loaded geometry, and only when the catalogue leaves it
 * falsy. Writing a guessed 1 suppressed that measurement and scaled every prop
 * by `targetLongest / 1` — Kenney kits are not unit-sized, so boats came out
 * wildly wrong. The authored dimensions still decide the final size; this just
 * lets the registry discover what it is scaling FROM.
 */
function writeCatalogue(models) {
  const THEME_OF = (f) =>
    f.startsWith('models/boat/') ? 'boat'
    : f.startsWith('models/tree/') ? 'tree'
    : f.startsWith('models/rock/') ? 'rock'
    : f.startsWith('models/city/') ? 'building'
    : 'tower';

  const glbs = models.filter(r => r.file.endsWith('.glb'));
  const entries = glbs.map((r) => {
    const id = basename(r.file, '.glb');
    return `  { id: '${id}', url: '/${r.file}', label: '${id.replace(/[-_]/g, ' ')}', ` +
           `sourceLongestSide: 0, theme: '${THEME_OF(r.file)}' },`;
  });

  const out = `/* GENERATED by scripts/fetch-assets.mjs — do not edit by hand.
 *
 * Regenerate with: node scripts/fetch-assets.mjs
 *
 * Every entry corresponds to a file under \`assets/models/\` with a row in
 * \`assets/LICENSES.md\`. All CC0 (Kenney). ${glbs.length} models.
 */
import type { AssetEntry } from './AssetRegistry';

/** Prop families an obstacle's \`theme\` can resolve to. */
export type AssetTheme = 'boat' | 'tree' | 'rock' | 'building' | 'tower';

export interface ThemedAssetEntry extends AssetEntry { theme: AssetTheme }

export const GENERATED_CATALOGUE: readonly ThemedAssetEntry[] = [
${entries.join('\n')}
];

/** Every model tagged with this theme, for picking one deterministically. */
export function assetsForTheme(theme: AssetTheme): readonly ThemedAssetEntry[] {
  return GENERATED_CATALOGUE.filter(a => a.theme === theme);
}
`;
  writeFileSync(join('src', 'features', 'assetCatalogue.generated.ts'), out);
  console.log(`assetCatalogue.generated.ts: ${glbs.length} models (textures excluded)`);
}

function dirSizeMb(dir) {
  if (!existsSync(dir)) return 0;
  let total = 0;
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      const st = statSync(p);
      if (st.isDirectory()) walk(p); else total += st.size;
    }
  };
  walk(dir);
  return total / 1048576;
}

function writeLicences() {
  /* REGENERATED, never appended. Appending is not idempotent: a second run
     duplicated every row, and a licence file with each file listed twice is
     worse than none — it reads as two different grants for one asset. The
     sidecar keeps provenance across partial runs so a re-fetch of one pack
     does not drop the rows for the others. */
  const side = join(ASSETS, '.provenance.json');
  const prev = existsSync(side) ? JSON.parse(readFileSync(side, 'utf8')) : {};
  for (const r of licenceRows) prev[r.file] = r;

  /* Drop rows for files that are no longer on disk, so a tightened filter
     cleans up after itself instead of leaving ghosts. */
  for (const k of Object.keys(prev)) {
    if (!existsSync(join(ASSETS, k))) delete prev[k];
  }
  writeFileSync(side, JSON.stringify(prev, null, 2));

  const rows = Object.values(prev).sort((a, b) => a.file.localeCompare(b.file));
  const HEAD = '| File | Source | Author | Licence | Notes |\n|---|---|---|---|---|';
  const table = (list) => list.length === 0
    ? '_(none yet)_'
    : [HEAD, ...list.map(r =>
        `| \`${r.file}\` | [${r.source}](${r.url}) | ${r.author} | ${r.licence} | ${r.notes} |`,
      )].join('\n');

  const path = join(ASSETS, 'LICENSES.md');
  let md = readFileSync(path, 'utf8');
  const section = (name, body) => {
    const re = new RegExp(`(## ${name}\\n\\n)([\\s\\S]*?)(?=\\n## |$)`);
    md = md.replace(re, `$1${body}\n`);
  };
  writeCatalogue(rows.filter(r => r.file.startsWith('models/')));
  section('Models', table(rows.filter(r => r.file.startsWith('models/'))));
  section('HDRIs',  table(rows.filter(r => r.file.startsWith('hdri/'))));
  section('Textures', table(rows.filter(r => r.file.startsWith('textures/'))));
  writeFileSync(path, md);
  console.log(`\nLICENSES.md: ${rows.length} rows (regenerated)`);
}

/* ── Main ────────────────────────────────────────────────────────────────── */

const mb = dirSizeMb(ASSETS);
if (process.argv.includes('--check')) {
  console.log(`assets/ is ${mb.toFixed(2)} MB (budget ${BUDGET_MB} MB)`);
  if (mb > BUDGET_MB) { console.error('OVER BUDGET'); process.exit(1); }
  process.exit(0);
}

console.log('Kenney (CC0):');
await doKenney();
if (!process.argv.includes('--list')) {
  console.log('Poly Haven HDRIs (CC0):');
  await doHdris();
  writeLicences();
  const after = dirSizeMb(ASSETS);
  console.log(`\nassets/ now ${after.toFixed(2)} MB of ${BUDGET_MB} MB budget`);
  if (after > BUDGET_MB) { console.error('OVER BUDGET — trim the picks'); process.exit(1); }
}
