import type { ArenaData, WallData, ObstacleData, BridgeData, BridgeSegmentData } from '../types/arenaTypes';
import { SceneSurfaceProjector } from '../geometry/sceneSurfaceProjector';
import { arenaSurfaceYAtArenaLocal } from '../geometry/surfaceUtils';

/**
 * Shared surface-projection service.
 *
 * Aggregates wall, obstacle, and bridge-segment meshes for a given arena into a
 * `SceneSurfaceProjector` (downward raycast), so any manager can thread geometry
 * or snap placements onto real 3D surfaces instead of relying solely on the
 * mathematical parabolic-bowl approximation.
 *
 * No caching — `buildProjector` always builds fresh so mesh references are current.
 *
 * Injection: ArenaSandbox creates one instance and passes it (or a wrapping callback)
 * to managers that need surface-aware geometry:
 *   - SpeedLineManager     — ribbon follows bowl, walls, obstacles, bridge decks
 *   - (future) TrapManager — accurate Y on bridge decks / wall faces
 *   - (future) ObstacleManager — snap-to-surface on apply
 *   - (future) SpawnManager   — mesh-based ground detection
 */
export class ProjectionService {
  constructor(
    private readonly getArenas:         () => ReadonlyMap<string, ArenaData>,
    private readonly getWalls:          () => ReadonlyMap<string, WallData>,
    private readonly getObstacles:      () => ReadonlyMap<string, ObstacleData>,
    private readonly getBridgesByArena: () => ReadonlyMap<string, Set<string>>,
    private readonly getBridges:        () => ReadonlyMap<string, BridgeData>,
    private readonly getSegments:       () => ReadonlyMap<string, BridgeSegmentData>,
  ) {}

  buildProjector(arenaId: string): SceneSurfaceProjector | undefined {
    const arena = this.getArenas().get(arenaId);
    if (!arena) return undefined;
    const fallbackSurf = (lx: number, lz: number) => arenaSurfaceYAtArenaLocal(arena, lx, lz);
    const projector = new SceneSurfaceProjector([], fallbackSurf);
    for (const wallId of arena.wallIds) {
      const wall = this.getWalls().get(wallId);
      if (wall?.mesh) projector.addMesh(wall.mesh);
    }
    const arenaR = Math.max(arena.radiusX, arena.radiusZ);
    const rSq    = (arenaR + 20) * (arenaR + 20);
    for (const [, obs] of this.getObstacles()) {
      if (!obs.mesh) continue;
      const dx = obs.posX - arena.posX;
      const dz = obs.posZ - arena.posZ;
      if (dx * dx + dz * dz <= rSq) projector.addMesh(obs.mesh);
    }
    for (const bridgeId of this.getBridgesByArena().get(arenaId) ?? new Set<string>()) {
      const bridge = this.getBridges().get(bridgeId);
      if (!bridge) continue;
      for (const segId of bridge.segmentIds) {
        const seg = this.getSegments().get(segId);
        if (seg?.mesh) projector.addMesh(seg.mesh);
      }
    }
    return projector;
  }
}
