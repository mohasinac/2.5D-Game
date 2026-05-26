export interface PortraitAsset {
  npcId: string;
  imageUrl: string;
  states: Record<string, string>; // expression name → image URL
}

export class PortraitSystem {
  private portraits: Map<string, PortraitAsset> = new Map();
  private imageCache: Map<string, HTMLImageElement> = new Map();

  registerPortrait(asset: PortraitAsset): void {
    this.portraits.set(asset.npcId, asset);
  }

  getPortraitUrl(npcId: string, state?: string): string | null {
    const asset = this.portraits.get(npcId);
    if (!asset) return null;
    if (state && asset.states[state]) return asset.states[state];
    return asset.imageUrl;
  }

  async preloadPortrait(npcId: string): Promise<void> {
    const asset = this.portraits.get(npcId);
    if (!asset) return;
    await this.preloadImage(asset.imageUrl);
    for (const url of Object.values(asset.states)) {
      await this.preloadImage(url);
    }
  }

  private preloadImage(url: string): Promise<void> {
    if (this.imageCache.has(url)) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { this.imageCache.set(url, img); resolve(); };
      img.onerror = () => resolve();
      img.src = url;
    });
  }
}
