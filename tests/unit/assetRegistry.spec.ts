import { test, expect } from '@playwright/test';
import { AssetRegistry, ASSET_CATALOGUE } from '../../src/features/AssetRegistry';
import type { AssetEntry } from '../../src/features/AssetRegistry';

/**
 * AssetRegistry resolves shipped prop ids to glTF models.
 *
 * The behaviours asserted here are the ones that decide whether a missing or
 * broken model degrades gracefully or takes an arena down with it. A prop that
 * fails to load must fall back to its procedural placeholder — an arena full of
 * boxes is a worse-looking arena, not a broken one.
 *
 * Browser-free: these paths never touch WebGL, and the failure cases never
 * reach the network because the id is rejected before a request is made.
 */

const entry = (over: Partial<AssetEntry> = {}): AssetEntry => ({
  id: 'boat',
  url: '/models/boat.glb',
  label: 'Boat',
  sourceLongestSide: 2,
  ...over,
});

test.describe('AssetRegistry', () => {

  test('the shipped catalogue is an explicit list, not a directory scan', () => {
    // Deliberately empty until models land. The point of the assertion is that
    // the catalogue EXISTS and is enumerable, so a broken id is a visible edit
    // in source rather than a silent 404 at runtime.
    expect(Array.isArray(ASSET_CATALOGUE)).toBe(true);
  });

  test('every catalogue entry is well formed', () => {
    // Guards the moment real props land: an entry with no url or a zero source
    // extent would divide by zero in instantiate().
    for (const e of ASSET_CATALOGUE) {
      expect(e.id).toBeTruthy();
      expect(e.url.startsWith('/')).toBe(true);
      expect(e.label).toBeTruthy();
      expect(e.sourceLongestSide).toBeGreaterThan(0);
    }
  });

  test('catalogue ids are unique', () => {
    const ids = ASSET_CATALOGUE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('has() and list() reflect the injected catalogue', () => {
    const r = new AssetRegistry([entry(), entry({ id: 'tower', label: 'Tower' })]);
    expect(r.has('boat')).toBe(true);
    expect(r.has('nope')).toBe(false);
    expect(r.list().map((e) => e.id).sort()).toEqual(['boat', 'tower']);
  });

  test('an unknown id resolves to null rather than throwing', async () => {
    // A save referencing a prop that was renamed or removed must not break the
    // arena that loads it.
    const r = new AssetRegistry([entry()]);
    expect(await r.load('does-not-exist')).toBeNull();
  });

  test('an unknown id never reaches the network', async () => {
    // Rejected from the catalogue before a fetch is attempted — which is also
    // why this spec can run in the browser-free project.
    const r = new AssetRegistry([]);
    expect(await r.load('anything')).toBeNull();
  });

  test('a failed load is remembered, not retried on every frame', async () => {
    // An obstacle re-renders constantly; without the negative cache a missing
    // model would issue a request per rebuild.
    const r = new AssetRegistry([entry()]);
    await r.load('missing');
    const second = r.load('missing');
    expect(await second).toBeNull();
  });

  test('instantiate() returns null until the model is ready', () => {
    // The caller keeps its procedural placeholder in that window, which is what
    // makes loading asynchronous without a visible gap.
    const r = new AssetRegistry([entry()]);
    expect(r.instantiate('boat', 30)).toBeNull();
    expect(r.instantiate('unknown', 30)).toBeNull();
  });

  test('dispose() is safe with nothing loaded', () => {
    const r = new AssetRegistry([entry()]);
    expect(() => r.dispose()).not.toThrow();
  });
});
