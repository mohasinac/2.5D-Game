import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ticksToSeconds, TICKS_MENU_FADE } from "../../constants/rpgConstants";
import { InventoryPanel } from "./InventoryPanel";
import { QuestLogPanel } from "./QuestLogPanel";
import { BadgeCasePanel } from "./BadgeCasePanel";
import { WorldMapCanvas } from "../world-map/WorldMapCanvas";
import { RegionManager } from "../../engine/RegionManager";
import { useRPGStore } from "../../stores/rpgStore";
import type { RegionDef } from "../../data/schemas";
import type { Quest } from "../../data/schemas";

type MenuTab = "inventory" | "quests" | "badges" | "map" | "save";

interface BadgeDef {
  id: string;
  displayName: string;
  description: string;
  iconAssetId: string;
  category: string;
}

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  initialTab?: MenuTab;
}

const TABS: { id: MenuTab; label: string }[] = [
  { id: "inventory", label: "Bag" },
  { id: "quests",    label: "Quests" },
  { id: "badges",    label: "Badges" },
  { id: "map",       label: "Map" },
  { id: "save",      label: "Save" },
];

export function MenuOverlay({ open, onClose, onSave, initialTab }: MenuOverlayProps) {
  const [tab, setTab] = useState<MenuTab>(initialTab ?? "inventory");

  // Sync tab when caller changes initialTab (e.g. M key → map)
  useEffect(() => {
    if (open && initialTab) setTab(initialTab);
  }, [open, initialTab]);

  // Lazy-loaded data — fetched once when menu opens
  const [questDefs,  setQuestDefs]  = useState<Quest[]>([]);
  const [badgeDefs,  setBadgeDefs]  = useState<BadgeDef[]>([]);
  const [regions,    setRegions]    = useState<RegionDef[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!open || dataLoaded) return;
    let cancelled = false;
    async function loadAll() {
      try {
        const [qSnap, bSnap, rSnap] = await Promise.all([
          getDocs(collection(db, "rpg_quests")),
          getDocs(collection(db, "rpg_badges")),
          getDocs(collection(db, "rpg_regions")),
        ]);
        if (cancelled) return;
        setQuestDefs(qSnap.docs.map((d) => d.data() as Quest));
        setBadgeDefs(bSnap.docs.map((d) => d.data() as BadgeDef));
        setRegions(rSnap.docs.map((d) => d.data() as RegionDef));
        setDataLoaded(true);
      } catch (err) {
        console.error("[MenuOverlay] Failed to load data:", err);
      }
    }
    void loadAll();
    return () => { cancelled = true; };
  }, [open, dataLoaded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "x" || e.key === "X") {
        onClose();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // World map derived data
  const store = useRPGStore.getState();
  const regionManager = new RegionManager();
  regionManager.loadRegions(regions);
  const unlockedRegionIds = regions
    .filter((r) => regionManager.isRegionUnlocked(r.id, store))
    .map((r) => r.id);
  const connectionReasons: Record<string, string | null> = {};
  for (const r of regions) {
    if (!unlockedRegionIds.includes(r.id)) {
      connectionReasons[r.id] = regionManager.getConnectionGateReason(
        store.currentRegionId ?? "", r.id, store
      );
    }
  }
  const handleRegionSelect = (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) return;
    useRPGStore.getState().setCurrentRegion(regionId);
    useRPGStore.getState().setCurrentMap(region.hubMapId);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ticksToSeconds(TICKS_MENU_FADE) }}
          className="absolute inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative bg-gray-900 border-2 border-amber-400 rounded-xl w-[95%] sm:w-[90%] max-w-[600px] h-[80%] sm:h-[70%] max-h-[500px] lg:max-h-[600px] flex flex-col overflow-hidden"
          >
            {/* Tab bar */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 min-w-[48px] px-2 sm:px-3 py-2 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    tab === t.id
                      ? "text-amber-400 border-b-2 border-amber-400 bg-gray-800/50"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === "inventory" && <InventoryPanel onClose={onClose} />}
              {tab === "quests" && (
                <QuestLogPanel questDefs={questDefs} onClose={onClose} />
              )}
              {tab === "badges" && (
                <BadgeCasePanel badgeDefs={badgeDefs} onClose={onClose} />
              )}
              {tab === "map" && (
                <div className="absolute inset-0 top-[44px] sm:top-[52px]">
                  {regions.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <WorldMapCanvas
                      regions={regions}
                      unlockedRegionIds={unlockedRegionIds}
                      connectionReasons={connectionReasons}
                      onRegionSelect={handleRegionSelect}
                    />
                  )}
                </div>
              )}
              {tab === "save" && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-gray-400 text-sm">Save your progress</p>
                  <button
                    onClick={onSave}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
                  >
                    Save Game
                  </button>
                </div>
              )}
            </div>

            {/* Close hint — hidden when map tab active (map has its own back) */}
            {tab !== "map" && (
              <div className="text-center text-gray-600 text-xs py-2 border-t border-gray-800">
                Press X or Esc to close
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
