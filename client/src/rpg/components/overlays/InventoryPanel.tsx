import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRPGStore } from "../../stores/rpgStore";
import type { InventoryItem } from "../../data/schemas";

interface InventoryPanelProps {
  onClose: () => void;
}

type BagTab = "equipment" | "consumables" | "key-items" | "beyblades";

const BAG_TABS: { id: BagTab; label: string; icon: string }[] = [
  { id: "equipment",   label: "Equipment",  icon: "⚙" },
  { id: "consumables", label: "Use",        icon: "🧪" },
  { id: "key-items",   label: "Key Items",  icon: "🗝" },
  { id: "beyblades",   label: "Beyblades",  icon: "⚡" },
];

const SLOT_LABELS: Record<string, string> = {
  launcher:   "Launcher",
  ripcord:    "Ripcord",
  upgrade:    "Upgrade",
  accessory:  "Accessory",
  collectible:"Collectible",
};

const DURABILITY_COLOR = (pct: number) =>
  pct > 0.6 ? "bg-green-500" : pct > 0.3 ? "bg-amber-400" : "bg-red-500";

export function InventoryPanel({ onClose: _onClose }: InventoryPanelProps) {
  const [tab, setTab]           = useState<BagTab>("equipment");
  const [itemDefs, setItemDefs] = useState<Record<string, InventoryItem>>({});

  const items              = useRPGStore((s) => s.items);
  const beyblades          = useRPGStore((s) => s.beyblades);
  const equippedBeybladeId = useRPGStore((s) => s.equippedBeybladeId);
  const equippedLauncherId = useRPGStore((s) => s.equippedLauncherId);
  const installedUpgrades  = useRPGStore((s) => s.installedUpgradeIds);
  const itemDurability     = useRPGStore((s) => s.itemDurability);
  const money              = useRPGStore((s) => s.money);

  const equipBeyblade   = useRPGStore((s) => s.equipBeyblade);
  const equipLauncher   = useRPGStore((s) => s.equipLauncher);
  const unequipLauncher = useRPGStore((s) => s.unequipLauncher);
  const installUpgrade  = useRPGStore((s) => s.installUpgrade);
  const uninstallUpgrade = useRPGStore((s) => s.uninstallUpgrade);
  const useConsumable   = useRPGStore((s) => s.useConsumable);

  // Load item definitions lazily
  useEffect(() => {
    if (Object.keys(itemDefs).length > 0) return;
    getDocs(collection(db, "rpg_items"))
      .then((snap) => {
        const map: Record<string, InventoryItem> = {};
        snap.docs.forEach((d) => { map[d.id] = d.data() as InventoryItem; });
        setItemDefs(map);
      })
      .catch(() => {/* non-fatal */});
  }, [itemDefs]);

  const def = (id: string) => itemDefs[id];

  // Categorise owned items
  const equipment  = items.filter((i) => {
    const d = def(i.itemId);
    return d && ["launcher","ripcord","upgrade","accessory","collectible"].includes(d.equipSlot ?? d.category);
  });
  const consumables = items.filter((i) => {
    const d = def(i.itemId);
    return d && (d.isConsumable || d.equipSlot === "consumable" || d.category === "consumable");
  });
  const keyItems = items.filter((i) => {
    const d = def(i.itemId);
    return d && (d.questRelated || d.equipSlot === "key-item" || d.category === "beyblade-part");
  });

  const durPct = (itemId: string, maxDur?: number) => {
    if (!maxDur) return 1;
    const cur = itemDurability[itemId] ?? maxDur;
    return cur / maxDur;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-amber-400 font-bold text-lg">Bag</h3>
        <div className="text-amber-300 text-sm">💰 {money} coins</div>
      </div>

      {/* Equipment slot quick-view strip */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {/* Launcher slot */}
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs ${
          equippedLauncherId
            ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
            : "border-gray-700 bg-gray-800/50 text-gray-600"
        }`}>
          <span>🚀</span>
          <span className="truncate">
            {equippedLauncherId
              ? (def(equippedLauncherId)?.displayName ?? equippedLauncherId)
              : "No launcher equipped"}
          </span>
          {equippedLauncherId && def(equippedLauncherId)?.maxDurability && (
            <div className="ml-auto w-8 h-1 bg-gray-700 rounded-full overflow-hidden shrink-0">
              <div
                className={`h-full rounded-full ${DURABILITY_COLOR(durPct(equippedLauncherId, def(equippedLauncherId)?.maxDurability))}`}
                style={{ width: `${durPct(equippedLauncherId, def(equippedLauncherId)?.maxDurability) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Upgrades slot */}
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs ${
          installedUpgrades.length > 0
            ? "border-blue-400/50 bg-blue-400/10 text-blue-300"
            : "border-gray-700 bg-gray-800/50 text-gray-600"
        }`}>
          <span>⚙</span>
          <span className="truncate">
            {installedUpgrades.length > 0
              ? `${installedUpgrades.length} upgrade${installedUpgrades.length !== 1 ? "s" : ""}`
              : "No upgrades"}
          </span>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div className="flex border-b border-gray-700 mb-3 overflow-x-auto">
        {BAG_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[52px] px-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              tab === t.id
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto">

        {/* EQUIPMENT TAB */}
        {tab === "equipment" && (
          <div className="space-y-1.5">
            {equipment.length === 0 && (
              <p className="text-gray-500 text-sm">No equipment in bag</p>
            )}
            {equipment.map(({ itemId, quantity }) => {
              const d    = def(itemId);
              const isLauncher  = d?.isLauncher;
              const isUpgrade   = d?.isLauncherUpgrade;
              const isEquipped  = itemId === equippedLauncherId;
              const isInstalled = installedUpgrades.includes(itemId);
              const pct  = durPct(itemId, d?.maxDurability);
              const leftSpin = d?.launchSide === "left";

              return (
                <div
                  key={itemId}
                  className={`px-3 py-2 rounded border text-sm ${
                    isEquipped || isInstalled
                      ? "bg-amber-500/15 border-amber-400/40 text-amber-200"
                      : "bg-gray-800 border-gray-700/50 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {leftSpin && <span title="Left-spin" className="text-purple-400 text-[10px]">◀</span>}
                    <span className="flex-1 font-medium truncate">
                      {d?.displayName ?? itemId}
                    </span>
                    {quantity > 1 && <span className="text-gray-500 text-xs">×{quantity}</span>}
                    {(isEquipped || isInstalled) && (
                      <span className="text-[10px] text-amber-400 uppercase font-bold">on</span>
                    )}
                  </div>

                  {/* Durability bar */}
                  {d?.maxDurability && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${DURABILITY_COLOR(pct)}`}
                          style={{ width: `${pct * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-500 shrink-0">
                        {itemDurability[itemId] ?? d.maxDurability}/{d.maxDurability}
                      </span>
                    </div>
                  )}

                  {/* Launch boost badge */}
                  {(d?.launchBoost ?? 0) > 0 && (
                    <div className="mt-1 text-[10px] text-blue-400">
                      +{Math.round((d!.launchBoost! * 100))}% launch power
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-2 flex gap-1.5">
                    {isLauncher && !isEquipped && (
                      <button
                        onClick={() => equipLauncher(itemId, d!.maxDurability!, d)}
                        className="text-[10px] px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold"
                      >
                        Equip
                      </button>
                    )}
                    {isLauncher && isEquipped && (
                      <button
                        onClick={() => unequipLauncher()}
                        className="text-[10px] px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-white rounded"
                      >
                        Unequip
                      </button>
                    )}
                    {isUpgrade && !isInstalled && (
                      <button
                        onClick={() => installUpgrade(itemId)}
                        className="text-[10px] px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold"
                      >
                        Install
                      </button>
                    )}
                    {isUpgrade && isInstalled && (
                      <button
                        onClick={() => uninstallUpgrade(itemId)}
                        className="text-[10px] px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-white rounded"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONSUMABLES TAB */}
        {tab === "consumables" && (
          <div className="space-y-1.5">
            {consumables.length === 0 && (
              <p className="text-gray-500 text-sm">No consumables in bag</p>
            )}
            {consumables.map(({ itemId, quantity }) => {
              const d = def(itemId);
              return (
                <div key={itemId} className="px-3 py-2 rounded bg-gray-800 border border-gray-700/50 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 font-medium">{d?.displayName ?? itemId}</span>
                    <span className="text-amber-400 text-xs font-bold">×{quantity}</span>
                  </div>
                  {d?.description && (
                    <p className="text-[10px] text-gray-500 mt-0.5">{d.description}</p>
                  )}
                  <button
                    onClick={() => useConsumable(itemId)}
                    disabled={quantity <= 0}
                    className="mt-1.5 text-[10px] px-3 py-0.5 bg-green-700 hover:bg-green-600 text-white rounded disabled:opacity-40"
                  >
                    Use
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* KEY ITEMS TAB */}
        {tab === "key-items" && (
          <div className="space-y-1.5">
            {keyItems.length === 0 && (
              <p className="text-gray-500 text-sm">No key items</p>
            )}
            {keyItems.map(({ itemId }) => {
              const d = def(itemId);
              return (
                <div key={itemId} className="px-3 py-2 rounded bg-gray-800 border border-amber-800/30 text-sm">
                  <div className="text-amber-300 font-medium">{d?.displayName ?? itemId}</div>
                  {d?.description && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{d.description}</p>
                  )}
                  {d?.questRelated && (
                    <span className="text-[9px] text-amber-500 uppercase font-bold">Quest Item</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BEYBLADES TAB */}
        {tab === "beyblades" && (
          <div className="space-y-1.5">
            {beyblades.length === 0 && (
              <p className="text-gray-500 text-sm">No beyblades yet</p>
            )}
            {beyblades.map((id) => (
              <div
                key={id}
                className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
                  id === equippedBeybladeId
                    ? "bg-amber-500/20 border border-amber-400 text-amber-300"
                    : "bg-gray-800 border border-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span>⚡ {id}</span>
                {id === equippedBeybladeId ? (
                  <span className="text-xs text-amber-400 font-bold">EQUIPPED</span>
                ) : (
                  <button
                    onClick={() => equipBeyblade(id)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Equip
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer — slot hint */}
      <div className="mt-3 pt-2 border-t border-gray-800 grid grid-cols-3 gap-1 text-[9px] text-gray-600">
        {Object.entries(SLOT_LABELS).map(([slot, label]) => (
          <span key={slot} className="text-center">{label}</span>
        ))}
      </div>
    </div>
  );
}
