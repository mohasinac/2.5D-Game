import type { MapExit, RPGMap, MapEntryPoint } from "../data/schemas";
import { TRANSITION_FADE_MS } from "../constants/rpgConstants";
import type { RPGStore } from "../stores/rpgStore";
import type { MapManager } from "../engine/MapManager";
import type { NPCScheduler } from "./NPCScheduler";
import type { RPGAudioManager } from "./RPGAudioManager";
import type { TriggerSystem } from "../engine/TriggerSystem";
import type { PlayerController } from "../engine/PlayerController";
import type { CameraController } from "../engine/CameraController";

export type MapLoader = (mapId: string) => Promise<{ map: RPGMap; tilesetUrl: string }>;

export class SceneLoader {
  private isTransitioning = false;
  private onTransitionStart?: () => void;
  private onTransitionEnd?: () => void;
  private mapLoader?: MapLoader;

  constructor(
    private store: () => RPGStore,
    private mapManager: MapManager,
    private npcScheduler: NPCScheduler,
    private triggerSystem: TriggerSystem,
    private playerController: PlayerController,
    private cameraController: CameraController,
    private audioManager: RPGAudioManager
  ) {}

  setMapLoader(loader: MapLoader): void {
    this.mapLoader = loader;
  }

  onFadeOut(cb: () => void): void  { this.onTransitionStart = cb; }
  onFadeIn(cb: () => void): void   { this.onTransitionEnd = cb; }

  async transition(exit: MapExit): Promise<void> {
    if (this.isTransitioning || !this.mapLoader) return;
    this.isTransitioning = true;

    const store = this.store();
    store.setTransitioning(true);
    store.setPlayerLocked(true);
    this.onTransitionStart?.();

    await this.delay(TRANSITION_FADE_MS);

    try {
      const { map, tilesetUrl } = await this.mapLoader(exit.targetMapId);
      const { Assets } = await import("pixi.js");
      const tilesetTex = await Assets.load(tilesetUrl);

      await this.mapManager.loadMap(map, tilesetTex);
      this.triggerSystem.loadMap(map);
      this.npcScheduler.spawnNPCsForMap(map, store.timeSlot);
      this.npcScheduler.restoreAllBubbles();

      const entryPoint = this.mapManager.getEntryPoint(exit.targetEntryId);
      if (entryPoint) {
        this.playerController.teleportTo(entryPoint.tile, entryPoint.facingDirection);
        const worldPos = this.mapManager.getTileWorldPosition(entryPoint.tile);
        this.cameraController.setMapSize(map.width, map.height);
        this.cameraController.snapTo(worldPos);
      }

      store.setCurrentMap(map.id);
      store.setCurrentRegion(map.regionId);

      if (map.bgmTrackId) {
        await this.audioManager.crossfadeBgm(map.bgmTrackId, TRANSITION_FADE_MS);
      }
    } catch (err) {
      console.error("[SceneLoader] Failed to transition:", err);
    }

    await this.delay(TRANSITION_FADE_MS);
    this.onTransitionEnd?.();
    store.setTransitioning(false);
    store.setPlayerLocked(false);
    this.isTransitioning = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
