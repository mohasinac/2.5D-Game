import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { DialogueTree } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER, INP } from "../rpgAdminShared";

export default function RPGDialogueListPage() {
  const [items, setItems] = useState<DialogueTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_DIALOGUES));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as DialogueTree)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete dialogue "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_DIALOGUES, id));
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const filtered = filter
    ? items.filter(d => d.id.toLowerCase().includes(filter.toLowerCase()))
    : items;

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Dialogues</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} dialogue trees</p>
        </div>
        <Link to="/admin/rpg/dialogues/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Dialogue
        </Link>
      </div>

      <input className={INP + " mb-4 max-w-xs"} placeholder="Filter by id..." value={filter} onChange={e => setFilter(e.target.value)} />

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Start Node</th>
                <th className={TABLE_TH}>Nodes</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/dialogues/${d.id}/edit`} className="text-blue-400 hover:underline">{d.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{d.startNodeId}</td>
                  <td className={TABLE_TD}>{Object.keys(d.nodes ?? {}).length}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(d.id)} disabled={deleting === d.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === d.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No dialogues found.</p>}
        </div>
      )}
    </div>
  );
}
