import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";

interface DefDoc {
  id: string;
  label: string;
  description: string;
}

const COLLECTION_MAP: Record<string, string> = {
  "map-types": COLLECTIONS.RPG_MAP_TYPE_DEFS,
  "npc-types": COLLECTIONS.RPG_NPC_TYPE_DEFS,
  "badge-categories": COLLECTIONS.RPG_BADGE_CATEGORY_DEFS,
  "item-categories": COLLECTIONS.RPG_ITEM_CATEGORY_DEFS,
  "quest-categories": COLLECTIONS.RPG_QUEST_CATEGORY_DEFS,
  "event-categories": COLLECTIONS.RPG_EVENT_CATEGORY_DEFS,
  "travel-modes": COLLECTIONS.RPG_TRAVEL_MODE_DEFS,
};

const TITLES: Record<string, string> = {
  "map-types": "Map Types",
  "npc-types": "NPC Types",
  "badge-categories": "Badge Categories",
  "item-categories": "Item Categories",
  "quest-categories": "Quest Categories",
  "event-categories": "Event Categories",
  "travel-modes": "Travel Modes",
};

export default function RPGDefListPage() {
  const { collection: collectionParam } = useParams<{ collection: string }>();
  const colName = collectionParam ? COLLECTION_MAP[collectionParam] : null;
  const title = collectionParam ? TITLES[collectionParam] ?? collectionParam : "Definitions";

  const [docs, setDocs] = useState<DefDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const load = useCallback(async () => {
    if (!colName) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, colName));
      const list: DefDoc[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as DefDoc));
      list.sort((a, b) => a.id.localeCompare(b.id));
      setDocs(list);
    } catch (err) {
      console.error("Failed to load definitions:", err);
    }
    setLoading(false);
  }, [colName]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!colName || !newId.trim()) return;
    try {
      await setDoc(doc(db, colName, newId.trim()), {
        id: newId.trim(),
        label: newLabel.trim() || newId.trim(),
        description: newDesc.trim(),
      });
      toast.success(`Added "${newId.trim()}"`);
      setNewId("");
      setNewLabel("");
      setNewDesc("");
      load();
    } catch (err) {
      toast.error("Failed to add definition");
      console.error(err);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!colName) return;
    try {
      await setDoc(doc(db, colName, id), { id, label: editLabel, description: editDesc }, { merge: true });
      toast.success("Updated");
      setEditId(null);
      load();
    } catch (err) {
      toast.error("Failed to update");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!colName || !confirm(`Delete "${id}"?`)) return;
    try {
      await deleteDoc(doc(db, colName, id));
      toast.success(`Deleted "${id}"`);
      load();
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  if (!colName) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-xl font-bold mb-4">Unknown Definition Collection</h1>
        <p className="text-gray-400">Collection "{collectionParam}" is not recognized.</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full box-border">
      <h1 className="text-xl font-bold text-white mb-1">{title}</h1>
      <p className="text-gray-400 text-xs mb-6">
        Open definition collection: <code className="text-gray-500">{colName}</code>
      </p>

      {/* Add new */}
      <div className="flex gap-2 mb-6 items-end flex-wrap">
        <div>
          <label className="text-xs text-gray-400 block mb-1">ID</label>
          <input
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="e.g. city"
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-1.5 w-40"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Label</label>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="City"
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-1.5 w-40"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs text-gray-400 block mb-1">Description</label>
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="A bustling urban area"
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-1.5 w-full"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!newId.trim()}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded font-medium"
        >
          Add
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : docs.length === 0 ? (
        <div className="text-gray-500 text-sm">No definitions yet. Add one above.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-gray-400">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Label</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) =>
              editId === d.id ? (
                <tr key={d.id} className="border-b border-gray-800 bg-gray-900">
                  <td className="py-2 px-3 text-gray-300 font-mono">{d.id}</td>
                  <td className="py-2 px-3">
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="bg-gray-800 border border-gray-600 text-white text-sm rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="bg-gray-800 border border-gray-600 text-white text-sm rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-3 flex gap-1">
                    <button
                      onClick={() => handleSaveEdit(d.id)}
                      className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={d.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                  <td className="py-2 px-3 text-gray-300 font-mono">{d.id}</td>
                  <td className="py-2 px-3 text-white">{d.label}</td>
                  <td className="py-2 px-3 text-gray-400">{d.description}</td>
                  <td className="py-2 px-3 flex gap-1">
                    <button
                      onClick={() => { setEditId(d.id); setEditLabel(d.label); setEditDesc(d.description); }}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded"
                    >
                      Del
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
