#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   REAL PART GEOMETRY — the local STL library, made browser-shaped.

   Procedural geometry will never look like a real Attack Ring. The library
   already holds 273 measured parts and `case study/stl-part-stats.json`
   carries a `file` path for every one of them, with `partType` and the full
   mass-properties set already attached. So part -> mesh is a LOOKUP, not a
   matching problem, and this script is the lookup plus the four corrections
   a print model needs before a browser can draw it.

   WHY EACH STEP IS HERE, because three of the four are non-obvious:

   1. WELD FIRST OR SIMPLIFICATION DOES NOTHING. An STL is a triangle SOUP —
      every triangle carries its own three vertices and no triangle shares a
      vertex with its neighbour, even where they are geometrically identical.
      An edge-collapse simplifier works on connectivity, and a soup has none,
      so it collapses nothing and returns the mesh unchanged. This is the
      trap: the pipeline appears to run, emits a file, and the file is still
      172,000 triangles.

   2. THESE ARE PRINT MODELS. 2,502 to 432,974 triangles, median 172,478 —
      sized for a slicer, not a GPU. A bey is several parts and a battle is
      several beys, so the budget is a few thousand triangles each.

   3. NORMALS MUST NOT BE FULLY SMOOTH. These are hard-surface mechanical
      parts. Averaging every normal at a shared vertex rounds off the blade
      edges that make an Attack Ring recognisable; emitting flat normals
      instead triples the vertex count. So vertices split only where the
      crease angle is genuinely sharp.

   4. UNITS AND POSE. The library is millimetres with a Z-up spin axis; this
      project is 1 unit = 1 CENTIMETRE with Y up. Both are recorded per entry
      (`units`, `spinAxis`), so neither is guessed.

   Output: `assets/beys/<partType>/<name>.glb` (served at `/beys/...` —
   `publicDir` is `assets/`), plus a generated catalogue and a coverage
   report naming every part that did NOT produce a mesh.

   Usage:  node scripts/build-bey-models.mjs [--limit N] [--tris N] [--force]
   ══════════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MeshoptSimplifier } from 'meshoptimizer';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

/** Where the print library lives. The stats index stores paths relative to it. */
const STL_ROOT = process.env.STL_ROOT ?? 'D:/3d prints';
const STATS = join(ROOT, 'case study', 'stl-part-stats.json');
const OUT_DIR = join(ROOT, 'assets', 'beys');
const CATALOGUE_TS = join(ROOT, 'src', 'config', 'beys', 'models.generated.ts');
const COVERAGE = join(OUT_DIR, '_coverage.json');

/** Triangle budget per part. A bey is 3-5 of these and a battle is several beys. */
const DEFAULT_TARGET_TRIS = 4000;

/**
 * Crease angle for splitting normals, degrees.
 *
 * 40 deg keeps a cylinder smooth (its facets are a few degrees apart at any
 * reasonable tessellation) while keeping a blade edge sharp. Lower and the
 * curved shells facet visibly; higher and the parts go soft.
 */
const CREASE_DEG = 40;

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : dflt;
};
const LIMIT = flag('--limit', Infinity);
const TARGET_TRIS = flag('--tris', DEFAULT_TARGET_TRIS);
const FORCE = args.includes('--force');

/* ── STL parsing ─────────────────────────────────────────────────────────── */

/**
 * Read an STL into a flat triangle-soup position array.
 *
 * Both encodings appear in the library and the stats index records which
 * (`format`), but sniffing is still safer than trusting it: an ASCII file
 * parsed as binary yields a garbage triangle count in the hundreds of
 * millions and an immediate out-of-memory, which is a terrible way to find
 * out the field was stale.
 */
function readStl(buf) {
  /* EXACT MATCH ONLY. The first version fell back to "not starting with
     `solid` means binary", and 20 of the 273 library entries are OBJ files —
     the index says so in `format`, and I did not read it. An OBJ parsed as
     binary STL reads four arbitrary text bytes as a triangle count, asks for
     a Float32Array of a few hundred million entries, and dies with "Array
     buffer allocation failed". It presented as an out-of-memory problem and
     was a file-format problem; the first fix, rewriting the welder to use
     typed arrays, was a real improvement that changed nothing here.

     So: binary only when the layout equation holds exactly, and every other
     case is sniffed from its actual content. */
  const isBinary = buf.length >= 84 && 84 + buf.readUInt32LE(80) * 50 === buf.length;

  if (isBinary) {
    const tris = buf.readUInt32LE(80);
    const pos = new Float32Array(tris * 9);
    let o = 84, p = 0;
    for (let i = 0; i < tris; i++) {
      o += 12;                                   // skip the face normal
      for (let v = 0; v < 9; v++) { pos[p++] = buf.readFloatLE(o); o += 4; }
      o += 2;                                    // attribute byte count
    }
    return pos;
  }

  const text = buf.toString('utf8');

  if (/^\s*solid/.test(text) && /facet\s+normal/.test(text)) {
    const nums = [];
    const re = /vertex\s+(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)/g;
    let m;
    while ((m = re.exec(text))) nums.push(+m[1], +m[2], +m[3]);
    return Float32Array.from(nums);
  }

  if (/^\s*(v|vn|vt|f|o|g|mtllib)\s/m.test(text)) return readObj(text);

  throw new Error('unrecognised mesh format');
}

/**
 * Wavefront OBJ -> triangle soup.
 *
 * Expanded to a soup rather than kept indexed so the rest of the pipeline has
 * one input shape; `weld` re-indexes it a step later anyway, and an OBJ's
 * own indexing is per-attribute (`v/vt/vn`) rather than per-vertex, so it is
 * not directly usable as a position index.
 *
 * Handles the three things real files do that a minimal parser misses:
 * N-GONS (triangulated as a fan — Blender exports quads by default), NEGATIVE
 * indices (relative to the end of the vertex list, which is legal and silently
 * produces garbage geometry if read as positive), and `v/vt/vn` triples where
 * only the first field is the position.
 */
function readObj(text) {
  const vx = [], vy = [], vz = [];
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    if (line.charCodeAt(0) === 118 /* v */ && line[1] === ' ') {
      const p = line.split(/\s+/);
      vx.push(+p[1]); vy.push(+p[2]); vz.push(+p[3]);
    } else if (line.charCodeAt(0) === 102 /* f */ && line[1] === ' ') {
      const p = line.trim().split(/\s+/).slice(1);
      const idx = p.map(tok => {
        let i = parseInt(tok, 10);
        if (Number.isNaN(i)) return -1;
        return i < 0 ? vx.length + i : i - 1;
      }).filter(i => i >= 0 && i < vx.length);
      for (let k = 1; k + 1 < idx.length; k++) {
        for (const i of [idx[0], idx[k], idx[k + 1]]) out.push(vx[i], vy[i], vz[i]);
      }
    }
  }
  return Float32Array.from(out);
}

/* ── Welding ─────────────────────────────────────────────────────────────── */

/**
 * Soup -> indexed mesh, merging vertices that coincide.
 *
 * Quantised to a grid before hashing. Exact float equality fails here: a
 * slicer-exported STL writes the same corner from two triangles with values
 * that differ in the last bit, so an exact match welds almost nothing and
 * step 1's whole purpose is lost. The grid is 1e-4 of the model's longest
 * side, far below any printable feature.
 */
function weld(pos) {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < pos.length; i += 3) {
    if (pos[i] < minX) minX = pos[i];       if (pos[i] > maxX) maxX = pos[i];
    if (pos[i + 1] < minY) minY = pos[i + 1]; if (pos[i + 1] > maxY) maxY = pos[i + 1];
    if (pos[i + 2] < minZ) minZ = pos[i + 2]; if (pos[i + 2] > maxZ) maxZ = pos[i + 2];
  }
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
  const q = span * 1e-4;

  /* SORT, DON'T HASH. The obvious implementation keys a Map on
     `"${qx},${qy},${qz}"`, and it works right up until it doesn't: the
     largest parts here are 432,974 triangles, so that Map holds 1.3 million
     distinct STRINGS, and 21 of the 202 parts died with "Array buffer
     allocation failed" before the simplifier ever saw them. Quantised
     coordinates in an Int32Array, an index permutation sorted over them, and
     a single scan to number the runs costs a few megabytes flat. */
  const n = pos.length / 3;
  const qc = new Int32Array(pos.length);
  for (let i = 0; i < pos.length; i++) qc[i] = Math.round(pos[i] / q);

  const order = new Uint32Array(n);
  for (let i = 0; i < n; i++) order[i] = i;
  /* Uint32Array.sort takes a comparator and sorts in place numerically. */
  const cmp = (a, b) =>
    (qc[a * 3] - qc[b * 3]) || (qc[a * 3 + 1] - qc[b * 3 + 1]) || (qc[a * 3 + 2] - qc[b * 3 + 2]);
  order.sort(cmp);

  const idx = new Uint32Array(n);
  const outX = new Float32Array(n), outY = new Float32Array(n), outZ = new Float32Array(n);
  let unique = 0;
  for (let k = 0; k < n; k++) {
    const v = order[k];
    const isNew = k === 0 || cmp(order[k - 1], v) !== 0;
    if (isNew) {
      outX[unique] = pos[v * 3]; outY[unique] = pos[v * 3 + 1]; outZ[unique] = pos[v * 3 + 2];
      unique++;
    }
    idx[v] = unique - 1;
  }

  const positions = new Float32Array(unique * 3);
  for (let i = 0; i < unique; i++) {
    positions[i * 3] = outX[i]; positions[i * 3 + 1] = outY[i]; positions[i * 3 + 2] = outZ[i];
  }
  return { positions, indices: idx, bounds: { minX, minY, minZ, maxX, maxY, maxZ } };
}

/* ── Normals ─────────────────────────────────────────────────────────────── */

/**
 * Smooth normals that keep hard edges, by splitting vertices per crease.
 *
 * Each vertex accumulates one normal per CLUSTER of adjacent faces whose
 * directions agree within the crease angle. A vertex in the middle of a
 * curved shell ends with one cluster and stays welded; a vertex on a blade
 * edge ends with two and is duplicated, so the edge renders sharp.
 */
function creaseNormals(positions, indices, creaseDeg) {
  const cosLimit = Math.cos(creaseDeg * Math.PI / 180);
  const clusters = new Map();          // vertex -> [{ nx,ny,nz, out }]
  const outPos = [], outNrm = [];
  const outIdx = new Uint32Array(indices.length);

  const faceN = (a, b, c) => {
    const ax = positions[a * 3], ay = positions[a * 3 + 1], az = positions[a * 3 + 2];
    const ux = positions[b * 3] - ax, uy = positions[b * 3 + 1] - ay, uz = positions[b * 3 + 2] - az;
    const vx = positions[c * 3] - ax, vy = positions[c * 3 + 1] - ay, vz = positions[c * 3 + 2] - az;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    /* NOT normalised away: the length is twice the triangle area, and keeping
       it area-weights the average. Normalising first lets a sliver triangle
       pull a vertex normal as hard as the large face it sits beside. */
    return [nx, ny, nz, len];
  };

  for (let f = 0; f < indices.length; f += 3) {
    const a = indices[f], b = indices[f + 1], c = indices[f + 2];
    const [nx, ny, nz, len] = faceN(a, b, c);
    const ux = nx / len, uy = ny / len, uz = nz / len;

    for (const [corner, slot] of [[a, f], [b, f + 1], [c, f + 2]]) {
      let list = clusters.get(corner);
      if (!list) clusters.set(corner, (list = []));
      let hit = null;
      for (const cl of list) {
        const cLen = Math.hypot(cl.nx, cl.ny, cl.nz) || 1;
        if ((cl.nx * ux + cl.ny * uy + cl.nz * uz) / cLen >= cosLimit) { hit = cl; break; }
      }
      if (!hit) {
        hit = { nx: 0, ny: 0, nz: 0, out: outPos.length / 3 };
        list.push(hit);
        outPos.push(positions[corner * 3], positions[corner * 3 + 1], positions[corner * 3 + 2]);
        outNrm.push(0, 0, 0);
      }
      hit.nx += nx; hit.ny += ny; hit.nz += nz;
      outIdx[slot] = hit.out;
    }
  }

  for (const list of clusters.values()) {
    for (const cl of list) {
      const len = Math.hypot(cl.nx, cl.ny, cl.nz) || 1;
      outNrm[cl.out * 3] = cl.nx / len;
      outNrm[cl.out * 3 + 1] = cl.ny / len;
      outNrm[cl.out * 3 + 2] = cl.nz / len;
    }
  }
  return { positions: Float32Array.from(outPos), normals: Float32Array.from(outNrm), indices: outIdx };
}

/* ── GLB writing ─────────────────────────────────────────────────────────── */

const GLB_MAGIC = 0x46546c67, GLB_JSON = 0x4e4f534a, GLB_BIN = 0x004e4942;
const pad4 = n => (n + 3) & ~3;

/**
 * Write a single-mesh GLB by hand.
 *
 * Deliberately not `GLTFExporter`: that lives in three's examples, expects a
 * DOM for its texture path, and this needs positions, normals and indices and
 * nothing else. Hand-writing the container is about sixty lines and removes
 * a browser-shaped dependency from a build script.
 */
function writeGlb(path, { positions, normals, indices }, name) {
  const useU32 = positions.length / 3 > 65535;
  const idx = useU32 ? Uint32Array.from(indices) : Uint16Array.from(indices);

  const parts = [
    { data: Buffer.from(idx.buffer, idx.byteOffset, idx.byteLength), target: 34963 },
    { data: Buffer.from(positions.buffer, positions.byteOffset, positions.byteLength), target: 34962 },
    { data: Buffer.from(normals.buffer, normals.byteOffset, normals.byteLength), target: 34962 },
  ];
  const views = [];
  let offset = 0;
  for (const p of parts) {
    views.push({ buffer: 0, byteOffset: offset, byteLength: p.data.length, target: p.target });
    offset = pad4(offset + p.data.length);
  }
  const bin = Buffer.alloc(offset);
  let at = 0;
  for (const p of parts) { p.data.copy(bin, at); at = pad4(at + p.data.length); }

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    if (positions[i] < minX) minX = positions[i];       if (positions[i] > maxX) maxX = positions[i];
    if (positions[i + 1] < minY) minY = positions[i + 1]; if (positions[i + 1] > maxY) maxY = positions[i + 1];
    if (positions[i + 2] < minZ) minZ = positions[i + 2]; if (positions[i + 2] > maxZ) maxZ = positions[i + 2];
  }

  const gltf = {
    asset: { version: '2.0', generator: 'build-bey-models.mjs' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name }],
    meshes: [{ name, primitives: [{ attributes: { POSITION: 1, NORMAL: 2 }, indices: 0, material: 0 }] }],
    /* A neutral PBR material, because a part's colour belongs to the ASSEMBLY
       that uses it, not to the geometry: the same Attack Ring mould ships in
       a dozen colourways across the line. The renderer tints a clone. */
    materials: [{
      name: 'part',
      pbrMetallicRoughness: { baseColorFactor: [0.82, 0.84, 0.88, 1], metallicFactor: 0.15, roughnessFactor: 0.55 },
    }],
    buffers: [{ byteLength: bin.length }],
    bufferViews: views,
    accessors: [
      { bufferView: 0, componentType: useU32 ? 5125 : 5123, count: idx.length, type: 'SCALAR' },
      {
        bufferView: 1, componentType: 5126, count: positions.length / 3, type: 'VEC3',
        min: [minX, minY, minZ], max: [maxX, maxY, maxZ],
      },
      { bufferView: 2, componentType: 5126, count: normals.length / 3, type: 'VEC3' },
    ],
  };

  const json = Buffer.from(JSON.stringify(gltf), 'utf8');
  const jsonPad = Buffer.alloc(pad4(json.length) - json.length, 0x20);   // spaces
  const binPad = Buffer.alloc(pad4(bin.length) - bin.length, 0);
  const jsonLen = json.length + jsonPad.length;
  const binLen = bin.length + binPad.length;

  const header = Buffer.alloc(12);
  header.writeUInt32LE(GLB_MAGIC, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonLen + 8 + binLen, 8);
  const jsonHdr = Buffer.alloc(8);
  jsonHdr.writeUInt32LE(jsonLen, 0); jsonHdr.writeUInt32LE(GLB_JSON, 4);
  const binHdr = Buffer.alloc(8);
  binHdr.writeUInt32LE(binLen, 0); binHdr.writeUInt32LE(GLB_BIN, 4);

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Buffer.concat([header, jsonHdr, json, jsonPad, binHdr, bin, binPad]));
  return 12 + 8 + jsonLen + 8 + binLen;
}

/* ── Pose and scale ──────────────────────────────────────────────────────── */

/**
 * Put the part in project space: centimetres, Y up, spin axis vertical,
 * centred on that axis with its base at y = 0.
 *
 * The rotation is driven by the entry's recorded `spinAxis` rather than
 * guessed from the bounding box. A weight disc is wider than it is tall on
 * every axis ordering, so "the short axis is the spin axis" is right often
 * enough to look correct and wrong exactly on the parts that matter — a tall
 * Blade Base would be laid on its side.
 */
function toProjectSpace(positions, { units, spinAxis }) {
  const s = units === 'mm' ? 0.1 : units === 'm' ? 100 : 1;   // -> centimetres
  const out = new Float32Array(positions.length);
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i] * s, y = positions[i + 1] * s, z = positions[i + 2] * s;
    if (spinAxis === 'z')      { out[i] = x;  out[i + 1] = z;  out[i + 2] = -y; }
    else if (spinAxis === 'x') { out[i] = -y; out[i + 1] = x;  out[i + 2] = z;  }
    else                       { out[i] = x;  out[i + 1] = y;  out[i + 2] = z;  }
  }
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < out.length; i += 3) {
    if (out[i] < minX) minX = out[i];       if (out[i] > maxX) maxX = out[i];
    if (out[i + 1] < minY) minY = out[i + 1]; if (out[i + 1] > maxY) maxY = out[i + 1];
    if (out[i + 2] < minZ) minZ = out[i + 2]; if (out[i + 2] > maxZ) maxZ = out[i + 2];
  }
  const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
  for (let i = 0; i < out.length; i += 3) {
    out[i] -= cx; out[i + 1] -= minY; out[i + 2] -= cz;
  }
  return { positions: out, heightCm: maxY - minY, radiusCm: Math.max(maxX - minX, maxZ - minZ) / 2 };
}

/* ── Main ────────────────────────────────────────────────────────────────── */

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function main() {
  await MeshoptSimplifier.ready;

  const stats = JSON.parse(readFileSync(STATS, 'utf8'));
  /* Named key, not `Object.values(...)[0]`. The index is an object whose
     first value is the string `root`, so the positional form quietly read 12
     characters as 12 entries and reported "skipped 12, built 0" — a plausible
     enough number to be mistaken for a real result. */
  const all = Array.isArray(stats) ? stats : stats.parts;
  if (!Array.isArray(all)) throw new Error('stl-part-stats.json has no `parts` array');
  /* The index's own `root` is where the library lived when it was measured;
     prefer it over the hardcoded default so a moved library needs no edit. */
  const stlRoot = process.env.STL_ROOT ?? stats.root ?? STL_ROOT;
  console.log(`${all.length} indexed parts, library at ${stlRoot}`);

  const built = [], skipped = [];
  let n = 0;

  for (const e of all) {
    if (n >= LIMIT) break;
    /* NON-WATERTIGHT PARTS ARE SKIPPED, LOUDLY. A mesh with holes has no
       consistent interior, so edge collapses can punch straight through a
       shell and leave a part that renders inside-out in places. 71 of the 273
       are in this state; they are reported, not silently dropped, because a
       missing part should be a visible gap in the catalogue. */
    if (!e.watertight) { skipped.push({ name: e.name, partType: e.partType, reason: 'not watertight' }); continue; }

    const src = join(stlRoot, e.file);
    if (!existsSync(src)) { skipped.push({ name: e.name, partType: e.partType, reason: 'source file missing' }); continue; }

    const id = slug(e.name);
    const rel = `${e.partType}/${id}.glb`;
    const dest = join(OUT_DIR, rel);
    if (!FORCE && existsSync(dest)) {
      const st = statSync(dest);
      built.push({ id, name: e.name, partType: e.partType, url: `/beys/${rel}`, bytes: st.size, cached: true });
      n++;
      continue;
    }

    try {
      const soup = readStl(readFileSync(src));
      if (soup.length < 9) { skipped.push({ name: e.name, partType: e.partType, reason: 'no triangles parsed' }); continue; }

      const posed = toProjectSpace(soup, e);
      const welded = weld(posed.positions);

      const targetIdx = Math.min(welded.indices.length, TARGET_TRIS * 3);
      /* `1` is the error LIMIT, not a target: meshopt stops when it reaches
         the index count OR the error bound, whichever comes first. A tight
         bound here would silently leave parts at 100k triangles. */
      const simplified = MeshoptSimplifier.simplify(
        welded.indices, welded.positions, 3, targetIdx, 1,
      )[0];

      const final = creaseNormals(welded.positions, simplified, CREASE_DEG);
      const bytes = writeGlb(dest, final, e.name);

      built.push({
        id, name: e.name, partType: e.partType, url: `/beys/${rel}`, bytes,
        srcTris: soup.length / 9, tris: final.indices.length / 3,
        heightCm: +posed.heightCm.toFixed(3), radiusCm: +posed.radiusCm.toFixed(3),
        massG: e.massG?.abs ?? null, inertiaSpinGcm2: e.inertiaSpinGcm2 ?? null,
      });
      n++;
      if (n % 25 === 0) console.log(`  ${n} built...`);
    } catch (err) {
      skipped.push({ name: e.name, partType: e.partType, reason: String(err.message || err) });
    }
  }

  built.sort((a, b) => (a.partType + a.id).localeCompare(b.partType + b.id));

  const byType = {};
  for (const b of built) byType[b.partType] = (byType[b.partType] ?? 0) + 1;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(COVERAGE, JSON.stringify({
    generated: built.length, skipped: skipped.length, byType, skippedDetail: skipped,
  }, null, 2));

  mkdirSync(dirname(CATALOGUE_TS), { recursive: true });
  const rows = built.map(b =>
    `  { id: '${b.id}', partType: '${b.partType}', url: '${b.url}', label: ${JSON.stringify(b.name)}, ` +
    `heightCm: ${b.heightCm ?? 0}, radiusCm: ${b.radiusCm ?? 0}, massG: ${b.massG ?? 'null'}, ` +
    `inertiaSpinGcm2: ${b.inertiaSpinGcm2 ?? 'null'} },`).join('\n');

  writeFileSync(CATALOGUE_TS, `/* GENERATED by scripts/build-bey-models.mjs — do not edit by hand.
 *
 * Regenerate with: node scripts/build-bey-models.mjs
 *
 * ${built.length} parts decimated from the local print library to a few
 * thousand triangles each, in project space: centimetres, Y up, spin axis
 * vertical, base at y = 0.
 *
 * THE GLB FILES ARE NOT IN GIT. They are build output under \`assets/beys/\`,
 * and that is a SIZE decision — the sources are 5.1 GB of print models and
 * even decimated the set is far past a sane bundle. A clone without them
 * still runs: \`AssetRegistry.load()\` returns null rather than throwing, and
 * the caller falls back to procedural geometry. Run the script to get them.
 *
 * Measurements come from \`case study/stl-part-stats.json\` — the same source
 * the physics reads — so a model and its mass properties cannot drift apart.
 */

export interface BeyPartModel {
  /** Stable slug of the part name. */
  id: string;
  /** Slot family from the STL analysis: attack_ring, blade_base, tip, ... */
  partType: string;
  /** Served path. \`publicDir\` is \`assets/\`, so \`/beys/...\`. */
  url: string;
  label: string;
  /** Measured extents of the decimated mesh, centimetres. */
  heightCm: number;
  radiusCm: number;
  /** ABS mass and spin inertia from the measured volume. Null if unknown. */
  massG: number | null;
  inertiaSpinGcm2: number | null;
}

export const BEY_PART_MODELS: readonly BeyPartModel[] = [
${rows}
];

/** Lookup by slug. */
export const BEY_PART_MODEL_BY_ID: ReadonlyMap<string, BeyPartModel> =
  new Map(BEY_PART_MODELS.map(m => [m.id, m]));
`);

  const totalMb = built.reduce((s, b) => s + b.bytes, 0) / 1e6;
  console.log(`\nbuilt ${built.length} models (${totalMb.toFixed(1)} MB), skipped ${skipped.length}`);
  console.log('by type:', JSON.stringify(byType));
  const reasons = {};
  for (const s of skipped) reasons[s.reason] = (reasons[s.reason] ?? 0) + 1;
  console.log('skip reasons:', JSON.stringify(reasons));
  console.log(`catalogue -> ${CATALOGUE_TS}`);
  console.log(`coverage  -> ${COVERAGE}`);
}

main().catch(err => { console.error(err); process.exit(1); });
