import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db, COLLECTIONS } from "@/lib/firebase";

interface BeyAccessory {
  id: string;
  name: string;
  description?: string;
  iconEmoji?: string;
  effectType: string;
  procChance?: number;
}

const TABLE_TH = "text-left text-xs text-gray-400 font-semibold uppercase tracking-wide px-3 py-2";
const TABLE_TD = "px-3 py-2 text-sm text-gray-300";

export function BeyAccessoriesPage() {
  const [items, setItems] = useState<BeyAccessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.BEY_ACCESSORIES));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as BeyAccessory)));
      } catch (e) { console.error(e); toast.error("Failed to load accessories"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete accessory "${id}"?`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, COLLECTIONS.BEY_ACCESSORIES, id));
      setItems(prev => prev.filter(r => r.id !== id));
      toast.success("Deleted");
    } catch (e) { console.error(e); toast.error("Delete failed"); }
    finally { setDeleting(null); }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-white">Bey Accessories</h1>
          <p className="text-gray-400 text-[13px] mt-1">
            Pokémon-style held items. Each beyblade can equip one via <code className="text-blue-300">accessoryItemId</code> on its stats doc.
          </p>
        </div>
        <Link to="/admin/bey-accessories/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline">
          + New Accessory
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className={TABLE_TH}>Icon</th>
                <th className={TABLE_TH}>ID</th>
                <th className={TABLE_TH}>Name</th>
                <th className={TABLE_TH}>Effect Type</th>
                <th className={TABLE_TH}>Proc Chance</th>
                <th className={TABLE_TH}>Description</th>
                <th className={TABLE_TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(acc => (
                <tr key={acc.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className={TABLE_TD}>{acc.iconEmoji ?? "📦"}</td>
                  <td className={TABLE_TD}>
                    <Link to={`/admin/bey-accessories/${acc.id}`} className="text-blue-400 hover:underline">{acc.id}</Link>
                  </td>
                  <td className={TABLE_TD}>{acc.name}</td>
                  <td className={TABLE_TD}>{acc.effectType}</td>
                  <td className={TABLE_TD}>{acc.procChance != null ? `${(acc.procChance * 100).toFixed(0)}%` : "—"}</td>
                  <td className={TABLE_TD + " max-w-xs truncate"}>{acc.description}</td>
                  <td className={TABLE_TD}>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      disabled={deleting === acc.id}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-800 rounded"
                    >
                      {deleting === acc.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No accessories yet. Add one to get started.</p>}
        </div>
      )}
    </div>
  );
}
