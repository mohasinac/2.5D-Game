import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";
import type { BeybladeStack } from "@/types/beybladeSystem";

interface StackRow extends BeybladeStack {
  _docId: string;
}

export default function AdminStacksPage() {
  const [stacks, setStacks] = useState<StackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "beyblade_stacks"), orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);
      const rows: StackRow[] = snap.docs.map((d) => ({
        ...(d.data() as BeybladeStack),
        _docId: d.id,
      }));
      setStacks(rows);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const promote = async (stackId: string) => {
    setBusy(stackId);
    try {
      await updateDoc(doc(db, "beyblade_stacks", stackId), {
        isPublic: true,
        ownerId: "admin",
      });
      setStacks((prev) =>
        prev.map((s) =>
          s._docId === stackId ? { ...s, isPublic: true, ownerId: "admin" } : s
        )
      );
    } finally {
      setBusy(null);
    }
  };

  const unpromote = async (stackId: string) => {
    setBusy(stackId);
    try {
      await updateDoc(doc(db, "beyblade_stacks", stackId), { isPublic: false });
      setStacks((prev) =>
        prev.map((s) => (s._docId === stackId ? { ...s, isPublic: false } : s))
      );
    } finally {
      setBusy(null);
    }
  };

  const deleteStack = async (stackId: string) => {
    setBusy(stackId);
    try {
      await deleteDoc(doc(db, "beyblade_stacks", stackId));
      setStacks((prev) => prev.filter((s) => s._docId !== stackId));
    } finally {
      setBusy(null);
      setConfirmDelete(null);
    }
  };

  const filtered = stacks.filter(
    (s) =>
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerId?.toLowerCase().includes(search.toLowerCase()) ||
      s.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Stack Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            View, edit, and moderate all player beyblade stacks. Promote stacks to public presets.
          </p>
        </div>
        <Link
          to="/admin/stack-templates"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Stack Templates
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, owner, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={load}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Owner</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Slots</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Tags</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Visibility</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {search ? "No stacks match your search." : "No stacks found."}
                  </td>
                </tr>
              ) : (
                filtered.map((stack) => (
                  <tr
                    key={stack._docId}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                    data-testid="stack-row"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {stack.name || <span className="text-gray-500 italic">Unnamed</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {stack.ownerId === "admin" ? (
                        <span className="text-blue-400">admin</span>
                      ) : (
                        stack.ownerId
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {stack.slots?.length ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(stack.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {stack.fusionSourceIds && (
                          <span className="px-2 py-0.5 bg-purple-900/60 text-purple-300 rounded text-xs">
                            fusion
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {stack.isPublic ? (
                        <span className="px-2 py-0.5 bg-green-900/60 text-green-300 rounded text-xs font-medium">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs font-medium">
                          Private
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {stack.isPublic ? (
                          <button
                            onClick={() => unpromote(stack._docId)}
                            disabled={busy === stack._docId}
                            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => promote(stack._docId)}
                            disabled={busy === stack._docId}
                            className="px-2 py-1 text-xs bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
                          >
                            Promote
                          </button>
                        )}
                        {confirmDelete === stack._docId ? (
                          <>
                            <button
                              onClick={() => deleteStack(stack._docId)}
                              disabled={busy === stack._docId}
                              className="px-2 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(stack._docId)}
                            disabled={busy === stack._docId}
                            className="px-2 py-1 text-xs bg-red-900/60 hover:bg-red-800 text-red-300 rounded transition-colors disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-gray-500 text-xs">
        {filtered.length} stack{filtered.length !== 1 ? "s" : ""} shown
        {search && ` (filtered from ${stacks.length})`}
      </p>
    </div>
  );
}
