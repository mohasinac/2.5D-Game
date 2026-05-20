import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, btn, btnOutline } from "@/styles/theme";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type TagField = "compatibilityTags" | "requiredCompatibility" | "excludedCompatibility";

interface TagUsage {
  collectionKey: string;   // e.g. "ATTACK_RING_PARTS"
  collectionName: string;  // e.g. "attack_ring_parts"
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
      // Fetch all part collections in parallel
      const snapshots = await Promise.all(
        PART_COLLECTIONS.map(async (col) => ({
          col,
          docs: (await getDocs(collection(db, col.name))).docs,
        }))
      );

      // Aggregate tag → usages
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

      // Group usages by doc (a doc may appear in multiple fields)
      const docMap = new Map<string, { collectionName: string; fields: TagField[] }>();
      for (const usage of tagEntry.usages) {
        const key = `${usage.collectionName}/${usage.partId}`;
        if (!docMap.has(key)) docMap.set(key, { collectionName: usage.collectionName, fields: [] });
        const entry = docMap.get(key)!;
        if (!entry.fields.includes(usage.field)) entry.fields.push(usage.field);
      }

      // Fetch affected docs and patch each field
      await Promise.all(
        [...docMap.entries()].map(async ([, { collectionName, fields }]) => {
          // Find original doc to get current array values
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

  // ── Filter ───────────────────────────────────────────────────────────────────
  const visible = filter.trim()
    ? tags.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
    : tags;

  // ── Collection labels used in a tag's usages ─────────────────────────────────
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

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 28, maxWidth: 860 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 21, fontWeight: 700, color: C.text, margin: 0 }}>Compatibility Tags</h1>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
          All tags in use across every part collection. Rename a tag here to update every part that uses it at once.
        </p>
      </div>

      {/* Field legend */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {TAG_FIELDS.map((f) => (
          <span
            key={f}
            style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 5,
              background: FIELD_COLOR[f] + "1a", color: FIELD_COLOR[f],
              border: `1px solid ${FIELD_COLOR[f]}44`,
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Search + refresh */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input
          placeholder="Search tags…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            flex: 1, background: C.bg2, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13,
          }}
        />
        <button onClick={fetchTags} style={{ ...btnOutline(), padding: "8px 14px", fontSize: 12 }}>
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: C.red + "1a", border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.red }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 13 }}>Loading tags…</div>
      )}

      {/* Empty state */}
      {!loading && visible.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: C.muted, fontSize: 13 }}>
          {filter ? "No tags match your search." : "No compatibility tags found. Add tags to parts in their edit pages."}
        </div>
      )}

      {/* Tag list */}
      {!loading && visible.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Summary row */}
          <div style={{ fontSize: 12, color: C.faint, marginBottom: 4 }}>
            {visible.length} tag{visible.length !== 1 ? "s" : ""}
            {filter ? ` matching "${filter}"` : ""} · {tags.reduce((s, t) => s + t.usages.length, 0)} total usages
          </div>

          {visible.map((entry) => {
            const isExpanded = expanded.has(entry.name);
            const isRenaming = renaming?.tag === entry.name;

            return (
              <div
                key={entry.name}
                style={{
                  background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 9,
                  overflow: "hidden",
                }}
              >
                {/* Tag header row */}
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", cursor: "pointer",
                  }}
                  onClick={() => !isRenaming && toggleExpand(entry.name)}
                >
                  {/* Tag chip */}
                  <span
                    style={{
                      fontSize: 12, padding: "3px 9px", borderRadius: 5,
                      background: C.blue + "1a", color: C.blue,
                      border: `1px solid ${C.blue}33`, fontFamily: "monospace",
                    }}
                  >
                    {entry.name}
                  </span>

                  {/* Usage count */}
                  <span style={{ fontSize: 12, color: C.muted }}>{entry.usages.length} use{entry.usages.length !== 1 ? "s" : ""}</span>

                  {/* Collection badges */}
                  <div style={{ display: "flex", gap: 4, flex: 1, flexWrap: "wrap" }}>
                    {usedIn(entry).map((label) => (
                      <span
                        key={label}
                        style={{
                          fontSize: 10, padding: "1px 6px", borderRadius: 4,
                          background: C.bg3, color: C.muted, border: `1px solid ${C.border}`,
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Field type badges */}
                  <div style={{ display: "flex", gap: 4 }}>
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
                    style={{ ...btnOutline(C.border), padding: "4px 10px", fontSize: 11, flexShrink: 0 }}
                  >
                    Rename
                  </button>

                  {/* Expand arrow */}
                  <span style={{ fontSize: 10, color: C.faint, flexShrink: 0 }}>
                    {isExpanded ? "▾" : "▸"}
                  </span>
                </div>

                {/* Rename inline form */}
                {isRenaming && (
                  <div
                    style={{
                      padding: "10px 14px", background: C.bg2,
                      borderTop: `1px solid ${C.border}`,
                      display: "flex", gap: 8, alignItems: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}>New name:</span>
                    <input
                      autoFocus
                      value={renaming.newName}
                      onChange={(e) => setRenaming({ ...renaming, newName: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenaming(null); }}
                      style={{
                        flex: 1, background: C.bg3, border: `1px solid ${C.border}`,
                        borderRadius: 6, padding: "6px 10px", color: C.text, fontSize: 12,
                        fontFamily: "monospace",
                      }}
                    />
                    <button
                      onClick={confirmRename}
                      disabled={saving || !renaming.newName.trim() || renaming.newName === entry.name}
                      style={{ ...btn(C.blue), padding: "6px 12px", fontSize: 12, opacity: saving ? 0.6 : 1 }}
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setRenaming(null)}
                      style={{ ...btnOutline(), padding: "6px 10px", fontSize: 12 }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Expanded: usage detail */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: `1px solid ${C.border}`,
                      maxHeight: 260, overflowY: "auto",
                    }}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: C.bg2 }}>
                          <th style={{ padding: "6px 14px", color: C.faint, fontWeight: 500, textAlign: "left" }}>Part</th>
                          <th style={{ padding: "6px 14px", color: C.faint, fontWeight: 500, textAlign: "left" }}>Type</th>
                          <th style={{ padding: "6px 14px", color: C.faint, fontWeight: 500, textAlign: "left" }}>Field</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.usages.map((u, i) => (
                          <tr
                            key={i}
                            style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.bg2 + "88" }}
                          >
                            <td style={{ padding: "6px 14px", color: C.text }}>{u.partName}</td>
                            <td style={{ padding: "6px 14px", color: C.muted }}>
                              {PART_COLLECTIONS.find((c) => c.key === u.collectionKey)?.label ?? u.collectionKey}
                            </td>
                            <td style={{ padding: "6px 14px" }}>
                              <span
                                style={{
                                  fontSize: 10, padding: "2px 7px", borderRadius: 4,
                                  background: FIELD_COLOR[u.field] + "1a",
                                  color: FIELD_COLOR[u.field],
                                  border: `1px solid ${FIELD_COLOR[u.field]}33`,
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
