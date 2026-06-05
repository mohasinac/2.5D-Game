/**
 * create-demo-arena.js
 *
 * Puppeteer script that builds the full demo arena by clicking through the
 * Arena Sandbox UI one node at a time.
 *
 * Prerequisites:
 *   npm run dev          (Vite dev server must be running on port 3000)
 *   npm run demo         (runs this script)
 *
 * What it builds:
 *   ├── Moat Arena       (60 cm radius, isMoat, 2 spiral ledges, void particles)
 *   │   ├── Water Zone   (posR=42, fill:water — in the moat ring)
 *   │   ├── Void Zone    (posR=42, fill:void)
 *   │   ├── Wall × 4     (various tilts: waves/serrated/flat, full-perim + partial arcs)
 *   │   ├── Speed Line × 3  (Whirlpool, Flower Pattern, Wall Climb)
 *   │   ├── Trap × 2     (Launch Pad, Buff Zone)
 *   │   └── Portal A     (linked to Portal B)
 *   ├── Tower Arena      (posY=20, step profile, on moat island)
 *   │   ├── Lava Zone
 *   │   ├── Wall × 2     (inward-45°, double-wall)
 *   │   ├── Saw Trap
 *   │   └── Tower Ring speed line
 *   ├── Loop Bridge      (straight → loop → curve, with side wall)
 *   ├── Hairpin Bridge   (ramp → hairpin → chicane)
 *   ├── Obstacle × 3     (Boat A sphere, Boat B cylinder, Pillar cuboid)
 *   ├── Rotation × 2     (Boat A orbits, Boat B orbits counter)
 *   ├── Base Trampoline  (trap on octagon base)
 *   └── Portal B         (linked to Portal A, bidirectional)
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'demo-arena');

const BASE_URL = 'http://localhost:3000';
const STEP_DELAY = 350;    // ms between each action
const NAV_TIMEOUT = 15000; // ms to wait for page load

// ─── Screenshot counter ───────────────────────────────────────────────────────
let _shotIndex = 0;

/** Ensure the screenshots output directory exists. */
function ensureScreenshotsDir() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

/**
 * Take a full-page screenshot and save it to screenshots/demo-arena/.
 * The filename is zero-padded so files sort in creation order.
 * @param {import('puppeteer').Page} page
 * @param {string} label  Short description, used in filename (spaces → underscores).
 */
async function screenshot(page, label) {
  _shotIndex++;
  const safe = label.replace(/[^a-zA-Z0-9_\-]/g, '_').toLowerCase();
  const filename = `${String(_shotIndex).padStart(3, '0')}_${safe}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`  📸 ${filename}`);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/** Wait for a tree node with the given data-id to exist in the DOM. */
async function waitForNode(page, nodeId, timeout = 8000) {
  await page.waitForSelector(`.tree-node[data-id="${nodeId}"]`, { timeout });
  await sleep(120);
}

/** Click the tree row for nodeId to select it and open the properties panel. */
async function selectNode(page, nodeId) {
  await page.click(`.tree-node[data-id="${nodeId}"] .tree-node-row`);
  await sleep(STEP_DELAY);
}

/**
 * Click the "+" add button on a tree node.
 * If the node has multiple child options a floating menu appears; use
 * clickMenuOption() next to pick an item.
 */
async function clickAddBtn(page, nodeId) {
  await page.click(`.tree-node[data-id="${nodeId}"] .tree-add-btn`);
  await sleep(200);
}

/**
 * Click a menu item in the floating .tree-add-menu by its label text.
 * Exact text match (e.g. 'A+', 'Z+', 'SL+').
 */
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

/** Wait for the properties panel to show content (not the empty placeholder). */
async function waitForProps(page) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector('.prop-empty');
      return !el || el.style.display === 'none' || el.offsetParent === null;
    },
    { timeout: 5000 },
  );
  await sleep(150);
}

/**
 * Find the .prop-row whose .prop-label text matches labelText,
 * then interact with the input inside it.
 */
async function findPropRow(page, labelText) {
  const rows = await page.$$('.prop-row');
  for (const row of rows) {
    const label = await row.$('.prop-label');
    if (!label) continue;
    const text = await label.evaluate(el => el.textContent?.trim());
    if (text === labelText) return row;
  }
  return null;
}

/** Set a numeric .prop-input by its label. */
async function setPropNum(page, labelText, value) {
  const row = await findPropRow(page, labelText);
  if (!row) { console.warn(`  [skip] num row not found: "${labelText}"`); return; }
  const input = await row.$('input.prop-input');
  if (!input) { console.warn(`  [skip] no input in row: "${labelText}"`); return; }
  await input.click({ clickCount: 3 });
  await input.type(String(value));
  await page.keyboard.press('Tab');
  await sleep(180);
}

/** Set a .prop-select by its label. optionValue is the <option> value= attribute. */
async function setPropSelect(page, labelText, optionValue) {
  const row = await findPropRow(page, labelText);
  if (!row) { console.warn(`  [skip] select row not found: "${labelText}"`); return; }
  const sel = await row.$('select.prop-select');
  if (!sel) { console.warn(`  [skip] no select in row: "${labelText}"`); return; }
  await sel.select(optionValue);
  await sleep(180);
}

/** Set a color input by its label. hex = '#RRGGBB'. */
async function setPropColor(page, labelText, hex) {
  const row = await findPropRow(page, labelText);
  if (!row) { console.warn(`  [skip] color row not found: "${labelText}"`); return; }
  const input = await row.$('input[type="color"]');
  if (!input) { console.warn(`  [skip] no color input in row: "${labelText}"`); return; }
  await input.evaluate((el, v) => {
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, hex);
  await sleep(180);
}

/**
 * Click a .prop-profile-btn toggle to reach the desired state.
 * on=true means activate it (add .active); on=false means deactivate it.
 */
async function setPropToggle(page, labelText, on) {
  const row = await findPropRow(page, labelText);
  if (!row) { console.warn(`  [skip] toggle row not found: "${labelText}"`); return; }
  const btn = await row.$('.prop-profile-btn');
  if (!btn) { console.warn(`  [skip] no toggle btn in row: "${labelText}"`); return; }
  const isActive = await btn.evaluate(el => el.classList.contains('active'));
  if (isActive !== on) {
    await btn.click();
    await sleep(180);
  }
}

/** Log a step with a leading prefix so progress is easy to read. */
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
  // obstacle/trap/wall nodes have a single ↻+ button, so it fires directly
  await sleep(STEP_DELAY);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🎡  Arena Sandbox — Demo Arena Builder\n');
  console.log('  Make sure "npm run dev" is running on http://localhost:3000\n');

  ensureScreenshotsDir();
  console.log(`  📁 Screenshots → ${SCREENSHOTS_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--window-size=1440,900'],
  });

  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error') console.error('  [page error]', m.text()); });

  // ── Navigate to Arena Sandbox ─────────────────────────────────────────────
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

  step('Configuring Moat Arena properties…');
  await setPropNum(page, 'Radius X', 60);
  await setPropNum(page, 'Radius Z', 60);
  await setPropNum(page, 'Depth', 22);
  await setPropColor(page, 'Color', '#1a3a5c');
  await setPropToggle(page, 'Ring/Moat', true);
  await sleep(300);
  await setPropNum(page, 'Inner R X', 25);
  await setPropNum(page, 'Inner R Z', 25);
  await setPropNum(page, 'Inner Y offset', 20);
  await setPropSelect(page, 'Preset', 'void_motes');
  await setPropNum(page, 'Spiral Count', 2);
  await setPropNum(page, 'Spiral Turns', 1.5);
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
  await setPropSelect(page, 'Fill', 'water');
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
  await setPropSelect(page, 'Fill', 'void');
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
  await setPropToggle(page, 'Full Perimeter', true);
  await setPropNum(page, 'Height (cm)', 20);
  await setPropNum(page, 'Tilt°', -20);
  await setPropSelect(page, 'Top Profile', 'waves');
  await setPropNum(page, 'Amplitude (cm)', 4);
  await setPropNum(page, 'Frequency', 6);
  await setPropColor(page, 'Color', '#2255aa');
  await setPropNum(page, 'Glow Intensity', 0.4);
  await setPropColor(page, 'Glow Color', '#00e5ff');
  step('Wall 1 configured');
  await screenshot(page, 'wall-1_wave_full_perimeter');

  // ── Wall 2: Partial-arc step wall ─────────────────────────────────────────
  console.log('\n🧱 Adding Wall 2 — Step wall (0–180°)…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-2');
  step('wall-2 created');

  await selectNode(page, 'wall-2');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await setPropNum(page, 'Arc Start°', 0);
  await setPropNum(page, 'Arc End°', 180);
  await setPropNum(page, 'Height (cm)', 30);
  await setPropNum(page, 'Tilt°', -35);
  await setPropSelect(page, 'Top Profile', 'serrated');
  await setPropNum(page, 'Amplitude (cm)', 5);
  await setPropNum(page, 'Frequency', 8);
  await setPropColor(page, 'Color', '#334466');
  step('Wall 2 configured');
  await screenshot(page, 'wall-2_serrated_step_0-180deg');

  // ── Wall 3: Partial-arc straight wall (180–360°) ──────────────────────────
  console.log('\n🧱 Adding Wall 3 — Straight wall (180–360°)…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-3');
  step('wall-3 created');

  await selectNode(page, 'wall-3');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await setPropNum(page, 'Arc Start°', 180);
  await setPropNum(page, 'Arc End°', 360);
  await setPropNum(page, 'Height (cm)', 15);
  await setPropNum(page, 'Tilt°', 10);
  await setPropSelect(page, 'Top Profile', 'flat');
  await setPropColor(page, 'Color', '#3a5050');
  step('Wall 3 configured');
  await screenshot(page, 'wall-3_straight_180-360deg');

  // ── Wall 4: Short outward-leaning wall (60–120°) ──────────────────────────
  console.log('\n🧱 Adding Wall 4 — Outward lean (60–120°)…');
  await addWallToArena(page, 'arena-1');
  await waitForNode(page, 'wall-4');
  step('wall-4 created');

  await selectNode(page, 'wall-4');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await setPropNum(page, 'Arc Start°', 60);
  await setPropNum(page, 'Arc End°', 120);
  await setPropNum(page, 'Height (cm)', 25);
  await setPropNum(page, 'Tilt°', 25);
  await setPropSelect(page, 'Top Profile', 'triangles');
  await setPropColor(page, 'Color', '#663322');
  await setPropNum(page, 'Glow Intensity', 0.3);
  await setPropColor(page, 'Glow Color', '#ff6b35');
  step('Wall 4 configured');
  await screenshot(page, 'wall-4_outward_lean_60-120deg');

  // ── Speed Line 1: Whirlpool (circular arc) ────────────────────────────────
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
  await setPropColor(page, 'Glow', '#00ccff');
  await setPropSelect(page, 'Direction', 'forward');
  await setPropNum(page, 'Speed ×', 2.5);
  step('Whirlpool speed line configured');
  await screenshot(page, 'sl-1_whirlpool');

  // ── Speed Line 2: Flower Pattern (radial) ────────────────────────────────
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
  await setPropColor(page, 'Glow', '#ff66cc');
  await setPropSelect(page, 'Direction', 'bidirectional');
  await setPropNum(page, 'Speed ×', 1.8);
  step('Flower Pattern speed line configured');
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
  await setPropNum(page, 'Launch ×', 2.0);
  step('Wall Climb speed line configured');
  await screenshot(page, 'sl-3_wall_climb');

  // ── Trap 1: Launch Pad ───────────────────────────────────────────────────
  console.log('\n⚡ Adding Trap 1 — Launch Pad…');
  await addTrapToArena(page, 'arena-1');
  await waitForNode(page, 'trap-1');
  step('trap-1 created');

  await selectNode(page, 'trap-1');
  await waitForProps(page);
  await setPropSelect(page, 'Variant', 'trampoline');
  await setPropSelect(page, 'Effect', 'launch');
  await setPropNum(page, 'Radius (cm)', 10);
  await setPropNum(page, 'Angle°', 135);
  await setPropNum(page, 'Force Y (cm/s)', 80);
  await setPropColor(page, 'Color', '#ffcc00');
  step('Launch Pad trap configured');
  await screenshot(page, 'trap-1_launch_pad');

  // ── Trap 2: Buff Zone ────────────────────────────────────────────────────
  console.log('\n⚡ Adding Trap 2 — Buff Zone…');
  await addTrapToArena(page, 'arena-1');
  await waitForNode(page, 'trap-2');
  step('trap-2 created');

  await selectNode(page, 'trap-2');
  await waitForProps(page);
  await setPropSelect(page, 'Variant', 'buff');
  await setPropSelect(page, 'Effect', 'buff_zone');
  await setPropNum(page, 'Radius (cm)', 12);
  await setPropNum(page, 'Angle°', 315);
  await setPropColor(page, 'Color', '#cc8800');
  step('Buff Zone trap configured');
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
  await setPropSelect(page, 'Wall Profile', 'step');
  await setPropNum(page, 'Step Count', 3);
  await setPropColor(page, 'Color', '#2d4a7a');
  await setPropSelect(page, 'Preset', 'embers');
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
  await setPropSelect(page, 'Fill', 'lava');
  await setPropColor(page, 'Glow Color', '#ff4400');
  await setPropSelect(page, 'Preset', 'embers');
  step('Lava Zone configured');
  await screenshot(page, 'zone-3_lava_zone');

  // ── Wall 5: Full-perimeter inward tilt ───────────────────────────────────
  console.log('\n🧱 Adding Wall 5 — Inward tilt -45°…');
  await addWallToArena(page, 'arena-2');
  await waitForNode(page, 'wall-5');
  step('wall-5 created');

  await selectNode(page, 'wall-5');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', true);
  await setPropNum(page, 'Height (cm)', 20);
  await setPropNum(page, 'Tilt°', -45);
  await setPropSelect(page, 'Top Profile', 'flat');
  await setPropColor(page, 'Color', '#1a3355');
  await setPropNum(page, 'Glow Intensity', 0.5);
  await setPropColor(page, 'Glow Color', '#3366ff');
  step('Wall 5 configured');
  await screenshot(page, 'wall-5_inward_-45deg_tower');

  // ── Wall 6: Double wall ──────────────────────────────────────────────────
  console.log('\n🧱 Adding Wall 6 — Double wall…');
  await addWallToArena(page, 'arena-2');
  await waitForNode(page, 'wall-6');
  step('wall-6 created');

  await selectNode(page, 'wall-6');
  await waitForProps(page);
  await setPropToggle(page, 'Full Perimeter', false);
  await setPropNum(page, 'Arc Start°', 240);
  await setPropNum(page, 'Arc End°', 360);
  await setPropNum(page, 'Height (cm)', 18);
  await setPropToggle(page, 'Enable', true);  // double wall enable toggle
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
  await setPropNum(page, 'Damage Factor', 1.5);
  await setPropToggle(page, 'Periodic', true);
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
  await setPropSelect(page, 'Direction', 'forward');
  await setPropNum(page, 'Speed ×', 3.0);
  step('Tower Ring speed line configured');
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
  step('Loop Bridge section configured');
  await screenshot(page, 'bridge-1_loop_bridge_created');

  // seg-1: straight 80 cm
  step('Configuring seg-1 (straight)…');
  await waitForNode(page, 'seg-1');
  await selectNode(page, 'seg-1');
  await waitForProps(page);
  await setPropNum(page, 'Length (cm)', 80);

  // seg-2: loop
  step('Adding seg-2 (loop)…');
  await addSegmentToBridge(page, 'bridge-1');
  await waitForNode(page, 'seg-2');
  await selectNode(page, 'seg-2');
  await waitForProps(page);
  await setPropSelect(page, 'Type', 'loop');
  await sleep(300);
  await setPropNum(page, 'Loop Radius (cm)', 25);

  // seg-3: curve
  step('Adding seg-3 (curve)…');
  await addSegmentToBridge(page, 'bridge-1');
  await waitForNode(page, 'seg-3');
  await selectNode(page, 'seg-3');
  await waitForProps(page);
  await setPropSelect(page, 'Type', 'curve');
  await sleep(300);
  await setPropNum(page, 'Radius (cm)', 40);
  await setPropNum(page, 'Angle°', 90);

  // wall-7: side wall on bridge
  step('Adding wall-7 (bridge side wall)…');
  await addWallToBridge(page, 'bridge-1');
  await waitForNode(page, 'wall-7');
  await selectNode(page, 'wall-7');
  await waitForProps(page);
  await setPropNum(page, 'Height (cm)', 12);
  await setPropNum(page, 'Tilt°', -15);
  await setPropColor(page, 'Color', '#8899aa');
  step('Loop Bridge complete');
  await screenshot(page, 'bridge-1_loop_bridge_complete');

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

  // seg-4: ramp
  step('Configuring seg-4 (ramp)…');
  await waitForNode(page, 'seg-4');
  await selectNode(page, 'seg-4');
  await waitForProps(page);
  await setPropSelect(page, 'Type', 'ramp');
  await sleep(300);
  await setPropNum(page, 'Length (cm)', 60);
  await setPropNum(page, 'Ramp Angle°', 15);

  // seg-5: hairpin
  step('Adding seg-5 (hairpin)…');
  await addSegmentToBridge(page, 'bridge-2');
  await waitForNode(page, 'seg-5');
  await selectNode(page, 'seg-5');
  await waitForProps(page);
  await setPropSelect(page, 'Type', 'hairpin');
  await sleep(300);
  await setPropNum(page, 'Radius (cm)', 20);

  // seg-6: chicane
  step('Adding seg-6 (chicane)…');
  await addSegmentToBridge(page, 'bridge-2');
  await waitForNode(page, 'seg-6');
  await selectNode(page, 'seg-6');
  await waitForProps(page);
  await setPropSelect(page, 'Type', 'chicane');
  await sleep(300);
  await setPropNum(page, 'Radius (cm)', 15);
  step('Hairpin Bridge complete');
  await screenshot(page, 'bridge-2_hairpin_bridge_complete');

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
  await setPropSelect(page, 'Shape', 'sphere');
  await setPropNum(page, 'X (cm)', 14);
  await setPropNum(page, 'Y (cm)', 14);
  await setPropNum(page, 'Z (cm)', 14);
  await setPropNum(page, 'X (cm)', 40);   // posX
  await sleep(100);

  // The position and dim rows both use 'X (cm)', so target more carefully:
  // We'll set dimX via the first occurrence and posX via the later one.
  // This is best handled inline since findPropRow returns the FIRST match.
  // Use page.evaluate to target specifically.
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.prop-row')];
    const dimRow = rows.find(r => {
      const labels = r.querySelectorAll('.prop-label');
      return [...labels].some(l => l.textContent?.trim() === 'X (cm)');
    });
    if (dimRow) {
      const input = dimRow.querySelector('input.prop-input');
      if (input) { input.value = '14'; input.dispatchEvent(new Event('input', { bubbles: true })); }
    }
  });
  await sleep(150);

  await setPropNum(page, 'Y (cm)', 38);   // posY
  await setPropToggle(page, 'Floating', true);
  await setPropColor(page, 'Color', '#ff6b35');
  await setPropNum(page, 'Glow Intensity', 0.5);
  await setPropColor(page, 'Glow Color', '#ff9955');
  step('Boat A configured');
  await screenshot(page, 'obstacle-1_boat_A_sphere');

  // obstacle-2: Boat B (cylinder, cyan)
  await addObstacle(page);
  await waitForNode(page, 'obstacle-2');
  step('obstacle-2 created');

  await selectNode(page, 'obstacle-2');
  await waitForProps(page);
  await setPropSelect(page, 'Shape', 'cylinder');
  await setPropNum(page, 'Y (cm)', 38);
  await setPropToggle(page, 'Floating', true);
  await setPropColor(page, 'Color', '#00e5ff');
  await setPropNum(page, 'Glow Intensity', 0.5);
  await setPropColor(page, 'Glow Color', '#00aaff');
  step('Boat B configured');
  await screenshot(page, 'obstacle-2_boat_B_cylinder');

  // obstacle-3: Pillar (cuboid, stone)
  await addObstacle(page);
  await waitForNode(page, 'obstacle-3');
  step('obstacle-3 created');

  await selectNode(page, 'obstacle-3');
  await waitForProps(page);
  await setPropSelect(page, 'Shape', 'cuboid');
  await setPropNum(page, 'Y (cm)', 50);
  await setPropNum(page, 'Z (cm)', 10);
  await setPropColor(page, 'Color', '#667788');
  await setPropSelect(page, 'Theme', 'stone');
  step('Pillar configured');
  await screenshot(page, 'obstacle-3_pillar_cuboid');

  // ═══════════════════════════════════════════════════════════════════════════
  // ROTATIONS — moving boat obstacles
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n↻ Adding rotations for moving boats…');

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
  step('Rot 1 configured — Boat A orbits arena center');
  await screenshot(page, 'rot-1_orbit_boat_A');

  await addRotation(page, 'obstacle-2');
  await waitForNode(page, 'rot-2');
  step('rot-2 created (Boat B orbit)');

  await selectNode(page, 'rot-2');
  await waitForProps(page);
  await setPropSelect(page, 'Mode', 'continuous');
  await setPropNum(page, 'Speed (°/s)', -18);
  await setPropNum(page, 'Pivot X (cm)', 0);
  await setPropNum(page, 'Pivot Y (cm)', 35);
  await setPropNum(page, 'Pivot Z (cm)', 0);
  step('Rot 2 configured — Boat B orbits counter-clockwise');
  await screenshot(page, 'rot-2_orbit_boat_B_counter');

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
  await setPropSelect(page, 'Effect', 'launch');
  await setPropNum(page, 'X (cm)', 80);
  await setPropNum(page, 'Z (cm)', 0);
  await setPropNum(page, 'Force Y (cm/s)', 100);
  await setPropColor(page, 'Color', '#eecc44');
  step('Base trampoline configured');
  await screenshot(page, 'trap-4_base_trampoline');

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTAL 2 — Portal B (on base, bidirectional, linked to portal-1)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n◉ Adding Portal B (base portal)…');

  await addBasePortal(page);
  await waitForNode(page, 'portal-2');
  step('portal-2 created');

  await selectNode(page, 'portal-2');
  await waitForProps(page);
  await setPropNum(page, 'X (cm)', -80);
  await setPropNum(page, 'Z (cm)', 0);
  await setPropSelect(page, 'Type', 'portal');
  await setPropToggle(page, 'Bidirectional', true);
  await setPropColor(page, 'Pad Color', '#ff6b35');
  await setPropColor(page, 'Glow Color', '#ff9944');
  step('Portal B configured');
  await screenshot(page, 'portal-2_portal_B_base');

  // ── Link portals ─────────────────────────────────────────────────────────
  step('Linking Portal A → Portal B…');
  await selectNode(page, 'portal-1');
  await waitForProps(page);
  await setPropSelect(page, 'Type', 'portal');
  await setPropToggle(page, 'Bidirectional', true);
  // Set destPortalId to portal-2 if a Target Portal select exists
  await setPropSelect(page, 'Target Portal', 'portal-2');
  step('Portals linked');
  await screenshot(page, 'portal-1_linked_to_portal_B');

  // ═══════════════════════════════════════════════════════════════════════════
  // FINAL OVERVIEW SCREENSHOT — deselect everything, full scene visible
  // ═══════════════════════════════════════════════════════════════════════════
  step('Taking final overview screenshot…');
  // Click the octagon-base label (neutral selection, no props panel clutter)
  await selectNode(page, 'octagon-base');
  await sleep(600);
  await screenshot(page, 'FINAL_demo_arena_complete');

  // ═══════════════════════════════════════════════════════════════════════════
  // DONE
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n✅  Demo arena creation complete!');
  console.log('    The arena has been auto-saved to localStorage.');
  console.log(`    📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log(`    📸 ${_shotIndex} screenshots taken`);
  console.log('    Browser will remain open — close it when done reviewing.\n');

  console.log('  Nodes created:');
  console.log('    arena-1  Moat Arena (60 cm, isMoat, 2 spiral ledges)');
  console.log('    arena-2  Tower Arena (22 cm, step profile, posY=20)');
  console.log('    zone-1   Water Zone (water fill, moat ring)');
  console.log('    zone-2   Void Zone');
  console.log('    zone-3   Lava Zone (tower)');
  console.log('    wall-1   Full-perimeter waves (-20° tilt)');
  console.log('    wall-2   Step/serrated 0–180° (-35° tilt)');
  console.log('    wall-3   Flat 180–360° (+10° tilt)');
  console.log('    wall-4   Triangles 60–120° (+25° tilt)');
  console.log('    wall-5   Full-perimeter inward (-45°, tower)');
  console.log('    wall-6   Double wall (tower)');
  console.log('    wall-7   Bridge side wall');
  console.log('    sl-1     Whirlpool speed line');
  console.log('    sl-2     Flower Pattern speed line');
  console.log('    sl-3     Wall Climb speed line');
  console.log('    sl-4     Tower Ring speed line');
  console.log('    trap-1   Launch Pad (trampoline)');
  console.log('    trap-2   Buff Zone (sand)');
  console.log('    trap-3   Saw Trap (damage, periodic)');
  console.log('    trap-4   Base Trampoline');
  console.log('    portal-1 Portal A (cyan, arena)');
  console.log('    portal-2 Portal B (orange, base, bidirectional)');
  console.log('    bridge-1 Loop Bridge (straight + loop + curve)');
  console.log('    bridge-2 Hairpin Bridge (ramp + hairpin + chicane)');
  console.log('    obstacle-1 Boat A (sphere, floating, orbiting)');
  console.log('    obstacle-2 Boat B (cylinder, floating, orbiting)');
  console.log('    obstacle-3 Pillar (cuboid, stone)');
  console.log('    rot-1    Orbit A (25°/s)');
  console.log('    rot-2    Orbit B (-18°/s counter)');
}

main().catch(err => {
  console.error('\n❌  Demo builder failed:', err.message);
  console.error('    Make sure "npm run dev" is running on http://localhost:3000');
  process.exit(1);
});
