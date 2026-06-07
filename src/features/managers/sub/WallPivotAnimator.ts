/**
 * Stateless singleton for wall pivot rotation animation.
 * Extracted from WallManager.tick() so the logic is testable in isolation.
 */

import type { WallData } from '../../../types/arenaTypes';

const DEG2RAD = Math.PI / 180;
const TWO_PI  = Math.PI * 2;

export class WallPivotAnimator {
  tick(wall: WallData, dt: number): void {
    if (!wall.rotateOnArena || !wall._rotatePivot) return;
    const t = performance.now() / 1000;
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
