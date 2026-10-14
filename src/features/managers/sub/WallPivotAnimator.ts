/**
 * Stateless singleton for wall pivot rotation animation.
 * Extracted from WallManager.tick() so the logic is testable in isolation.
 */

import type { WallData } from '../../../types/arenaTypes';

const DEG2RAD = Math.PI / 180;
const TWO_PI  = Math.PI * 2;

export class WallPivotAnimator {
  /**
   * @param simTimeSec  Simulated seconds, from the injected SimClock — NOT wall time.
   *
   * This previously read `performance.now()`, which made a wall's oscillation a
   * function of real time. That meant the arena *geometry itself* was
   * non-deterministic: two battles started three seconds apart had their walls
   * in different places, and a replay could collide with a wall that had moved.
   * Taking sim time as a parameter keeps this class stateless and replayable.
   */
  tick(wall: WallData, dt: number, simTimeSec: number): void {
    if (!wall.rotateOnArena || !wall._rotatePivot) return;
    const t = simTimeSec;
    switch (wall.arenaRotateMode) {
      case 'continuous':
        wall._rotatePivot.rotation.y += wall.arenaRotateSpeed * DEG2RAD * dt;
        break;
      case 'step':
        wall._arenaRotateTimer = (wall._arenaRotateTimer ?? wall.arenaRotateStepInterval) - dt;
        if (wall._arenaRotateTimer <= 0) {
          wall._rotatePivot.rotation.y += wall.arenaRotateStepDeg * DEG2RAD;
          wall._arenaRotateTimer = wall.arenaRotateStepInterval;
        }
        break;
      case 'oscillate':
        wall._rotatePivot.rotation.y =
          wall.arenaRotateOscAmp * DEG2RAD *
          Math.sin(TWO_PI * wall.arenaRotateOscFreq * t);
        break;
    }
  }
}

export const wallPivotAnimator = new WallPivotAnimator();
