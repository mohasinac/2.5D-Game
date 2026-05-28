import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { RegionDef } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER } from "../rpgAdminShared";

export default function RPGRegionListPage() {
  const [items, setItems] = useState<RegionDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.RPG_REGIONS));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as RegionDef)));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete region "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_REGIONS, id));
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Regions</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} regions</p>
        </div>
        <Link to="/admin/rpg/regions/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Region
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Name</th>
                <th className={TABLE_TH}>Country</th>
                <th className={TABLE_TH}>Maps</th>
                <th className={TABLE_TH}>Arcs</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/regions/${r.id}/edit`} className="text-blue-400 hover:underline">{r.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{r.displayName}</td>
                  <td className={TABLE_TD}>{r.country}</td>
                  <td className={TABLE_TD}>{r.mapIds?.length ?? 0}</td>
                  <td className={TABLE_TD}>{r.arcIds?.length ?? 0}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === r.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No regions yet.</p>}
        </div>
      )}
    </div>
  );
}
