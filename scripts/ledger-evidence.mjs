/* Regenerate the Ledger's Evidence column FROM THE CODE.
 *
 * The column exists so `MECH OK` is falsifiable: every row names the
 * mechanism's declaration and a live call site. Generated, never typed —
 * hand-written line numbers rot within a commit, and a status document that
 * nothing re-derives is a status document that lies.
 *
 *   node scripts/ledger-evidence.mjs            # rewrite the column
 *   node scripts/ledger-evidence.mjs --check    # fail if stale (CI)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : (extname(p) === '.ts' ? [p] : []);
});
const strip = (t) => t
  .replace(/\/\*[\s\S]*?\*\//g, (m) => '\n'.repeat((m.match(/\n/g) ?? []).length))
  .replace(/(^|[^:])\/\/.*$/gm, '$1');
const SRC = walk('src').map((f) => ({
  base: f.split(/[\\/]/).pop(),
  lines: strip(readFileSync(f, 'utf8')).split(/\r?\n/),
}));

const cache = new Map();
function ref(sym) {
  if (cache.has(sym)) return cache.get(sym);
  let decl = null;
  const declRx = [
    new RegExp('^export (?:async )?(?:function|const|class|interface) ' + sym + '\\b'),
    new RegExp('^\\s{2}(?:public |private )?' + sym + '\\s*\\('),
  ];
  outer: for (const rx of declRx) {
    for (const f of SRC) {
      const i = f.lines.findIndex((l) => rx.test(l));
      if (i >= 0) { decl = { base: f.base, line: i + 1 }; break outer; }
    }
  }
  if (!decl) { cache.set(sym, null); return null; }

  const word = new RegExp('\\b' + sym + '\\b');
  const call = new RegExp('\\b' + sym + '\\s*\\(');
  let best = null;
  for (const f of SRC) {
    if (f.base === decl.base) continue;
    for (let i = 0; i < f.lines.length; i++) {
      const l = f.lines[i];
      if (!word.test(l) || /^\s*(import|export)\b/.test(l)) continue;
      if (call.test(l) || l.includes('.' + sym)) {
        const r = '`' + decl.base + ':' + decl.line + '`<-`' + f.base + ':' + (i + 1) + '`';
        cache.set(sym, r);
        return r;
      }
      best ??= '`' + decl.base + ':' + decl.line + '`<-`' + f.base + ':' + (i + 1) + '`';
    }
  }
  if (!best) {
    /* A private method called inside its own file is wired, not orphaned.
       Treating cross-file reach as the only evidence reported 46 such rows as
       gaps — a measurement artifact, not a finding. */
    const own = SRC.find((f) => f.base === decl.base);
    const i = own ? own.lines.findIndex((l, n) =>
      n + 1 !== decl.line && new RegExp('(this\\.|\\b)' + sym + '\\s*\\(').test(l)) : -1;
    if (i >= 0) best = '`' + decl.base + ':' + decl.line + '`<-`' + decl.base + ':' + (i + 1) + '` (internal)';
  }
  const r = best ?? '`' + decl.base + ':' + decl.line + '` NO CALLER';
  cache.set(sym, r);
  return r;
}

/* Gap codes, from the Ledger's own key (Parts 12-14). */
const CODE = {
  C: 'resolveBeyPairs', I: 'composeInertia', D: 'spinDecayRate', T: 'tiltFromContact',
  M: 'shouldDeploy', B: 'applyBurstImpulse', P: 'projectileHit', Z: 'fieldAccel',
  J: 'stepFlight', E: 'getEffective', X: 'ComboDetector', L: 'stepLink',
  S: 'applySpinExchange', R: 'detachPart', A: 'bind', F: 'effectiveTipFriction',
  '[M]': 'applyAmplification',
};
/* Parts 1-11 name their mechanism in prose instead of a code. Ordered most
   specific first — a case about a tornado is a field case, not a contact case
   just because the word "force" appears in it. */
const RULES = [
  /* Loose balls first: these rows also say "ball" and "mass", which several
     later rules would otherwise claim for inertia or friction. */
  [/steel ball|ball pocket|pocket ball|ball race|ball retention|retention platform|migration timing|yin.?yang|CEW slot/i, 'stepLooseMass'],
  [/precess|wobble|nutation|topple|tilt|heavy.?top|gyroscop|sleep.?out|LAD|axis angle/i, 'tiltFromContact'],
  [/burst|ratchet|tooth|teeth|disengage/i, 'applyBurstImpulse'],
  [/stadium|arena|dish|bowl|zone|terrace|courtyard|pagoda|colosseum|cityscape|tower|trampoline/i, 'CS10_ARENAS'],
  [/wear|dent|deform|fatigue|sacrificial|stress|mold|wear.?in/i, 'applyWear'],
  [/magnet|polarity|attract|repel/i, 'magneticAccel'],
  [/clone|stroboscop|afterimage|mirage|decoy/i, 'makeClone'],
  [/power bar|cost tier|power unit|gauge|parameter grid|archetype|taxonomy|amplif|BeySpirit/i, 'applyAmplification'],
  [/counter.?spin|spin.?steal|spin direction|opposite spin|left.?spin|relative surface/i, 'applySpinExchange'],
  [/vortex|tornado|aura|field|aoe|shockwave|suction|whirl|gravity well/i, 'fieldAccel'],
  [/jump|aerial|flight|airborne|dive|ballistic|loop|centripetal/i, 'stepFlight'],
  [/projectile|bullet|cannon|satellite|beam/i, 'projectileHit'],
  [/detach|swap|morph|mutat|extend|part change|mode change|reorder/i, 'detachPart'],
  [/threshold|centrifugal|deploy|mode switch|clutch/i, 'shouldDeploy'],
  [/inertia|moment|mass distribution|annular|protrusion|fin|wheel|disc|ring|core|frame|armor|shell/i, 'composeInertia'],
  [/decay|stamina|spin.?down|duration|lifetime|outspin|endurance/i, 'spinDecayRate'],
  [/friction|\bmu\b|grip|tip|bottom|driver|contact patch|surface|bearing|free.?spin|roller|shaft/i, 'effectiveTipFriction'],
  [/combo|input|key|sequence|QTE|timing window|feint/i, 'ComboDetector'],
  [/launch|launcher|ripcord|winder|shoot|banking/i, 'launchOmega'],
  [/buff|debuff|stat|modifier|boost|penalt/i, 'getEffective'],
  [/cooperat|dual.?bey|alliance|link|formation|tandem/i, 'stepLink'],
  [/target|lock.?on|aim|track|predict/i, 'bind'],
  [/rail|groove|speed build|variable speed|ridge/i, 'blendSteering'],
  [/impulse|collision|contact|rebound|smash|recoil|deflect|parry|clash|hit|strike|impact|knock|push|force/i, 'resolveBeyPairs'],
];

function evidenceFor(codeCell, proseCell) {
  const out = [];
  const add = (sym) => {
    const r = ref(sym);
    if (r && !out.includes(r)) out.push(r);
  };
  for (const tk of codeCell.match(/\[M\]|geom|\b[A-Z]\b/g) ?? []) {
    if (tk === 'geom') { if (!out.includes('authorable')) out.push('authorable'); continue; }
    if (CODE[tk]) add(CODE[tk]);
  }
  if (out.length === 0) {
    for (const [rx, sym] of RULES) {
      if (rx.test(proseCell)) add(sym);
      if (out.length >= 2) break;
    }
  }
  return out.length ? out.join(' / ') : '-';
}

const PATH = 'case study/LEDGER.md';
const src = readFileSync(PATH, 'utf8');
const out = [];
let inTable = false;
let ncol = 0;
for (const line of src.split('\n')) {
  const t = line.trim();
  if (!t.startsWith('|')) { inTable = false; out.push(line); continue; }
  const cells = t.split('|').slice(1, -1).map((c) => c.trim());
  if (cells[0] && cells[0].toLowerCase().startsWith('case')) {
    inTable = true;
    if (cells[cells.length - 1] !== 'Evidence (file:line)') cells.push('Evidence (file:line)');
    ncol = cells.length;
    out.push('| ' + cells.join(' | ') + ' |');
    continue;
  }
  if (inTable && /^[\s\-:|]+$/.test(t)) {
    out.push('|' + Array(ncol).fill('---').join('|') + '|');
    continue;
  }
  if (inTable && /^\d+$/.test(cells[0]) && Number(cells[0]) >= 10 && cells.length >= ncol - 1) {
    const row = cells.slice(0, ncol - 1);
    /* The LAST cell of a row is the `After fix v2` verdict; the gap codes (or
       the prose evidence, in Parts 1-11) sit one to its left. Reading the
       verdict as the code cell is how a first pass produced blanket evidence
       derived from the status instead of from the mechanism. */
    const ev = evidenceFor(row[row.length - 2] ?? '', row.slice(1, -1).join(' '));
    out.push('| ' + row.concat(ev).join(' | ') + ' |');
    continue;
  }
  out.push(line);
}
const next = out.join('\n');

if (process.argv.includes('--check')) {
  if (next !== src) {
    console.error('LEDGER.md evidence column is STALE — run: node scripts/ledger-evidence.mjs');
    process.exit(1);
  }
  console.log('ledger evidence column is current');
} else {
  writeFileSync(PATH, next);
  const uncalled = (next.match(/NO CALLER/g) ?? []).length;
  const blank = (next.match(/\| - \|\s*$/gm) ?? []).length;
  console.log('evidence regenerated — ' + uncalled + ' rows cite an uncalled mechanism, ' + blank + ' blank');
}
