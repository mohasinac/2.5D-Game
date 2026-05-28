import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { RouteDef } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER } from "../rpgAdminShared";

export default function RPGRouteListPage() {
  const [items, setItems] = useState<RouteDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_ROUTES));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as RouteDef)));
      } catch (e) { console.error(e); toast.error("Operation failed"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete route "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_ROUTES, id));
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); toast.error("Operation failed"); }
    finally { setDeleting(null); }
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Routes</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} routes (playable protagonists)</p>
        </div>
        <Link to="/admin/rpg/routes/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Route
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
                <th className={TABLE_TH}>Protagonist NPC</th>
                <th className={TABLE_TH}>Starting Map</th>
                <th className={TABLE_TH}>Arcs</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/routes/${r.id}/edit`} className="text-blue-400 hover:underline">{r.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{r.displayName}</td>
                  <td className={TABLE_TD}>{r.protagonistNpcId}</td>
                  <td className={TABLE_TD}>{r.startingMapId}</td>
                  <td className={TABLE_TD}>{r.availableInArcs?.length ?? 0}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === r.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No routes yet.</p>}
        </div>
      )}
    </div>
  );
}
