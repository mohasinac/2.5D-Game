/**
 * create-demo-arena.js
 *
 * Puppeteer script that builds the full demo arena step-by-step through the
 * Arena Sandbox UI, demonstrating all major features:
 * - Hex Race Moat arena (outer hexagon, inner circle moat, r=80)
 * - Tower Command arena (elevated on island, r=30, posY=28)
 * - Zones, pits, walls, speed lines, traps, portals, obstacles, rotations
 * - Tower Spiral Drop bridge (4 segments, arena-2 anchor, tapered width)
 * - Bridge ribbon speed line, rotation groups
 * - Preset save and library load
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
    console.log(`  ðŸ“¸ ${filename}`);
  } catch (e) {
    console.warn(`  [warn] screenshot failed (${filename}): ${e.message.slice(0, 80)}`);
  }
}

/** Verify the page is still on /arena; re-navigate if it drifted. */
async function ensureArenaPage(page) {
  const url = page.url();
  if (!url.includes('/arena')) {
    console.warn(`  [recover] page drifted to ${url} â€” re-navigating to /arena`);
    await page.goto(`${BASE_URL}/arena`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    await page.waitForSelector('.tree-node[data-id="octagon-base"]', { timeout: NAV_TIMEOUT });
    await sleep(800);
  }
}

// â”€â”€â”€ Core helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// findPropRow uses a single evaluate call to avoid stale ElementHandle issues
async function findPropRow(page, labelText) {
  const norm = normLabel(labelText);
  const found = await page.evaluate((lbl) => {
    const rows = [...document.querySelectorAll('.prop-row')];
    for (const row of rows) {
      const label = row.querySelector('.prop-label');
      if (!label) continue;
      const t = (label.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (t === lbl) return true;
    }
    return false;
  }, norm);
  // Return a sentinel object when found â€” callers that need an ElementHandle use setPropToggle's
  // inline evaluate approach instead
  return found ? { _found: true } : null;
}

/**
 * Set a numeric input row.
 * Fires the slider's change event (which calls onChange in AbstractPropertiesPanel.numRow)
 * rather than the number input's change event (which has no listener).
 */
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
      // Set value on number input (display)
      numInput.value = String(val);
      numInput.dispatchEvent(new Event('input', { bubbles: true }));
      // Fire change on the SLIDER (range input) which triggers onChange in AbstractPropertiesPanel
      const slider = row.querySelector('input[type="range"]');
      if (slider) {
        slider.value = String(val);
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        // No slider (rare) â€” dispatch blur on number input to trigger commit()
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

/**
 * Set a select/dropdown row. occurrence=0 means first matching row,
 * occurrence=1 means second, etc.
 */
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

/** Click a .prop-profile-btn by text. */
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

/**
 * Click the Nth .prop-profile-btn matching btnText.
 * occurrence=0 â†’ first match, occurrence=1 â†’ second match, etc.
 */
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

/** Click a .prop-shape-btn (opening shapes, segment types) by its label span text. */
async function clickShapeBtn(page, label) {
  // Wait up to 5 s for shape buttons to appear in the panel
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
    // Fallback: check full textContent
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
  // Wait for fill buttons to appear in the panel (they render when a zone is selected)
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

/** Check or uncheck a tree node's checkbox */
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

/** Click a small icon button on a tree node by button text or title */
async function clickChildBtn(page, nodeId, btnLabel) {
  const found = await page.evaluate((id, lbl) => {
    const node = document.querySelector(`.tree-node[data-id="${id}"]`);
    if (!node) return false;
    const btns = [...node.querySelectorAll('button')];
    const btn = btns.find(b => (b.textContent?.trim() === lbl) || (b.title?.includes(lbl)));
    if (btn) { btn.click(); return true; }
    return false;
  }, nodeId, btnLabel);
  if (!found) console.warn(`  [skip] child btn "${btnLabel}" not found on ${nodeId}`);
  await sleep(300);
}

/** Wait for and dismiss a confirm/dialog modal */
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
  console.log(`  â–¸ ${msg}`);
}

// â”€â”€â”€ Node creation helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
async function addPortalToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Add arena portal');
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
async function addBasePortal(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'Add base portal');
}


// ─── Pier helpers ─────────────────────────────────────────────────────────────

async function setPierSection(page) {
  await setPropNum(page, 'Width (cm)', 5);
  await clickProfileBtn(page, '━ Flat');
  await sleep(200);
  await setPropNum(page, 'Depth (cm)', 1);
  await clickProfileBtn(page, '◈ Stone');
  await setPropColor(page, 'Color', '#a09070');
  await clickProfileBtn(page, 'Concrete');
}

async function addPier(page, angle, bridgeId, segIdA, segIdB, pierName) {
  await addBridge(page);
  await waitForNode(page, bridgeId);
  step(`${bridgeId} created`);

  // Configure start ref: Arena, angle, yOffset=-11
  await selectNode(page, bridgeId);
  await waitForProps(page);
  await clickProfileBtnAt(page, 'Arena', 0);
  await sleep(400);
  await selectNode(page, bridgeId);
  await waitForProps(page);
  await sleep(200);
  await setPropSelect(page, 'Arena', 'arena-1', 0);
  await setPropNum(page, 'Angle°', angle, 0);
  await setPropNum(page, 'Y Offset (cm)', -11, 0);

  // Section
  await selectNode(page, bridgeId);
  await waitForProps(page);
  await setPierSection(page);

  // Segment A: Ramp -25 degrees, length 15
  await addSegmentToBridge(page, bridgeId);
  await waitForNode(page, segIdA);
  await selectNode(page, segIdA);
  await waitForProps(page);
  await clickShapeBtn(page, 'Ramp');
  await sleep(300);
  await selectNode(page, segIdA);
  await waitForProps(page);
  await setPropNum(page, 'Length (cm)', 15);
  await setPropNum(page, 'Ramp Angle°', -25);

  // Segment B: Straight, length 20
  await addSegmentToBridge(page, bridgeId);
  await waitForNode(page, segIdB);
  await selectNode(page, segIdB);
  await waitForProps(page);
  // Straight is default type
  await setPropNum(page, 'Length (cm)', 20);

  step(`${pierName} pier complete`);
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
  // STEPS 2-3 — Configure Base
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
  await clickProfileBtn(page, '▭ Step');
  await sleep(400);

  await selectNode(page, 'arena-1');
  await waitForProps(page);

  await setPropNum(page, 'Radius X', 60);
  await setPropNum(page, 'Radius Z', 60);
  await setPropNum(page, 'Depth', 22);
  await setPropNum(page, 'Step Count', 2);
  await setPropNum(page, 'Y (tower)', 24);

  await setPropColor(page, 'Color', '#4a8fa8');
  await clickProfileBtn(page, 'Plain');
  await clickProfileBtn(page, '◈ Stone');
  await setPropColor(page, 'Light Color', '#44aadd');
  await setPropNum(page, 'Intensity', 1.3);
  await setPropNum(page, 'Fog Density', 3);

  step('Black Sea Bowl: circle/step, r=60, depth=22, posY=24');
  await screenshot(page, '03_black_sea_bowl');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 12-14 — Pit: Whirlpool Eye
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
  await setPropNum(page, 'Radius X', 6);
  await setPropNum(page, 'Radius Z', 6);
  await setPropNum(page, 'Dist (cm)', 0);
  await setPropNum(page, 'Angle °', 0);
  await setPropColor(page, 'Color', '#041520');
  await setPropColor(page, 'Glow Color', '#0044aa');
  await setPropNum(page, 'Intensity', 0.6);
  step('Whirlpool Eye: circle r=6, centered');
  await screenshot(page, '04_whirlpool_eye');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 15-18 — Zone: Black Sea (water fill)
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
  await setPropNum(page, 'Radius X', 30);
  await setPropNum(page, 'Radius Z', 30);
  await setPropNum(page, 'Depth', 14);
  await setPropNum(page, 'Dist (cm)', 0);
  await setPropNum(page, 'Angle °', 0);
  await clickFillBtn(page, 'water');
  await sleep(300);
  await selectNode(page, 'zone-1');
  await waitForProps(page);
  await setPropNum(page, 'Opacity', 0.88);
  await setPropColor(page, 'Glow Color', '#00aaff');
  await setPropNum(page, 'Intensity', 0.5);
  step('Black Sea: r=30, water fill, opacity=0.88');
  await screenshot(page, '05_black_sea_zone');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 19-22 — Wall: City Perimeter (crenellated)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🧱 Steps 19-22 — Adding City Perimeter wall…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-1');
  step('wall-1 created');

  await selectNode(page, 'wall-1');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', true);
  await setPropNum(page, 'Height (cm)', 20);
  await setPropNum(page, 'Tilt°', 0);
  await setPropNum(page, 'Thickness (cm)', 3);
  await clickProfileBtn(page, '⊓ Crenellated');
  await sleep(300);
  await selectNode(page, 'wall-1');
  await waitForProps(page);
  await setPropNum(page, 'Amplitude (cm)', 3);
  await setPropNum(page, 'Frequency', 8);
  await setPropColor(page, 'Color', '#c4aa80');
  await clickProfileBtn(page, 'Concrete');
  await clickProfileBtn(page, '◈ Stone');
  step('City Perimeter: full, h=20, crenellated, sandstone');
  await screenshot(page, '06_city_perimeter');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 23-29 — Speed Line: Whirlpool Current (spiral_in, periodic)
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

  await setPropNum(page, 'Radius X cm', 28);
  await setPropNum(page, 'Turns', 3.5);
  await setPropNum(page, 'Total Steps', 80);

  await setPropNum(page, 'Speed ×', 3.5);
  await setPropNum(page, 'Width cm', 2.5);
  await setPropColor(page, 'Color', '#00ccff');
  await setPropNum(page, 'Opacity', 0.75);
  await setPropColor(page, 'Glow Color', '#44ddff');

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

  step('Whirlpool Current: spiral_in, periodic 45s/0.33, launch force=3');
  await screenshot(page, '07_whirlpool_sl');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 30-35 — Trap: Whirlpool (gravity_pull, periodic)
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

  await setPropNum(page, 'Width (cm)', 72);
  await setPropNum(page, 'Depth (cm)', 72);
  await setPropNum(page, 'Radius (cm)', 0);
  await setPropNum(page, 'Angle°', 0);

  await setPropToggle(page, 'Periodic', true);
  await sleep(300);
  await selectNode(page, 'trap-1');
  await waitForProps(page);
  await setPropNum(page, 'Safe (s)', 30);
  await setPropNum(page, 'Unsafe (s)', 15);

  await setPropNum(page, 'Range (cm)', 30);
  await setPropNum(page, 'Strength (cm/s²)', 18);
  await clickProfileBtn(page, 'Continuous');

  await setPropColor(page, 'Color', '#0055aa');
  await setPropColor(page, 'Glow Color', '#0099cc');
  await setPropNum(page, 'Glow Intensity', 0.35);

  step('Whirlpool trap: gravity_pull, periodic 30s safe/15s unsafe');
  await screenshot(page, '08_whirlpool_trap');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 36-45 — Four Pier Bridges (E, S, W, N)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🌉 Steps 36-45 — Building four pier bridges…');

  console.log('\n  East Pier (bridge-1)…');
  await addPier(page, 0, 'bridge-1', 'seg-1', 'seg-2', 'East');
  await screenshot(page, '09_east_pier');

  console.log('\n  South Pier (bridge-2)…');
  await addPier(page, 90, 'bridge-2', 'seg-3', 'seg-4', 'South');
  await screenshot(page, '10_south_pier');

  console.log('\n  West Pier (bridge-3)…');
  await addPier(page, 180, 'bridge-3', 'seg-5', 'seg-6', 'West');
  await screenshot(page, '11_west_pier');

  console.log('\n  North Pier (bridge-4)…');
  await addPier(page, 270, 'bridge-4', 'seg-7', 'seg-8', 'North');
  await screenshot(page, '12_north_pier');

  step('All four pier bridges complete');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 46-53 — Eight Boats (floating obstacles, theme=boat)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n⛵ Steps 46-53 — Adding boats…');

  const boats = [
    { id: 'obstacle-1', dx:20, dy:4,  dz:10, x:17.3,  y:3,   z:10.0,  rot:30,  color:'#8a7a6a' },
    { id: 'obstacle-2', dx:22, dy:4,  dz:10, x:-20.7, y:3,   z:-7.5,  rot:200, color:'#7a8a9a' },
    { id: 'obstacle-3', dx:14, dy:3,  dz:8,  x:-2.6,  y:2.5, z:14.8,  rot:100, color:'#9a8a7a' },
    { id: 'obstacle-4', dx:12, dy:3,  dz:7,  x:13.8,  y:2.5, z:-11.6, rot:320, color:'#8a9a8a' },
    { id: 'obstacle-5', dx:10, dy:2,  dz:5,  x:10.0,  y:2,   z:0.0,   rot:0,   color:'#a0a0b0' },
    { id: 'obstacle-6', dx:10, dy:2,  dz:5,  x:-5.0,  y:2,   z:8.7,   rot:120, color:'#b0a090' },
    { id: 'obstacle-7', dx:10, dy:2,  dz:5,  x:-5.0,  y:2,   z:-8.7,  rot:240, color:'#a0b0a0' },
    { id: 'obstacle-8', dx:16, dy:3,  dz:8,  x:-20.8, y:2.5, z:12.0,  rot:150, color:'#88a0b8' },
  ];

  for (const b of boats) {
    await addObstacle(page);
    await waitForNode(page, b.id);
    await selectNode(page, b.id);
    await waitForProps(page);
    await setPropSelect(page, 'Shape', 'cuboid');
    await sleep(200);
    await selectNode(page, b.id);
    await waitForProps(page);
    await setPropNum(page, 'Width (cm)', b.dx);
    await setPropNum(page, 'Height (cm)', b.dy);
    await setPropNum(page, 'Depth (cm)', b.dz);
    await setPropNum(page, 'X (cm)', b.x);
    await setPropNum(page, 'Y (cm)', b.y);
    await setPropNum(page, 'Z (cm)', b.z);
    await setPropNum(page, 'Rot Y°', b.rot);
    await setPropSelect(page, 'Theme', 'boat');
    await setPropToggle(page, 'Floating', true);
    await setPropColor(page, 'Color', b.color);
    step(`${b.id}: cuboid ${b.dx}x${b.dy}x${b.dz}, boat theme`);
  }
  await screenshot(page, '13_boats');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 53a-53d — Four City Tower Obstacles (shore ring, r=47)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🏰 Steps 53a-53d — Adding city towers…');

  const towers = [
    { id: 'obstacle-9',  x:33.2,  y:19, z:33.2,  rot:45,  color:'#c4aa80' },
    { id: 'obstacle-10', x:-33.2, y:19, z:33.2,  rot:135, color:'#b8a070' },
    { id: 'obstacle-11', x:-33.2, y:19, z:-33.2, rot:225, color:'#c4aa80' },
    { id: 'obstacle-12', x:33.2,  y:19, z:-33.2, rot:315, color:'#b8a070' },
  ];

  for (const t of towers) {
    await addObstacle(page);
    await waitForNode(page, t.id);
    await selectNode(page, t.id);
    await waitForProps(page);
    await setPropSelect(page, 'Shape', 'cuboid');
    await sleep(200);
    await selectNode(page, t.id);
    await waitForProps(page);
    await setPropNum(page, 'Width (cm)', 5);
    await setPropNum(page, 'Height (cm)', 12);
    await setPropNum(page, 'Depth (cm)', 5);
    await setPropNum(page, 'X (cm)', t.x);
    await setPropNum(page, 'Y (cm)', t.y);
    await setPropNum(page, 'Z (cm)', t.z);
    await setPropNum(page, 'Rot Y°', t.rot);
    await clickProfileBtn(page, 'Concrete');
    await setPropColor(page, 'Color', t.color);
    step(`${t.id}: tower 5x12x5 at (${t.x},${t.z})`);
  }
  await screenshot(page, '14_towers');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 54-57 — Rotation: Drifting Fleet (obstacles 5,6,7)
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
  await setPropNum(page, 'Pivot Y (cm)', 2);
  await setPropNum(page, 'Pivot Z (cm)', 0);
  step('Drifting Fleet: continuous 5 deg/s, pivot Y=2');
  await screenshot(page, '15_drifting_fleet');

  // NOTE: Boat translations (docking motion) are defined in demoArenaConfig.ts
  // and loaded directly — there is no UI button to add translations via Puppeteer.
  // They will appear automatically when the demo arena config is loaded.

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 63-66 — Overview screenshots
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n📸 Steps 63-66 — Taking overview screenshots…');

  // Top-down overview
  await selectNode(page, 'arena-1');
  await sleep(500);
  await screenshot(page, '17_overview');

  // Center (pit + water zone)
  await selectNode(page, 'zone-1');
  await sleep(500);
  await screenshot(page, '18_water_zone');

  // One pier
  await selectNode(page, 'bridge-1');
  await sleep(500);
  await screenshot(page, '19_east_pier_detail');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 67-69 — Save as Preset
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n💾 Steps 67-69 — Saving as preset…');
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
    // Fill Name field
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
    // Fill Group field
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
    // Click Save button in modal
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
