/**
 * DemoDriver — typed wrapper over `window.__demo` for the feature demos.
 *
 * Everything goes through the dev-only demo API rather than the real UI, so a
 * demo can place a bey at an exact position and replay identically.
 */

import type { Page } from '@playwright/test';
import type { ArenaConfig } from '../../src/utils/arenaPersistence';

export interface Vec3 { x: number; y: number; z: number }

export interface BeyState {
  pos: Vec3; vel: Vec3; speed: number;
  health: number; rpm: number; grounded: boolean; spawned: boolean;
}

/** Fixed step so repeat runs of the same demo produce the same motion. */
export const FIXED_DT_MS = 16.667;

export class DemoDriver {
  constructor(readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/arena', { waitUntil: 'domcontentloaded' });
    await this.page.waitForFunction(
      () => (window as never as { __demo?: { ready?: boolean } }).__demo?.ready === true,
      undefined,
      { timeout: 30_000 },
    );
    await this.page.evaluate((dt) => window.__demo.setFixedTimestep(dt), FIXED_DT_MS);
    // Editor panels would otherwise cover most of every demo frame.
    await this.page.evaluate(() => window.__demo.setChromeVisible(false));
  }

  async load(cfg: ArenaConfig): Promise<void> {
    await this.page.evaluate(async (c) => {
      window.__demo.despawnBey();
      window.__demo.clearMarkers();
      await window.__demo.loadArenaConfig(c as never);
    }, cfg as never);
  }

  async narrate(title: string, sub = ''): Promise<void> {
    await this.page.evaluate(
      (a: { title: string; sub: string }) => window.__demo.narrate(a.title, a.sub),
      { title, sub },
    );
  }

  async spawn(opts: { pos?: Vec3; vel?: Vec3; rpm?: number; tiltDeg?: number } = {}): Promise<void> {
    await this.page.evaluate((o) => window.__demo.spawnBey(o as never), opts as never);
  }

  async despawn(): Promise<void> {
    await this.page.evaluate(() => window.__demo.despawnBey());
  }

  async state(): Promise<BeyState | null> {
    return this.page.evaluate(() => window.__demo.getBeyState() as never);
  }

  async setVelocity(v: Vec3): Promise<void> {
    await this.page.evaluate((x) => window.__demo.setBeyVelocity(x as never), v as never);
  }

  async setPosition(p: Vec3): Promise<void> {
    await this.page.evaluate((x) => window.__demo.setBeyPosition(x as never), p as never);
  }

  async camera(pos: Vec3, target: Vec3): Promise<void> {
    await this.page.evaluate(
      (a: { pos: Vec3; target: Vec3 }) => window.__demo.setCamera(a.pos, a.target),
      { pos, target },
    );
  }

  async focusOn(featureId: string, distance = 110): Promise<boolean> {
    return this.page.evaluate(
      (a: { id: string; distance: number }) => window.__demo.focusOn(a.id, a.distance),
      { id: featureId, distance },
    );
  }

  async mark(featureId: string): Promise<boolean> {
    return this.page.evaluate((id) => window.__demo.markFeature(id as string), featureId as never);
  }

  async featureState(featureId: string): Promise<Record<string, unknown> | null> {
    return this.page.evaluate(
      (id) => window.__demo.getFeatureState(id as string) as never,
      featureId as never,
    );
  }

  /** Let the simulation run. Uses real time; the fixed dt keeps motion repeatable. */
  async settle(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async waitForRest(speed = 3, timeoutMs = 6000): Promise<boolean> {
    return this.page.evaluate(
      (a: { speed: number; timeoutMs: number }) =>
        window.__demo.waitForRest(a.speed, a.timeoutMs),
      { speed, timeoutMs },
    );
  }

  /** Drop a bey from above the given XZ and let it fall into the bowl. */
  async drop(x: number, z: number, y = 45, vel?: Vec3): Promise<void> {
    await this.spawn({ pos: { x, y, z }, vel: vel ?? { x: 0, y: 0, z: 0 }, rpm: 1500 });
  }

  /** Launch a bey across the bowl so it interacts with walls and features. */
  async launch(from: Vec3, vel: Vec3): Promise<void> {
    await this.spawn({ pos: from, vel, rpm: 1800 });
  }
}

declare global {
  interface Window {
    __demo: {
      ready: boolean;
      loadArenaConfig(cfg: unknown): Promise<void>;
      clear(): void;
      spawnBey(o?: unknown): void;
      despawnBey(): void;
      getBeyState(): unknown;
      setBeyPosition(p: unknown): void;
      setBeyVelocity(v: unknown): void;
      setRosterState(id: string, patch: unknown): boolean;
      setFixedTimestep(ms: number | null): void;
      freeze(): void;
      resume(): void;
      step(n?: number): void;
      settle(ms: number): Promise<void>;
      setCamera(pos: unknown, target: unknown): void;
      focusOn(id: string, distance?: number): boolean;
      markFeature(id: string, color?: number): boolean;
      clearMarkers(): void;
      getFeatureState(id: string): unknown;
      narrate(title: string, sub?: string): void;
      clearNarration(): void;
      setChromeVisible(visible: boolean): void;
      waitForRest(speed?: number, timeoutMs?: number): Promise<boolean>;
      /* Diagnostics. `unknown` deliberately, as everything else here is: the
         real shapes live in `src/utils/demoApi.ts` and duplicating them would
         give two declarations to keep in step. Specs cast at the call site. */
      probeDown(x: number, z: number): unknown;
      getBridgeDiag(): unknown;
      getMatchDiag(): unknown;
    };
  }
}
