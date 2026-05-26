import * as PIXI from "pixi.js";

export class RPGPixiApp {
  private app: PIXI.Application | null = null;
  private worldContainer: PIXI.Container = new PIXI.Container();
  private uiContainer: PIXI.Container = new PIXI.Container();
  private tickListeners: Set<(delta: number) => void> = new Set();

  async init(canvas: HTMLCanvasElement): Promise<void> {
    this.app = new PIXI.Application();
    await this.app.init({
      canvas,
      width: canvas.clientWidth || 800,
      height: canvas.clientHeight || 600,
      backgroundColor: 0x000000,
      antialias: false, // keep pixel art sharp
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.worldContainer = new PIXI.Container();
    this.uiContainer = new PIXI.Container();
    this.app.stage.addChild(this.worldContainer);
    this.app.stage.addChild(this.uiContainer);

    this.app.ticker.add((ticker) => {
      for (const fn of this.tickListeners) {
        fn(ticker.deltaMS);
      }
    });
  }

  destroy(): void {
    this.tickListeners.clear();
    if (this.app) {
      this.app.destroy(false, { children: true });
      this.app = null;
    }
  }

  getApp(): PIXI.Application {
    if (!this.app) throw new Error("RPGPixiApp not initialized");
    return this.app;
  }

  getWorldContainer(): PIXI.Container {
    return this.worldContainer;
  }

  getUIContainer(): PIXI.Container {
    return this.uiContainer;
  }

  resize(width: number, height: number): void {
    if (!this.app) return;
    this.app.renderer.resize(width, height);
  }

  addTickListener(fn: (deltaMS: number) => void): void {
    this.tickListeners.add(fn);
  }

  removeTickListener(fn: (deltaMS: number) => void): void {
    this.tickListeners.delete(fn);
  }

  isReady(): boolean {
    return this.app !== null;
  }
}
