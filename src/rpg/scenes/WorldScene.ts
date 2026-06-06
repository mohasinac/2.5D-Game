import Phaser from 'phaser';
import { Player } from '../entities/Player.ts';
import { NPCManager } from '../systems/NPCManager.ts';
import { EventSystem } from '../systems/EventSystem.ts';
import { CutscenePlayer } from '../systems/CutscenePlayer.ts';
import { ChestObject } from '../entities/ChestObject.ts';
import { EventZone } from '../entities/EventZone.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import { eventBus } from '../systems/EventBus.ts';
import { TILE_SIZE } from '../config/rpgConstants.ts';
import type { MapData } from '../../types/rpgTypes.ts';

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private npcManager!: NPCManager;
  private eventSystem!: EventSystem;
  private cutscenePlayer!: CutscenePlayer;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private collisionLayer: Set<string> = new Set();
  private bushTiles: Set<string> = new Set();
  private mapData: MapData | null = null;
  private chests: ChestObject[] = [];
  private eventZones: EventZone[] = [];
  private tileImages = new Map<string, Phaser.GameObjects.Image>();

  constructor() { super({ key: 'WorldScene' }); }

  create(): void {
    const mapId = gameStateStore.getCurrentMap() || 'city_park';
    this.loadMap(mapId);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.cutscenePlayer = new CutscenePlayer(this);

    eventBus.on('cutscene:start', (id: string) => {
      if (this.player && !this.player.isLocked()) {
        this.player.lock();
        void this.cutscenePlayer.play(id).then(() => {
          if (this.player) this.player.unlock();
        });
      }
    });

    eventBus.on('rpg:warp', (data: { mapId: string; tileX: number; tileY: number }) => {
      this.warpTo(data.mapId, data.tileX, data.tileY);
    });

    eventBus.on('dialogue:complete', () => {
      if (this.player) this.player.unlock();
    });

    // Auto-fire intro cutscene on very first boot
    if (!gameStateStore.getFlag('intro_played')) {
      gameStateStore.setFlag('intro_played', true);
      this.time.delayedCall(500, () => {
        eventBus.emit('cutscene:start', 'cs_intro');
      });
    }

    this.events.on('shutdown', () => this.cleanup());
  }

  private loadMap(mapId: string): void {
    this.cleanup();

    const mapData = svgAssetStore.getMap(mapId);
    if (!mapData) return;
    this.mapData = mapData;

    const worldW = mapData.cols * TILE_SIZE;
    const worldH = mapData.rows * TILE_SIZE;
    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBounds(0, 0, worldW, worldH);

    this.buildTileLayers(mapData);

    const spawnPos = gameStateStore.getPlayerPos();
    const spawnX = (spawnPos?.tileX ?? 2) * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = (spawnPos?.tileY ?? 2) * TILE_SIZE + TILE_SIZE / 2;
    this.player = new Player(this, spawnPos?.tileX ?? 2, spawnPos?.tileY ?? 2, TILE_SIZE);

    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    void spawnX; void spawnY;

    this.npcManager = new NPCManager(this, TILE_SIZE);
    this.npcManager.spawnAll(mapData.entities);

    this.eventSystem = new EventSystem(this);
    for (const ev of mapData.events) {
      const trigger = svgAssetStore.getTrigger(ev.triggerId);
      // Build chest objects directly from chest-type triggers
      if (trigger?.type === 'chest' && trigger.targetId) {
        const chest = new ChestObject(
          this, ev.id, ev.tileX, ev.tileY, TILE_SIZE, trigger.targetId,
        );
        this.chests.push(chest);
      } else {
        const zone = new EventZone(this, ev, TILE_SIZE);
        this.eventSystem.register(zone.zone, ev.triggerId);
        this.eventZones.push(zone);
      }
    }

    this.physics.add.collider(this.player.sprite, this.npcManager.getSprites());

    gameStateStore.setCurrentMap(mapId);
  }

  private buildTileLayers(mapData: MapData): void {
    this.collisionLayer.clear();
    this.bushTiles.clear();

    const tileset = svgAssetStore.getTileset(mapData.tilesetId);
    if (!tileset) return;

    // SVG was loaded at scale=2 by SVGAssetLoader, so actual texture dimensions are doubled
    const SVG_SCALE = 2;
    const tileW = tileset.tileWidth;
    const tileH = tileset.tileHeight;
    // Columns derived from the tileset's SVG grid
    const sheetCols = Math.max(1, Math.floor(512 / tileW)); // estimate; 512px assumed SVG width
    // Crop coordinates must match the scaled texture
    const cropW = tileW * SVG_SCALE;
    const cropH = tileH * SVG_SCALE;

    for (const layer of mapData.layers) {
      if (!layer.visible) continue;
      for (let row = 0; row < mapData.rows; row++) {
        for (let col = 0; col < mapData.cols; col++) {
          const cell = layer.cells[row]?.[col];
          if (!cell?.tileId) continue;

          const tileData = svgAssetStore.getTile(cell.tileId);
          if (!tileData) continue;

          const x = col * TILE_SIZE;
          const y = row * TILE_SIZE;
          const fi = tileData.frameIndex;
          const fx = (fi % sheetCols) * cropW;
          const fy = Math.floor(fi / sheetCols) * cropH;

          const img = this.add.image(x + TILE_SIZE / 2, y + TILE_SIZE / 2, tileset.id);
          // Scale down from the 2x SVG to the desired TILE_SIZE
          img.setScale(TILE_SIZE / cropW);
          img.setCrop(fx, fy, cropW, cropH);
          this.tileImages.set(`${layer.id}:${col}:${row}`, img);

          const key = `${col}:${row}`;
          if (tileData.collision === 'solid') this.collisionLayer.add(key);
          if (tileData.collision === 'bush')  this.bushTiles.add(key);
        }
      }
    }
  }

  private getPlayerBushTiles(): Set<string> {
    if (!this.player) return new Set();
    const tileX = Math.floor(this.player.x / TILE_SIZE);
    const tileY = Math.floor(this.player.y / TILE_SIZE);
    const result = new Set<string>();
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const key = `${tileX + dx}:${tileY + dy}`;
        if (this.bushTiles.has(key)) result.add(key);
      }
    }
    return result;
  }

  update(_time: number, delta: number): void {
    if (!this.player || this.player.isLocked()) return;

    this.player.update(this.cursors);

    if (this.player.inventoryJustPressed) {
      if (this.scene.isActive('InventoryScene')) {
        this.scene.stop('InventoryScene');
        this.player.unlock();
      } else {
        this.player.lock();
        this.scene.launch('InventoryScene');
      }
    }

    const playerBush = this.getPlayerBushTiles();
    this.npcManager.update(delta, { x: this.player.x, y: this.player.y }, playerBush);

    this.eventSystem.check(this.player.sprite);

    if (this.player.interactJustPressed) {
      this.tryInteract();
    }
  }

  private tryInteract(): void {
    const area = this.player.getInteractArea();

    for (const chest of this.chests) {
      if (!chest.isOpen() && area.contains(chest.sprite.x, chest.sprite.y)) {
        chest.open();
        return;
      }
    }

    for (const npc of this.npcManager.getAll()) {
      if (!npc.isInTalk() && area.contains(npc.x, npc.y)) {
        npc.startTalk();
        this.player.lock();
        if (npc.dialogueId) {
          this.scene.launch('DialogueScene', { treeId: npc.dialogueId, npcId: npc.id });
          eventBus.once('dialogue:complete', () => {
            npc.endTalk();
            this.player.unlock();
          });
        }
        return;
      }
    }
  }

  warpTo(mapId: string, tileX: number, tileY: number): void {
    gameStateStore.setPlayerPos(tileX, tileY);
    this.loadMap(mapId);
  }

  private cleanup(): void {
    for (const c of this.chests) c.destroy();
    this.chests = [];
    for (const z of this.eventZones) z.destroy();
    this.eventZones = [];
    for (const img of this.tileImages.values()) img.destroy();
    this.tileImages.clear();
    if (this.npcManager) this.npcManager.despawnAll();
    if (this.eventSystem) this.eventSystem.destroy();
  }
}
