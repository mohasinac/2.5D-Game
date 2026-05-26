import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRPGStore } from "../stores/rpgStore";
import { WorldMapCanvas } from "../components/world-map/WorldMapCanvas";
import { RegionManager } from "../engine/RegionManager";
import type { RegionDef } from "../data/schemas";

export default function RPGWorldMapPage() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<RegionDef[]>([]);
  const [loading, setLoading] = useState(true);

  const store = useRPGStore.getState();

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "rpg_regions"));
        const defs: RegionDef[] = [];
        snap.forEach((d) => defs.push(d.data() as RegionDef));
        setRegions(defs);
      } catch (err) {
        console.error("[RPGWorldMapPage] Failed to load regions:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const regionManager = new RegionManager();
  regionManager.loadRegions(regions);

  const unlockedRegionIds = regions
    .filter((r) => regionManager.isRegionUnlocked(r.id, store))
    .map((r) => r.id);

  const connectionReasons: Record<string, string | null> = {};
  for (const r of regions) {
    if (!unlockedRegionIds.includes(r.id)) {
      connectionReasons[r.id] = regionManager.getConnectionGateReason(
        store.currentRegionId ?? "",
        r.id,
        store
      );
    }
  }

  const handleRegionSelect = (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) return;
    useRPGStore.getState().setCurrentRegion(regionId);
    useRPGStore.getState().setCurrentMap(region.hubMapId);
    navigate("/rpg/game");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <WorldMapCanvas
        regions={regions}
        unlockedRegionIds={unlockedRegionIds}
        connectionReasons={connectionReasons}
        onRegionSelect={handleRegionSelect}
      />
    </div>
  );
}
