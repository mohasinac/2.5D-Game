import Phaser from 'phaser';
import type { NPCData, NPCEntityPlacement, Direction } from '../../types/rpgTypes.ts';
import {
  NPC_WALK_SPEED, NPC_CHASE_SPEED, NPC_FOLLOW_SPEED,
  NPC_IDLE_TIME_MIN, NPC_IDLE_TIME_MAX, VISION_ALERT_DURATION,
} from '../config/rpgConstants.ts';
import { svgAssetStore } from '../stores/SVGAssetStore.ts';

type NPCState = 'idle' | 'patrol' | 'follow' | 'chase' | 'alert' | 'talk' | 'return';

export class NPC {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private state: NPCState;
  private facing: Direction = 'down';
  private patrolIndex = 0;
  private patrolPx: { x: number; y: number }[] = [];
  private idleTimer = 0;
  private alertTimer = 0;
  private lastSeenX = 0;
  private lastSeenY = 0;
  private homeX: number;
  private homeY: number;
  private visionGraphic?: Phaser.GameObjects.Graphics;

  constructor(
    private scene: Phaser.Scene,
    private placement: NPCEntityPlacement,
    private def: NPCData,
    tileSize: number,
  ) {
    const x = placement.tileX * tileSize + tileSize / 2;
    const y = placement.tileY * tileSize + tileSize / 2;
    this.homeX = x; this.homeY = y;
    this.sprite = scene.physics.add.sprite(x, y, def.spriteId);
    this.sprite.setCollideWorldBounds(true);
    this.state = def.aiDefault as NPCState;

    this.patrolPx = placement.patrolPath.map(p => ({
      x: p.x * tileSize + tileSize / 2,
      y: p.y * tileSize + tileSize / 2,
    }));

    const sprDef = svgAssetStore.getSprite(def.spriteId);
    if (sprDef?.hitbox) {
      this.sprite.setBodySize(sprDef.hitbox.width, sprDef.hitbox.height);
      this.sprite.setOffset(sprDef.hitbox.offsetX, sprDef.hitbox.offsetY);
    }
    this.sprite.play(`${def.spriteId}_idle_down`);
  }

  get id(): string { return this.placement.id; }
  get npcId(): string { return this.def.id; }
  get x(): number { return this.sprite.x; }
  get y(): number { return this.sprite.y; }
  get dialogueId(): string | null { return this.def.dialogueId; }

  startTalk(): void { this.state = 'talk'; this.sprite.setVelocity(0, 0); }
  endTalk(): void { this.state = this.def.aiDefault as NPCState; }
  isInTalk(): boolean { return this.state === 'talk'; }

  private canSeePlayer(px: number, py: number, bushTiles: Set<string>): boolean {
    const dx = px - this.sprite.x; const dy = py - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let range = this.def.visionCone.range;

    // Check if player is in a bush tile — reduce vision range
    if (bushTiles.size > 0) { range *= this.def.visionCone.reductionBush; }

    if (dist > range) return false;

    // Check angle — compare player angle to facing direction
    const playerAngle = Math.atan2(dy, dx);
    const facingAngle = this.getFacingAngle();
    let diff = Math.abs(playerAngle - facingAngle);
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    const halfCone = (this.def.visionCone.angle / 2) * (Math.PI / 180);
    return diff <= halfCone;
  }

  private getFacingAngle(): number {
    switch (this.facing) {
      case 'right': return 0;
      case 'down':  return Math.PI / 2;
      case 'left':  return Math.PI;
      case 'up':    return -Math.PI / 2;
    }
  }

  private moveToward(tx: number, ty: number, speed: number): boolean {
    const dx = tx - this.sprite.x; const dy = ty - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 4) { this.sprite.setVelocity(0, 0); return true; }
    this.sprite.setVelocity((dx / dist) * speed, (dy / dist) * speed);
    this.updateFacingFromVelocity(dx, dy);
    return false;
  }

  private updateFacingFromVelocity(vx: number, vy: number): void {
    if (Math.abs(vx) > Math.abs(vy)) {
      this.facing = vx > 0 ? 'right' : 'left';
    } else {
      this.facing = vy > 0 ? 'down' : 'up';
    }
    const prefix = this.sprite.body && (Math.abs((this.sprite.body as Phaser.Physics.Arcade.Body).velocity.x) > 4 || Math.abs((this.sprite.body as Phaser.Physics.Arcade.Body).velocity.y) > 4) ? 'walk' : 'idle';
    const animKey = `${this.def.spriteId}_${prefix}_${this.facing}`;
    if (this.sprite.scene?.anims.exists(animKey) && this.sprite.anims.currentAnim?.key !== animKey) {
      this.sprite.play(animKey);
    }
  }

  update(dt: number, player: { x: number; y: number }, bushTiles: Set<string>): void {
    if (this.state === 'talk') return;

    const sees = this.canSeePlayer(player.x, player.y, bushTiles);

    switch (this.state) {
      case 'idle': {
        this.sprite.setVelocity(0, 0);
        this.idleTimer += dt;
        if (this.idleTimer > NPC_IDLE_TIME_MIN + Math.random() * (NPC_IDLE_TIME_MAX - NPC_IDLE_TIME_MIN)) {
          this.idleTimer = 0;
          const dirs: Direction[] = ['up', 'down', 'left', 'right'];
          this.facing = dirs[Math.floor(Math.random() * dirs.length)];
        }
        if (sees && this.def.aiDefault === 'chase') this.state = 'chase';
        break;
      }

      case 'patrol': {
        if (this.patrolPx.length === 0) { this.state = 'idle'; break; }
        const target = this.patrolPx[this.patrolIndex];
        const arrived = this.moveToward(target.x, target.y, NPC_WALK_SPEED);
        if (arrived) this.patrolIndex = (this.patrolIndex + 1) % this.patrolPx.length;
        if (sees) { this.state = 'alert'; this.alertTimer = 0; }
        break;
      }

      case 'follow': {
        const dist = Math.hypot(player.x - this.sprite.x, player.y - this.sprite.y);
        if (dist > 80) this.moveToward(player.x, player.y, NPC_FOLLOW_SPEED);
        else this.sprite.setVelocity(0, 0);
        break;
      }

      case 'alert': {
        this.sprite.setVelocity(0, 0);
        this.alertTimer += dt;
        if (sees) { this.state = 'chase'; this.lastSeenX = player.x; this.lastSeenY = player.y; }
        else if (this.alertTimer > VISION_ALERT_DURATION) {
          this.state = this.def.aiDefault as NPCState;
        }
        break;
      }

      case 'chase': {
        if (sees) { this.lastSeenX = player.x; this.lastSeenY = player.y; }
        const reached = this.moveToward(this.lastSeenX, this.lastSeenY, NPC_CHASE_SPEED);
        if (reached && !sees) { this.state = 'return'; }
        break;
      }

      case 'return': {
        const home = this.moveToward(this.homeX, this.homeY, NPC_WALK_SPEED);
        if (home) this.state = this.def.aiDefault as NPCState;
        break;
      }
    }
  }

  drawVisionCone(debug: boolean): void {
    if (!debug) { this.visionGraphic?.setVisible(false); return; }
    if (!this.visionGraphic) {
      this.visionGraphic = this.scene.add.graphics();
    }
    this.visionGraphic.setVisible(true);
    this.visionGraphic.clear();
    const range = this.def.visionCone.range;
    const halfAngle = (this.def.visionCone.angle / 2) * (Math.PI / 180);
    const facing = this.getFacingAngle();
    this.visionGraphic.fillStyle(0xff0000, 0.15);
    this.visionGraphic.slice(this.sprite.x, this.sprite.y, range, facing - halfAngle, facing + halfAngle);
    this.visionGraphic.fillPath();
  }

  destroy(): void {
    this.visionGraphic?.destroy();
    this.sprite.destroy();
  }
}
