import type { ArenaData, EnvKeyframe, EnvProperty, EnvScheduleEntry, WeatherPreset } from '../../types/arenaTypes';
import type { ITickableManager } from '../IArenaFeature';

export class ArenaEnvironmentManager implements ITickableManager {
  constructor(
    private readonly getArenas:    () => ReadonlyMap<string, ArenaData>,
    private readonly onEnvChange:  (arenaId: string, changedProps: EnvProperty[]) => void,
    private readonly onSoundEvent: (arenaId: string, soundEvent: string) => void,
  ) {}

  // ── ITickableManager ──────────────────────────────────────────────────────
  tick(dt: number): void {
    for (const [arenaId, arena] of this.getArenas().entries()) {
      if (arena.pointsPerSecond > 0) {
        arena._score += arena.pointsPerSecond * arena.scoreMultiplier * dt;
      }

      for (const entry of arena.envSchedule) {
        if (!entry.enabled) continue;

        // Advance revert timer first
        if (entry._revertTimer !== undefined && entry._prevValues && entry.revertSec > 0) {
          entry._revertTimer += dt;
          if (entry._revertTimer >= entry.revertSec) {
            this._applyKeyframes(arena, entry._prevValues);
            this.onEnvChange(arenaId, entry._prevValues.map(k => k.property));
            entry._revertTimer = undefined;
            entry._prevValues  = undefined;
            continue;
          }
        }

        if (entry.triggerType === 'interval') {
          if (entry._timer === undefined) entry._timer = entry.intervalSec - entry.delaySec;
          entry._timer -= dt;
          if (entry._timer <= 0) {
            this._fireEntry(arenaId, arena, entry);
            entry._timer = entry.intervalSec;
          }
        } else if (entry.triggerType === 'once') {
          entry._timer = (entry._timer ?? 0) + dt;
          if (entry._timer >= entry.delaySec) {
            this._fireEntry(arenaId, arena, entry);
            entry.enabled = false;
            entry._timer  = undefined;
          }
        }
        // 'event' entries fired only via triggerEvent()
      }
    }
  }

  // ── Public setters ────────────────────────────────────────────────────────
  setGravity(arenaId: string, scale: number, dirX = 0, dirZ = 0): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    arena.gravityScale      = scale;
    arena.gravityDirectionX = dirX;
    arena.gravityDirectionZ = dirZ;
    this.onEnvChange(arenaId, ['gravityScale', 'gravityDirectionX', 'gravityDirectionZ']);
  }

  setWeather(arenaId: string, preset: WeatherPreset, opts?: Partial<Pick<ArenaData,
    'windEnabled' | 'windDirectionDeg' | 'windStrengthCms' | 'windGustInterval' | 'windGustMult'
  >>): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    arena.weatherPreset = preset;
    if (opts) Object.assign(arena, opts);
    const changed: EnvProperty[] = ['weatherPreset'];
    if (opts?.windEnabled      !== undefined) changed.push('windEnabled');
    if (opts?.windDirectionDeg !== undefined) changed.push('windDirectionDeg');
    if (opts?.windStrengthCms  !== undefined) changed.push('windStrengthCms');
    if (opts?.windGustInterval !== undefined) changed.push('windGustInterval');
    if (opts?.windGustMult     !== undefined) changed.push('windGustMult');
    this.onEnvChange(arenaId, changed);
  }

  setTilt(arenaId: string, tiltX: number, tiltZ: number): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    arena.tiltX = tiltX;
    arena.tiltZ = tiltZ;
    this.onEnvChange(arenaId, ['tiltX', 'tiltZ']);
  }

  setFog(arenaId: string, density: number): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    arena.fogDensity = density;
    this.onEnvChange(arenaId, ['fogDensity']);
  }

  setScoreMultiplier(arenaId: string, mult: number): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    arena.scoreMultiplier = mult;
    this.onEnvChange(arenaId, ['scoreMultiplier']);
  }

  addScore(arenaId: string, points: number): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    arena._score += points * arena.scoreMultiplier;
  }

  /** Fire all 'event' schedule entries matching eventName for the given arena. */
  triggerEvent(arenaId: string, eventName: string): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    for (const entry of arena.envSchedule) {
      if (entry.enabled && entry.triggerType === 'event' && entry.eventName === eventName) {
        this._fireEntry(arenaId, arena, entry);
      }
    }
  }

  // ── Schedule management ───────────────────────────────────────────────────
  addEntry(arenaId: string, entry: EnvScheduleEntry): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    entry._timer       = entry.triggerType === 'interval' ? entry.intervalSec - entry.delaySec : 0;
    entry._revertTimer = undefined;
    entry._prevValues  = undefined;
    arena.envSchedule.push(entry);
  }

  removeEntry(arenaId: string, entryId: string): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    const idx = arena.envSchedule.findIndex(e => e.id === entryId);
    if (idx !== -1) arena.envSchedule.splice(idx, 1);
  }

  updateEntry(arenaId: string, entry: EnvScheduleEntry): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    const idx = arena.envSchedule.findIndex(e => e.id === entry.id);
    if (idx !== -1) {
      const prev = arena.envSchedule[idx];
      entry._timer       = prev._timer;
      entry._revertTimer = prev._revertTimer;
      entry._prevValues  = prev._prevValues;
      arena.envSchedule[idx] = entry;
    }
  }

  clearSchedule(arenaId: string): void {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return;
    arena.envSchedule = [];
  }

  /** Reset all runtime timers — call when the scene is cleared. */
  clear(): void {
    for (const arena of this.getArenas().values()) {
      for (const entry of arena.envSchedule) {
        entry._timer       = undefined;
        entry._revertTimer = undefined;
        entry._prevValues  = undefined;
      }
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private _fireEntry(arenaId: string, arena: ArenaData, entry: EnvScheduleEntry): void {
    if (entry.revertSec > 0 && !entry._prevValues) {
      const snap = arena as unknown as Record<string, number | string | boolean>;
      entry._prevValues  = entry.keyframes.map(k => ({ property: k.property, value: snap[k.property] }));
      entry._revertTimer = 0;
    }
    this._applyKeyframes(arena, entry.keyframes);
    this.onEnvChange(arenaId, entry.keyframes.map(k => k.property));
    if (entry.soundEvent) this.onSoundEvent(arenaId, entry.soundEvent);
  }

  private _applyKeyframes(arena: ArenaData, keyframes: EnvKeyframe[]): void {
    const a = arena as unknown as Record<string, number | string | boolean>;
    for (const kf of keyframes) a[kf.property] = kf.value;
  }
}
