/**
 * analyze-stl-library.mjs — mass-properties analysis of a 3D-print part library.
 *
 *   node --max-old-space-size=8192 scripts/analyze-stl-library.mjs [--root "D:/3d prints"] [--extract]
 *
 * READ-ONLY with respect to the source tree. Archives are expanded into a scratch
 * directory, never in place; no source file is ever written, moved, or deleted.
 *
 * For every mesh it derives the quantities a spinning-top physics model actually
 * needs — volume, mass, centre of mass, and the inertia tensor — rather than the
 * hand-authored 0-100 sliders the builder uses today:
 *
 *   Izz about the spin axis  →  Δrpm ∝ impulse / I   (collision spin loss)
 *   centre-of-mass height    →  stability / precession
 *   outboard mass ratio      →  smash-attack vs stamina bias
 *   outer radius, height     →  contact radius for collision
 *
 * Outputs (both under `case study/`):
 *   CS24 — STL part library analysis.md   human-readable report
 *   stl-part-stats.json                   machine-readable catalog
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, '..');

/* ── CLI ──────────────────────────────────────────────────────────────────── */
const argv = process.argv.slice(2);
function flag(name, fallback = null) {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const next = argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const ROOT = String(flag('root', 'D:/3d prints'));
const DO_EXTRACT = flag('extract', false) === true;
const SCRATCH = path.join(REPO, '.stl-scratch');
const OUT_DIR = path.join(REPO, 'case study');
const OUT_MD = path.join(OUT_DIR, 'CS24 — STL part library analysis.md');
const OUT_JSON = path.join(OUT_DIR, 'stl-part-stats.json');

/* Beyond this, vertex welding for the watertight check costs more than it is
   worth; the mesh is flagged `watertight: null` instead of being guessed at. */
const WATERTIGHT_TRI_LIMIT = 2_000_000;

/* ── Densities (g/cm³) ────────────────────────────────────────────────────── */
const DENSITIES = {
  pla: 1.24,
  abs: 1.04,
  petg: 1.27,
};
/* Printed parts are not solid. Typical hobby infill for a functional part. */
const PRINT_INFILL = 0.35;

/* ── Part-type taxonomy, matched against the filename ─────────────────────── */
/* Order matters: the first hit wins, so the more specific patterns come first. */
const PART_PATTERNS = [
  ['engine_gear', /\b(engine[ _-]?gear|\beg\b|_eg_|gt[ _]?eg)\b/i],
  ['spin_gear', /\b(spin[ _-]?gear|\bsg\b|_sg_|_sg\.|right_sg|left_sg)/i],
  ['clutch', /clutch/i],
  ['bearing_core', /bearing[ _-]?core|\bbearing\b/i],
  ['tip', /\btip\b|_tip|tip[ _-]?part/i],
  ['sub_attack_ring', /\bsar\b|_sar|sub[ _-]?ar\b|sub[ _-]?attack/i],
  ['attack_ring', /\bar\b|_ar\b|_ar[ _.(]|attack[ _-]?ring/i],
  ['weight_disk', /\bwd\b|_wd\b|weight[ _-]?disk/i],
  ['blade_base', /\bbb\b|_base|blade[ _-]?base|\bbase\b/i],
  ['support_part', /\bsp\b|_sp\b|support[ _-]?part|survivor[ _-]?ring/i],
  ['core', /\bcore\b|shaft|hub/i],
  ['bit_chip', /bit[ _-]?chip|bitchip/i],
];

function classifyPart(filename) {
  const stem = path.basename(filename, path.extname(filename));
  for (const [type, re] of PART_PATTERNS) if (re.test(stem)) return type;
  return 'unknown';
}

/* ── Mesh loading ─────────────────────────────────────────────────────────── */
/* All loaders return a flat Float64Array of 9 numbers per triangle. */

function isBinarySTL(buf) {
  if (buf.length < 84) return false;
  const triCount = buf.readUInt32LE(80);
  /* A binary STL is exactly 84 + 50n bytes. ASCII files effectively never are. */
  return buf.length === 84 + triCount * 50;
}

function loadBinarySTL(buf) {
  const n = buf.readUInt32LE(80);
  const tris = new Float64Array(n * 9);
  let o = 84;
  for (let i = 0; i < n; i++) {
    o += 12; // skip the stored facet normal; it is recomputed where needed
    for (let k = 0; k < 9; k++) {
      tris[i * 9 + k] = buf.readFloatLE(o);
      o += 4;
    }
    o += 2; // attribute byte count
  }
  return tris;
}

function loadAsciiSTL(text) {
  const out = [];
  const re = /vertex\s+(-?[\d.eE+]+)\s+(-?[\d.eE+]+)\s+(-?[\d.eE+]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }
  if (out.length % 9 !== 0) out.length -= out.length % 9;
  return Float64Array.from(out);
}

function loadOBJ(text) {
  const vx = [];
  const tris = [];
  for (const line of text.split('\n')) {
    if (line.startsWith('v ')) {
      const p = line.split(/\s+/);
      vx.push([+p[1], +p[2], +p[3]]);
    } else if (line.startsWith('f ')) {
      const idx = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((tok) => {
          const i = parseInt(tok.split('/')[0], 10);
          return i < 0 ? vx.length + i : i - 1;
        });
      /* Fan-triangulate any n-gon. */
      for (let i = 1; i + 1 < idx.length; i++) {
        for (const j of [idx[0], idx[i], idx[i + 1]]) {
          const v = vx[j];
          if (!v) continue;
          tris.push(v[0], v[1], v[2]);
        }
      }
    }
  }
  if (tris.length % 9 !== 0) tris.length -= tris.length % 9;
  return Float64Array.from(tris);
}

function loadMesh(file) {
  const ext = path.extname(file).toLowerCase();
  const buf = fs.readFileSync(file);
  if (ext === '.obj') return { tris: loadOBJ(buf.toString('utf8')), format: 'obj' };
  if (isBinarySTL(buf)) return { tris: loadBinarySTL(buf), format: 'stl-binary' };
  return { tris: loadAsciiSTL(buf.toString('utf8')), format: 'stl-ascii' };
}

/* ── Mass properties ──────────────────────────────────────────────────────── */
/**
 * Tetrahedron decomposition against the origin.
 *
 * Volume:     V  = Σ det(a,b,c)/6
 * Centroid:   Cm = Σ v·(a+b+c)/4 / V
 * Covariance: C  = Σ detJ/120 · A·M·Aᵀ   with M = [[2,1,1],[1,2,1],[1,1,2]]
 * Inertia:    I  = tr(C)·Id − C          (unit density; scale by ρ afterwards)
 *
 * Signed volumes mean the result is correct for any closed surface regardless of
 * where the origin sits. For an open (non-watertight) mesh it is meaningless,
 * which is exactly why watertightness is checked and reported.
 */
function massProperties(tris) {
  const n = tris.length / 9;
  let V = 0;
  const cm = [0, 0, 0];
  const C = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // row-major 3×3

  for (let i = 0; i < n; i++) {
    const o = i * 9;
    const ax = tris[o], ay = tris[o + 1], az = tris[o + 2];
    const bx = tris[o + 3], by = tris[o + 4], bz = tris[o + 5];
    const cx = tris[o + 6], cy = tris[o + 7], cz = tris[o + 8];

    const detJ =
      ax * (by * cz - bz * cy) -
      ay * (bx * cz - bz * cx) +
      az * (bx * cy - by * cx);
    const v = detJ / 6;
    V += v;

    cm[0] += v * (ax + bx + cx) / 4;
    cm[1] += v * (ay + by + cy) / 4;
    cm[2] += v * (az + bz + cz) / 4;

    /* A·M·Aᵀ expanded: for each (i,j), Σ over the 6 vertex pairings. */
    const p = [[ax, ay, az], [bx, by, bz], [cx, cy, cz]];
    const k = detJ / 120;
    for (let r = 0; r < 3; r++) {
      for (let c2 = 0; c2 < 3; c2++) {
        let s = 0;
        for (let u = 0; u < 3; u++) {
          for (let w = 0; w < 3; w++) {
            s += (u === w ? 2 : 1) * p[u][r] * p[w][c2];
          }
        }
        C[r * 3 + c2] += k * s;
      }
    }
  }

  if (Math.abs(V) < 1e-12) return null;
  cm[0] /= V; cm[1] /= V; cm[2] /= V;

  /* Shift the covariance to the centre of mass (parallel-axis, covariance form). */
  for (let r = 0; r < 3; r++) {
    for (let c2 = 0; c2 < 3; c2++) {
      C[r * 3 + c2] -= V * cm[r] * cm[c2];
    }
  }

  const tr = C[0] + C[4] + C[8];
  const I = [
    tr - C[0], -C[1], -C[2],
    -C[3], tr - C[4], -C[5],
    -C[6], -C[7], tr - C[8],
  ];

  return { volume: V, com: cm, inertiaUnitDensity: I };
}

function bounds(tris) {
  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < tris.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = tris[i + k];
      if (v < lo[k]) lo[k] = v;
      if (v > hi[k]) hi[k] = v;
    }
  }
  return { lo, hi, size: [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]] };
}

/** Each undirected edge of a closed manifold is shared by exactly two faces. */
function checkWatertight(tris) {
  const n = tris.length / 9;
  if (n > WATERTIGHT_TRI_LIMIT) return null;
  const Q = 1e4; // weld tolerance, in source units
  const key = (o) =>
    `${Math.round(tris[o] * Q)},${Math.round(tris[o + 1] * Q)},${Math.round(tris[o + 2] * Q)}`;

  const edges = new Map();
  for (let i = 0; i < n; i++) {
    const o = i * 9;
    const v = [key(o), key(o + 3), key(o + 6)];
    for (let e = 0; e < 3; e++) {
      const a = v[e], b = v[(e + 1) % 3];
      const k = a < b ? `${a}|${b}` : `${b}|${a}`;
      edges.set(k, (edges.get(k) ?? 0) + 1);
    }
  }
  let bad = 0;
  for (const c of edges.values()) if (c !== 2) bad++;
  return { watertight: bad === 0, badEdges: bad, edgeCount: edges.size };
}

/**
 * Fraction of mass further than 0.7·R from the spin axis.
 * High = outboard-weighted = smash attack. Low = hub-weighted = stamina.
 */
function outboardRatio(tris, com, spinAxis) {
  const [u, w] = [[1, 2], [0, 2], [0, 1]][spinAxis];
  let rMax = 0;
  const n = tris.length / 9;
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 3; k++) {
      const o = i * 9 + k * 3;
      const du = tris[o + u] - com[u];
      const dw = tris[o + w] - com[w];
      const r = Math.hypot(du, dw);
      if (r > rMax) rMax = r;
    }
  }
  if (rMax === 0) return { ratio: 0, rMax: 0 };

  /* Volume-weighted, using each triangle's own signed tet volume. */
  let total = 0, outboard = 0;
  const cut = 0.7 * rMax;
  for (let i = 0; i < n; i++) {
    const o = i * 9;
    const ax = tris[o], ay = tris[o + 1], az = tris[o + 2];
    const bx = tris[o + 3], by = tris[o + 4], bz = tris[o + 5];
    const cx = tris[o + 6], cy = tris[o + 7], cz = tris[o + 8];
    const detJ =
      ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
    const v = detJ / 6;
    const centroid = [(ax + bx + cx) / 4, (ay + by + cy) / 4, (az + bz + cz) / 4];
    const r = Math.hypot(centroid[u] - com[u], centroid[w] - com[w]);
    total += v;
    if (r > cut) outboard += v;
  }
  return { ratio: total !== 0 ? outboard / total : 0, rMax };
}

/* ── Unit detection ───────────────────────────────────────────────────────── */
/* Real plastic-gen beys are ~45-55 mm across. Anything far outside that is a
   scale error, and must be reported rather than silently folded into the stats. */
function detectUnits(maxDim) {
  if (maxDim >= 15 && maxDim <= 200) return { unit: 'mm', toCm: 0.1, confident: true };
  if (maxDim >= 1.5 && maxDim <= 20) return { unit: 'cm', toCm: 1, confident: true };
  if (maxDim >= 0.015 && maxDim <= 0.2) return { unit: 'm', toCm: 100, confident: true };
  return { unit: 'mm?', toCm: 0.1, confident: false };
}

/* ── Walk ─────────────────────────────────────────────────────────────────── */
function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function extractArchives(files) {
  const archives = files.filter((f) => /\.(7z|zip)$/i.test(f));
  if (!archives.length) return [];
  fs.mkdirSync(SCRATCH, { recursive: true });

  let sevenZip = null;
  for (const cand of ['7z', 'C:/Program Files/7-Zip/7z.exe']) {
    try {
      execFileSync(cand, ['i'], { stdio: 'ignore' });
      sevenZip = cand;
      break;
    } catch { /* try next */ }
  }
  if (!sevenZip) {
    console.warn(`  ! 7-Zip not found — skipping ${archives.length} archive(s)`);
    return [];
  }

  const produced = [];
  for (const a of archives) {
    const dest = path.join(SCRATCH, crypto.createHash('md5').update(a).digest('hex').slice(0, 12));
    if (fs.existsSync(dest)) { produced.push(...walk(dest)); continue; }
    fs.mkdirSync(dest, { recursive: true });
    try {
      execFileSync(sevenZip, ['x', a, `-o${dest}`, '-y'], { stdio: 'ignore' });
      produced.push(...walk(dest));
    } catch {
      console.warn(`  ! failed to extract ${path.basename(a)}`);
    }
  }
  return produced;
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`Root not found: ${ROOT}`);
    process.exit(1);
  }
  console.log(`Scanning ${ROOT} …`);

  let files = walk(ROOT);
  if (DO_EXTRACT) {
    console.log('Extracting archives to scratch …');
    files = files.concat(extractArchives(files));
  }

  const meshFiles = files.filter((f) => /\.(stl|obj)$/i.test(f));
  console.log(`${meshFiles.length} mesh file(s)\n`);

  const parts = [];
  const byHash = new Map();
  let done = 0;

  for (const file of meshFiles) {
    const rel = path.relative(ROOT, file);
    const stat = fs.statSync(file);
    done++;
    process.stdout.write(`  [${done}/${meshFiles.length}] ${path.basename(file).slice(0, 60)}\r`);

    const rec = {
      file: rel.replace(/\\/g, '/'),
      name: path.basename(file, path.extname(file)),
      partType: classifyPart(file),
      bytes: stat.size,
      warnings: [],
    };

    try {
      const hash = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');
      rec.hash = hash;
      if (byHash.has(hash)) rec.duplicateOf = byHash.get(hash);
      else byHash.set(hash, rec.file);

      const { tris, format } = loadMesh(file);
      rec.format = format;
      rec.triangles = tris.length / 9;
      if (rec.triangles === 0) {
        rec.warnings.push('no triangles parsed');
        parts.push(rec);
        continue;
      }

      const bb = bounds(tris);
      const maxDim = Math.max(...bb.size);
      const units = detectUnits(maxDim);
      rec.units = units.unit;
      if (!units.confident) {
        rec.warnings.push(`ambiguous scale: largest dimension ${maxDim.toFixed(2)} source units`);
      }

      const s = units.toCm;
      rec.sizeCm = bb.size.map((v) => +(v * s).toFixed(3));

      /* Spin axis = the flattest axis. A disc, ring or weight disk is thin along
         the axis it spins about. Reported so a wrong guess is visible. */
      const spinAxis = bb.size.indexOf(Math.min(...bb.size));
      rec.spinAxis = ['x', 'y', 'z'][spinAxis];

      const [ru, rw] = [[1, 2], [0, 2], [0, 1]][spinAxis];
      rec.outerRadiusCm = +(Math.max(bb.size[ru], bb.size[rw]) / 2 * s).toFixed(3);
      rec.heightCm = +(bb.size[spinAxis] * s).toFixed(3);

      const wt = checkWatertight(tris);
      rec.watertight = wt ? wt.watertight : null;
      if (wt && !wt.watertight) rec.warnings.push(`not watertight: ${wt.badEdges} bad edge(s)`);
      if (wt === null) rec.warnings.push('watertight check skipped (mesh too large)');

      const mp = massProperties(tris);
      if (!mp) {
        rec.warnings.push('degenerate volume');
        parts.push(rec);
        continue;
      }

      const volCm3 = mp.volume * s ** 3;
      rec.volumeCm3 = +volCm3.toFixed(4);
      if (volCm3 < 0) rec.warnings.push('negative volume — inverted normals');

      rec.comCm = mp.com.map((v) => +(v * s).toFixed(3));
      /* Height of the centre of mass above the part's own lowest point. */
      rec.comHeightCm = +(((mp.com[spinAxis] - bb.lo[spinAxis]) * s)).toFixed(3);
      rec.comOffsetRadialCm = +(
        Math.hypot(mp.com[ru] - (bb.lo[ru] + bb.size[ru] / 2),
                   mp.com[rw] - (bb.lo[rw] + bb.size[rw] / 2)) * s
      ).toFixed(4);

      rec.massG = {};
      for (const [k, rho] of Object.entries(DENSITIES)) {
        rec.massG[k] = +(Math.abs(volCm3) * rho).toFixed(2);
      }
      rec.massG.printed_pla_35 = +(Math.abs(volCm3) * DENSITIES.pla * PRINT_INFILL).toFixed(2);

      /* Unit-density inertia scales as length⁵; then multiply by ρ for g·cm². */
      const iScale = s ** 5;
      const Ixx = mp.inertiaUnitDensity[0] * iScale;
      const Iyy = mp.inertiaUnitDensity[4] * iScale;
      const Izz = mp.inertiaUnitDensity[8] * iScale;
      const diag = [Ixx, Iyy, Izz].map((v) => +(Math.abs(v) * DENSITIES.abs).toFixed(4));
      rec.inertiaGcm2 = { Ixx: diag[0], Iyy: diag[1], Izz: diag[2], about: 'centre of mass, ABS density' };
      rec.inertiaSpinGcm2 = diag[spinAxis];

      const massAbs = Math.abs(volCm3) * DENSITIES.abs;
      rec.radiusOfGyrationCm =
        massAbs > 0 ? +Math.sqrt(rec.inertiaSpinGcm2 / massAbs).toFixed(4) : null;

      const ob = outboardRatio(tris, mp.com, spinAxis);
      rec.outboardMassRatio = +ob.ratio.toFixed(4);

      /* Sanity gate from the plan: a real plastic-gen part is ~40-60 mm across. */
      const diaMm = rec.outerRadiusCm * 2 * 10;
      if (diaMm < 20 || diaMm > 90) {
        rec.warnings.push(`implausible diameter ${diaMm.toFixed(1)} mm — check scale`);
      }
    } catch (e) {
      rec.warnings.push(`parse error: ${String(e.message).slice(0, 120)}`);
    }

    parts.push(rec);
  }

  process.stdout.write('\n\n');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify({ root: ROOT, generated: null, partCount: parts.length, parts }, null, 2),
  );
  console.log(`JSON  → ${OUT_JSON}`);
  console.log(`\n${summarise(parts)}`);
}

function summarise(parts) {
  const byType = new Map();
  for (const p of parts) byType.set(p.partType, (byType.get(p.partType) ?? 0) + 1);
  const dupes = parts.filter((p) => p.duplicateOf).length;
  const leaky = parts.filter((p) => p.watertight === false).length;
  const warned = parts.filter((p) => p.warnings.length).length;

  const lines = [
    `parts            : ${parts.length}`,
    `duplicates       : ${dupes}`,
    `non-watertight   : ${leaky}`,
    `with warnings    : ${warned}`,
    '',
    'by part type:',
    ...[...byType.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([t, n]) => `  ${t.padEnd(18)} ${n}`),
  ];
  return lines.join('\n');
}

main();
