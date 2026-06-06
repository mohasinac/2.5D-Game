import Phaser from 'phaser';
import { NPC } from '../entities/NPC.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import type { NPCEntityPlacement } from '../../types/rpgTypes.ts';

export class NPCManager {
  private npcs = new Map<string, NPC>();
  private scene: Phaser.Scene;
  private tileSize: number;
  private debugVision = false;

  constructor(scene: Phaser.Scene, tileSize: number) {
    this.scene = scene;
    this.tileSize = tileSize;
  }

  spawnAll(placements: NPCEntityPlacement[]): void {
    for (const p of placements) {
      const def = svgAssetStore.getNPC(p.npcId);
      if (!def) continue;
      this.setupNPCAnimations(def.spriteId);
      const npc = new NPC(this.scene, p, def, this.tileSize);
      this.npcs.set(p.id, npc);
    }
  }

  private setupNPCAnimations(spriteId: string): void {
    const sprDef = svgAssetStore.getSprite(spriteId);
    if (!sprDef) return;

    const texture = this.scene.textures.get(spriteId);
    if (!texture || texture.key === '__MISSING') return;

    const cols = sprDef.cols;
    const rows = sprDef.rows || 1;
    const totalFrames = cols * rows;
    const scale = 2;
    const fw = sprDef.frameWidth * scale;
    const fh = sprDef.frameHeight * scale;

    for (let i = 0; i < totalFrames; i++) {
      if (!texture.has(String(i))) {
        texture.add(String(i), 0, (i % cols) * fw, Math.floor(i / cols) * fh, fw, fh);
      }
    }

    const dirs = ['down', 'up', 'left', 'right'];
    dirs.forEach((dir, di) => {
      const idleKey = `${spriteId}_idle_${dir}`;
      const walkKey = `${spriteId}_walk_${dir}`;
      if (!this.scene.anims.exists(idleKey)) {
        this.scene.anims.create({
          key: idleKey,
          frames: [{ key: spriteId, frame: String(di * cols) }],
          frameRate: 1,
          repeat: 0,
        });
      }
      if (!this.scene.anims.exists(walkKey)) {
        const walkFrames = Array.from({ length: Math.min(cols, 4) }, (_, i) =>
          ({ key: spriteId, frame: String(di * cols + i) }));
        this.scene.anims.create({
          key: walkKey,
          frames: walkFrames,
          frameRate: 8,
          repeat: -1,
        });
      }
    });
  }

  getAll(): NPC[] { return [...this.npcs.values()]; }

  get(id: string): NPC | undefined { return this.npcs.get(id); }

  getSprites(): Phaser.Physics.Arcade.Sprite[] {
    return [...this.npcs.values()].map(n => n.sprite);
  }

  getBushTiles(tileSize: number, mapCols: number): Set<string> {
    // Populated by WorldScene based on tilemap collision layer; passed back in
    // update(). NPCManager just forwards it to NPC.update().
    void tileSize; void mapCols;
    return new Set<string>();
  }

  update(dt: number, player: { x: number; y: number }, bushTiles: Set<string>): void {
    for (const npc of this.npcs.values()) {
      npc.update(dt, player, bushTiles);
      npc.drawVisionCone(this.debugVision);
    }
  }

  setDebugVision(on: boolean): void {
    this.debugVision = on;
  }

  despawnAll(): void {
    for (const npc of this.npcs.values()) npc.destroy();
    this.npcs.clear();
  }
}
