import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ARENA_SAVE_VERSION } from '../config/arenaConstants';
import type {
  ArenaConfig, ArenaSave, BridgeSave, WallSave,
  ObstacleSave, TrapSave, PortalSave, RotationSave,
  BaseFootingSave, JumpLinkSave, TranslationSave, SpeedLineSave,
} from '../utils/arenaPersistence';
import type { SurfaceType } from '../types/arenaTypes';

type BaseConfig = ArenaConfig['baseConfig'];

interface ArenaStateSlice {
  baseConfig:      BaseConfig;
  arenas:          ArenaSave[];     arenaSeq:       number;
  pitSeq:          number;          zoneSeq:        number;
  bridges:         BridgeSave[];
  wallSeq:         number;          bridgeSeq:      number;
  segmentSeq:      number;          speedLineSeq:   number;
  speedLines:      SpeedLineSave[];
  baseWalls:       WallSave[];
  obstacles:       ObstacleSave[];  obstacleSeq:    number;
  traps:           TrapSave[];      trapSeq:        number;
  portals:         PortalSave[];    portalSeq:      number;
  rotations:       RotationSave[];  rotationSeq:    number;
  footings:        BaseFootingSave[]; footingSeq:   number;
  jumpLinks:       JumpLinkSave[];  jumpLinkSeq:    number;
  translations:    TranslationSave[]; translationSeq: number;
}

interface ArenaStateActions {
  replace:  (c: ArenaConfig) => void;
  discard:  () => void;

  upsertArena:       (s: ArenaSave)         => void;
  removeArena:       (id: string)           => void;
  upsertBridge:      (s: BridgeSave)        => void;
  removeBridge:      (id: string)           => void;
  upsertObstacle:    (s: ObstacleSave)      => void;
  removeObstacle:    (id: string)           => void;
  upsertTrap:        (s: TrapSave)          => void;
  removeTrap:        (id: string)           => void;
  upsertPortal:      (s: PortalSave)        => void;
  removePortal:      (id: string)           => void;
  upsertWall:        (s: WallSave)          => void;
  removeWall:        (id: string)           => void;
  upsertRotation:    (s: RotationSave)      => void;
  removeRotation:    (id: string)           => void;
  upsertFooting:     (s: BaseFootingSave)   => void;
  removeFooting:     (id: string)           => void;
  upsertJumpLink:    (s: JumpLinkSave)      => void;
  removeJumpLink:    (id: string)           => void;
  upsertTranslation: (s: TranslationSave)   => void;
  removeTranslation: (id: string)           => void;
  upsertSpeedLine:   (s: SpeedLineSave)     => void;
  removeSpeedLine:   (id: string)           => void;

  setBaseConfig: (bc: BaseConfig) => void;
  clearObstacles: () => void;
  clearTraps:     () => void;
  clearPortals:   () => void;
  clearWalls:     () => void;
  clearBridges:   () => void;
  clearRotations: () => void;
  clearFootings:  () => void;
  clearJumpLinks: () => void;
  clearTranslations: () => void;
  clearSpeedLines: () => void;
}

export type ArenaStateStore = ReturnType<typeof createArenaStateStore>;
export type ArenaStateState = ArenaStateSlice & ArenaStateActions;

function emptySlice(): ArenaStateSlice {
  return {
    baseConfig: { height: 30, sides: 8, color: 0x334455, surface: 'plain' as SurfaceType, customTileData: null, tileScale: 1 },
    arenas: [], arenaSeq: 0, pitSeq: 0, zoneSeq: 0,
    bridges: [],
    wallSeq: 0, bridgeSeq: 0, segmentSeq: 0, speedLineSeq: 0,
    speedLines: [],
    baseWalls: [],
    obstacles: [], obstacleSeq: 0,
    traps: [],     trapSeq: 0,
    portals: [],   portalSeq: 0,
    rotations: [], rotationSeq: 0,
    footings: [],  footingSeq: 0,
    jumpLinks: [], jumpLinkSeq: 0,
    translations: [], translationSeq: 0,
  };
}

function configToSlice(c: ArenaConfig): ArenaStateSlice {
  return {
    baseConfig:      c.baseConfig,
    arenas:          c.arenas,          arenaSeq:       c.arenaSeq,
    pitSeq:          c.pitSeq,          zoneSeq:        c.zoneSeq,
    bridges:         c.bridges,
    wallSeq:         c.wallSeq,         bridgeSeq:      c.bridgeSeq,
    segmentSeq:      c.segmentSeq,      speedLineSeq:   c.speedLineSeq,
    speedLines:      c.speedLines ?? [],
    baseWalls:       c.baseWalls ?? [],
    obstacles:       c.obstacles,       obstacleSeq:    c.obstacleSeq,
    traps:           c.traps,           trapSeq:        c.trapSeq,
    portals:         c.portals,         portalSeq:      c.portalSeq,
    rotations:       c.rotations,       rotationSeq:    c.rotationSeq,
    footings:        c.footings,        footingSeq:     c.footingSeq,
    jumpLinks:       c.jumpLinks,       jumpLinkSeq:    c.jumpLinkSeq,
    translations:    c.translations,    translationSeq: c.translationSeq,
  };
}

function upsert<T extends { id: string }>(arr: T[], item: T): T[] {
  const i = arr.findIndex(x => x.id === item.id);
  const next = [...arr];
  if (i >= 0) next[i] = item; else next.push(item);
  return next;
}

export function createArenaStateStore(storageKey: string) {
  return createStore<ArenaStateState>()(
    persist(
      (set) => ({
        ...emptySlice(),

        replace:  (c) => set(configToSlice(c)),
        discard:  () => set(emptySlice()),

        upsertArena:       (s) => set((st) => ({ arenas:       upsert(st.arenas,       s) })),
        removeArena:       (id) => set((st) => ({ arenas:       st.arenas.filter(x => x.id !== id) })),
        upsertBridge:      (s) => set((st) => ({ bridges:      upsert(st.bridges,      s) })),
        removeBridge:      (id) => set((st) => ({ bridges:      st.bridges.filter(x => x.id !== id) })),
        upsertObstacle:    (s) => set((st) => ({ obstacles:    upsert(st.obstacles,    s) })),
        removeObstacle:    (id) => set((st) => ({ obstacles:    st.obstacles.filter(x => x.id !== id) })),
        upsertTrap:        (s) => set((st) => ({ traps:        upsert(st.traps,        s) })),
        removeTrap:        (id) => set((st) => ({ traps:        st.traps.filter(x => x.id !== id) })),
        upsertPortal:      (s) => set((st) => ({ portals:      upsert(st.portals,      s) })),
        removePortal:      (id) => set((st) => ({ portals:      st.portals.filter(x => x.id !== id) })),
        upsertWall:        (s) => set((st) => ({ baseWalls:    upsert(st.baseWalls,    s) })),
        removeWall:        (id) => set((st) => ({ baseWalls:    st.baseWalls.filter(x => x.id !== id) })),
        upsertRotation:    (s) => set((st) => ({ rotations:    upsert(st.rotations,    s) })),
        removeRotation:    (id) => set((st) => ({ rotations:    st.rotations.filter(x => x.id !== id) })),
        upsertFooting:     (s) => set((st) => ({ footings:     upsert(st.footings,     s) })),
        removeFooting:     (id) => set((st) => ({ footings:     st.footings.filter(x => x.id !== id) })),
        upsertJumpLink:    (s) => set((st) => ({ jumpLinks:    upsert(st.jumpLinks,    s) })),
        removeJumpLink:    (id) => set((st) => ({ jumpLinks:    st.jumpLinks.filter(x => x.id !== id) })),
        upsertTranslation: (s) => set((st) => ({ translations: upsert(st.translations, s) })),
        removeTranslation: (id) => set((st) => ({ translations: st.translations.filter(x => x.id !== id) })),
        upsertSpeedLine:   (s) => set((st) => ({ speedLines:   upsert(st.speedLines,   s) })),
        removeSpeedLine:   (id) => set((st) => ({ speedLines:   st.speedLines.filter(x => x.id !== id) })),

        setBaseConfig: (bc) => set({ baseConfig: bc }),
        clearObstacles:   () => set({ obstacles:    [], obstacleSeq:    0 }),
        clearTraps:       () => set({ traps:        [], trapSeq:        0 }),
        clearPortals:     () => set({ portals:      [], portalSeq:      0 }),
        clearWalls:       () => set({ baseWalls:    [], wallSeq:        0 }),
        clearBridges:     () => set({ bridges:      [], bridgeSeq:      0, segmentSeq: 0 }),
        clearRotations:   () => set({ rotations:    [], rotationSeq:    0 }),
        clearFootings:    () => set({ footings:     [], footingSeq:     0 }),
        clearJumpLinks:   () => set({ jumpLinks:    [], jumpLinkSeq:    0 }),
        clearTranslations:() => set({ translations: [], translationSeq: 0 }),
        clearSpeedLines:  () => set({ speedLines:   [], speedLineSeq:   0 }),
      }),
      {
        name:    storageKey,
        storage: createJSONStorage(() => localStorage),
        version: ARENA_SAVE_VERSION,
        migrate: () => emptySlice() as ArenaStateState,
      },
    ),
  );
}
