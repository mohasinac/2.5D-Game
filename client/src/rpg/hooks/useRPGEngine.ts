import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRPGStore } from "../stores/rpgStore";
import { useRPGInput } from "./useRPGInput";

import { RPGPixiApp } from "../engine/RPGPixiApp";
import { MapManager } from "../engine/MapManager";
import { CollisionSystem } from "../engine/CollisionSystem";
import { TriggerSystem } from "../engine/TriggerSystem";
import { CameraController } from "../engine/CameraController";
import { PlayerController } from "../engine/PlayerController";
import { SpriteAnimationSystem } from "../engine/SpriteAnimationSystem";
import { TimeSystem } from "../engine/TimeSystem";
import { RegionManager } from "../engine/RegionManager";

import { DialogueSystem } from "../systems/DialogueSystem";
import { QuestSystem } from "../systems/QuestSystem";
import { StoryEventSystem } from "../systems/StoryEventSystem";
import { CutsceneSystem } from "../systems/CutsceneSystem";
import { NPCScheduler } from "../systems/NPCScheduler";
import { LevelingSystem } from "../systems/LevelingSystem";
import { BadgeSystem } from "../systems/BadgeSystem";
import { SceneLoader } from "../systems/SceneLoader";
import { RPGAudioManager } from "../systems/RPGAudioManager";
import { PortraitSystem } from "../systems/PortraitSystem";
import { PlayerProgression } from "../systems/PlayerProgression";
import { BattleTransitionSystem } from "../systems/BattleTransitionSystem";
import { WorldManager } from "../systems/WorldManager";

import { TILE_SIZE } from "../constants/rpgConstants";
import type { RPGMap } from "../data/schemas";

export interface RPGEngineRef {
  pixi: RPGPixiApp;
  mapManager: MapManager;
  cameraController: CameraController;
  playerController: PlayerController;
  dialogueSystem: DialogueSystem;
  questSystem: QuestSystem;
  storyEventSystem: StoryEventSystem;
  cutsceneSystem: CutsceneSystem;
  npcScheduler: NPCScheduler;
  levelingSystem: LevelingSystem;
  badgeSystem: BadgeSystem;
  sceneLoader: SceneLoader;
  audioManager: RPGAudioManager;
  portraitSystem: PortraitSystem;
  playerProgression: PlayerProgression;
  battleTransitionSystem: BattleTransitionSystem;
  worldManager: WorldManager;
  regionManager: RegionManager;
}

export function useRPGEngine(
  canvasContainerRef: React.RefObject<HTMLDivElement | null>,
  userId: string,
  username: string
): { engine: RPGEngineRef | null; isReady: boolean } {
  const engineRef = useRef<RPGEngineRef | null>(null);
  const isReadyRef = useRef(false);
  const navigate = useNavigate();
  const inputRef = useRPGInput();

  const getServerUrl = useCallback(() => {
    return (import.meta as { env?: { VITE_GAME_SERVER_URL?: string } }).env?.VITE_GAME_SERVER_URL
      ?? "ws://localhost:2567";
  }, []);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const containerEl = canvasContainerRef.current;

    const getStore = () => useRPGStore.getState();

    // ── Instantiate systems that don't need PixiJS ──────────────────────────
    const collisionSystem = new CollisionSystem();
    const triggerSystem = new TriggerSystem();
    const spriteAnimation = new SpriteAnimationSystem();
    const timeSystem = new TimeSystem();
    const dialogueSystem = new DialogueSystem();
    const questSystem = new QuestSystem();
    const levelingSystem = new LevelingSystem();
    const badgeSystem = new BadgeSystem();
    const storyEventSystem = new StoryEventSystem();
    const cutsceneSystem = new CutsceneSystem();
    const npcScheduler = new NPCScheduler(spriteAnimation);
    const audioManager = new RPGAudioManager();
    const portraitSystem = new PortraitSystem();
    const worldManager = new WorldManager();
    const regionManager = new RegionManager();

    const pixi = new RPGPixiApp();
    const playerController = new PlayerController(spriteAnimation, collisionSystem);

    const playerProgression = new PlayerProgression(getStore, questSystem, badgeSystem);

    const battleTransitionSystem = new BattleTransitionSystem(
      getStore,
      dialogueSystem,
      questSystem,
      levelingSystem,
      badgeSystem,
      npcScheduler,
      navigate,
      getServerUrl
    );

    // MapManager and CameraController require a PIXI.Container — created after pixi.init
    let mapManager: MapManager;
    let cameraController: CameraController;
    let sceneLoader: SceneLoader;

    // ── Wire callbacks ───────────────────────────────────────────────────────
    timeSystem.onTimeSlotChange((slot) => {
      getStore().setTimeSlot(slot);
      const s = getStore();
      if (s.currentMapId) {
        const map = worldManager.getCachedMap(s.currentMapId);
        if (map) npcScheduler.spawnNPCsForMap(map as RPGMap, slot, false);
      }
    });

    playerController.onFacingChanged((facing) => {
      getStore().setPlayerFacing(facing);
    });

    playerController.onTileChanged((tile) => {
      getStore().setPlayerTile(tile);
      const s = getStore();

      const exit = triggerSystem.getExitAt(tile);
      if (exit && !s.isTransitioning && sceneLoader) {
        sceneLoader.transition(exit);
        return;
      }

      const stepTriggers = triggerSystem.getEventTriggersAt(tile, "step", s.flags);
      for (const trigger of stepTriggers) {
        storyEventSystem.queueEventIfEligibleFromStore(trigger.storyEventId, s);
      }

      if (s.currentMapId) {
        playerProgression.applyMapArrival(s.currentMapId);
      }
    });

    // ── Create canvas and init PixiJS ────────────────────────────────────────
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    containerEl.appendChild(canvas);

    pixi.init(canvas).then(async () => {
      const world = pixi.getWorldContainer();

      // Now create PixiJS-dependent objects
      mapManager = new MapManager(world);
      cameraController = new CameraController(world);
      cameraController.setScreenSize(canvas.clientWidth, canvas.clientHeight);

      // Add NPC container to world
      world.addChild(npcScheduler.getContainer());

      sceneLoader = new SceneLoader(
        getStore,
        mapManager,
        npcScheduler,
        triggerSystem,
        playerController,
        cameraController,
        audioManager
      );

      sceneLoader.setMapLoader(async (mapId: string) => {
        const mapData = await worldManager.loadMap(mapId);
        if (!mapData) throw new Error(`Map not found: ${mapId}`);
        const tilesetUrl = `/assets/tilesets/${mapData.tilesetId}.png`;
        return { map: mapData as RPGMap, tilesetUrl };
      });

      const s = getStore();
      const startMapId = s.currentMapId ?? "bakuten-city-east";

      try {
        const mapData = await worldManager.loadMap(startMapId);
        if (mapData) {
          const { Assets, Texture } = await import("pixi.js");
          let tilesetTex: typeof Texture.EMPTY;
          try {
            tilesetTex = await Assets.load(`/assets/tilesets/${mapData.tilesetId}.png`);
          } catch {
            tilesetTex = Texture.EMPTY;
          }

          await mapManager.loadMap(mapData as RPGMap, tilesetTex);
          triggerSystem.loadMap(mapData as RPGMap);
          npcScheduler.spawnNPCsForMap(mapData as RPGMap, s.timeSlot, false);

          const entry = mapManager.getEntryPoint("start");
          const startTile = entry?.tile ?? s.playerTile ?? { x: 5, y: 5 };
          const startFacing = entry?.facingDirection ?? s.playerFacing ?? "down";

          let playerTex: typeof Texture.EMPTY;
          try {
            playerTex = await Assets.load("/assets/sprites/player.png");
          } catch {
            playerTex = Texture.EMPTY;
          }

          playerController.init(world, playerTex, startTile, startFacing);

          const worldPos = playerController.getWorldPosition();
          cameraController.setMapSize(mapData.width * TILE_SIZE, mapData.height * TILE_SIZE);
          cameraController.follow(worldPos);
          cameraController.update(0);

          getStore().setCurrentMap(mapData.id);
          getStore().setCurrentRegion(mapData.regionId);

          storyEventSystem.checkTriggersForMapObj(mapData as RPGMap, getStore());
        }
      } catch (err) {
        console.error("[useRPGEngine] Failed to load starting map:", err);
      }

      isReadyRef.current = true;

      // ── Main game tick ─────────────────────────────────────────────────────
      pixi.addTickListener((deltaMS: number) => {
        const input = inputRef.current;
        const st = getStore();

        timeSystem.update(deltaMS);
        getStore().addPlaytime(deltaMS);

        if (!st.playerLocked && !st.activeDialogue) {
          playerController.update(deltaMS, input);

          if (input.confirm && !playerController.isWalking()) {
            const npc = npcScheduler.getNPCAdjacentToTile(st.playerTile, st.playerFacing);
            if (npc) {
              const tree = dialogueSystem.getDialogueForNPC(npc, st.flags);
              if (tree) {
                dialogueSystem.startDialogue(tree.id);
                playerProgression.applyNPCTalk(npc.id);
              }
            } else {
              const facingTile = playerController.getFacingTile();
              const zoneTriggers = triggerSystem.getEventTriggersAt(facingTile, "interact", st.flags);
              for (const trigger of zoneTriggers) {
                storyEventSystem.queueEventIfEligibleFromStore(trigger.storyEventId, st);
              }
            }
          }
        } else {
          playerController.update(deltaMS, { up: false, down: false, left: false, right: false, confirm: false, cancel: false, menu: false });
        }

        npcScheduler.update(deltaMS);

        const worldPos = playerController.getWorldPosition();
        cameraController.follow(worldPos);
        cameraController.update(deltaMS);
      });

      // Populate the engine ref now that everything is wired
      if (engineRef.current) {
        engineRef.current.mapManager = mapManager;
        engineRef.current.cameraController = cameraController;
        engineRef.current.sceneLoader = sceneLoader;
      }
    });

    const engine: RPGEngineRef = {
      pixi,
      mapManager: null as unknown as MapManager,
      cameraController: null as unknown as CameraController,
      playerController,
      dialogueSystem, questSystem, storyEventSystem, cutsceneSystem,
      npcScheduler, levelingSystem, badgeSystem,
      sceneLoader: null as unknown as SceneLoader,
      audioManager, portraitSystem, playerProgression,
      battleTransitionSystem, worldManager, regionManager,
    };
    engineRef.current = engine;

    return () => {
      pixi.destroy();
      timeSystem.stop();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      engineRef.current = null;
      isReadyRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    engine: engineRef.current,
    isReady: isReadyRef.current,
  };
}
