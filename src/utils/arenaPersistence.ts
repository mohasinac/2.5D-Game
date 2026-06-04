import { OpeningShape, WallProfile, SurfaceType, ZoneFill, ArenaData, PitData, ZoneData } from '../types/arenaTypes';

export interface ArenaSave {
  id: string; name: string;
  openingShape: OpeningShape; wallProfile: WallProfile;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  posX: number; posZ: number; posY: number; rotY: number;
  isMoat: boolean; innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape; innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile; innerRimOffset: number;
  pits: PitSave[]; zones: ZoneSave[];
}

export interface PitSave {
  id: string; name: string;
  parentPitId: string | null; parentZoneId: string | null;
  openingShape: OpeningShape;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  posR: number; posAngle: number; rotY: number;
  pits: PitSave[]; zones: ZoneSave[];
}

export interface ZoneSave {
  id: string; name: string; openingShape: OpeningShape;
  parentPitId: string | null; parentZoneId: string | null;
  radiusX: number; radiusZ: number; depth: number; sides: number; starInner: number;
  color: number; surface: SurfaceType; customTileData: string | null; tileScale: number;
  fill: ZoneFill; fillColor: number | null; fillOpacity: number; fillGlow: boolean;
  posR: number; posAngle: number; rotY: number;
  isMoat: boolean; innerRadiusX: number; innerRadiusZ: number;
  innerOpeningShape: OpeningShape; innerSides: number; innerStarInner: number;
  innerWallProfile: WallProfile; innerRimOffset: number;
  pits: PitSave[]; zones: ZoneSave[];
}

export interface ArenaConfig {
  version: 4;
  baseConfig: { height: number; sides: number; color: number; surface: SurfaceType; customTileData: string | null; tileScale: number };
  arenas: ArenaSave[]; arenaSeq: number; pitSeq: number; zoneSeq: number;
}

export function pitToSave(p: PitData, pits: Map<string, PitData>, zones: Map<string, ZoneData>): PitSave {
  return {
    id:p.id,name:p.name,parentPitId:p.parentPitId,parentZoneId:p.parentZoneId,
    openingShape:p.openingShape,
    radiusX:p.radiusX,radiusZ:p.radiusZ,depth:p.depth,sides:p.sides,starInner:p.starInner,
    color:p.color,surface:p.surface,customTileData:p.customTileData,tileScale:p.tileScale,
    posR:p.posR,posAngle:p.posAngle,rotY:p.rotY,
    pits:p.pitIds.map(id=>{ const c=pits.get(id); return c?pitToSave(c,pits,zones):null!; }).filter(Boolean),
    zones:p.zoneIds.map(id=>{ const c=zones.get(id); return c?zoneToSave(c,pits,zones):null!; }).filter(Boolean),
  };
}

export function zoneToSave(z: ZoneData, pits: Map<string, PitData>, zones: Map<string, ZoneData>): ZoneSave {
  return {
    id:z.id,name:z.name,parentPitId:z.parentPitId,parentZoneId:z.parentZoneId,
    openingShape:z.openingShape,
    radiusX:z.radiusX,radiusZ:z.radiusZ,depth:z.depth,sides:z.sides,starInner:z.starInner,
    color:z.color,surface:z.surface,customTileData:z.customTileData,tileScale:z.tileScale,
    fill:z.fill,fillColor:z.fillColor,fillOpacity:z.fillOpacity,fillGlow:z.fillGlow,
    posR:z.posR,posAngle:z.posAngle,rotY:z.rotY,
    isMoat:z.isMoat,innerRadiusX:z.innerRadiusX,innerRadiusZ:z.innerRadiusZ,
    innerOpeningShape:z.innerOpeningShape,innerSides:z.innerSides,innerStarInner:z.innerStarInner,
    innerWallProfile:z.innerWallProfile,innerRimOffset:z.innerRimOffset,
    pits:z.pitIds.map(id=>{ const c=pits.get(id); return c?pitToSave(c,pits,zones):null!; }).filter(Boolean),
    zones:z.zoneIds.map(id=>{ const c=zones.get(id); return c?zoneToSave(c,pits,zones):null!; }).filter(Boolean),
  };
}

export function arenaToSave(
  id: string,
  a: ArenaData,
  pits: Map<string, PitData>,
  zones: Map<string, ZoneData>,
): ArenaSave {
  return {
    id,name:a.name,openingShape:a.openingShape,wallProfile:a.wallProfile,
    radiusX:a.radiusX,radiusZ:a.radiusZ,depth:a.depth,sides:a.sides,starInner:a.starInner,
    color:a.color,surface:a.surface,customTileData:a.customTileData,tileScale:a.tileScale,
    posX:a.posX,posZ:a.posZ,posY:a.posY,rotY:a.rotY,
    isMoat:a.isMoat,innerRadiusX:a.innerRadiusX,innerRadiusZ:a.innerRadiusZ,
    innerOpeningShape:a.innerOpeningShape,innerSides:a.innerSides,innerStarInner:a.innerStarInner,
    innerWallProfile:a.innerWallProfile,innerRimOffset:a.innerRimOffset,
    pits:a.pitIds.filter(pid=>{ const p=pits.get(pid); return p&&!p.parentPitId&&!p.parentZoneId; }).map(pid=>pitToSave(pits.get(pid)!,pits,zones)),
    zones:a.zoneIds.filter(zid=>{ const z=zones.get(zid); return z&&!z.parentPitId&&!z.parentZoneId; }).map(zid=>zoneToSave(zones.get(zid)!,pits,zones)),
  };
}
