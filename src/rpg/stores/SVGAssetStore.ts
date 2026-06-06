import type {
  SVGSpriteData, SVGTilesetData, TileData, MapData, NPCData,
  DialogueTree, CutsceneScript, AudioAssetData, ShopData,
  PipePuzzleLevel, PlatformLevel, TriggerData,
} from '../../types/rpgTypes.ts';
import { LS_ASSETS } from '../config/rpgConstants.ts';

interface AssetBundle {
  sprites:        SVGSpriteData[];
  tilesets:       SVGTilesetData[];
  tiles:          TileData[];
  maps:           MapData[];
  npcs:           NPCData[];
  dialogues:      DialogueTree[];
  cutscenes:      CutsceneScript[];
  audio:          AudioAssetData[];
  shops:          ShopData[];
  triggers:       TriggerData[];
  pipeLevels:     PipePuzzleLevel[];
  platformLevels: PlatformLevel[];
}

class SVGAssetStore {
  private sprites        = new Map<string, SVGSpriteData>();
  private tilesets       = new Map<string, SVGTilesetData>();
  private tiles          = new Map<string, TileData>();
  private maps           = new Map<string, MapData>();
  private npcs           = new Map<string, NPCData>();
  private dialogues      = new Map<string, DialogueTree>();
  private cutscenes      = new Map<string, CutsceneScript>();
  private audio          = new Map<string, AudioAssetData>();
  private shops          = new Map<string, ShopData>();
  private triggers       = new Map<string, TriggerData>();
  private pipeLevels     = new Map<string, PipePuzzleLevel>();
  private platformLevels = new Map<string, PlatformLevel>();

  // ── Sprites ────────────────────────────────────────────────────
  addSprite(d: SVGSpriteData):    void { this.sprites.set(d.id, d); }
  getSprite(id: string):          SVGSpriteData | undefined { return this.sprites.get(id); }
  getAllSprites():                 SVGSpriteData[] { return [...this.sprites.values()]; }
  updateSprite(id: string, p: Partial<SVGSpriteData>): void {
    const s = this.sprites.get(id); if (s) this.sprites.set(id, { ...s, ...p });
  }
  removeSprite(id: string): void { this.sprites.delete(id); }

  // ── Tilesets ───────────────────────────────────────────────────
  addTileset(d: SVGTilesetData):  void { this.tilesets.set(d.id, d); }
  getTileset(id: string):         SVGTilesetData | undefined { return this.tilesets.get(id); }
  getAllTilesets():                SVGTilesetData[] { return [...this.tilesets.values()]; }
  updateTileset(id: string, p: Partial<SVGTilesetData>): void {
    const t = this.tilesets.get(id); if (t) this.tilesets.set(id, { ...t, ...p });
  }
  removeTileset(id: string): void { this.tilesets.delete(id); }

  // ── Tiles ──────────────────────────────────────────────────────
  addTile(d: TileData):    void { this.tiles.set(d.id, d); }
  getTile(id: string):     TileData | undefined { return this.tiles.get(id); }
  getAllTiles():            TileData[] { return [...this.tiles.values()]; }
  getTilesForTileset(tsId: string): TileData[] {
    return [...this.tiles.values()].filter(t => t.tilesetId === tsId);
  }
  updateTile(id: string, p: Partial<TileData>): void {
    const t = this.tiles.get(id); if (t) this.tiles.set(id, { ...t, ...p });
  }
  removeTile(id: string): void { this.tiles.delete(id); }

  // ── Maps ───────────────────────────────────────────────────────
  addMap(d: MapData):    void { this.maps.set(d.id, d); }
  getMap(id: string):    MapData | undefined { return this.maps.get(id); }
  getAllMaps():           MapData[] { return [...this.maps.values()]; }
  updateMap(id: string, p: Partial<MapData>): void {
    const m = this.maps.get(id); if (m) this.maps.set(id, { ...m, ...p });
  }
  removeMap(id: string): void { this.maps.delete(id); }

  // ── NPCs ───────────────────────────────────────────────────────
  addNPC(d: NPCData):    void { this.npcs.set(d.id, d); }
  getNPC(id: string):    NPCData | undefined { return this.npcs.get(id); }
  getAllNPCs():           NPCData[] { return [...this.npcs.values()]; }
  updateNPC(id: string, p: Partial<NPCData>): void {
    const n = this.npcs.get(id); if (n) this.npcs.set(id, { ...n, ...p });
  }
  removeNPC(id: string): void { this.npcs.delete(id); }

  // ── Dialogue Trees ─────────────────────────────────────────────
  addDialogue(d: DialogueTree):   void { this.dialogues.set(d.id, d); }
  getDialogue(id: string):        DialogueTree | undefined { return this.dialogues.get(id); }
  getAllDialogues():               DialogueTree[] { return [...this.dialogues.values()]; }
  updateDialogue(id: string, d: DialogueTree): void { this.dialogues.set(id, d); }
  removeDialogue(id: string): void { this.dialogues.delete(id); }

  // ── Cutscenes ──────────────────────────────────────────────────
  addCutscene(d: CutsceneScript):  void { this.cutscenes.set(d.id, d); }
  getCutscene(id: string):         CutsceneScript | undefined { return this.cutscenes.get(id); }
  getAllCutscenes():                CutsceneScript[] { return [...this.cutscenes.values()]; }
  updateCutscene(id: string, d: CutsceneScript): void { this.cutscenes.set(id, d); }
  removeCutscene(id: string): void { this.cutscenes.delete(id); }

  // ── Audio ──────────────────────────────────────────────────────
  addAudio(d: AudioAssetData):   void { this.audio.set(d.id, d); }
  getAudio(id: string):          AudioAssetData | undefined { return this.audio.get(id); }
  getAllAudio():                  AudioAssetData[] { return [...this.audio.values()]; }
  updateAudio(id: string, p: Partial<AudioAssetData>): void {
    const a = this.audio.get(id); if (a) this.audio.set(id, { ...a, ...p });
  }
  removeAudio(id: string): void { this.audio.delete(id); }

  // ── Shops ──────────────────────────────────────────────────────
  addShop(d: ShopData):    void { this.shops.set(d.id, d); }
  getShop(id: string):     ShopData | undefined { return this.shops.get(id); }
  getAllShops():            ShopData[] { return [...this.shops.values()]; }
  updateShop(id: string, d: ShopData): void { this.shops.set(id, d); }
  removeShop(id: string): void { this.shops.delete(id); }

  // ── Triggers ───────────────────────────────────────────────────
  addTrigger(d: TriggerData):   void { this.triggers.set(d.id, d); }
  getTrigger(id: string):       TriggerData | undefined { return this.triggers.get(id); }
  getAllTriggers():              TriggerData[] { return [...this.triggers.values()]; }
  updateTrigger(id: string, p: Partial<TriggerData>): void {
    const t = this.triggers.get(id); if (t) this.triggers.set(id, { ...t, ...p });
  }
  removeTrigger(id: string): void { this.triggers.delete(id); }

  // ── Pipe puzzle levels ─────────────────────────────────────────
  addPipeLevel(d: PipePuzzleLevel):   void { this.pipeLevels.set(d.id, d); }
  getPipeLevel(id: string):           PipePuzzleLevel | undefined { return this.pipeLevels.get(id); }
  getAllPipeLevels():                  PipePuzzleLevel[] { return [...this.pipeLevels.values()]; }
  updatePipeLevel(id: string, d: PipePuzzleLevel): void { this.pipeLevels.set(id, d); }
  removePipeLevel(id: string): void { this.pipeLevels.delete(id); }

  // ── Platform levels ────────────────────────────────────────────
  addPlatformLevel(d: PlatformLevel):   void { this.platformLevels.set(d.id, d); }
  getPlatformLevel(id: string):         PlatformLevel | undefined { return this.platformLevels.get(id); }
  getAllPlatformLevels():                PlatformLevel[] { return [...this.platformLevels.values()]; }
  updatePlatformLevel(id: string, d: PlatformLevel): void { this.platformLevels.set(id, d); }
  removePlatformLevel(id: string): void { this.platformLevels.delete(id); }

  // ── Serialization ─────────────────────────────────────────────
  serialize(): string {
    const bundle: AssetBundle = {
      sprites:        this.getAllSprites(),
      tilesets:       this.getAllTilesets(),
      tiles:          this.getAllTiles(),
      maps:           this.getAllMaps(),
      npcs:           this.getAllNPCs(),
      dialogues:      this.getAllDialogues(),
      cutscenes:      this.getAllCutscenes(),
      audio:          this.getAllAudio(),
      shops:          this.getAllShops(),
      triggers:       this.getAllTriggers(),
      pipeLevels:     this.getAllPipeLevels(),
      platformLevels: this.getAllPlatformLevels(),
    };
    return JSON.stringify(bundle);
  }

  deserialize(raw: string): void {
    try {
      const b = JSON.parse(raw) as AssetBundle;
      this.sprites.clear();        (b.sprites        ?? []).forEach(d => this.sprites.set(d.id, d));
      this.tilesets.clear();       (b.tilesets        ?? []).forEach(d => this.tilesets.set(d.id, d));
      this.tiles.clear();          (b.tiles           ?? []).forEach(d => this.tiles.set(d.id, d));
      this.maps.clear();           (b.maps            ?? []).forEach(d => this.maps.set(d.id, d));
      this.npcs.clear();           (b.npcs            ?? []).forEach(d => this.npcs.set(d.id, d));
      this.dialogues.clear();      (b.dialogues       ?? []).forEach(d => this.dialogues.set(d.id, d));
      this.cutscenes.clear();      (b.cutscenes       ?? []).forEach(d => this.cutscenes.set(d.id, d));
      this.audio.clear();          (b.audio           ?? []).forEach(d => this.audio.set(d.id, d));
      this.shops.clear();          (b.shops           ?? []).forEach(d => this.shops.set(d.id, d));
      this.triggers.clear();       (b.triggers        ?? []).forEach(d => this.triggers.set(d.id, d));
      this.pipeLevels.clear();     (b.pipeLevels      ?? []).forEach(d => this.pipeLevels.set(d.id, d));
      this.platformLevels.clear(); (b.platformLevels  ?? []).forEach(d => this.platformLevels.set(d.id, d));
    } catch {
      // corrupt data — keep empty store
    }
  }

  save(): void { localStorage.setItem(LS_ASSETS, this.serialize()); }

  load(): void {
    const raw = localStorage.getItem(LS_ASSETS);
    if (raw) this.deserialize(raw);
  }

  clear(): void {
    this.sprites.clear(); this.tilesets.clear(); this.tiles.clear();
    this.maps.clear(); this.npcs.clear(); this.dialogues.clear();
    this.cutscenes.clear(); this.audio.clear(); this.shops.clear();
    this.triggers.clear(); this.pipeLevels.clear(); this.platformLevels.clear();
  }
}

export const svgAssetStore = new SVGAssetStore();
