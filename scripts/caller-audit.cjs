/* Who actually calls what.
 *
 * This project's documented failure mode is a system that is built, wired to
 * nothing, and indistinguishable from a working one. Five such systems were
 * already catalogued before this pass. This lists every module added for the
 * plan and counts references to it from OUTSIDE its own file, so "done" can
 * be separated from "reachable". */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.(ts|js)$/.test(p)) out.push(p);
  }
  return out;
}

const strip = (t) => t
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

const norm = (p) => p.split(path.sep).join('/');
const src = walk('src').map((f) => ({ p: norm(f), c: strip(fs.readFileSync(f, 'utf8')) }));

/* module path (no extension) -> a symbol that proves it is used.
 *
 * Pick a symbol the CALLERS actually name, not simply the most prominent
 * export. Three modules reported as orphans on an earlier run purely because
 * this table probed `resolveProjectiles`, `totalFieldAccel` and
 * `LocalStorageAdapter` while the call sites use `projectileHit`,
 * `fieldAccel` and `COLLECTIONS`. A false alarm here is as corrosive as a
 * missed one — it sends you rewiring something that was already wired. */
const MODULES = {
  'sim/step/spin':            'stepSpin',
  'sim/step/beyCollision':    'resolveBeyPairs',
  'sim/step/spinExchange':    'applySpinExchange',
  'sim/step/obstacles':       'resolveObstacleSide',
  'sim/step/channel':         'resolveChannel',
  'sim/step/movementPattern': 'patternDirection',
  'sim/step/railBlend':       'blendSteering',
  'sim/step/aerial':          'stepFlight',
  'sim/step/projectile':      'projectileHit',
  'sim/step/fieldForce':      'fieldAccel',
  'sim/step/partMutation':    'detachPart',
  'sim/step/surfaceState':    'sampleSurface',
  'sim/step/clones':          'stepClones',
  'sim/step/launch':          'launchOmega',
  'utils/easing':             'ease',
  'bey/assembler':            'assemble',
  'stores/StorageAdapter':    'COLLECTIONS',
  'systems/ComboDetector':    'ComboDetector',
  'systems/BattleGauges':     'chargeGauges',
  'systems/BeySystem':        'BeySystem',
  'systems/MatchSystem':      'MatchSystem',
  'systems/InputSystem':      'InputSystem',
  'systems/BeyHud':           'BeyHud',
  'systems/inputSources':     'KeyboardInputSource',
  'renderers/BeyRenderer':    'BeyRenderer',
  'render/postprocessing':    'mountComposer',
  'config/arenas/index':      'CS10_ARENAS',
};

let orphans = 0;
console.log('module'.padEnd(28) + 'refs  used by');
for (const [mod, sym] of Object.entries(MODULES)) {
  let n = 0;
  const where = new Set();
  const own = `src/${mod}.ts`;
  for (const { p, c } of src) {
    if (p === own) continue;
    const m = c.match(new RegExp(`\\b${sym}\\b`, 'g'));
    if (m) { n += m.length; where.add(path.basename(p)); }
  }
  if (n === 0) orphans++;
  console.log(mod.padEnd(28) + String(n).padStart(3) + '   ' +
    (n === 0 ? 'ORPHAN — nothing in src/ calls it' : [...where].slice(0, 3).join(', ')));
}
console.log(`\n${orphans} of ${Object.keys(MODULES).length} modules have no caller in src/.`);
console.log('(tests/ are not counted — a unit test proves the logic, not that the game uses it.)');
