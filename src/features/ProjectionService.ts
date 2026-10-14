import * as THREE from 'three';
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

    /* THE BOWL ITSELF — previously missing, so every projected point fell
       through to the analytic `arenaSurfaceYAtArenaLocal` approximation and the
       raycaster only ever saw walls, obstacles and bridge decks. That made the
       projector agree with the formula by construction, which hid the whole
       point of raycasting: real geometry that the formula cannot express.
       It matters most for the BB-10 profile, whose Tornado Ridge is a genuine
       non-monotonic bump — the analytic path reproduces it (both go through
       `bb10RiseFraction`), but the floor cap, island cap and stepped/spiral
       meshes are real geometry with no formula at all. */
    if (arena.mesh)       projector.addMesh(arena.mesh);
    if (arena.floorMesh)  projector.addMesh(arena.floorMesh);
    if (arena.islandMesh) projector.addMesh(arena.islandMesh);
    for (const m of arena.spiralMeshes ?? []) projector.addMesh(m);

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
    /* Bridge decks, BY PROXIMITY rather than by the bridgesByArena index.
       That index is keyed on `bridge.startRef.id`, which is the EMPTY STRING for
       a `freepoint` bridge — one anchored to a world position instead of to an
       arena or wall. The shipped demo arena's piers are exactly that, so an
       index lookup finds nothing and the decks stay invisible to physics: the
       bey falls straight through a pier it should be able to ride.

       Proximity mirrors how obstacles are already gathered just above, and it
       is the honest test anyway — what matters for projecting onto a surface is
       whether the surface is HERE, not who owns it. The index is still consulted
       so arena-parented bridges outside the radius are not dropped. */
    const indexed = this.getBridgesByArena().get(arenaId) ?? new Set<string>();
    const segWorld = new THREE.Vector3();
    for (const [bridgeId, bridge] of this.getBridges()) {
      for (const segId of bridge.segmentIds) {
        const seg = this.getSegments().get(segId);
        if (!seg?.mesh) continue;
        if (!indexed.has(bridgeId)) {
          seg.mesh.getWorldPosition(segWorld);
          const dx = segWorld.x - arena.posX;
          const dz = segWorld.z - arena.posZ;
          if (dx * dx + dz * dz > rSq) continue;
        }
        projector.addMesh(seg.mesh);
      }
    }
    return projector;
  }
}
