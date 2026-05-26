import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";
import type { InventoryItem } from "@/rpg/data/schemas";
import { TABLE_TH, TABLE_TD, BTN_DANGER, INP } from "../rpgAdminShared";

export default function RPGItemListPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.RPG_ITEMS));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)));
      } catch (e) { console.error(e); toast.error("Failed to load items"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete item "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.RPG_ITEMS, id));
      setItems(prev => prev.filter(r => r.id !== id));
      toast.success("Item deleted");
    } catch (e) { console.error(e); toast.error("Failed to delete item"); }
    finally { setDeleting(null); }
  };

  const filtered = filter
    ? items.filter(i => i.displayName?.toLowerCase().includes(filter.toLowerCase()) || i.id.toLowerCase().includes(filter.toLowerCase()) || i.category?.toLowerCase().includes(filter.toLowerCase()))
    : items;

  return (
    <div className="p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">RPG Items</h1>
          <p className="text-gray-400 text-[13px] mt-1">{items.length} items</p>
        </div>
        <Link to="/admin/rpg/items/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Item
        </Link>
      </div>

      <input className={INP + " mb-4 max-w-xs"} placeholder="Filter by name, id, or category..." value={filter} onChange={e => setFilter(e.target.value)} />

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Display Name</th>
                <th className={TABLE_TH}>Category</th>
                <th className={TABLE_TH}>Stackable</th>
                <th className={TABLE_TH}>Usable</th>
                <th className={TABLE_TH}>Sell Price</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>
                    <Link to={`/admin/rpg/items/${i.id}/edit`} className="text-blue-400 hover:underline">{i.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{i.displayName}</td>
                  <td className={TABLE_TD}>{i.category}</td>
                  <td className={TABLE_TD}>{i.stackable ? "Yes" : "No"}</td>
                  <td className={TABLE_TD}>{i.usable ? "Yes" : "No"}</td>
                  <td className={TABLE_TD}>{i.sellPrice ?? "-"}</td>
                  <td className={TABLE_TD}>
                    <button onClick={() => handleDelete(i.id)} disabled={deleting === i.id} className={BTN_DANGER + " text-xs py-1 px-2"}>
                      {deleting === i.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No items found.</p>}
        </div>
      )}
    </div>
  );
}
