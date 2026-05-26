import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { ArcDef } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER } from "../rpgAdminShared";

export default function RPGArcListPage() {
  const [items, setItems] = useState<ArcDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_ARCS));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as ArcDef)));
      } catch (e) { console.error(e); toast.error("Operation failed"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete arc "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_ARCS, id));
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e) { console.error(e); toast.error("Operation failed"); }
    finally { setDeleting(null); }
  };

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Arcs</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} arcs (generations)</p>
        </div>
        <Link to="/admin/rpg/arcs/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Arc
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>Order</th>
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Name</th>
                <th className={TABLE_TH}>Routes</th>
                <th className={TABLE_TH}>Starting Region</th>
                <th className={TABLE_TH}>Previous Arc</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(a => (
                <tr key={a.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>{a.order}</td>
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/arcs/${a.id}/edit`} className="text-blue-400 hover:underline">{a.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{a.displayName}</td>
                  <td className={TABLE_TD}>{a.routeIds?.length ?? 0}</td>
                  <td className={TABLE_TD}>{a.startingRegionId}</td>
                  <td className={TABLE_TD}>{a.previousArcId || "-"}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === a.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No arcs yet.</p>}
        </div>
      )}
    </div>
  );
}
