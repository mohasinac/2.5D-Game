import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, alpha } from "@/styles/theme";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type TagField = "compatibilityTags" | "requiredCompatibility" | "excludedCompatibility";

interface TagUsage {
  collectionKey: string;
  collectionName: string;
  partId: string;
  partName: string;
  field: TagField;
}

interface TagEntry {
  name: string;
  usages: TagUsage[];
}

// Part collections that carry compatibility fields
const PART_COLLECTIONS: { key: string; name: string; label: string }[] = [
  { key: "BIT_BEAST_PARTS",    name: COLLECTIONS.BIT_BEAST_PARTS,    label: "Bit Beast" },
  { key: "ATTACK_RING_PARTS",  name: COLLECTIONS.ATTACK_RING_PARTS,  label: "Attack Ring" },
  { key: "WEIGHT_DISK_PARTS",  name: COLLECTIONS.WEIGHT_DISK_PARTS,  label: "Weight Disk" },
  { key: "SUB_PARTS",          name: COLLECTIONS.SUB_PARTS,          label: "Sub-Part" },
  { key: "TIP_PARTS",          name: COLLECTIONS.TIP_PARTS,          label: "Tip" },
  { key: "CORE_PARTS",         name: COLLECTIONS.CORE_PARTS,         label: "Core" },
  { key: "CASING_PARTS",       name: COLLECTIONS.CASING_PARTS,       label: "Casing" },
];

const TAG_FIELDS: TagField[] = [
  "compatibilityTags",
  "requiredCompatibility",
  "excludedCompatibility",
];

const FIELD_COLOR: Record<TagField, string> = {
  compatibilityTags:    C.blue,
  requiredCompatibility: C.green,
  excludedCompatibility: C.red,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CompatibilityTagsPage() {
  const [tags, setTags]         = useState<TagEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState("");
  const [renaming, setRenaming] = useState<{ tag: string; newName: string } | null>(null);
  const [saving, setSaving]     = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // ── Fetch and aggregate all tags ────────────────────────────────────────────
  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshots = await Promise.all(
        PART_COLLECTIONS.map(async (col) => ({
          col,
          docs: (await getDocs(collection(db, col.name))).docs,
        }))
      );

      const tagMap = new Map<string, TagUsage[]>();
      for (const { col, docs } of snapshots) {
        for (const docSnap of docs) {
          const data = docSnap.data();
          const name = (data.displayName as string) || docSnap.id;
          for (const field of TAG_FIELDS) {
            const arr: string[] = Array.isArray(data[field]) ? data[field] : [];
            for (const tag of arr) {
              if (!tag) continue;
              if (!tagMap.has(tag)) tagMap.set(tag, []);
              tagMap.get(tag)!.push({
                collectionKey: col.key,
                collectionName: col.name,
                partId: docSnap.id,
                partName: name,
                field,
              });
            }
          }
        }
      }

      const sorted = [...tagMap.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .map(([name, usages]) => ({ name, usages }));

      setTags(sorted);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  // ── Batch rename ────────────────────────────────────────────────────────────
  const confirmRename = async () => {
    if (!renaming || !renaming.newName.trim() || renaming.newName === renaming.tag) return;
    const oldName = renaming.tag;
    const newName = renaming.newName.trim();
    setSaving(true);
    try {
      const tagEntry = tags.find((t) => t.name === oldName);
      if (!tagEntry) return;

      const docMap = new Map<string, { collectionName: string; fields: TagField[] }>();
      for (const usage of tagEntry.usages) {
        const key = `${usage.collectionName}/${usage.partId}`;
        if (!docMap.has(key)) docMap.set(key, { collectionName: usage.collectionName, fields: [] });
        const entry = docMap.get(key)!;
        if (!entry.fields.includes(usage.field)) entry.fields.push(usage.field);
      }

      await Promise.all(
        [...docMap.entries()].map(async ([, { collectionName, fields }]) => {
          const usage = tagEntry.usages.find((u) => u.collectionName === collectionName);
          if (!usage) return;
          const docRef = doc(db, collectionName, usage.partId);
          const snap = await import("firebase/firestore").then(({ getDoc }) => getDoc(docRef));
          if (!snap.exists()) return;
          const data = snap.data();
          const updates: Record<string, string[]> = {};
          for (const field of fields) {
            const arr: string[] = Array.isArray(data[field]) ? [...data[field]] : [];
            const idx = arr.indexOf(oldName);
            if (idx !== -1) arr[idx] = newName;
            updates[field] = arr;
          }
          await updateDoc(docRef, updates);
        })
      );

      setRenaming(null);
      toast.success(`Tag renamed from "${oldName}" to "${newName}".`);
      await fetchTags();
    } catch (err) {
      const msg = `Rename failed: ${String(err)}`;
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const visible = filter.trim()
    ? tags.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
    : tags;

  const usedIn = (entry: TagEntry) => {
    const labels = new Set(
      entry.usages.map((u) => PART_COLLECTIONS.find((c) => c.key === u.collectionKey)?.label ?? u.collectionKey)
    );
    return [...labels];
  };

  const fieldsUsed = (entry: TagEntry) => {
    return [...new Set(entry.usages.map((u) => u.field))];
  };

  const toggleExpand = (tag: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });

  return (
    <div className="p-7 max-w-[860px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[21px] font-bold text-text m-0">Compatibility Tags</h1>
        <p className="text-muted text-[13px] mt-1">
          All tags in use across every part collection. Rename a tag here to update every part that uses it at once.
        </p>
      </div>

      {/* Field legend */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        {TAG_FIELDS.map((f) => (
          <span
            key={f}
            style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 5,
              background: alpha(FIELD_COLOR[f], 0.10), color: FIELD_COLOR[f],
              border: `1px solid ${alpha(FIELD_COLOR[f], 0.27)}`,
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Search + refresh */}
      <div className="flex gap-2.5 mb-[18px]">
        <input
          placeholder="Search tags…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 bg-bg2 border border-border rounded-lg px-3 py-2 text-text text-[13px]"
        />
        <button onClick={fetchTags} className="px-3.5 py-2 bg-transparent text-text border border-border rounded-lg text-xs font-semibold cursor-pointer">
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red/[.10] border border-red/[.27] rounded-lg px-3.5 py-2.5 mb-4 text-[13px] text-red">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-muted text-[13px]">Loading tags…</div>
      )}

      {/* Empty state */}
      {!loading && visible.length === 0 && (
        <div className="py-10 text-center text-muted text-[13px]">
          {filter ? "No tags match your search." : "No compatibility tags found. Add tags to parts in their edit pages."}
        </div>
      )}

      {/* Tag list */}
      {!loading && visible.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {/* Summary row */}
          <div className="text-xs text-faint mb-1">
            {visible.length} tag{visible.length !== 1 ? "s" : ""}
            {filter ? ` matching "${filter}"` : ""} · {tags.reduce((s, t) => s + t.usages.length, 0)} total usages
          </div>

          {visible.map((entry) => {
            const isExpanded = expanded.has(entry.name);
            const isRenaming = renaming?.tag === entry.name;

            return (
              <div
                key={entry.name}
                className="bg-bg1 border border-border rounded-[9px] overflow-hidden"
              >
                {/* Tag header row */}
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer"
                  onClick={() => !isRenaming && toggleExpand(entry.name)}
                >
                  {/* Tag chip */}
                  <span
                    style={{
                      fontSize: 12, padding: "3px 9px", borderRadius: 5,
                      background: alpha(C.blue, 0.10), color: C.blue,
                      border: `1px solid ${alpha(C.blue, 0.20)}`, fontFamily: "monospace",
                    }}
                  >
                    {entry.name}
                  </span>

                  {/* Usage count */}
                  <span className="text-xs text-muted">{entry.usages.length} use{entry.usages.length !== 1 ? "s" : ""}</span>

                  {/* Collection badges */}
                  <div className="flex gap-1 flex-1 flex-wrap">
                    {usedIn(entry).map((label) => (
                      <span
                        key={label}
                        className="text-[10px] px-1.5 py-px rounded bg-bg3 text-muted border border-border"
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Field type badges */}
                  <div className="flex gap-1">
                    {fieldsUsed(entry).map((f) => (
                      <span
                        key={f}
                        style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: FIELD_COLOR[f], flexShrink: 0,
                        }}
                        title={f}
                      />
                    ))}
                  </div>

                  {/* Rename button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenaming({ tag: entry.name, newName: entry.name });
                      if (!isExpanded) toggleExpand(entry.name);
                    }}
                    className="px-2.5 py-1 text-[11px] flex-shrink-0 bg-transparent text-text border border-border rounded-lg cursor-pointer"
                  >
                    Rename
                  </button>

                  {/* Expand arrow */}
                  <span className="text-[10px] text-faint flex-shrink-0">
                    {isExpanded ? "▾" : "▸"}
                  </span>
                </div>

                {/* Rename inline form */}
                {isRenaming && (
                  <div
                    className="px-3.5 py-2.5 bg-bg2 border-t border-border flex gap-2 items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-muted flex-shrink-0">New name:</span>
                    <input
                      autoFocus
                      value={renaming.newName}
                      onChange={(e) => setRenaming({ ...renaming, newName: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenaming(null); }}
                      className="flex-1 bg-bg3 border border-border rounded-md px-2.5 py-1.5 text-text text-xs font-mono"
                    />
                    <button
                      onClick={confirmRename}
                      disabled={saving || !renaming.newName.trim() || renaming.newName === entry.name}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue text-white rounded-lg border-none cursor-pointer"
                      style={{ opacity: saving ? 0.6 : 1 }}
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setRenaming(null)}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-transparent text-text border border-border rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Expanded: usage detail */}
                {isExpanded && (
                  <div
                    className="border-t border-border overflow-y-auto"
                    style={{ maxHeight: 260 }}
                  >
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-bg2">
                          <th className="px-3.5 py-1.5 text-faint font-medium text-left">Part</th>
                          <th className="px-3.5 py-1.5 text-faint font-medium text-left">Type</th>
                          <th className="px-3.5 py-1.5 text-faint font-medium text-left">Field</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.usages.map((u, i) => (
                          <tr
                            key={i}
                            style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : alpha(C.bg2, 0.53) }}
                          >
                            <td className="px-3.5 py-1.5 text-text">{u.partName}</td>
                            <td className="px-3.5 py-1.5 text-muted">
                              {PART_COLLECTIONS.find((c) => c.key === u.collectionKey)?.label ?? u.collectionKey}
                            </td>
                            <td className="px-3.5 py-1.5">
                              <span
                                style={{
                                  fontSize: 10, padding: "2px 7px", borderRadius: 4,
                                  background: alpha(FIELD_COLOR[u.field], 0.10),
                                  color: FIELD_COLOR[u.field],
                                  border: `1px solid ${alpha(FIELD_COLOR[u.field], 0.20)}`,
                                }}
                              >
                                {u.field}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
