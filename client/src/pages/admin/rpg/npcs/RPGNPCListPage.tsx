import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { NPC } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER, INP } from "../rpgAdminShared";
import { NPCSpriteBlock, NPCTypeBadge } from "../components/NPCSpriteBlock";

export default function RPGNPCListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [cloning, setCloning] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_NPCS));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as NPC)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleClone = async (n: NPC) => {
    const newId = `${n.id}_copy_${Date.now()}`;
    setCloning(n.id);
    try {
      const { id: _id, ...rest } = n;
      await setDoc(doc(db, COLLECTIONS.RPG_NPCS, newId), {
        ...rest,
        displayName: `${n.displayName} (Copy)`,
        templateId: n.id,
        // Reset battle records and quest progress for clone
        defaultDialogueId: rest.defaultDialogueId ?? "",
      });
      navigate(`/admin/rpg/npcs/${newId}/edit`);
    } catch (e) { console.error(e); }
    finally { setCloning(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete NPC "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_NPCS, id));
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const filtered = useMemo(() => filter
    ? items.filter(n =>
        n.displayName?.toLowerCase().includes(filter.toLowerCase()) ||
        n.id.toLowerCase().includes(filter.toLowerCase()) ||
        n.type?.toLowerCase().includes(filter.toLowerCase()))
    : items,
  [items, filter]);

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG NPCs</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} NPCs</p>
        </div>
        <Link to="/admin/rpg/npcs/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New NPC
        </Link>
      </div>

      <input
        className={INP + " mb-4 max-w-xs"}
        placeholder="Filter by name, id, or type..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>Sprite</th>
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Name</th>
                <th className={TABLE_TH}>Type</th>
                <th className={TABLE_TH}>Facing</th>
                <th className={TABLE_TH}>Battle?</th>
                <th className={TABLE_TH}>Quests</th>
                <th className={TABLE_TH}>Sprite ID</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  {/* Sprite block thumbnail */}
                  <td className="py-2 px-3 align-middle">
                    <Link to={`/admin/rpg/npcs/${n.id}/edit`}>
                      <NPCSpriteBlock
                        npcType={n.type}
                        facing={n.defaultFacing}
                        hasBattle={!!n.battleConfig}
                        size={44}
                      />
                    </Link>
                  </td>

                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/npcs/${n.id}/edit`} className="text-blue-400 hover:underline font-mono text-xs">
                      {n.id}
                    </Link>
                  </td>
                  <td className={TABLE_TD + " font-medium"}>{n.displayName}</td>
                  <td className={TABLE_TD}>
                    <NPCTypeBadge npcType={n.type} />
                  </td>
                  <td className={TABLE_TD + " text-gray-400 text-xs"}>{n.defaultFacing ?? "down"}</td>
                  <td className={TABLE_TD}>
                    {n.battleConfig
                      ? <span className="text-red-400 text-xs font-bold">⚔ Yes</span>
                      : <span className="text-gray-600 text-xs">—</span>}
                  </td>
                  <td className={TABLE_TD}>
                    <span className="text-gray-400 text-xs">{n.questIds?.length ?? 0}</span>
                  </td>
                  <td className={TABLE_TD}>
                    <span className="text-gray-500 text-[10px] font-mono">{n.spriteSheetId || "—"}</span>
                  </td>
                  <td className={TABLE_TD}>
                    <div className="flex gap-1.5 items-center">
                      <button
                        onClick={() => handleClone(n)}
                        disabled={cloning === n.id}
                        title="Clone as template — reuse in another arc or map"
                        className="text-xs py-1 px-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                      >
                        {cloning === n.id ? "…" : "Clone"}
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        disabled={deleting === n.id}
                        className={BTN_DANGER + " text-xs py-1 px-2"}
                      >
                        {deleting === n.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm mt-4 text-center">No NPCs found.</p>
          )}
        </div>
      )}
    </div>
  );
}
