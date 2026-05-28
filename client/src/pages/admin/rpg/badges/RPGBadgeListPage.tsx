import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { BadgeDef } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER, INP } from "../rpgAdminShared";

export default function RPGBadgeListPage() {
  const [items, setItems] = useState<BadgeDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_BADGES));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as BadgeDef)));
      } catch (e) { console.error(e); toast.error("Failed to load badges"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete badge "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_BADGES, id));
      setItems(prev => prev.filter(r => r.id !== id));
      toast.success("Badge deleted");
    } catch (e) { console.error(e); toast.error("Failed to delete badge"); }
    finally { setDeleting(null); }
  };

  const filtered = filter
    ? items.filter(b => b.displayName?.toLowerCase().includes(filter.toLowerCase()) || b.id.toLowerCase().includes(filter.toLowerCase()))
    : items;

  const sorted = [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Badges</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} badges</p>
        </div>
        <Link to="/admin/rpg/badges/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Badge
        </Link>
      </div>

      <input className={INP + " mb-4 max-w-xs"} placeholder="Filter by name or id..." value={filter} onChange={e => setFilter(e.target.value)} />

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>#</th>
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Name</th>
                <th className={TABLE_TH}>Category</th>
                <th className={TABLE_TH}>Region</th>
                <th className={TABLE_TH}>Arc</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(b => (
                <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>{b.order ?? "-"}</td>
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/badges/${b.id}/edit`} className="text-blue-400 hover:underline">{b.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{b.displayName}</td>
                  <td className={TABLE_TD}>{b.category}</td>
                  <td className={TABLE_TD}>{b.regionId ?? "-"}</td>
                  <td className={TABLE_TD}>{b.arcId ?? "-"}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === b.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No badges found.</p>}
        </div>
      )}
    </div>
  );
}
