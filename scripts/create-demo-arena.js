/**
 * create-demo-arena.js
 *
 * Puppeteer script that builds the full demo arena by clicking through the
 * Arena Sandbox UI one node at a time.
 *
 * Prerequisites:
 *   npm run dev   OR   npm run preview:host   (server on port 3000)
 *   npm run demo  (runs this script)
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'demo-arena');

const BASE_URL = 'http://localhost:3000';
const STEP_DELAY = 400;
const NAV_TIMEOUT = 15000;

// ─── Screenshot counter ───────────────────────────────────────────────────────
let _shotIndex = 0;

function ensureScreenshotsDir() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function screenshot(page, label) {
  _shotIndex++;
  const safe = label.replace(/[^a-zA-Z0-9_\-]/g, '_').toLowerCase();
  const filename = `${String(_shotIndex).padStart(3, '0')}_${safe}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`  📸 ${filename}`);
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
  const items = await page.$$('.tree-add-menu .tree-ctx-item');
  for (const item of items) {
    const text = await item.evaluate(el => el.textContent?.trim());
    if (text === labelText) {
      await item.click();
      await sleep(STEP_DELAY);
      return;
    }
  }
  throw new Error(`Menu option "${labelText}" not found`);
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

// Normalize internal whitespace for label matching (handles 'Height   (cm)' etc.)
const normLabel = s => s.replace(/\s+/g, ' ').trim();

async function findPropRow(page, labelText) {
  const norm = normLabel(labelText);
  const rows = await page.$$('.prop-row');
  for (const row of rows) {
    const label = await row.$('.prop-label');
    if (!label) continue;
    const text = await label.evaluate(el => el.textContent?.replace(/\s+/g, ' ').trim());
    if (text === norm) return row;
  }
  return null;
}

/** Set a number input — prefers visible rows (skips collapsed segment bodies). */
async function setPropNum(page, labelText, value) {
  const norm = normLabel(labelText);
  const found = await page.evaluate((lbl, val) => {
    const rows = [...document.querySelectorAll('.prop-row')];
    for (const row of rows) {
      const label = row.querySelector('.prop-label');
      if (!label) continue;
      const t = (label.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (t !== lbl) continue;
      const input = row.querySelector('input.prop-input');
      if (!input) continue;
      if (input.offsetParent === null) continue; // skip hidden rows
      input.value = String(val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }, norm, value);
  if (!found) console.warn(`  [skip] num row not found or hidden: "${labelText}"`);
  await sleep(200);
}

async function setPropSelect(page, labelText, optionValue) {
  const norm = normLabel(labelText);
  // Search for first row with matching label that ALSO has a <select> (skips themeRow etc.)
  const rows = await page.$$('.prop-row');
  for (const row of rows) {
    const label = await row.$('.prop-label');
    if (!label) continue;
    const text = await label.evaluate(el => el.textContent?.replace(/\s+/g, ' ').trim());
    if (text !== norm) continue;
    // _selectRow() uses class="prop-input"; selectRow() uses class="prop-select"
    const sel = await row.$('select.prop-select') ?? await row.$('select.prop-input');
    if (!sel) continue;  // label matches but no <select> — skip (e.g. themeRow)
    await sel.select(optionValue);
    await sleep(200);
    return;
  }
  console.warn(`  [skip] select row not found: "${labelText}"`);
}

async function setPropColor(page, labelText, hex) {
  const row = await findPropRow(page, labelText);
  if (!row) { console.warn(`  [skip] color row not found: "${labelText}"`); return; }
  const input = await row.$('input[type="color"]');
  if (!input) { console.warn(`  [skip] no color input in row: "${labelText}"`); return; }
  await input.evaluate((el, v) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, hex);
  await sleep(200);
}

async function setPropToggle(page, labelText, on) {
  const row = await findPropRow(page, labelText);
  if (!row) { console.warn(`  [skip] toggle row not found: "${labelText}"`); return; }
  const btn = await row.$('.prop-profile-btn');
  if (!btn) { console.warn(`  [skip] no toggle btn in row: "${labelText}"`); return; }
  const isActive = await btn.evaluate(el => el.classList.contains('active'));
  if (isActive !== on) {
    await btn.click();
    await sleep(200);
  }
}

/**
 * Click a .prop-profile-btn by its exact text content.
 * Used for: wall profile, wall top profile, obstacle shape, trap shape.
 */
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
 * Click a zone fill button by fill type name.
 * Falls back to positional index in the FILLS array.
 */
async function clickFillBtn(page, fillName) {
  const FILLS = ['water', 'lava', 'swamp', 'poison', 'sand', 'ice', 'void', 'custom'];
  const idx = FILLS.indexOf(fillName);
  const clicked = await page.evaluate((f, i) => {
    const btns = [...document.querySelectorAll('.prop-fill-btn')];
    for (const btn of btns) {
      const t = (btn.textContent ?? '').trim().toLowerCase();
      if (t === f || t.includes(f)) { btn.click(); return true; }
    }
    if (i >= 0 && btns[i]) { btns[i].click(); return true; }
    return false;
  }, fillName, idx);
  if (!clicked) console.warn(`  [skip] fill btn not found: "${fillName}"`);
  await sleep(300);
}

/**
 * Click a bridge segment type button by its label (e.g. 'Loop', 'Curve', 'Hairpin').
 * Uses the second <span> inside .prop-shape-btn which holds the text label.
 */
async function clickSegmentType(page, label) {
  const clicked = await page.evaluate((lbl) => {
    const btns = [...document.querySelectorAll('.prop-shape-btn')];
    for (const btn of btns) {
      const spans = btn.querySelectorAll('span');
      const lastSpan = spans[spans.length - 1];
      if (lastSpan && lastSpan.textContent?.trim() === lbl) {
        btn.click();
        return true;
      }
    }
    return false;
  }, label);
  if (!clicked) console.warn(`  [skip] segment type btn not found: "${label}"`);
  await sleep(300);
}

function step(msg) {
  console.log(`  ▸ ${msg}`);
}

// ─── Node creation helpers ────────────────────────────────────────────────────

async function addArena(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'A+');
}
async function addZoneToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Z+');
}
async function addWallToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'W+');
}
async function addSpeedLineToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'SL+');
}
async function addTrapToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, 'Trap+');
}
async function addPortalToArena(page, arenaId) {
  await clickAddBtn(page, arenaId);
  await clickMenuOption(page, '⬡+');
}
async function addBridge(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'B+');
}
async function addSegmentToBridge(page, bridgeId) {
  await clickAddBtn(page, bridgeId);
  await clickMenuOption(page, 'Seg+');
}
async function addWallToBridge(page, bridgeId) {
  await clickAddBtn(page, bridgeId);
  await clickMenuOption(page, 'W+');
}
async function addObstacle(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'Obs+');
}
async function addBaseTrap(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, 'Trap+');
}
async function addBasePortal(page) {
  await clickAddBtn(page, 'octagon-base');
  await clickMenuOption(page, '⬡+');
}
async function addRotation(page, nodeId) {
  await clickAddBtn(page, nodeId);
  await sleep(STEP_DELAY);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🎡  Arena Sandbox — Demo Arena Builder\n');
  console.log('  Make sure dev/preview server is running on http://localhost:3000\n');

  ensureScreenshotsDir();
  console.log(`  📁 Screenshots → ${SCREENSHOTS_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--window-size=1440,900'],
  });

  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error') console.error('  [page error]', m.text()); });

  console.log('📍 Navigating to Arena Sandbox…');
  await page.goto(`${BASE_URL}/arena`, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT });
  await page.waitForSelector('.tree-node[data-id="octagon-base"]', { timeout: NAV_TIMEOUT });
  await sleep(800);
  step('Page loaded');
  await screenshot(page, 'page_loaded');

  // ═══════════════════════════════════════════════════════════════════════════
  // ARENA 1 — Moat Arena
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🏟  Creating Moat Arena…');

  await addArena(page);
  await waitForNode(page, 'arena-1');
  step('arena-1 created');

  await selectNode(page, 'arena-1');
  await waitForProps(page);
  await setPropNum(page, 'Radius X', 60);
  await setPropNum(page, 'Radius Z', 60);
  await setPropNum(page, 'Depth', 22);
  await setPropColor(page, 'Color', '#1a3a5c');

  // Enable moat + set moat island dims
  await setPropToggle(page, 'Ring/Moat', true);
  await sleep(400);
  await setPropNum(page, 'Inner R X', 25);
  await setPropNum(page, 'Inner R Z', 25);
  await setPropNum(page, 'Inner Y offset', 20);

  // Set particle preset
  await setPropSelect(page, 'Preset', 'void_motes');

  // Switch to spiral profile — also need 'Apply to all edges' ON for spiral rows to appear
  await setPropToggle(page, 'Apply to all edges', true);
  await clickProfileBtn(page, '↺ Spiral');
  await sleep(400);
  await selectNode(page, 'arena-1');
  await waitForProps(page);
  await sleep(300);

  // These rows only appear when wallProfile='spiral' AND stepApplyToAll=true
  await setPropNum(page, 'Turns', 1.5);
  await setPropNum(page, 'Helices', 2);

  step('Moat Arena configured');
  await screenshot(page, 'arena-1_moat_arena');

  // ── Zone 1: Water Zone ────────────────────────────────────────────────────
  console.log('\n💧 Adding Water Zone…');
  await addZoneToArena(page, 'arena-1');
  await waitForNode(page, 'zone-1');
  step('zone-1 created');

  await selectNode(page, 'zone-1');
  await waitForProps(page);
  await setPropNum(page, 'Radius X', 14);
  await setPropNum(page, 'Radius Z', 14);
  await setPropNum(page, 'Depth', 8);
  await setPropNum(page, 'Dist (cm)', 42);
  await setPropNum(page, 'Angle °', 45);
  await clickFillBtn(page, 'water');
  await setPropColor(page, 'Glow Color', '#00aaff');
  step('Water Zone configured');
  await screenshot(page, 'zone-1_water_zone');

  // ── Zone 2: Void Zone ─────────────────────────────────────────────────────
  console.log('\n🌀 Adding Void Zone…');
  await addZoneToArena(page, 'arena-1');
  await waitForNode(page, 'zone-2');
  step('zone-2 created');

  await selectNode(page, 'zone-2');
  await waitForProps(page);
  await setPropNum(page, 'Radius X', 12);
  await setPropNum(page, 'Radius Z', 12);
  await setPropNum(page, 'Depth', 8);
  await setPropNum(page, 'Dist (cm)', 42);
  await setPropNum(page, 'Angle °', 225);
  await clickFillBtn(page, 'void');
  await setPropColor(page, 'Glow Color', '#8800ff');
  await setPropSelect(page, 'Preset', 'void_motes');
  step('Void Zone configured');
  await screenshot(page, 'zone-2_void_zone');

  // ── Wall 1: Full-perimeter wave wall ──────────────────────────────────────
  console.log('\n🧱 Adding Wall 1 — Full perimeter waves…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-1');
  step('wall-1 created');

  await selectNode(page, 'wall-1');
  await waitForProps(page);
  // Default is full-perimeter; tilt is forced to 0 for closed ring — that's fine
  await setPropNum(page, 'Height (cm)', 20);
  await clickProfileBtn(page, '∿ Waves');   // top profile
  await sleep(300);
  // Re-select so Amplitude/Frequency rows appear (conditional on topProfile !== 'flat')
  await selectNode(page, 'wall-1');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Amplitude (cm)', 4);
  await setPropNum(page, 'Frequency', 6);
  await setPropColor(page, 'Color', '#2255aa');
  await setPropNum(page, 'Glow Intensity', 0.4);
  await setPropColor(page, 'Glow Color', '#00e5ff');
  step('Wall 1 configured');
  await screenshot(page, 'wall-1_wave_full_perimeter');

  // ── Wall 2: Partial-arc serrated wall (0–180°) ────────────────────────────
  console.log('\n🧱 Adding Wall 2 — Serrated step (0–180°)…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-2');
  step('wall-2 created');

  await selectNode(page, 'wall-2');
  await waitForProps(page);
  // Toggle off full-perimeter, then re-select so arc rows appear
  await setPropToggle(page, 'Full Perimeter', false);
  await sleep(400);
  await selectNode(page, 'wall-2');
  await waitForProps(page);
  await sleep(300);
  await setPropNum(page, 'Arc Start°', 0);
  await setPropNum(page, 'Arc End°', 180);
  await setPropNum(page, 'Height (cm)', 30);
  await setPropNum(page, 'Tilt°', -35);
  await clickProfileBtn(page, '⟋ Serrated');
  await sleep(300);
  await selectNode(page, 'wall-2');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Amplitude (cm)', 5);
  await setPropNum(page, 'Frequency', 8);
  await setPropColor(page, 'Color', '#334466');
  step('Wall 2 configured');
  await screenshot(page, 'wall-2_serrated_0-180deg');

  // ── Wall 3: Partial-arc flat wall (180–360°) ──────────────────────────────
  console.log('\n🧱 Adding Wall 3 — Flat (180–360°)…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-3');
  step('wall-3 created');

  await selectNode(page, 'wall-3');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await sleep(400);
  await selectNode(page, 'wall-3');
  await waitForProps(page);
  await sleep(300);
  await setPropNum(page, 'Arc Start°', 180);
  await setPropNum(page, 'Arc End°', 360);
  await setPropNum(page, 'Height (cm)', 15);
  await setPropNum(page, 'Tilt°', 10);
  await clickProfileBtn(page, '━ Flat');
  await setPropColor(page, 'Color', '#3a5050');
  step('Wall 3 configured');
  await screenshot(page, 'wall-3_flat_180-360deg');

  // ── Wall 4: Outward-leaning triangles (60–120°) ───────────────────────────
  console.log('\n🧱 Adding Wall 4 — Triangles outward (60–120°)…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-4');
  step('wall-4 created');

  await selectNode(page, 'wall-4');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await sleep(400);
  await selectNode(page, 'wall-4');
  await waitForProps(page);
  await sleep(300);
  await setPropNum(page, 'Arc Start°', 60);
  await setPropNum(page, 'Arc End°', 120);
  await setPropNum(page, 'Height (cm)', 25);
  await setPropNum(page, 'Tilt°', 25);
  await clickProfileBtn(page, '▲ Triangles');
  await sleep(300);
  await selectNode(page, 'wall-4');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Amplitude (cm)', 4);
  await setPropColor(page, 'Color', '#663322');
  await setPropNum(page, 'Glow Intensity', 0.3);
  await setPropColor(page, 'Glow Color', '#ff6b35');
  step('Wall 4 configured');
  await screenshot(page, 'wall-4_triangles_60-120deg');

  // ── Speed Line 1: Whirlpool ────────────────────────────────────────────────
  console.log('\n⚡ Adding Speed Line 1 — Whirlpool…');
  await addSpeedLineToArena(page, 'arena-1');
  await waitForNode(page, 'sl-1');
  step('sl-1 created');

  await selectNode(page, 'sl-1');
  await waitForProps(page);
  await setPropNum(page, 'Start Dist', 42);
  await setPropNum(page, 'Start Angle', 45);
  await setPropNum(page, 'Start Dir °', 90);
  await setPropToggle(page, 'Surface Follow', true);
  await setPropNum(page, 'Width cm', 3);
  await setPropColor(page, 'Color', '#0088ff');
  await setPropNum(page, 'Opacity', 0.85);
  await setPropToggle(page, 'Glow', true);     // glow copies ribbon color
  await setPropSelect(page, 'Direction', 'forward');
  await setPropNum(page, 'Speed ×', 2.5);      // setPropNum now skips hidden rows
  step('Whirlpool configured');
  await screenshot(page, 'sl-1_whirlpool');

  // ── Speed Line 2: Flower Pattern ──────────────────────────────────────────
  console.log('\n⚡ Adding Speed Line 2 — Flower Pattern…');
  await addSpeedLineToArena(page, 'arena-1');
  await waitForNode(page, 'sl-2');
  step('sl-2 created');

  await selectNode(page, 'sl-2');
  await waitForProps(page);
  await setPropNum(page, 'Start Dist', 10);
  await setPropNum(page, 'Start Angle', 0);
  await setPropNum(page, 'Start Dir °', 30);
  await setPropToggle(page, 'Surface Follow', true);
  await setPropNum(page, 'Width cm', 2);
  await setPropColor(page, 'Color', '#ff00aa');
  await setPropNum(page, 'Opacity', 0.75);
  await setPropToggle(page, 'Glow', true);
  await setPropSelect(page, 'Direction', 'bidirectional');
  await setPropNum(page, 'Speed ×', 1.8);
  step('Flower Pattern configured');
  await screenshot(page, 'sl-2_flower_pattern');

  // ── Speed Line 3: Wall Climb ──────────────────────────────────────────────
  console.log('\n⚡ Adding Speed Line 3 — Wall Climb…');
  await addSpeedLineToArena(page, 'arena-1');
  await waitForNode(page, 'sl-3');
  step('sl-3 created');

  await selectNode(page, 'sl-3');
  await waitForProps(page);
  await setPropNum(page, 'Start Dist', 55);
  await setPropNum(page, 'Start Angle', 270);
  await setPropNum(page, 'Start Dir °', 180);
  await setPropToggle(page, 'Surface Follow', false);
  await setPropNum(page, 'Width cm', 2.5);
  await setPropColor(page, 'Color', '#ffaa00');
  await setPropNum(page, 'Opacity', 0.9);
  await setPropSelect(page, 'Exit', 'launch');
  await sleep(300);
  // Re-select so Launch × row appears (conditional on exitBehavior='launch')
  await selectNode(page, 'sl-3');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Launch ×', 2.0);
  step('Wall Climb configured');
  await screenshot(page, 'sl-3_wall_climb');

  // ── Trap 1: Launch Pad ───────────────────────────────────────────────────
  console.log('\n⚡ Adding Trap 1 — Launch Pad…');
  await addTrapToArena(page, 'arena-1');
  await waitForNode(page, 'trap-1');
  step('trap-1 created');

  await selectNode(page, 'trap-1');
  await waitForProps(page);
  // Default effect is 'launch' so Force Y row is already visible
  await setPropSelect(page, 'Variant', 'trampoline');
  await setPropNum(page, 'Radius (cm)', 36);  // posR=36: inner edge at r=26, clear of moat inner wall (r=25)
  await setPropNum(page, 'Angle°', 135);
  await setPropNum(page, 'Force Y (cm/s)', 80);
  await setPropColor(page, 'Color', '#ffcc00');
  step('Launch Pad configured');
  await screenshot(page, 'trap-1_launch_pad');

  // ── Trap 2: Buff Zone ────────────────────────────────────────────────────
  console.log('\n⚡ Adding Trap 2 — Buff Zone…');
  await addTrapToArena(page, 'arena-1');
  await waitForNode(page, 'trap-2');
  step('trap-2 created');

  await selectNode(page, 'trap-2');
  await waitForProps(page);
  await setPropSelect(page, 'Effect', 'buff_zone');
  await setPropSelect(page, 'Variant', 'buff');
  await setPropNum(page, 'Radius (cm)', 46);  // posR=46: outer edge at r=58, inside the 60cm rim
  await setPropNum(page, 'Angle°', 315);
  await setPropColor(page, 'Color', '#cc8800');
  step('Buff Zone configured');
  await screenshot(page, 'trap-2_buff_zone');

  // ── Portal 1: Portal A ───────────────────────────────────────────────────
  console.log('\n◉ Adding Portal 1 — Portal A…');
  await addPortalToArena(page, 'arena-1');
  await waitForNode(page, 'portal-1');
  step('portal-1 created');

  await selectNode(page, 'portal-1');
  await waitForProps(page);
  await setPropNum(page, 'Radius (cm)', 8);
  await setPropNum(page, 'Angle°', 200);
  await setPropColor(page, 'Pad Color', '#00e5ff');
  await setPropColor(page, 'Glow Color', '#00aaff');
  step('Portal A configured');
  await screenshot(page, 'portal-1_portal_A');

  // ═══════════════════════════════════════════════════════════════════════════
  // ARENA 2 — Tower Arena (on moat island)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🏰 Creating Tower Arena…');

  await addArena(page);
  await waitForNode(page, 'arena-2');
  step('arena-2 created');

  await selectNode(page, 'arena-2');
  await waitForProps(page);
  await setPropNum(page, 'Radius X', 22);
  await setPropNum(page, 'Radius Z', 22);
  await setPropNum(page, 'Depth', 12);
  await setPropNum(page, 'Y (tower)', 20);
  await setPropColor(page, 'Color', '#2d4a7a');
  await setPropSelect(page, 'Preset', 'embers');

  // Switch to step profile → re-select to expose Step Count row
  await clickProfileBtn(page, '▭ Step');
  await sleep(400);
  await selectNode(page, 'arena-2');
  await waitForProps(page);
  await sleep(300);
  await setPropNum(page, 'Step Count', 3);

  step('Tower Arena configured');
  await screenshot(page, 'arena-2_tower_arena');

  // ── Zone 3: Lava Zone ────────────────────────────────────────────────────
  console.log('\n🌋 Adding Lava Zone to Tower Arena…');
  await addZoneToArena(page, 'arena-2');
  await waitForNode(page, 'zone-3');
  step('zone-3 created');

  await selectNode(page, 'zone-3');
  await waitForProps(page);
  await setPropNum(page, 'Radius X', 8);
  await setPropNum(page, 'Radius Z', 8);
  await setPropNum(page, 'Depth', 6);
  await setPropNum(page, 'Dist (cm)', 8);
  await setPropNum(page, 'Angle °', 90);
  await clickFillBtn(page, 'lava');
  await setPropColor(page, 'Glow Color', '#ff4400');
  await setPropSelect(page, 'Preset', 'embers');
  step('Lava Zone configured');
  await screenshot(page, 'zone-3_lava_zone');

  // ── Wall 5: Nearly-full inward tilt (-45°) ────────────────────────────────
  // Full-perimeter forces tilt=0, so use a wide arc (0–350°) instead.
  console.log('\n🧱 Adding Wall 5 — Inward tilt -45° (0–350°)…');
  await addWallToArena(page, 'arena-2');
  await waitForNode(page, 'wall-5');
  step('wall-5 created');

  await selectNode(page, 'wall-5');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await sleep(400);
  await selectNode(page, 'wall-5');
  await waitForProps(page);
  await sleep(300);
  await setPropNum(page, 'Arc Start°', 0);
  await setPropNum(page, 'Arc End°', 350);
  await setPropNum(page, 'Height (cm)', 20);
  await setPropNum(page, 'Tilt°', -45);
  await clickProfileBtn(page, '━ Flat');
  await setPropColor(page, 'Color', '#1a3355');
  await setPropNum(page, 'Glow Intensity', 0.5);
  await setPropColor(page, 'Glow Color', '#3366ff');
  step('Wall 5 configured');
  await screenshot(page, 'wall-5_inward_-45deg_tower');

  // ── Wall 6: Double wall (240–360°) ───────────────────────────────────────
  console.log('\n🧱 Adding Wall 6 — Double wall (240–360°)…');
  await addWallToArena(page, 'arena-2');
  await waitForNode(page, 'wall-6');
  step('wall-6 created');

  await selectNode(page, 'wall-6');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await sleep(400);
  await selectNode(page, 'wall-6');
  await waitForProps(page);
  await sleep(300);
  await setPropNum(page, 'Arc Start°', 240);
  await setPropNum(page, 'Arc End°', 360);
  await setPropNum(page, 'Height (cm)', 18);
  await setPropToggle(page, 'Enable', true);  // double wall
  await sleep(300);
  // Re-select so Peak Height/Peak Tilt rows appear (conditional on isDouble=true)
  await selectNode(page, 'wall-6');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Peak Height (cm)', 12);
  await setPropNum(page, 'Peak Tilt°', 30);
  await setPropColor(page, 'Color', '#446688');
  step('Wall 6 double wall configured');
  await screenshot(page, 'wall-6_double_wall_tower');

  // ── Trap 3: Saw Trap ─────────────────────────────────────────────────────
  console.log('\n⚡ Adding Trap 3 — Saw Trap…');
  await addTrapToArena(page, 'arena-2');
  await waitForNode(page, 'trap-3');
  step('trap-3 created');

  await selectNode(page, 'trap-3');
  await waitForProps(page);
  await setPropSelect(page, 'Variant', 'saw');
  await setPropSelect(page, 'Effect', 'damage');
  await setPropNum(page, 'Radius (cm)', 8);
  await setPropNum(page, 'Angle°', 270);
  await setPropToggle(page, 'Periodic', true);
  await sleep(300);
  // Re-select to get Safe/Unsafe rows (appear after Periodic toggle)
  await selectNode(page, 'trap-3');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Unsafe (s)', 1.5);
  await setPropNum(page, 'Safe (s)', 1.0);
  await setPropColor(page, 'Color', '#cc2200');
  step('Saw Trap configured');
  await screenshot(page, 'trap-3_saw_trap_tower');

  // ── Speed Line 4: Tower Ring ──────────────────────────────────────────────
  console.log('\n⚡ Adding Speed Line 4 — Tower Ring…');
  await addSpeedLineToArena(page, 'arena-2');
  await waitForNode(page, 'sl-4');
  step('sl-4 created');

  await selectNode(page, 'sl-4');
  await waitForProps(page);
  await setPropNum(page, 'Start Dist', 18);
  await setPropNum(page, 'Start Angle', 0);
  await setPropNum(page, 'Start Dir °', 90);
  await setPropToggle(page, 'Surface Follow', true);
  await setPropNum(page, 'Width cm', 2);
  await setPropColor(page, 'Color', '#ff6600');
  await setPropNum(page, 'Opacity', 0.8);
  await setPropToggle(page, 'Glow', true);
  await setPropSelect(page, 'Direction', 'forward');
  await setPropNum(page, 'Speed ×', 3.0);
  step('Tower Ring configured');
  await screenshot(page, 'sl-4_tower_ring');

  // ═══════════════════════════════════════════════════════════════════════════
  // BRIDGE 1 — Loop Bridge
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🌉 Creating Loop Bridge…');

  await addBridge(page);
  await waitForNode(page, 'bridge-1');
  step('bridge-1 created');

  await selectNode(page, 'bridge-1');
  await waitForProps(page);
  await setPropNum(page, 'Width (cm)', 12);
  await setPropColor(page, 'Color', '#aabbcc');

  // Anchor to arena-1 outer rim at 0° (east side) — bridges default to Floating
  await clickProfileBtn(page, 'Arena');
  await sleep(400);
  await selectNode(page, 'bridge-1');   // re-select so Arena select + Angle° rows appear
  await waitForProps(page);
  await sleep(300);
  await setPropSelect(page, 'Arena', 'arena-1');
  await setPropNum(page, 'Angle°', 0);

  await screenshot(page, 'bridge-1_created');

  // seg-1 is auto-created as 'straight' — just set length
  await waitForNode(page, 'seg-1');
  await selectNode(page, 'seg-1');
  await waitForProps(page);
  await setPropNum(page, 'Length (cm)', 80);
  step('seg-1 straight configured');

  // seg-2: add, change to loop type, re-select, set loop radius
  await addSegmentToBridge(page, 'bridge-1');
  await waitForNode(page, 'seg-2');
  await selectNode(page, 'seg-2');
  await waitForProps(page);
  await clickSegmentType(page, 'Loop');
  await sleep(300);
  await selectNode(page, 'seg-2');   // re-select to get loop-specific rows
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Loop Radius (cm)', 25);
  step('seg-2 loop configured');

  // seg-3: add, change to curve type, re-select, set radius + angle
  await addSegmentToBridge(page, 'bridge-1');
  await waitForNode(page, 'seg-3');
  await selectNode(page, 'seg-3');
  await waitForProps(page);
  await clickSegmentType(page, 'Curve');
  await sleep(300);
  await selectNode(page, 'seg-3');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Radius (cm)', 40);
  await setPropNum(page, 'Angle°', 90);
  step('seg-3 curve configured');

  // wall-7: bridge side wall
  await addWallToBridge(page, 'bridge-1');
  await waitForNode(page, 'wall-7');
  await selectNode(page, 'wall-7');
  await waitForProps(page);
  await setPropNum(page, 'Height (cm)', 12);
  await setPropNum(page, 'Tilt°', -15);
  await setPropColor(page, 'Color', '#8899aa');
  step('wall-7 bridge side wall configured');
  await screenshot(page, 'bridge-1_loop_complete');

  // ═══════════════════════════════════════════════════════════════════════════
  // BRIDGE 2 — Hairpin Bridge
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n🌉 Creating Hairpin Bridge…');

  await addBridge(page);
  await waitForNode(page, 'bridge-2');
  step('bridge-2 created');

  await selectNode(page, 'bridge-2');
  await waitForProps(page);
  await setPropNum(page, 'Width (cm)', 10);
  await setPropColor(page, 'Color', '#cc9944');

  // Anchor inside the moat ring at (0, 30, -40) heading north (+Z) toward the tower island
  await clickProfileBtn(page, 'Free pt');
  await sleep(400);
  await selectNode(page, 'bridge-2');   // re-select so freepoint rows appear
  await waitForProps(page);
  await sleep(300);
  await setPropNum(page, 'X (cm)', 0);
  await setPropNum(page, 'Y (cm)', 30);
  await setPropNum(page, 'Z (cm)', -40);
  await setPropNum(page, 'Heading°', 90);  // 90° = +Z direction (toward tower)

  // seg-4: auto-created straight → change to ramp
  await waitForNode(page, 'seg-4');
  await selectNode(page, 'seg-4');
  await waitForProps(page);
  await clickSegmentType(page, 'Ramp');
  await sleep(300);
  await selectNode(page, 'seg-4');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Length (cm)', 60);
  await setPropNum(page, 'Ramp Angle°', 20);  // 20° gives ~20cm rise to reach island at Y=50
  step('seg-4 ramp configured');

  // seg-5: hairpin
  await addSegmentToBridge(page, 'bridge-2');
  await waitForNode(page, 'seg-5');
  await selectNode(page, 'seg-5');
  await waitForProps(page);
  await clickSegmentType(page, 'Hairpin');
  await sleep(300);
  await selectNode(page, 'seg-5');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Radius (cm)', 20);
  step('seg-5 hairpin configured');

  // seg-6: chicane
  await addSegmentToBridge(page, 'bridge-2');
  await waitForNode(page, 'seg-6');
  await selectNode(page, 'seg-6');
  await waitForProps(page);
  await clickSegmentType(page, 'Chicane');
  await sleep(300);
  await selectNode(page, 'seg-6');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Radius (cm)', 15);
  step('seg-6 chicane configured');
  await screenshot(page, 'bridge-2_hairpin_complete');

  // ═══════════════════════════════════════════════════════════════════════════
  // OBSTACLES
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n⬛ Adding obstacles…');

  // obstacle-1: Boat A (sphere, floating, orange)
  await addObstacle(page);
  await waitForNode(page, 'obstacle-1');
  step('obstacle-1 created');

  await selectNode(page, 'obstacle-1');
  await waitForProps(page);
  // Default is cube — click sphere button, re-select to get Diameter row
  await clickProfileBtn(page, '● sphere');
  await sleep(300);
  await selectNode(page, 'obstacle-1');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Diameter (cm)', 14);
  await setPropNum(page, 'X (cm)', 40);
  await setPropNum(page, 'Y (cm)', 40);
  await setPropNum(page, 'Z (cm)', 0);
  await setPropToggle(page, 'Floating', true);
  await setPropColor(page, 'Color', '#ff6b35');
  await setPropNum(page, 'Glow Intensity', 0.5);
  await setPropColor(page, 'Glow Color', '#ff9955');
  await setPropSelect(page, 'Theme', 'boat');
  step('Boat A configured');
  await screenshot(page, 'obstacle-1_boat_A');

  // obstacle-2: Boat B (cylinder, cyan)
  await addObstacle(page);
  await waitForNode(page, 'obstacle-2');
  step('obstacle-2 created');

  await selectNode(page, 'obstacle-2');
  await waitForProps(page);
  await clickProfileBtn(page, '⬭ cylinder');
  await sleep(300);
  await selectNode(page, 'obstacle-2');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Diameter (cm)', 10);
  await setPropNum(page, 'Height (cm)', 10);
  await setPropNum(page, 'X (cm)', -40);
  await setPropNum(page, 'Y (cm)', 40);
  await setPropNum(page, 'Z (cm)', 0);
  await setPropToggle(page, 'Floating', true);
  await setPropColor(page, 'Color', '#00e5ff');
  await setPropNum(page, 'Glow Intensity', 0.5);
  await setPropColor(page, 'Glow Color', '#00aaff');
  await setPropSelect(page, 'Theme', 'boat');
  step('Boat B configured');
  await screenshot(page, 'obstacle-2_boat_B');

  // obstacle-3: Pillar (cuboid, stone/rock theme)
  await addObstacle(page);
  await waitForNode(page, 'obstacle-3');
  step('obstacle-3 created');

  await selectNode(page, 'obstacle-3');
  await waitForProps(page);
  await clickProfileBtn(page, '▬ cuboid');
  await sleep(300);
  await selectNode(page, 'obstacle-3');
  await waitForProps(page);
  await sleep(200);
  await setPropNum(page, 'Width (cm)', 10);
  await setPropNum(page, 'Height (cm)', 50);
  await setPropNum(page, 'Depth (cm)', 10);
  await setPropNum(page, 'Y (cm)', 50);
  await setPropColor(page, 'Color', '#667788');
  await setPropSelect(page, 'Theme', 'rock');
  step('Pillar configured');
  await screenshot(page, 'obstacle-3_pillar');

  // ═══════════════════════════════════════════════════════════════════════════
  // ROTATIONS — moving boat obstacles
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n↻ Adding rotations…');

  await addRotation(page, 'obstacle-1');
  await waitForNode(page, 'rot-1');
  step('rot-1 created (Boat A orbit)');

  await selectNode(page, 'rot-1');
  await waitForProps(page);
  await setPropSelect(page, 'Mode', 'continuous');
  await setPropNum(page, 'Speed (°/s)', 25);
  await setPropNum(page, 'Pivot X (cm)', 0);
  await setPropNum(page, 'Pivot Y (cm)', 35);
  await setPropNum(page, 'Pivot Z (cm)', 0);
  step('Rot 1 — Boat A orbits CW');
  await screenshot(page, 'rot-1_boat_A_orbit');

  await addRotation(page, 'obstacle-2');
  await waitForNode(page, 'rot-2');
  step('rot-2 created (Boat B counter-orbit)');

  await selectNode(page, 'rot-2');
  await waitForProps(page);
  await setPropSelect(page, 'Mode', 'continuous');
  await setPropNum(page, 'Speed (°/s)', 18);
  // Toggle direction CW→CCW
  const dirRow = await findPropRow(page, 'Direction');
  if (dirRow) {
    const dirBtn = await dirRow.$('.prop-profile-btn');
    if (dirBtn) { await dirBtn.click(); await sleep(200); }
  }
  await setPropNum(page, 'Pivot X (cm)', 0);
  await setPropNum(page, 'Pivot Y (cm)', 35);
  await setPropNum(page, 'Pivot Z (cm)', 0);
  step('Rot 2 — Boat B orbits CCW');
  await screenshot(page, 'rot-2_boat_B_orbit_ccw');

  // ═══════════════════════════════════════════════════════════════════════════
  // BASE TRAP — Trampoline
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n⚡ Adding base trampoline trap…');

  await addBaseTrap(page);
  await waitForNode(page, 'trap-4');
  step('trap-4 created (base)');

  await selectNode(page, 'trap-4');
  await waitForProps(page);
  await setPropSelect(page, 'Variant', 'trampoline');
  await setPropNum(page, 'X (cm)', 80);
  await setPropNum(page, 'Z (cm)', 0);
  await setPropNum(page, 'Force Y (cm/s)', 100);
  await setPropColor(page, 'Color', '#eecc44');
  step('Base trampoline configured');
  await screenshot(page, 'trap-4_base_trampoline');

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTAL 2 — Portal B (base, linked to portal-1)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n◉ Adding Portal B (base)…');

  await addBasePortal(page);
  await waitForNode(page, 'portal-2');
  step('portal-2 created');

  await selectNode(page, 'portal-2');
  await waitForProps(page);
  await setPropNum(page, 'X (cm)', -80);
  await setPropNum(page, 'Z (cm)', 0);
  await setPropSelect(page, 'Type', 'portal');
  await sleep(300);
  // Re-select to get Bidirectional + Target Portal rows
  await selectNode(page, 'portal-2');
  await waitForProps(page);
  await sleep(200);
  await setPropToggle(page, 'Bidirectional', true);
  await setPropColor(page, 'Pad Color', '#ff6b35');
  await setPropColor(page, 'Glow Color', '#ff9944');
  step('Portal B configured');
  await screenshot(page, 'portal-2_portal_B');

  // ── Link portals ──────────────────────────────────────────────────────────
  step('Linking Portal A → Portal B…');
  await selectNode(page, 'portal-1');
  await waitForProps(page);
  await setPropSelect(page, 'Type', 'portal');
  await sleep(300);
  await selectNode(page, 'portal-1');
  await waitForProps(page);
  await sleep(200);
  await setPropToggle(page, 'Bidirectional', true);
  await setPropSelect(page, 'Target Portal', 'portal-2');
  step('Portals linked');
  await screenshot(page, 'portal-1_linked');

  // ═══════════════════════════════════════════════════════════════════════════
  // FINAL OVERVIEW SCREENSHOT
  // ═══════════════════════════════════════════════════════════════════════════
  step('Final overview screenshot…');
  await selectNode(page, 'octagon-base');
  await sleep(800);
  await screenshot(page, 'FINAL_demo_arena_complete');

  console.log('\n✅  Demo arena creation complete!');
  console.log('    Auto-saved to localStorage.');
  console.log(`    📁 Screenshots: ${SCREENSHOTS_DIR}`);
  console.log(`    📸 ${_shotIndex} screenshots taken`);
  console.log('    Browser stays open — close when done reviewing.\n');
}

main().catch(err => {
  console.error('\n❌  Demo builder failed:', err.message);
  console.error('    Make sure dev/preview server is running on http://localhost:3000');
  process.exit(1);
});
