import * as PIXI from "pixi.js";
import type { WorldCoord } from "../data/schemas";
import {
  CAMERA_LERP, CAMERA_ZOOM_DEFAULT, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX,
  TILE_SIZE,
} from "../constants/rpgConstants";

export class CameraController {
  private container: PIXI.Container;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private zoom = CAMERA_ZOOM_DEFAULT;
  private screenWidth = 800;
  private screenHeight = 600;
  private mapPixelWidth = 0;
  private mapPixelHeight = 0;
  private cutsceneMode = false;

  constructor(container: PIXI.Container) {
    this.container = container;
    this.container.scale.set(this.zoom);
  }

  setMapSize(tileWidth: number, tileHeight: number): void {
    this.mapPixelWidth = tileWidth * TILE_SIZE;
    this.mapPixelHeight = tileHeight * TILE_SIZE;
  }

  setScreenSize(w: number, h: number): void {
    this.screenWidth = w;
    this.screenHeight = h;
  }

  follow(worldPos: WorldCoord): void {
    if (this.cutsceneMode) return;
    this.targetX = worldPos.x;
    this.targetY = worldPos.y;
  }

  panTo(worldPos: WorldCoord): void {
    this.cutsceneMode = true;
    this.targetX = worldPos.x;
    this.targetY = worldPos.y;
  }

  returnControl(): void {
    this.cutsceneMode = false;
  }

  setZoom(z: number): void {
    this.zoom = Math.max(CAMERA_ZOOM_MIN, Math.min(CAMERA_ZOOM_MAX, z));
    this.container.scale.set(this.zoom);
  }

  update(deltaMS: number): void {
    const lerp = Math.min(1, CAMERA_LERP * (deltaMS / 16));
    this.currentX += (this.targetX - this.currentX) * lerp;
    this.currentY += (this.targetY - this.currentY) * lerp;
    this.applyTransform();
  }

  private applyTransform(): void {
    const halfW = this.screenWidth / 2 / this.zoom;
    const halfH = this.screenHeight / 2 / this.zoom;

    let cx = this.currentX - halfW;
    let cy = this.currentY - halfH;

    if (this.mapPixelWidth > 0) {
      const maxX = this.mapPixelWidth - this.screenWidth / this.zoom;
      const maxY = this.mapPixelHeight - this.screenHeight / this.zoom;
      cx = Math.max(0, Math.min(maxX, cx));
      cy = Math.max(0, Math.min(maxY, cy));
    }

    this.container.x = -cx * this.zoom;
    this.container.y = -cy * this.zoom;
  }

  snapTo(worldPos: WorldCoord): void {
    this.currentX = worldPos.x;
    this.currentY = worldPos.y;
    this.targetX = worldPos.x;
    this.targetY = worldPos.y;
    this.applyTransform();
  }
}
