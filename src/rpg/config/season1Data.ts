import { svgAssetStore } from '../stores/SVGAssetStore.ts';
import { inventoryStore } from '../stores/InventoryStore.ts';
import { gameStateStore } from '../stores/GameStateStore.ts';
import type {
  SVGSpriteData, SVGTilesetData, TileData, MapData, NPCData,
  DialogueTree, CutsceneScript, ItemData, PipePuzzleLevel,
  PlatformLevel, TriggerData,
} from '../../types/rpgTypes.ts';

// ── Item catalogue (not stored in SVGAssetStore, used at runtime) ──
export const ITEM_CATALOGUE: Record<string, ItemData> = {
  dragoon: { id: 'dragoon', name: 'Dragoon', desc: 'Tyson\'s legendary wind-spirit Beyblade.', category: 'bey_part', equipSlot: 'bey', spriteId: 'items', frameIndex: 0, price: 0 },
  power_ring: { id: 'power_ring', name: 'Power Ring', desc: 'An attack ring that amplifies spin power.', category: 'bey_part', equipSlot: 'ring', spriteId: 'items', frameIndex: 1, price: 40 },
  heavy_disk: { id: 'heavy_disk', name: 'Heavy Disk', desc: 'Increases stamina through extra weight.', category: 'bey_part', equipSlot: 'disk', spriteId: 'items', frameIndex: 2, price: 35 },
  bba_token: { id: 'bba_token', name: 'BBA Token', desc: 'Official BBA tournament currency (G).', category: 'currency', equipSlot: null, spriteId: 'items', frameIndex: 3, price: 1 },
  energy_ring: { id: 'energy_ring', name: 'Energy Ring', desc: 'Boosts spin energy recovery.', category: 'consumable', equipSlot: null, spriteId: 'items', frameIndex: 4, price: 20 },
};

// ── Placeholder SVG helpers ──────────────────────────────────────
function makeSVG(w: number, h: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

function base64(svg: string): string {
  return btoa(unescape(encodeURIComponent(svg)));
}

// 4-direction walk sprite sheet: 4 cols × 4 rows (down,left,right,up), 48×48 per frame
function characterSVG(color: string, accentColor: string, label: string): string {
  const fw = 48; const fh = 48; const cols = 4; const rows = 4;
  const dirs = ['down', 'left', 'right', 'up'];
  let frames = '';
  dirs.forEach((dir, row) => {
    for (let col = 0; col < cols; col++) {
      const x = col * fw; const y = row * fh;
      const legOff = (col % 2 === 0) ? 3 : -3;
      const bodyY = dir === 'up' ? y + 8 : y + 10;
      frames += `
        <rect x="${x+14}" y="${bodyY}" width="20" height="22" rx="4" fill="${color}"/>
        <circle cx="${x+24}" cy="${y+14}" r="10" fill="${accentColor}"/>
        <text x="${x+24}" y="${y+18}" text-anchor="middle" font-size="8" fill="white" font-family="sans-serif">${label[0]}</text>
        <rect x="${x+14}" y="${bodyY+22}" width="8" height="10" rx="2" fill="${color}" transform="translate(${legOff},0)"/>
        <rect x="${x+26}" y="${bodyY+22}" width="8" height="10" rx="2" fill="${color}" transform="translate(${-legOff},0)"/>
      `;
    }
  });
  return makeSVG(fw * cols, fh * rows, frames);
}

// Tileset SVG: 8×4 grid of 32×32 tiles
function tilesetSVG(): string {
  const tw = 32; const cols = 8; const rows = 4;
  const tiles: { fill: string; label: string }[] = [
    { fill: '#4a7c3f', label: 'G' },   // grass
    { fill: '#8a7a5a', label: 'P' },   // path
    { fill: '#2d5a1b', label: 'T' },   // tree
    { fill: '#4a9f3f', label: 'L' },   // tree top
    { fill: '#6b5a3a', label: 'B' },   // bench
    { fill: '#2a6b2a', label: 'SH' },  // bush
    { fill: '#e8d878', label: 'F' },   // flower
    { fill: '#3a5a8a', label: 'W' },   // water
    { fill: '#3d6b33', label: 'GD' },  // grass dark
    { fill: '#a08060', label: 'PL' },  // path light
    { fill: '#1a3a0a', label: 'TD' },  // tree dark
    { fill: '#38804a', label: 'TL' },  // tree light
    { fill: '#c09a5a', label: 'ST' },  // stone
    { fill: '#e0c8a0', label: 'SL' },  // stone light
    { fill: '#5a7a9a', label: 'WD' },  // water dark
    { fill: '#7ab8d4', label: 'WL' },  // water light
    { fill: '#2a3a1a', label: 'BR' },  // brick
    { fill: '#4a3a2a', label: 'WB' },  // wood
    { fill: '#d4c090', label: 'SD' },  // sand
    { fill: '#c0d4f0', label: 'IC' },  // ice
    { fill: '#3a2a1a', label: 'RK' },  // rock
    { fill: '#6a4a3a', label: 'DT' },  // dirt
    { fill: '#9abe7a', label: 'ME' },  // meadow
    { fill: '#ffd700', label: 'GS' },  // gold star
    { fill: '#404060', label: 'FL' },  // floor
    { fill: '#606080', label: 'FW' },  // floor warm
    { fill: '#202030', label: 'VD' },  // void
    { fill: '#ff6060', label: 'DG' },  // danger
    { fill: '#00e5ff', label: 'SZ' },  // speed zone
    { fill: '#ff6b35', label: 'FZ' },  // fire zone
    { fill: '#ffffff', label: 'WH' },  // white
    { fill: '#000000', label: 'BK' },  // black
  ];
  let body = '';
  tiles.forEach((t, i) => {
    const col = i % cols; const row = Math.floor(i / cols);
    const x = col * tw; const y = row * tw;
    body += `<rect x="${x}" y="${y}" width="${tw}" height="${tw}" fill="${t.fill}"/>`;
    body += `<rect x="${x+1}" y="${y+1}" width="${tw-2}" height="${tw-2}" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>`;
    body += `<text x="${x+tw/2}" y="${y+tw/2+4}" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.8)" font-family="sans-serif">${t.label}</text>`;
  });
  return makeSVG(tw * cols, tw * rows, body);
}

function itemsSVG(): string {
  const tw = 32;
  const items = [
    { fill: '#00e5ff', label: 'DRG' },   // Dragoon
    { fill: '#ff6b35', label: 'PWR' },   // Power Ring
    { fill: '#888888', label: 'HVY' },   // Heavy Disk
    { fill: '#ffd700', label: 'G' },     // BBA Token (gold)
    { fill: '#00ff88', label: 'NRG' },   // Energy Ring
    { fill: '#ff4444', label: 'DMG' },   // Damage item
    { fill: '#4488ff', label: 'DEF' },   // Defense
    { fill: '#ff88ff', label: 'SP' },    // Special
  ];
  let body = '';
  items.forEach((item, i) => {
    const x = i * tw;
    body += `<rect x="${x}" y="0" width="${tw}" height="${tw}" rx="6" fill="${item.fill}" opacity="0.9"/>`;
    body += `<text x="${x+tw/2}" y="${tw/2+4}" text-anchor="middle" font-size="7" fill="white" font-family="sans-serif">${item.label}</text>`;
  });
  return makeSVG(tw * items.length, tw, body);
}

function chestSVG(): string {
  return makeSVG(48, 48, `
    <rect x="4" y="20" width="40" height="24" rx="3" fill="#8b6914"/>
    <rect x="4" y="20" width="40" height="10" rx="3" fill="#a07820"/>
    <rect x="18" y="24" width="12" height="10" rx="2" fill="#ffd700"/>
    <circle cx="24" cy="29" r="3" fill="#c0a000"/>
    <rect x="2" y="18" width="44" height="4" rx="1" fill="#c09a28"/>
  `);
}

// ── Dialogue helper ────────────────────────────────────────────────
function makeDlgNode(
  id: string, type: DialogueTree['nodes'][0]['type'],
  speaker: string, emotion: string, text: string,
  nextId: string | null = null,
): DialogueTree['nodes'][0] {
  return {
    id, type, speaker, emotion, text, nextId,
    choices: [], flagKey: null, trueBranch: null, falseBranch: null,
    eventType: null, eventArg: null,
  };
}

// ── Apply Season 1 defaults ────────────────────────────────────────
export function applySeasonOneDefaults(): void {

  // SVG sprites ───────────────────────────────────────────────────
  const sprites: SVGSpriteData[] = [
    {
      id: 'tyson', name: 'Tyson Granger',
      svgBase64: base64(characterSVG('#1a7aff', '#ff6b35', 'TY')),
      frameWidth: 48, frameHeight: 48, cols: 4, rows: 4, padding: 0,
      animations: [
        { name: 'walk-down',  fps: 8, loop: true, frames: [0,1,2,3] },
        { name: 'walk-left',  fps: 8, loop: true, frames: [4,5,6,7] },
        { name: 'walk-right', fps: 8, loop: true, frames: [8,9,10,11] },
        { name: 'walk-up',    fps: 8, loop: true, frames: [12,13,14,15] },
        { name: 'idle-down',  fps: 2, loop: true, frames: [0,1] },
      ],
      hitbox: { offsetX: 8, offsetY: 24, width: 32, height: 20 },
      portraits: { neutral: 0, happy: 1, sad: 2, angry: 3, surprised: 4 },
    },
    {
      id: 'kai', name: 'Kai Hiwatari',
      svgBase64: base64(characterSVG('#cc2222', '#222244', 'KI')),
      frameWidth: 48, frameHeight: 48, cols: 4, rows: 4, padding: 0,
      animations: [
        { name: 'walk-down',  fps: 8, loop: true, frames: [0,1,2,3] },
        { name: 'walk-left',  fps: 8, loop: true, frames: [4,5,6,7] },
        { name: 'walk-right', fps: 8, loop: true, frames: [8,9,10,11] },
        { name: 'walk-up',    fps: 8, loop: true, frames: [12,13,14,15] },
        { name: 'idle-down',  fps: 2, loop: true, frames: [0,1] },
      ],
      hitbox: { offsetX: 8, offsetY: 24, width: 32, height: 20 },
      portraits: { neutral: 0, happy: 1, sad: 2, angry: 3, surprised: 4 },
    },
    {
      id: 'max', name: 'Max Tate',
      svgBase64: base64(characterSVG('#22aa44', '#88ddaa', 'MX')),
      frameWidth: 48, frameHeight: 48, cols: 4, rows: 4, padding: 0,
      animations: [
        { name: 'walk-down',  fps: 8, loop: true, frames: [0,1,2,3] },
        { name: 'walk-left',  fps: 8, loop: true, frames: [4,5,6,7] },
        { name: 'walk-right', fps: 8, loop: true, frames: [8,9,10,11] },
        { name: 'walk-up',    fps: 8, loop: true, frames: [12,13,14,15] },
        { name: 'idle-down',  fps: 2, loop: true, frames: [0,1] },
      ],
      hitbox: { offsetX: 8, offsetY: 24, width: 32, height: 20 },
      portraits: { neutral: 0, happy: 1, sad: 2, angry: 3, surprised: 4 },
    },
    {
      id: 'kenny', name: 'Kenny (Chief)',
      svgBase64: base64(characterSVG('#aa8822', '#ffeeaa', 'KN')),
      frameWidth: 48, frameHeight: 48, cols: 4, rows: 4, padding: 0,
      animations: [
        { name: 'idle-down',  fps: 2, loop: true, frames: [0,1] },
        { name: 'walk-down',  fps: 8, loop: true, frames: [0,1,2,3] },
      ],
      hitbox: { offsetX: 8, offsetY: 24, width: 32, height: 20 },
      portraits: { neutral: 0, happy: 1, sad: 2, angry: 3, surprised: 4 },
    },
    {
      id: 'blader_a', name: 'Rival Blader',
      svgBase64: base64(characterSVG('#884488', '#ccaacc', 'BL')),
      frameWidth: 48, frameHeight: 48, cols: 4, rows: 4, padding: 0,
      animations: [
        { name: 'walk-down',  fps: 8, loop: true, frames: [0,1,2,3] },
        { name: 'idle-down',  fps: 2, loop: true, frames: [0,1] },
      ],
      hitbox: { offsetX: 8, offsetY: 24, width: 32, height: 20 },
      portraits: { neutral: 0, happy: 1, angry: 3 },
    },
    {
      id: 'chest', name: 'Chest',
      svgBase64: base64(chestSVG()),
      frameWidth: 48, frameHeight: 48, cols: 1, rows: 1, padding: 0,
      animations: [],
      hitbox: { offsetX: 4, offsetY: 4, width: 40, height: 40 },
      portraits: {},
    },
    {
      id: 'items', name: 'Item Icons',
      svgBase64: base64(itemsSVG()),
      frameWidth: 32, frameHeight: 32, cols: 8, rows: 1, padding: 0,
      animations: [],
      hitbox: { offsetX: 0, offsetY: 0, width: 32, height: 32 },
      portraits: {},
    },
  ];
  sprites.forEach(s => svgAssetStore.addSprite(s));

  // Tileset ────────────────────────────────────────────────────────
  const tileset: SVGTilesetData = {
    id: 'city_park_tiles', name: 'City Park',
    svgBase64: base64(tilesetSVG()),
    tileWidth: 32, tileHeight: 32,
    tileIds: [
      'grass', 'path', 'tree_trunk', 'tree_top', 'bench', 'bush', 'flower', 'water',
      'grass_dark', 'path_light', 'tree_dark', 'tree_light', 'stone', 'stone_light',
      'water_dark', 'water_light', 'brick', 'wood', 'sand', 'ice', 'rock', 'dirt',
      'meadow', 'gold_star', 'floor', 'floor_warm', 'void', 'danger', 'speed_zone',
      'fire_zone', 'white', 'black',
    ],
  };
  svgAssetStore.addTileset(tileset);

  // Tiles ──────────────────────────────────────────────────────────
  const tileConfigs: TileData[] = [
    { id: 'grass',      name: 'Grass',       tilesetId: 'city_park_tiles', frameIndex: 0,  collision: 'none',  zLayer: 'ground', animFrames: [], animFps: 0, tags: [] },
    { id: 'path',       name: 'Stone Path',  tilesetId: 'city_park_tiles', frameIndex: 1,  collision: 'none',  zLayer: 'ground', animFrames: [], animFps: 0, tags: [] },
    { id: 'tree_trunk', name: 'Tree Trunk',  tilesetId: 'city_park_tiles', frameIndex: 2,  collision: 'solid', zLayer: 'decor',  animFrames: [], animFps: 0, tags: ['obstacle'] },
    { id: 'tree_top',   name: 'Tree Top',    tilesetId: 'city_park_tiles', frameIndex: 3,  collision: 'none',  zLayer: 'overhead', animFrames: [], animFps: 0, tags: [] },
    { id: 'bench',      name: 'Bench',       tilesetId: 'city_park_tiles', frameIndex: 4,  collision: 'solid', zLayer: 'decor',  animFrames: [], animFps: 0, tags: ['obstacle'] },
    { id: 'bush',       name: 'Bush',        tilesetId: 'city_park_tiles', frameIndex: 5,  collision: 'none',  zLayer: 'decor',  animFrames: [], animFps: 0, tags: ['bush', 'hide'] },
    { id: 'flower',     name: 'Flower',      tilesetId: 'city_park_tiles', frameIndex: 6,  collision: 'none',  zLayer: 'decor',  animFrames: [], animFps: 0, tags: [] },
    { id: 'water',      name: 'Water',       tilesetId: 'city_park_tiles', frameIndex: 7,  collision: 'water', zLayer: 'ground', animFrames: [7,14,15], animFps: 3, tags: ['water'] },
    { id: 'stone',      name: 'Stone',       tilesetId: 'city_park_tiles', frameIndex: 12, collision: 'solid', zLayer: 'decor',  animFrames: [], animFps: 0, tags: ['obstacle'] },
    { id: 'speed_zone', name: 'Speed Zone',  tilesetId: 'city_park_tiles', frameIndex: 28, collision: 'none',  zLayer: 'ground', animFrames: [], animFps: 0, tags: ['speed'] },
    { id: 'void_tile',  name: 'Void',        tilesetId: 'city_park_tiles', frameIndex: 26, collision: 'solid', zLayer: 'ground', animFrames: [], animFps: 0, tags: ['void'] },
  ];
  tileConfigs.forEach(t => svgAssetStore.addTile(t));

  // Starting map ────────────────────────────────────────────────────
  const emptyRow = (cols: number) => Array.from({ length: cols }, (): { tileId: string | null } => ({ tileId: null }));
  const fillRow  = (cols: number, tileId: string) => Array.from({ length: cols }, () => ({ tileId }));

  const groundCells: { tileId: string | null }[][] = Array.from({ length: 15 }, () => fillRow(20, 'grass'));
  // Stone paths
  for (let r = 5; r < 10; r++) { groundCells[r][9] = { tileId: 'path' }; groundCells[r][10] = { tileId: 'path' }; }
  for (let c = 5; c < 15; c++) { groundCells[7][c] = { tileId: 'path' }; }

  const objectCells: { tileId: string | null }[][] = Array.from({ length: 15 }, () => emptyRow(20));
  // Trees around edges
  [[1,1],[1,2],[18,1],[18,2],[1,13],[1,12],[18,13],[18,12]].forEach(([c,r]) => {
    if (r < 15 && c < 20) objectCells[r][c] = { tileId: 'tree_trunk' };
  });
  // Benches
  [[6,5],[14,5],[6,10],[14,10]].forEach(([c,r]) => {
    if (r < 15 && c < 20) objectCells[r][c] = { tileId: 'bench' };
  });
  // Bushes
  [[3,3],[4,3],[15,3],[16,3],[3,11],[4,11]].forEach(([c,r]) => {
    if (r < 15 && c < 20) objectCells[r][c] = { tileId: 'bush' };
  });

  const startingMap: MapData = {
    id: 'city_park', name: 'Bey-Ta City Park',
    cols: 20, rows: 15, tileSize: 48,
    bgColor: '#2a4a2a', tilesetId: 'city_park_tiles', bgmId: null,
    layers: [
      { id: 'ground',   name: 'Ground',   visible: true, cells: groundCells },
      { id: 'objects',  name: 'Objects',  visible: true, cells: objectCells },
      { id: 'entities', name: 'Entities', visible: true, cells: Array.from({ length: 15 }, () => emptyRow(20)) },
      { id: 'overlay',  name: 'Overlay',  visible: true, cells: Array.from({ length: 15 }, () => emptyRow(20)) },
    ],
    entities: [
      { id: 'ent_kai',   npcId: 'npc_kai',   tileX: 14, tileY: 7, facing: 'left',  patrolPath: [{x:14,y:7},{x:11,y:7},{x:11,y:5},{x:14,y:5}] },
      { id: 'ent_kenny', npcId: 'npc_kenny', tileX: 5,  tileY: 7, facing: 'right', patrolPath: [] },
      { id: 'ent_max',   npcId: 'npc_max',   tileX: 10, tileY: 10, facing: 'up',   patrolPath: [{x:10,y:10},{x:12,y:10},{x:12,y:12},{x:10,y:12}] },
      { id: 'ent_blader',npcId: 'npc_blader',tileX: 16, tileY: 3,  facing: 'down', patrolPath: [{x:16,y:3},{x:18,y:3},{x:18,y:5},{x:16,y:5}] },
    ],
    events: [
      { id: 'ev_kenny',   tileX: 4,  tileY: 6, widthTiles: 3, heightTiles: 3, triggerId: 'tr_kenny_intro' },
      { id: 'ev_kai',     tileX: 13, tileY: 6, widthTiles: 3, heightTiles: 3, triggerId: 'tr_kai_meet' },
      { id: 'ev_max',     tileX: 9,  tileY: 9, widthTiles: 3, heightTiles: 3, triggerId: 'tr_max_meet' },
      { id: 'ev_battle',  tileX: 15, tileY: 2, widthTiles: 4, heightTiles: 4, triggerId: 'tr_practice_battle' },
      { id: 'ev_puzzle',  tileX: 17, tileY: 10, widthTiles: 2, heightTiles: 2, triggerId: 'tr_pipe_puzzle_1' },
      { id: 'ev_platform',tileX: 1,  tileY: 8, widthTiles: 2, heightTiles: 2, triggerId: 'tr_platform_1' },
      { id: 'ev_chest',   tileX: 10, tileY: 2, widthTiles: 2, heightTiles: 2, triggerId: 'tr_chest_1' },
    ],
  };
  svgAssetStore.addMap(startingMap);

  // NPCs ────────────────────────────────────────────────────────────
  const npcs: NPCData[] = [
    {
      id: 'npc_kenny', name: 'Kenny', spriteId: 'kenny', portraitId: 'kenny',
      aiDefault: 'idle', dialogueId: 'dlg_kenny_intro', shopId: null,
      visionCone: { range: 120, angle: 40, reductionBush: 0.5 },
    },
    {
      id: 'npc_kai', name: 'Kai', spriteId: 'kai', portraitId: 'kai',
      aiDefault: 'patrol', dialogueId: 'dlg_kai_meet', shopId: null,
      visionCone: { range: 180, angle: 65, reductionBush: 0.4 },
    },
    {
      id: 'npc_max', name: 'Max', spriteId: 'max', portraitId: 'max',
      aiDefault: 'follow', dialogueId: 'dlg_max_meet', shopId: null,
      visionCone: { range: 150, angle: 80, reductionBush: 0.6 },
    },
    {
      id: 'npc_blader', name: 'Rival Blader', spriteId: 'blader_a', portraitId: 'blader_a',
      aiDefault: 'patrol', dialogueId: 'dlg_blader_challenge', shopId: null,
      visionCone: { range: 200, angle: 60, reductionBush: 0.3 },
    },
  ];
  npcs.forEach(n => svgAssetStore.addNPC(n));

  // Triggers ─────────────────────────────────────────────────────────
  const triggers: TriggerData[] = [
    { id: 'tr_kenny_intro',     type: 'cutscene',       targetId: 'cs_intro',             warpTileX: 0, warpTileY: 0, once: true,  flagReq: null },
    { id: 'tr_kai_meet',        type: 'dialogue',        targetId: 'dlg_kai_meet',         warpTileX: 0, warpTileY: 0, once: false, flagReq: 'got_dragoon' },
    { id: 'tr_max_meet',        type: 'dialogue',        targetId: 'dlg_max_meet',         warpTileX: 0, warpTileY: 0, once: false, flagReq: null },
    { id: 'tr_practice_battle', type: 'battle',          targetId: 'npc_blader',           warpTileX: 0, warpTileY: 0, once: false, flagReq: 'got_dragoon' },
    { id: 'tr_pipe_puzzle_1',   type: 'pipe_puzzle',     targetId: 'pp_training_pipes',    warpTileX: 0, warpTileY: 0, once: false, flagReq: null },
    { id: 'tr_platform_1',      type: 'platform_level',  targetId: 'pl_park_rooftops',     warpTileX: 0, warpTileY: 0, once: false, flagReq: null },
    { id: 'tr_chest_1',         type: 'chest',           targetId: 'chest_power_ring',     warpTileX: 0, warpTileY: 0, once: true,  flagReq: null },
  ];
  triggers.forEach(t => svgAssetStore.addTrigger(t));

  // Dialogues ────────────────────────────────────────────────────────
  const kennyIntro: DialogueTree = {
    id: 'dlg_kenny_intro', name: 'Kenny: Intro', npcId: 'npc_kenny',
    startId: 'n1',
    positions: [{ id: 'n1', x: 50, y: 50 }, { id: 'n2', x: 300, y: 50 }, { id: 'n3', x: 550, y: 50 }, { id: 'n_end', x: 800, y: 50 }],
    nodes: [
      makeDlgNode('n1', 'TEXT', 'Kenny', 'happy', 'Tyson! It\'s finally arrived — your Dragoon! I knew your grandfather\'s Beyblade would find its way back to you!', 'n2'),
      makeDlgNode('n2', 'TEXT', 'Tyson', 'surprised', 'My Dragoon... Dad always talked about it. Let\'s do this!', 'n3'),
      { ...makeDlgNode('n3', 'EVENT', '', '', '', 'n_end'), eventType: 'give_item', eventArg: 'dragoon' },
      makeDlgNode('n_end', 'TEXT', 'Kenny', 'neutral', 'Now go find Kai and Max. We need the whole team before the BBA tournament!', null),
    ],
  };
  const kaiMeet: DialogueTree = {
    id: 'dlg_kai_meet', name: 'Kai: First Meeting', npcId: 'npc_kai',
    startId: 'k1',
    positions: [{ id: 'k1', x: 50, y: 50 }, { id: 'k2', x: 300, y: 50 }, { id: 'k3a', x: 550, y: 30 }, { id: 'k3b', x: 550, y: 100 }, { id: 'k_end', x: 800, y: 50 }],
    nodes: [
      makeDlgNode('k1', 'TEXT', 'Kai', 'neutral', 'You\'re the kid Kenny keeps talking about. Hmph. Don\'t waste my time.', 'k2'),
      {
        ...makeDlgNode('k2', 'CHOICE', '', '', '', null),
        choices: [
          { label: 'I want to battle!', nextId: 'k3a', flagReq: null },
          { label: 'Nice to meet you.', nextId: 'k3b', flagReq: null },
        ],
      },
      { ...makeDlgNode('k3a', 'TEXT', 'Kai', 'angry', 'Confidence without skill is just noise. Prove yourself in the arena first.', 'k_end'), nextId: 'k_end' },
      { ...makeDlgNode('k3b', 'TEXT', 'Kai', 'neutral', '...', 'k_end') },
      { ...makeDlgNode('k_end', 'EVENT', '', '', '', null), eventType: 'set_flag', eventArg: 'spoke_kai' },
    ],
  };
  const maxMeet: DialogueTree = {
    id: 'dlg_max_meet', name: 'Max: Introduction', npcId: 'npc_max',
    startId: 'm1',
    positions: [{ id: 'm1', x: 50, y: 50 }, { id: 'm2', x: 300, y: 50 }],
    nodes: [
      makeDlgNode('m1', 'TEXT', 'Max', 'happy', 'Hey! You must be Tyson! I\'m Max Tate — Draciel user and proud member of the Bladebreakers! Let\'s battle sometime!', 'm2'),
      makeDlgNode('m2', 'TEXT', 'Tyson', 'happy', 'Awesome! The more the better!', null),
    ],
  };
  const bladerChallenge: DialogueTree = {
    id: 'dlg_blader_challenge', name: 'Blader: Challenge', npcId: 'npc_blader',
    startId: 'b1',
    positions: [{ id: 'b1', x: 50, y: 50 }],
    nodes: [
      makeDlgNode('b1', 'TEXT', 'Rival', 'angry', 'Hey you! I heard you\'ve got a rare Dragoon! Let\'s battle for it!', null),
    ],
  };
  [kennyIntro, kaiMeet, maxMeet, bladerChallenge].forEach(d => svgAssetStore.addDialogue(d));

  // Opening cutscene ─────────────────────────────────────────────────
  const introCutscene: CutsceneScript = {
    id: 'cs_intro', name: 'Intro: Kenny Gives Dragoon',
    steps: [
      { id: 's1', type: 'fade',     duration: 600,  fadeDir: 'in',  targetX: 0, targetY: 0, dialogueId: null, npcId: null, destTileX: 0, destTileY: 0, soundId: null, flagKey: null, flagValue: false },
      { id: 's2', type: 'camera_pan', duration: 1000, targetX: 5 * 48, targetY: 7 * 48, dialogueId: null, npcId: null, destTileX: 0, destTileY: 0, soundId: null, flagKey: null, flagValue: false, fadeDir: 'in' },
      { id: 's3', type: 'dialogue', duration: 0,    dialogueId: 'dlg_kenny_intro', targetX: 0, targetY: 0, npcId: null, destTileX: 0, destTileY: 0, soundId: null, flagKey: null, flagValue: false, fadeDir: 'in' },
      { id: 's4', type: 'flag_set', duration: 0,    flagKey: 'got_dragoon', flagValue: true, targetX: 0, targetY: 0, dialogueId: null, npcId: null, destTileX: 0, destTileY: 0, soundId: null, fadeDir: 'in' },
      { id: 's5', type: 'wait',     duration: 300,  targetX: 0, targetY: 0, dialogueId: null, npcId: null, destTileX: 0, destTileY: 0, soundId: null, flagKey: null, flagValue: false, fadeDir: 'in' },
    ],
  };
  svgAssetStore.addCutscene(introCutscene);

  // Pipe puzzle levels ───────────────────────────────────────────────
  const E = (r: 0 | 90 | 180 | 270, l = false): { type: 'empty'; rotation: 0 | 90 | 180 | 270; locked: boolean } =>
    ({ type: 'empty', rotation: r, locked: l });
  const ST = (r: 0 | 90 | 180 | 270): { type: 'straight'; rotation: 0 | 90 | 180 | 270; locked: boolean } =>
    ({ type: 'straight', rotation: r, locked: false });
  const EL = (r: 0 | 90 | 180 | 270): { type: 'elbow'; rotation: 0 | 90 | 180 | 270; locked: boolean } =>
    ({ type: 'elbow', rotation: r, locked: false });
  const SRC = (): { type: 'source'; rotation: 0; locked: boolean } => ({ type: 'source', rotation: 0, locked: true });
  const SNK = (): { type: 'sink'; rotation: 0; locked: boolean }   => ({ type: 'sink', rotation: 0, locked: true });

  const pp1: PipePuzzleLevel = {
    id: 'pp_training_pipes', name: 'Training Pipes',
    cols: 5, rows: 4, timeLimitSec: 40,
    rewardItemId: 'energy_ring', rewardGold: 10, winFlagKey: 'pipe_1_solved',
    grid: [
      [SRC(),  EL(0),   E(0),    E(0),    E(0)   ],
      [E(0),   ST(90),  EL(90),  E(0),    E(0)   ],
      [E(0),   E(0),    ST(0),   EL(0),   E(0)   ],
      [E(0),   E(0),    E(0),    ST(90),  SNK()  ],
    ],
  };
  svgAssetStore.addPipeLevel(pp1);

  // Platform levels ─────────────────────────────────────────────────
  const pl1: PlatformLevel = {
    id: 'pl_park_rooftops', name: 'Park Rooftops',
    cols: 12, rows: 8, tileSize: 40,
    timeLimitSec: 60,
    spawnCol: 0, spawnRow: 6, exitCol: 11, exitRow: 1,
    bgColor: '#1a2a3a', gravity: 800,
    rewardItemId: 'power_ring', rewardGold: 25, winFlagKey: 'platform_1_cleared',
    tiles: [
      { col: 0, row: 7, type: 'solid' }, { col: 1, row: 7, type: 'solid' }, { col: 2, row: 7, type: 'solid' },
      { col: 0, row: 6, type: 'solid' }, { col: 1, row: 6, type: 'solid' }, { col: 2, row: 6, type: 'solid' },
      { col: 3, row: 5, type: 'solid' }, { col: 4, row: 5, type: 'solid' },
      { col: 5, row: 4, type: 'solid' }, { col: 6, row: 4, type: 'solid' },
      { col: 4, row: 3, type: 'spring' },
      { col: 7, row: 2, type: 'solid' }, { col: 8, row: 2, type: 'solid' }, { col: 9, row: 2, type: 'solid' },
      { col: 6, row: 6, type: 'spike' }, { col: 7, row: 6, type: 'spike' },
      { col: 10, row: 1, type: 'solid' }, { col: 11, row: 1, type: 'solid' },
      { col: 10, row: 2, type: 'solid' }, { col: 11, row: 2, type: 'solid' },
      { col: 5, row: 6, type: 'moving', moveAxis: 'x', moveRange: 3, moveSpeed: 60 },
    ],
    collectibles: [
      { col: 4, row: 4, itemId: 'energy_ring', frameIndex: 4 },
      { col: 8, row: 1, itemId: 'bba_token',   frameIndex: 3 },
    ],
  };
  svgAssetStore.addPlatformLevel(pl1);

  // Starting inventory ────────────────────────────────────────────────
  inventoryStore.add('dragoon', 1);
  inventoryStore.addGold(30);
  inventoryStore.equip('bey', 'dragoon');

  // Starting quest ───────────────────────────────────────────────────
  gameStateStore.setQuestStatus('quest_find_team', 'active');

  svgAssetStore.save();
}
