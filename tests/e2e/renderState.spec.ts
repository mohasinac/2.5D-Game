import { test, expect } from '@playwright/test';

/**
 * Asserts on *how* the arena scene is drawn, via the dev-only
 * `window.__demo.getRenderStats()`.
 *
 * WHY THIS EXISTS
 * ───────────────
 * Every check here corresponds to a defect that a fully green suite did not
 * catch, because none of them throws, logs, or changes the DOM — the scene just
 * quietly looks worse:
 *
 *   - `applyRenderPolicy` cleared `castShadow` on the DirectionalLight (a Light
 *     has no material, so it read as a diagram element). Result: the renderer
 *     had shadows enabled, meshes were flagged to cast and receive, and not one
 *     shadow was drawn. All 57 tests passed.
 *   - `Material.toneMapped` defaults to true, so any edge line or sprite added
 *     outside the policy gets desaturated by ACES — the authored cyan/orange
 *     palette dulls with nothing to indicate why.
 *
 * `tests/unit/renderPolicy.spec.ts` proves the policy decides correctly in
 * isolation; this proves it was actually applied to the live scene, which is a
 * different claim and the one that broke.
 */

/* `__demo` is dev-only and mounted by ArenaSandbox. */
const ARENA = '/arena';

interface RenderStats {
  toneMapping: number;
  outputColorSpace: string;
  shadowMapEnabled: boolean;
  shadowMapType: number;
  environmentSet: boolean;
  environmentIntensity: number;
  litCasters: number;
  litReceivers: number;
  unlitExcluded: number;
  toneMappedUnlit: number;
  shadowLights: number;
  shadowCamera: { left: number; right: number; top: number; bottom: number; near: number; far: number } | null;
  shadowMapSize: { width: number; height: number } | null;
}

test.describe('arena render state', () => {
  let stats: RenderStats;

  test.beforeEach(async ({ page }) => {
    await page.goto(ARENA, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean((window as never as { __demo?: unknown }).__demo), null, { timeout: 30_000 });

    /* Load a real arena so the scene holds actual geometry — an empty scene
       would pass the "no unlit material is tone-mapped" check vacuously. */
    await page.evaluate(async () => {
      /* Non-literal specifier on purpose: this path is resolved by the Vite dev
         server in the browser, and a literal would make `tsc` try to resolve it
         from the test file's own directory and fail. */
      const spec = '/src/config/demoArenaConfig.ts';
      const m = await import(/* @vite-ignore */ spec) as { DEMO_ARENA_CONFIG: unknown };
      await (window as never as { __demo: { loadArenaConfig(c: unknown): Promise<void> } })
        .__demo.loadArenaConfig(m.DEMO_ARENA_CONFIG);
    });
    await page.waitForTimeout(1500);

    stats = await page.evaluate(() =>
      (window as never as { __demo: { getRenderStats(): RenderStats } }).__demo.getRenderStats());
  });

  test('ACES tone mapping and sRGB output are active', () => {
    expect(stats.toneMapping).toBe(4);            // THREE.ACESFilmicToneMapping
    expect(stats.outputColorSpace).toBe('srgb');
  });

  test('the environment map is attached — PBR has something to reflect', () => {
    // Without this, every MeshStandardMaterial is a PBR material in an empty
    // room and `metal` renders near-black.
    expect(stats.environmentSet).toBe(true);
    expect(stats.environmentIntensity).toBeGreaterThan(0);
  });

  test('soft shadow mapping is enabled on the renderer', () => {
    expect(stats.shadowMapEnabled).toBe(true);
    expect(stats.shadowMapType).toBe(2);          // THREE.PCFSoftShadowMap
  });

  test('REGRESSION: a shadow-casting light actually survives into the scene', () => {
    // The exact defect the policy introduced. Renderer-side shadow settings
    // being correct is not sufficient — something has to cast.
    expect(stats.shadowLights).toBeGreaterThanOrEqual(1);
  });

  test('the shadow frustum is fitted to the scene, not left at the default', () => {
    // A directional light's shadow camera is orthographic and does not follow
    // the scene. Three's default is +-5, which at arena scale (gridSize 200)
    // would cover a 10 cm patch at the origin and nothing else.
    expect(stats.shadowCamera).not.toBeNull();
    const c = stats.shadowCamera!;
    expect(c.right - c.left).toBeGreaterThan(100);
    expect(c.top - c.bottom).toBeGreaterThan(100);
    expect(c.far).toBeGreaterThan(c.near);
    expect(stats.shadowMapSize!.width).toBeGreaterThanOrEqual(1024);
  });

  test('lit surfaces cast and receive', () => {
    expect(stats.litCasters).toBeGreaterThan(0);
    expect(stats.litReceivers).toBeGreaterThan(0);
  });

  test('THE PALETTE GUARD: no unlit material is left tone-mapped', () => {
    // Must be exactly 0. Any non-zero value is an authored colour being pushed
    // through the ACES exposure curve — the cyan/orange palette going dull with
    // no other symptom.
    expect(stats.unlitExcluded).toBeGreaterThan(0);   // the scene really has diagram elements
    expect(stats.toneMappedUnlit).toBe(0);
  });
});
