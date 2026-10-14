/**
 * create-demo-arena.js
 *
 * Puppeteer script that builds the Black Sea Bowl demo arena step-by-step
 * through the Arena Sandbox UI.
 *
 * Arena layout (radial zones from center):
 *   pit(r=5) — lake(r=75) — road(20cm) — bank(5cm) — shore(20cm) — wall(r=120)
 *
 * Features:
 *   - Black Sea Bowl: circle, r=120cm, depth=22cm, posY=0 (dug-in, flush with base)
 *   - Step wall profile: 4 steps (wallprofile-arena-1 sub-node)
 *   - Whirlpool Eye pit (r=5cm, centered)
 *   - Black Sea water zone (r=75cm, depth=6cm)
 *   - City Perimeter wall (crenellated, h=8cm, 60° panels + 120° gaps)
 *   - Whirlpool Current speed line (spiral_in, r=70, periodic)
 *   - Whirlpool gravity_pull trap (dim=150cm, periodic)
 *   - 4 piers (freepoint at lake edge r=75, heading inward to r=25)
 *   - 8 boats (floating obstacles, boat theme — create 1 + duplicate 7)
 *   - 4 city towers (shore ring r≈110, posY=31 — create 1 + duplicate 3)
 *   - Drifting Fleet rotation (boats 5,6,7)
 *
 * Prerequisites:
 *   npm run dev   (server on port 3000)
 *   npm run demo  (runs this script)
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'demo-arena');

const BASE_URL = 'http://localhost:3000';
const STEP_DELAY = 500;
const NAV_TIMEOUT = 20000;

let _shotIndex = 0;

function ensureScreenshotsDir() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function screenshot(page, label) {
  _shotIndex++;
  const safe = label.replace(/[^a-zA-Z0-9_\-]/g, '_').toLowerCase();
  const filename = `${String(_shotIndex).padStart(3, '0')}_${safe}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  try {
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`  📸 ${filename}`);
  } catch (e) {
    console.warn(`  [warn] screenshot failed (${filename}): ${e.message.slice(0, 80)}`);
  }
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function waitForNode(page, nodeId, timeout = 10000) {
  await page.waitForSelector(`.tree-node[data-id="${nodeId}"]`, { timeout });
  await sleep(150);
}

async function selectNode(page, nodeId) {
  await page.click(`.tree-node[data-id="${nodeId}"] .tree-node-row`);
  await sleep(STEP_DELAY);
}

async function clickAddBtn(page, nodeId) {
  await page.click(`.tree-node[data-id="${nodeId}"] .tree-add-btn`);
  await sleep(250);
}

async function clickMenuOption(page, labelText) {
  const clicked = await page.evaluate((lbl) => {
    const items = [...document.querySelectorAll('.tree-add-menu .tree-ctx-item')];
    for (const item of items) {
      if ((item.textContent?.trim() ?? '') === lbl) {
        item.click();
        return true;
      }
    }
    const texts = items.map(i => i.textContent?.trim());
    return { notFound: true, texts };
  }, labelText);
  if (!clicked || clicked.notFound) {
    console.warn(`  [skip] menu option not found: "${labelText}"`, clicked?.texts ? JSON.stringify(clicked.texts) : '');
  }
  await sleep(STEP_DELAY);
}

async function waitForProps(page) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector('.prop-empty');
      return !el || el.style.display === 'none' || el.offsetParent === null;
    },
    { timeout: 6000 },
  );
  await sleep(200);
}

const normLabel = s => s.replace(/\s+/g, ' ').trim();

async function setPropNum(page, labelText, value, occurrence = 0) {
  const norm = normLabel(labelText);
  const found = await page.evaluate((lbl, val, occ) => {
    const rows = [...document.querySelectorAll('.prop-row')];
    let count = 0;
    for (const row of rows) {
      const label = row.querySelector('.prop-label');
      if (!label) continue;
      const t = (label.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (t !== lbl) continue;
      const numInput = row.querySelector('input.prop-input');
      if (!numInput) continue;
      if (numInput.offsetParent === null) continue;
      if (count < occ) { count++; continue; }
      numInput.value = String(val);
      numInput.dispatchEvent(new Event('input', { bubbles: true }));
      const slider = row.querySelector('input[type="range"]');
      if (slider) {
        slider.value = String(val);
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        numInput.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      }
      return true;
    }
    return false;
  }, norm, value, occurrence);
  if (!found) console.warn(`  [skip] num row not found or hidden (occ=${occurrence}): "${labelText}"`);
  await sleep(250);
}

async function setPropText(page, labelText, value) {
  const norm = normLabel(labelText);
  const found = await page.evaluate((lbl, val) => {
    const rows = [...document.querySelectorAll('.prop-row')];
    for (const row of rows) {
      const label = row.querySelector('.prop-label');
      if (!label) continue;
      if ((label.textContent ?? '').replace(/\s+/g, ' ').trim() !== lbl) continue;
      const inp = row.querySelector('input[type="text"], input:not([type="color"]):not([type="number"])');
      if (!inp || inp.offsetParent === null) continue;
      inp.value = val;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }, norm, value);
  if (!found) console.warn(`  [skip] text row not found: "${labelText}"`);
  await sleep(200);
}

async function setPropSelect(page, labelText, optionValue, occurrence = 0) {
  const norm = normLabel(labelText);
  const found = await page.evaluate((lbl, val, occ) => {
    const rows = [...document.querySelectorAll('.prop-row')];
    let count = 0;
    for (const row of rows) {
      const label = row.querySelector('.prop-label');
      if (!label) continue;
      const t = (label.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (t !== lbl) continue;
      if (count < occ) { count++; continue; }
      const sel = row.querySelector('select');
      if (!sel) continue;
      sel.value = val;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }, norm, optionValue, occurrence);
  if (!found) console.warn(`  [skip] select row not found (occ=${occurrence}): "${labelText}"`);
  await sleep(200);
}

async function setPropColor(page, labelText, hex) {
  const norm = normLabel(labelText);
  const found = await page.evaluate((lbl, v) => {
    const rows = [...document.querySelectorAll('.prop-row')];
    for (const row of rows) {
      const label = row.querySelector('.prop-label');
      if (!label) continue;
      if ((label.textContent ?? '').replace(/\s+/g, ' ').trim() !== lbl) continue;
      const inp = row.querySelector('input[type="color"]');
      if (!inp) continue;
      inp.value = v;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  }, norm, hex);
  if (!found) console.warn(`  [skip] color row not found: "${labelText}"`);
  await sleep(200);
}

async function setPropToggle(page, labelText, on) {
  const norm = normLabel(labelText);
  const result = await page.evaluate((lbl, wantOn) => {
    const rows = [...document.querySelectorAll('.prop-row')];
    for (const row of rows) {
      const label = row.querySelector('.prop-label');
      if (!label) continue;
      const t = (label.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (t !== lbl) continue;
      const btn = row.querySelector('.prop-profile-btn');
      if (!btn) return { found: false, reason: 'no btn in row' };
      const isActive = btn.classList.contains('active');
      if (isActive !== wantOn) btn.click();
      return { found: true };
    }
    const allLabels = [...document.querySelectorAll('.prop-label')].map(el => el.textContent?.trim());
    return { found: false, reason: 'row not found', labels: allLabels.slice(0, 20) };
  }, norm, on);
  if (!result.found) {
    console.warn(`  [skip] toggle row not found: "${labelText}"`, result.reason,
      result.labels ? `labels=${JSON.stringify(result.labels)}` : '');
  }
  await sleep(200);
}

/** Click a .prop-profile-btn by text (material/profile buttons). */
async function clickProfileBtn(page, btnText) {
  const clicked = await page.evaluate((text) => {
    const btns = [...document.querySelectorAll('.prop-profile-btn')];
    for (const btn of btns) {
      if ((btn.textContent ?? '').trim() === text) {
        btn.click();
        return true;
      }
    }
    return false;
  }, btnText);
  if (!clicked) console.warn(`  [skip] profile btn not found: "${btnText}"`);
  await sleep(300);
}

async function clickProfileBtnAt(page, btnText, occurrence = 0) {
  const clicked = await page.evaluate((text, occ) => {
    const btns = [...document.querySelectorAll('.prop-profile-btn')];
    let count = 0;
    for (const btn of btns) {
      if ((btn.textContent ?? '').trim() === text) {
        if (count === occ) { btn.click(); return true; }
        count++;
      }
    }
    return false;
  }, btnText, occurrence);
  if (!clicked) console.warn(`  [skip] profile btn not found (occ=${occurrence}): "${btnText}"`);
  await sleep(300);
}

/** Click a .prop-surface-btn by text (surface texture buttons use a different CSS class). */
async function clickSurfaceBtn(page, text) {
  const clicked = await page.evaluate((t) => {
    const btns = [...document.querySelectorAll('.prop-surface-btn')];
    for (const btn of btns) {
      if ((btn.textContent ?? '').trim() === t) { btn.click(); return true; }
    }
    return false;
  }, text);
  if (!clicked) console.warn(`  [skip] surface btn not found: "${text}"`);
  await sleep(300);
}

/**
 * Right-click a tree node to open context menu, then click "Duplicate".
 * After this call the duplicate node will have the next seq ID.
 */
async function duplicateNode(page, nodeId) {
  const found = await page.evaluate((id) => {
    const row = document.querySelector(`.tree-node[data-id="${id}"] .tree-node-row`);
    if (!row) return false;
    row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    return true;
  }, nodeId);
  if (!found) { console.warn(`  [skip] contextmenu node not found: ${nodeId}`); return; }
  await sleep(400);
  const clicked = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.tree-ctx-item')];
    const dup = items.find(i => (i.textContent?.trim() ?? '') === 'Duplicate');
    if (dup) { dup.click(); return true; }
    return false;
  });
  if (!clicked) console.warn(`  [skip] Duplicate option not found in context menu`);
  await sleep(500);
}

/** Click a .prop-shape-btn (opening shapes, segment types) by its label span text. */
async function clickShapeBtn(page, label) {
  await page.waitForFunction(
    () => document.querySelectorAll('.prop-shape-btn').length > 0,
    { timeout: 5000 },
  ).catch(() => {});

  const result = await page.evaluate((lbl) => {
    const btns = [...document.querySelectorAll('.prop-shape-btn')];
    for (const btn of btns) {
      const spans = btn.querySelectorAll('span');
      const lastSpan = spans[spans.length - 1];
      if (lastSpan && lastSpan.textContent?.trim() === lbl) {
        btn.click();
        return { found: true, count: btns.length };
      }
    }
    for (const btn of btns) {
      if ((btn.textContent ?? '').includes(lbl)) {
        btn.click();
        return { found: true, count: btns.length, fallback: true };
      }
    }
    return { found: false, count: btns.length, texts: btns.map(b => b.textContent?.trim()) };
  }, label);

  if (!result.found) {
    console.warn(`  [skip] shape btn not found: "${label}" (${result.count} btns: ${JSON.stringify(result.texts)})`);
  }
  await sleep(300);
}

async function clickFillBtn(page, fillName) {
  await page.waitForFunction(
    () => document.querySelectorAll('.prop-fill-btn').length > 0,
    { timeout: 5000 },
  ).catch(() => {});

  const FILLS = ['water', 'lava', 'swamp', 'poison', 'sand', 'ice', 'void', 'custom'];
  const idx = FILLS.indexOf(fillName);
  const result = await page.evaluate((f, i) => {
    const btns = [...document.querySelectorAll('.prop-fill-btn')];
    for (const btn of btns) {
      const t = (btn.textContent ?? '').trim().toLowerCase();
      if (t === f || t.includes(f)) { btn.click(); return { ok: true }; }
    }
    if (i >= 0 && btns[i]) { btns[i].click(); return { ok: true, byIndex: true }; }
    return { ok: false, count: btns.length, texts: btns.map(b => b.textContent?.trim()) };
  }, fillName, idx);
  if (!result.ok) console.warn(`  [skip] fill btn not found: "${fillName}" (${result.count} btns: ${JSON.stringify(result.texts)})`);
  await sleep(300);
}

async function checkTreeNode(page, nodeId, checked = true) {
  const found = await page.evaluate((id, want) => {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (!node) return false;
    const chk = node.querySelector('.tree-chk');
    if (!chk) return false;
    const isChecked = chk.checked || chk.classList.contains('checked');
    if (isChecked !== want) chk.click();
    return true;
  }, nodeId, checked);
  if (!found) console.warn(`  [skip] tree-chk not found for ${nodeId}`);
  await sleep(150);
}

async function confirmDialog(page, yesText = null) {
  await page.waitForSelector('.dialog-modal, .game-confirm', { timeout: 5000 }).catch(() => {});
  await page.evaluate((t) => {
    const btns = [...document.querySelectorAll('.dialog-modal button, .game-confirm button')];
    const btn = t
      ? btns.find(b => b.textContent?.trim().toLowerCase().includes(t.toLowerCase()))
      : btns[0];
    if (btn) btn.click();
  }, yesText);
  await sleep(400);
}

function step(msg) {
  console.log(`  ▸ ${msg}`);
}

// ─── Node creation helpers ────────────────────────────────────────────────────

async function addArena(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'Add arena');
}
async function addPitToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Add pit');
}
async function addZoneToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Add zone');
}
async function addWallToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Add wall');
}
async function addSpeedLineToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Add speed line');
}
async function addTrapToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Add arena trap');
}
async function addBridge(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'Add bridge');
}
async function addSegmentToBridge(page, bridgeId) {
  await clickAddBtn(page, bridgeId);
  await clickMenuOption(page, 'Add segment');
}
async function addObstacle(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'Add obstacle');
}

// ─── Pier helpers ─────────────────────────────────────────────────────────────

async function setPierSection(page) {
  await setPropNum(page, 'Width (cm)', 6);
  await clickProfileBtn(page, '━ Flat');
  await sleep(200);
  await clickProfileBtn(page, '◈ Stone');
  await setPropColor(page, 'Color', '#a09070');
  await clickSurfaceBtn(page, 'Concrete');
}

/**
 * Add a pier bridge using freepoint startRef.
 * Pier starts at lake edge (r=75, Y≈17) and extends 50cm inward to r=25.
 * px/py/pz = world start position; heading = direction pier points (toward center).
 *   East  pier: px=75,  py=17, pz=0,  heading=90  (West  = −X = inward)
 *   South pier: px=0,   py=17, pz=75, heading=180 (North = −Z = inward)
 *   West  pier: px=-75, py=17, pz=0,  heading=270 (East  = +X = inward)
 *   North pier: px=0,   py=17, pz=-75,heading=0   (South = +Z = inward)
 */
async function addPier(page, bridgeId, segIdA, segIdB, px, py, pz, heading, pierName) {
  await addBridge(page);
  await waitForNode(page, bridgeId);
  step(`${bridgeId} created`);

  // Set freepoint start ref
  await selectNode(page, bridgeId);
  await waitForProps(page);
  await clickProfileBtnAt(page, 'Freepoint', 0);
  await sleep(400);
  await selectNode(page, bridgeId);
  await waitForProps(page);
  await setPropNum(page, 'X (cm)', px, 0);
  await setPropNum(page, 'Y (cm)', py, 0);
  await setPropNum(page, 'Z (cm)', pz, 0);
  await setPropNum(page, 'Heading°', heading, 0);

  // Section: flat, 6cm wide, concrete surface, stone material
  await selectNode(page, bridgeId);
  await waitForProps(page);
  await setPierSection(page);

  // Segment A: straight 25cm
  await addSegmentToBridge(page, bridgeId);
  await waitForNode(page, segIdA);
  await selectNode(page, segIdA);
  await waitForProps(page);
  await clickShapeBtn(page, 'Straight');
  await sleep(200);
  await selectNode(page, segIdA);
  await waitForProps(page);
  await setPropNum(page, 'Length (cm)', 25);

  // Segment B: straight 25cm
  await addSegmentToBridge(page, bridgeId);
  await waitForNode(page, segIdB);
  await selectNode(page, segIdB);
  await waitForProps(page);
  await setPropNum(page, 'Length (cm)', 25);

  step(`${pierName} pier: freepoint (${px},${py},${pz}) heading=${heading}°, 2×25cm straight`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n⛵  Black Sea Bowl — Demo Arena Builder\n');
  console.log('  Make sure dev server is running on http://localhost:3000\n');

  ensureScreenshotsDir();
  console.log(`  📁 Screenshots → ${SCREENSHOTS_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    protocolTimeout: 90000,
    defaultViewport: { width: 1440, height: 900 },
    args: [
      '--window-size=1440,900',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-session-crashed-bubble',
      '--disable-infobars',
    ],
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('  [JS error]', err.message));
  page.on('console', m => { if (m.type() === 'error') console.error('  [console error]', m.text()); });
  page.on('dialog', async dialog => { await dialog.dismiss().catch(() => {}); });

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 0 — Navigate to Arena Sandbox
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n📍 Step 0 — Navigating to Arena Sandbox…');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  await sleep(500);
  await page.goto(`${BASE_URL}/arena`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
  await page.waitForSelector('.tree-node[data-id="octagon-base"]', { timeout: NAV_TIMEOUT });
  await sleep(800);
  const hasDialog = await page.$('.game-confirm, .dialog-modal');
  if (hasDialog) await confirmDialog(page, 'confirm');
  step('Page loaded');
  await screenshot(page, '00_arena_loaded');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1 — Reset / clear any existing arena
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🗑  Step 1 — Clearing existing arena…');
  const didReset = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b =>
      b.title?.includes('Reset') || b.className?.includes('reset-arena') ||
      b.textContent?.trim() === 'Reset Arena'
    );
    if (btn) { btn.click(); return true; }
    return false;
  });
  if (didReset) {
    await sleep(500);
    const dlg = await page.$('.game-confirm, .dialog-modal');
    if (dlg) await confirmDialog(page, 'confirm');
    await sleep(700);
    step('Arena reset');
  } else {
    step('[skip] No reset button found — starting fresh');
  }
  await screenshot(page, '01_reset');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 2-3 — Configure Base (h=30, 8 sides)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🔷 Steps 2-3 — Configure Base…');
  await selectNode(page, 'octagon-base');
  await waitForProps(page);
  await setPropNum(page, 'Height', 30);
  await setPropNum(page, 'Sides', 8);
  await setPropColor(page, 'Color', '#e8dcc0');
  step('Base: height=30, sides=8');
  await screenshot(page, '02_base_config');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 4-11 — Arena 1: Black Sea Bowl
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🏟  Steps 4-11 — Creating Black Sea Bowl arena…');
  await addArena(page);
  await waitForNode(page, 'arena-1');
  step('arena-1 created');

  await selectNode(page, 'arena-1');
  await page.waitForFunction(
    () => document.querySelectorAll('.prop-shape-btn').length > 0,
    { timeout: 8000 },
  ).catch(() => console.warn('  [warn] shape btns did not appear'));
  await sleep(300);

  await clickShapeBtn(page, 'Circle');
  await sleep(400);
  await selectNode(page, 'arena-1');
  await waitForProps(page);

  await setPropNum(page, 'Radius X', 120);
  await setPropNum(page, 'Radius Z', 120);
  await setPropNum(page, 'Depth', 22);
  // posY=0 → rim flush with octagon surface (dug-in look, not raised tub)
  await setPropNum(page, 'Y (tower)', 0);

  await setPropColor(page, 'Color', '#4a8fa8');
  // Surface and material use different button classes
  await clickSurfaceBtn(page, 'Plain');
  await clickProfileBtn(page, '◈ Stone');
  await setPropColor(page, 'Light Color', '#44aadd');
  await setPropNum(page, 'Intensity', 1.3);
  await setPropNum(page, 'Fog Density', 3);

  step('Black Sea Bowl: circle, r=120, depth=22, posY=0 (flush)');
  await screenshot(page, '03_black_sea_bowl');

  // Wall profile is in the wallprofile-arena-1 sub-node (not the main arena panel)
  console.log('\n  Configuring wall profile (wallprofile sub-node)…');
  await waitForNode(page, 'wallprofile-arena-1', 5000);
  await selectNode(page, 'wallprofile-arena-1');
  await waitForProps(page);
  await clickProfileBtn(page, '▭ Step');
  await sleep(300);
  await selectNode(page, 'wallprofile-arena-1');
  await waitForProps(page);
  await setPropNum(page, 'Step Count', 4);
  step('Wall profile: ▭ Step, stepCount=4');
  // Return to arena panel
  await selectNode(page, 'arena-1');
  await waitForProps(page);

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 12-14 — Pit: Whirlpool Eye (r=5, centered)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n▼ Steps 12-14 — Adding Whirlpool Eye pit…');
  await addPitToArena(page, 'arena-1');
  await waitForNode(page, 'pit-1');
  step('pit-1 created');

  await selectNode(page, 'pit-1');
  await waitForProps(page);
  await clickShapeBtn(page, 'Circle');
  await sleep(300);
  await selectNode(page, 'pit-1');
  await waitForProps(page);
  await setPropNum(page, 'Radius X', 5);
  await setPropNum(page, 'Radius Z', 5);
  await setPropNum(page, 'Dist (cm)', 0);
  await setPropNum(page, 'Angle °', 0);
  await setPropColor(page, 'Color', '#041520');
  await setPropColor(page, 'Glow Color', '#0044aa');
  await setPropNum(page, 'Intensity', 0.6);
  step('Whirlpool Eye: circle r=5, centered');
  await screenshot(page, '04_whirlpool_eye');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 15-18 — Zone: Black Sea (water fill, r=75, depth=6)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n💧 Steps 15-18 — Adding Black Sea water zone…');
  await addZoneToArena(page, 'arena-1');
  await waitForNode(page, 'zone-1');
  step('zone-1 created');

  await selectNode(page, 'zone-1');
  await waitForProps(page);
  await clickShapeBtn(page, 'Circle');
  await sleep(300);
  await selectNode(page, 'zone-1');
  await waitForProps(page);
  // r=75 = lake zone; depth=6 keeps zone bottom above Y=0 (30-22*(1-0)+1 math)
  await setPropNum(page, 'Radius X', 75);
  await setPropNum(page, 'Radius Z', 75);
  await setPropNum(page, 'Depth', 6);
  await setPropNum(page, 'Dist (cm)', 0);
  await setPropNum(page, 'Angle °', 0);
  await clickFillBtn(page, 'water');
  await sleep(300);
  await selectNode(page, 'zone-1');
  await waitForProps(page);
  await setPropNum(page, 'Opacity', 0.88);
  await setPropColor(page, 'Glow Color', '#00aaff');
  await setPropNum(page, 'Intensity', 0.5);
  step('Black Sea: r=75, depth=6, water fill, opacity=0.88');
  await screenshot(page, '05_black_sea_zone');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 19-22 — Wall: City Perimeter (crenellated, h=8, gaps)
  // Panel=126cm≈60°, Gap=251cm≈120° at r=120: 2 walls (E/W) + 2 gaps (N/S)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🧱 Steps 19-22 — Adding City Perimeter wall…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-1');
  step('wall-1 created');

  await selectNode(page, 'wall-1');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', true);
  await sleep(300);
  await selectNode(page, 'wall-1');
  await waitForProps(page);
  await setPropToggle(page, 'Gaps', true);
  await sleep(300);
  await selectNode(page, 'wall-1');
  await waitForProps(page);
  await setPropNum(page, 'Height (cm)', 8);
  await setPropNum(page, 'Tilt°', 0);
  await setPropNum(page, 'Thickness (cm)', 3);
  await setPropNum(page, 'Panel Width (cm)', 126);
  await setPropNum(page, 'Gap Width (cm)', 251);
  await clickProfileBtn(page, '⊓ Crenellated');
  await sleep(300);
  await selectNode(page, 'wall-1');
  await waitForProps(page);
  await setPropNum(page, 'Amplitude (cm)', 2);
  await setPropNum(page, 'Frequency', 10);
  await setPropColor(page, 'Color', '#c4aa80');
  await clickSurfaceBtn(page, 'Concrete');
  await clickProfileBtn(page, '◈ Stone');
  step('City Perimeter: h=8, 126cm panels / 251cm gaps, crenellated, concrete/stone');
  await screenshot(page, '06_city_perimeter');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 23-29 — Speed Line: Whirlpool Current (spiral_in, r=70, periodic)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n⚡ Steps 23-29 — Adding Whirlpool Current speed line…');
  await addSpeedLineToArena(page, 'arena-1');
  await waitForNode(page, 'sl-1');
  step('sl-1 created');

  await selectNode(page, 'sl-1');
  await waitForProps(page);
  await setPropSelect(page, 'Shape', 'spiral_in');
  await sleep(400);
  await selectNode(page, 'sl-1');
  await waitForProps(page);

  await setPropNum(page, 'Radius X cm', 70);
  await setPropNum(page, 'Radius Z cm', 70);
  await setPropNum(page, 'Turns', 4);
  await setPropNum(page, 'Total Steps', 100);
  await setPropNum(page, 'Inner Radius cm', 5);

  await setPropNum(page, 'Speed ×', 3.5);
  await setPropNum(page, 'Width cm', 2.5);
  await setPropColor(page, 'Color', '#00ccff');
  await setPropNum(page, 'Opacity', 0.75);
  // SL glow is a toggleRow, NOT a color input
  await setPropToggle(page, 'Glow', true);

  await setPropSelect(page, 'Direction', 'forward');
  await sleep(200);
  await setPropSelect(page, 'Exit', 'launch');
  await sleep(200);
  await selectNode(page, 'sl-1');
  await waitForProps(page);
  await setPropNum(page, 'Launch ×', 3.0);

  await setPropSelect(page, 'Activation', 'periodic');
  await sleep(300);
  await selectNode(page, 'sl-1');
  await waitForProps(page);
  await setPropNum(page, 'Period ms', 45000);
  await setPropNum(page, 'Duty 0–1', 0.33);

  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const regen = btns.find(b => b.textContent?.includes('Regenerate') || b.textContent?.includes('↺ Regen'));
    if (regen) regen.click();
  });
  await sleep(600);

  step('Whirlpool Current: spiral_in r=70, 4 turns, 100 steps, glow on, periodic 45s/0.33');
  await screenshot(page, '07_whirlpool_sl');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 30-35 — Trap: Whirlpool (gravity_pull, dim=150, periodic)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n⚡ Steps 30-35 — Adding Whirlpool trap…');
  await addTrapToArena(page, 'arena-1');
  await waitForNode(page, 'trap-1');
  step('trap-1 created');

  await selectNode(page, 'trap-1');
  await waitForProps(page);
  await setPropSelect(page, 'Shape', 'circle');
  await sleep(300);
  await setPropSelect(page, 'Effect', 'gravity_pull');
  await sleep(300);
  await selectNode(page, 'trap-1');
  await waitForProps(page);

  await setPropNum(page, 'Width (cm)', 150);
  await setPropNum(page, 'Depth (cm)', 150);
  await setPropNum(page, 'Radius (cm)', 0);
  await setPropNum(page, 'Angle°', 0);

  await setPropToggle(page, 'Periodic', true);
  await sleep(300);
  await selectNode(page, 'trap-1');
  await waitForProps(page);
  await setPropNum(page, 'Safe (s)', 30);
  await setPropNum(page, 'Unsafe (s)', 15);

  await setPropNum(page, 'Range (cm)', 75);
  await setPropNum(page, 'Strength (cm/s²)', 18);
  await clickProfileBtn(page, 'Continuous');

  await setPropColor(page, 'Color', '#0055aa');
  await setPropColor(page, 'Glow Color', '#0099cc');
  await setPropNum(page, 'Glow Intensity', 0.35);

  step('Whirlpool trap: gravity_pull dim=150, range=75, periodic 30s safe / 15s unsafe');
  await screenshot(page, '08_whirlpool_trap');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 36-45 — Four Pier Bridges (freepoint at lake edge r=75, Y≈17)
  // freePosY≈17 = arena surface at r=75: 30 - 22*(1-(75/120)²) ≈ 17cm
  // Heading convention: fwd=(-sin(deg),0,cos(deg))
  //   E pier heading=90°  → fwd=(-1,0,0) = West  = toward center ✓
  //   S pier heading=180° → fwd=(0,0,-1) = North = toward center ✓
  //   W pier heading=270° → fwd=(+1,0,0) = East  = toward center ✓
  //   N pier heading=0°   → fwd=(0,0,+1) = South = toward center ✓
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🌉 Steps 36-45 — Building four pier bridges (freepoint startRef)…');

  console.log('\n  East Pier (bridge-1)…');
  await addPier(page, 'bridge-1', 'seg-1', 'seg-2', 75, 17, 0, 90, 'East');
  await screenshot(page, '09_east_pier');

  console.log('\n  South Pier (bridge-2)…');
  await addPier(page, 'bridge-2', 'seg-3', 'seg-4', 0, 17, 75, 180, 'South');
  await screenshot(page, '10_south_pier');

  console.log('\n  West Pier (bridge-3)…');
  await addPier(page, 'bridge-3', 'seg-5', 'seg-6', -75, 17, 0, 270, 'West');
  await screenshot(page, '11_west_pier');

  console.log('\n  North Pier (bridge-4)…');
  await addPier(page, 'bridge-4', 'seg-7', 'seg-8', 0, 17, -75, 0, 'North');
  await screenshot(page, '12_north_pier');

  step('All four pier bridges complete');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 46-53 — Eight Boats (create obstacle-1 fully, duplicate ×7)
  // Positions scaled ×2.5 from original to match arena r=120 (was r=60).
  // posY = water surface (~8cm) + dimY/2
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n⛵ Steps 46-53 — Adding boats (create obstacle-1, duplicate ×7)…');

  // Create obstacle-1 (Large Freighter) with full setup including theme + floating
  await addObstacle(page);
  await waitForNode(page, 'obstacle-1');
  await selectNode(page, 'obstacle-1');
  await waitForProps(page);
  await setPropSelect(page, 'Shape', 'cuboid');
  await sleep(200);
  await selectNode(page, 'obstacle-1');
  await waitForProps(page);
  await setPropNum(page, 'Width (cm)', 20);
  await setPropNum(page, 'Height (cm)', 4);
  await setPropNum(page, 'Depth (cm)', 10);
  await setPropNum(page, 'X (cm)', 43.3);
  await setPropNum(page, 'Y (cm)', 9);
  await setPropNum(page, 'Z (cm)', 25.0);
  await setPropNum(page, 'Rot Y°', 30);
  await setPropSelect(page, 'Theme', 'boat');
  await setPropToggle(page, 'Floating', true);
  await setPropColor(page, 'Color', '#8a7a6a');
  step('obstacle-1: Large Freighter 20×4×10 at (43.3,9,25), theme=boat, floating');

  // [id, width, height, depth, posX, posY, posZ, rotY, color]
  const boatOverrides = [
    ['obstacle-2', 22, 4,  10, -51.8,  9,   -18.8, 200, '#7a8a9a'],
    ['obstacle-3', 14, 3,   8,  -6.5,  8.5,  37.0, 100, '#9a8a7a'],
    ['obstacle-4', 12, 3,   7,  34.5,  8.5, -29.0, 320, '#8a9a8a'],
    ['obstacle-5', 10, 2,   5,  25.0,  8,     0.0,   0, '#a0a0b0'],
    ['obstacle-6', 10, 2,   5, -12.5,  8,    21.75,120, '#b0a090'],
    ['obstacle-7', 10, 2,   5, -12.5,  8,   -21.75,240, '#a0b0a0'],
    ['obstacle-8', 16, 3,   8, -52.0,  8.5,  30.0, 150, '#88a0b8'],
  ];

  for (let i = 0; i < boatOverrides.length; i++) {
    const [id, dx, dy, dz, x, y, z, rot, color] = boatOverrides[i];
    // Duplicate from the previous obstacle (chain duplication)
    const srcId = i === 0 ? 'obstacle-1' : `obstacle-${i + 1}`;
    await duplicateNode(page, srcId);
    await waitForNode(page, id);
    await selectNode(page, id);
    await waitForProps(page);
    await setPropNum(page, 'Width (cm)', dx);
    await setPropNum(page, 'Height (cm)', dy);
    await setPropNum(page, 'Depth (cm)', dz);
    await setPropNum(page, 'X (cm)', x);
    await setPropNum(page, 'Y (cm)', y);
    await setPropNum(page, 'Z (cm)', z);
    await setPropNum(page, 'Rot Y°', rot);
    await setPropColor(page, 'Color', color);
    step(`${id}: ${dx}×${dy}×${dz} at (${x},${y},${z}) rot=${rot}°`);
  }
  await screenshot(page, '13_boats');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 53a-53d — Four City Tower Obstacles (shore ring r≈110, posY≈31)
  // posY=31 ≈ shore surface Y (≈25) + dimY/2 (6) ≈ 31
  // Towers at (±78, ±78) → r = 78√2 ≈ 110cm (in shore ring r=100-120)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🏰 Steps 53a-53d — Adding city towers (create obstacle-9, duplicate ×3)…');

  await addObstacle(page);
  await waitForNode(page, 'obstacle-9');
  await selectNode(page, 'obstacle-9');
  await waitForProps(page);
  await setPropSelect(page, 'Shape', 'cuboid');
  await sleep(200);
  await selectNode(page, 'obstacle-9');
  await waitForProps(page);
  await setPropNum(page, 'Width (cm)', 5);
  await setPropNum(page, 'Height (cm)', 12);
  await setPropNum(page, 'Depth (cm)', 5);
  await setPropNum(page, 'X (cm)', 78);
  await setPropNum(page, 'Y (cm)', 31);
  await setPropNum(page, 'Z (cm)', 78);
  await setPropNum(page, 'Rot Y°', 45);
  await clickSurfaceBtn(page, 'Concrete');
  await setPropColor(page, 'Color', '#c4aa80');
  step('obstacle-9: Harbor Tower NE 5×12×5 at (78,31,78), concrete');

  // [id, x, y, z, rotY, color]
  const towerOverrides = [
    ['obstacle-10', -78, 31,  78, 135, '#b8a070'],
    ['obstacle-11', -78, 31, -78, 225, '#c4aa80'],
    ['obstacle-12',  78, 31, -78, 315, '#b8a070'],
  ];

  for (let i = 0; i < towerOverrides.length; i++) {
    const [id, x, y, z, rot, color] = towerOverrides[i];
    const srcId = i === 0 ? 'obstacle-9' : `obstacle-${9 + i}`;
    await duplicateNode(page, srcId);
    await waitForNode(page, id);
    await selectNode(page, id);
    await waitForProps(page);
    await setPropNum(page, 'X (cm)', x);
    await setPropNum(page, 'Y (cm)', y);
    await setPropNum(page, 'Z (cm)', z);
    await setPropNum(page, 'Rot Y°', rot);
    await setPropColor(page, 'Color', color);
    step(`${id}: tower at (${x},${y},${z}) rot=${rot}°`);
  }
  await screenshot(page, '14_towers');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 54-57 — Rotation: Drifting Fleet (obstacles 5,6,7 orbit at Y=8)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n↻ Steps 54-57 — Creating Drifting Fleet rotation…');
  await checkTreeNode(page, 'obstacle-5', true);
  await checkTreeNode(page, 'obstacle-6', true);
  await checkTreeNode(page, 'obstacle-7', true);
  await sleep(300);
  await clickAddBtn(page, 'obstacle-5');
  await clickMenuOption(page, 'Add rotation');
  await sleep(600);
  await checkTreeNode(page, 'obstacle-5', false);
  await checkTreeNode(page, 'obstacle-6', false);
  await checkTreeNode(page, 'obstacle-7', false);

  await waitForNode(page, 'rot-1');
  step('rot-1 created');

  await selectNode(page, 'rot-1');
  await waitForProps(page);
  await setPropSelect(page, 'Mode', 'continuous');
  await setPropNum(page, 'Speed (°/s)', 5);
  await setPropNum(page, 'Pivot X (cm)', 0);
  await setPropNum(page, 'Pivot Y (cm)', 8);
  await setPropNum(page, 'Pivot Z (cm)', 0);
  step('Drifting Fleet: continuous 5 °/s, pivotY=8 (water surface level)');
  await screenshot(page, '15_drifting_fleet');

  // ═══════════════════════════════════════════════════════════════════════════
  // Final overview screenshots
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n📸 Final overview screenshots…');

  await selectNode(page, 'arena-1');
  await sleep(500);
  await screenshot(page, '17_overview');

  await selectNode(page, 'zone-1');
  await sleep(500);
  await screenshot(page, '18_water_zone');

  await selectNode(page, 'bridge-1');
  await sleep(500);
  await screenshot(page, '19_east_pier_detail');

  // ═══════════════════════════════════════════════════════════════════════════
  // Save as Preset
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n💾 Saving as preset…');
  const presetClicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b =>
      b.textContent?.includes('Preset') || b.title?.toLowerCase().includes('preset')
    );
    if (btn) { btn.click(); return true; }
    return false;
  });
  if (presetClicked) {
    await sleep(500);
    const nameFilled = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'));
      const inp = inputs.find(i =>
        (i.placeholder || '').toLowerCase().includes('name') ||
        (i.closest('.modal-row') || i.closest('.prop-row') || { textContent: '' }).textContent.includes('Name')
      );
      if (!inp) return false;
      inp.value = 'Black Sea Bowl';
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    });
    if (!nameFilled) console.warn('  [warn] name input not found in preset modal');
    await sleep(200);
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'));
      const inp = inputs.find(i =>
        (i.placeholder || '').toLowerCase().includes('group') ||
        (i.closest('.modal-row') || i.closest('.prop-row') || { textContent: '' }).textContent.includes('Group')
      );
      if (!inp) return;
      inp.value = 'Demo Arenas';
      inp.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await sleep(200);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const save = btns.find(b => b.textContent?.trim() === 'Save' || b.textContent?.includes('💾'));
      if (save) save.click();
    });
    await sleep(600);
    await screenshot(page, '20_preset_saved');
    step('Preset saved: Black Sea Bowl / Demo Arenas');
  } else {
    step('[skip] Preset button not found');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DONE
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n✅  All steps complete!');
  console.log('    Auto-saved to localStorage.');
  console.log(`    📁 Screenshots: ${SCREENSHOTS_DIR}`);
  console.log(`    📸 ${_shotIndex} screenshots taken`);
  console.log('    Browser stays open — close when done reviewing.\n');
}

main().catch(err => {
  console.error('\n❌  Demo builder failed:', err.message);
  console.error('    Stack:', err.stack);
  console.error('    Make sure dev server is running on http://localhost:3000');
  process.exit(1);
});
