import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { RPGMap } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER, INP } from "../rpgAdminShared";

export default function RPGMapListPage() {
  const [items, setItems] = useState<RPGMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_MAPS));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as RPGMap)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete map "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_MAPS, id));
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const filtered = filter
    ? items.filter(m => m.displayName?.toLowerCase().includes(filter.toLowerCase()) || m.id.toLowerCase().includes(filter.toLowerCase()) || m.regionId?.toLowerCase().includes(filter.toLowerCase()))
    : items;

  return (
    <div className="p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Maps</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} maps</p>
        </div>
        <Link to="/admin/rpg/maps/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Map
        </Link>
      </div>

      <input className={INP + " mb-4 max-w-xs"} placeholder="Filter by name, id, or region..." value={filter} onChange={e => setFilter(e.target.value)} />

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Name</th>
                <th className={TABLE_TH}>Region</th>
                <th className={TABLE_TH}>Type</th>
                <th className={TABLE_TH}>Size</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/maps/${m.id}/edit`} className="text-blue-400 hover:underline">{m.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{m.displayName}</td>
                  <td className={TABLE_TD}>{m.regionId}</td>
                  <td className={TABLE_TD}>{m.type}</td>
                  <td className={TABLE_TD}>{m.width}x{m.height}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(m.id)} disabled={deleting === m.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === m.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No maps found.</p>}
        </div>
      )}
    </div>
  );
}
