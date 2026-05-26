import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { Quest } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER, INP } from "../rpgAdminShared";

export default function RPGQuestListPage() {
  const [items, setItems] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_QUESTS));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Quest)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete quest "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_QUESTS, id));
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const filtered = filter
    ? items.filter(q => q.title?.toLowerCase().includes(filter.toLowerCase()) || q.id.toLowerCase().includes(filter.toLowerCase()) || q.category?.toLowerCase().includes(filter.toLowerCase()))
    : items;

  return (
    <div className="p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Quests</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} quests</p>
        </div>
        <Link to="/admin/rpg/quests/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Quest
        </Link>
      </div>

      <input className={INP + " mb-4 max-w-xs"} placeholder="Filter by title, id, or category..." value={filter} onChange={e => setFilter(e.target.value)} />

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Title</th>
                <th className={TABLE_TH}>Category</th>
                <th className={TABLE_TH}>Arc</th>
                <th className={TABLE_TH}>Objectives</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/quests/${q.id}/edit`} className="text-blue-400 hover:underline">{q.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{q.title}</td>
                  <td className={TABLE_TD}>{q.category}</td>
                  <td className={TABLE_TD}>{q.arcId}</td>
                  <td className={TABLE_TD}>{q.objectives?.length ?? 0}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(q.id)} disabled={deleting === q.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === q.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No quests found.</p>}
        </div>
      )}
    </div>
  );
}
