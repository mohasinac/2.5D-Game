import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RPGMap, RegionDef, ArcDef, RouteDef, WorldConfig } from "../data/schemas";

const COLLECTIONS = {
  MAPS: "rpg_maps",
  REGIONS: "rpg_regions",
  ARCS: "rpg_arcs",
  ROUTES: "rpg_routes",
  CONFIG: "rpg_config",
} as const;

export class WorldManager {
  private mapCache: Map<string, RPGMap> = new Map();
  private regionCache: Map<string, RegionDef> = new Map();
  private arcCache: Map<string, ArcDef> = new Map();
  private routeCache: Map<string, RouteDef> = new Map();
  private worldConfig: WorldConfig | null = null;

  async loadWorldConfig(): Promise<WorldConfig | null> {
    const ref = doc(db, COLLECTIONS.CONFIG, "world");
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    this.worldConfig = snap.data() as WorldConfig;
    return this.worldConfig;
  }

  async loadMap(mapId: string): Promise<RPGMap | null> {
    if (this.mapCache.has(mapId)) return this.mapCache.get(mapId)!;
    const ref = doc(db, COLLECTIONS.MAPS, mapId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const map = snap.data() as RPGMap;
    this.mapCache.set(mapId, map);
    return map;
  }

  async loadRegion(regionId: string): Promise<RegionDef | null> {
    if (this.regionCache.has(regionId)) return this.regionCache.get(regionId)!;
    const ref = doc(db, COLLECTIONS.REGIONS, regionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const region = snap.data() as RegionDef;
    this.regionCache.set(regionId, region);
    return region;
  }

  async loadAllRegions(): Promise<RegionDef[]> {
    const snap = await getDocs(collection(db, COLLECTIONS.REGIONS));
    const regions: RegionDef[] = [];
    snap.forEach((d) => {
      const r = d.data() as RegionDef;
      this.regionCache.set(r.id, r);
      regions.push(r);
    });
    return regions;
  }

  async loadAllArcs(): Promise<ArcDef[]> {
    const snap = await getDocs(collection(db, COLLECTIONS.ARCS));
    const arcs: ArcDef[] = [];
    snap.forEach((d) => {
      const a = d.data() as ArcDef;
      this.arcCache.set(a.id, a);
      arcs.push(a);
    });
    return arcs.sort((a, b) => a.order - b.order);
  }

  async loadRoutesForArc(arcId: string): Promise<RouteDef[]> {
    const arc = await this.loadArc(arcId);
    if (!arc) return [];
    const routes: RouteDef[] = [];
    for (const routeId of arc.routeIds) {
      const r = await this.loadRoute(routeId);
      if (r) routes.push(r);
    }
    return routes;
  }

  async loadArc(arcId: string): Promise<ArcDef | null> {
    if (this.arcCache.has(arcId)) return this.arcCache.get(arcId)!;
    const ref = doc(db, COLLECTIONS.ARCS, arcId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const arc = snap.data() as ArcDef;
    this.arcCache.set(arcId, arc);
    return arc;
  }

  async loadRoute(routeId: string): Promise<RouteDef | null> {
    if (this.routeCache.has(routeId)) return this.routeCache.get(routeId)!;
    const ref = doc(db, COLLECTIONS.ROUTES, routeId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const route = snap.data() as RouteDef;
    this.routeCache.set(routeId, route);
    return route;
  }

  getWorldConfig(): WorldConfig | null { return this.worldConfig; }
  getCachedMap(mapId: string): RPGMap | null { return this.mapCache.get(mapId) ?? null; }
  getCachedRegion(regionId: string): RegionDef | null { return this.regionCache.get(regionId) ?? null; }
}
