/**
 * PartPicker — searchable list of parts from a Firestore collection.
 * Shows parts as cards (color swatch + name + compatibility tags).
 * Highlights incompatible parts (gray out) with tooltip.
 * Admin override button bypasses compatibility check.
 */

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C } from "@/styles/theme";

interface PartCard {
  id: string;
  displayName: string;
  color?: string;
  compatibilityTags?: string[];
  requiredCompatibility?: string[];
  excludedCompatibility?: string[];
  images?: { topView?: string };
}

function isCompatible(
  part: PartCard,
  existingTags: string[],
  isAdmin: boolean,
): { ok: boolean; reason: string } {
  if (isAdmin) return { ok: true, reason: "" };

  for (const exc of part.excludedCompatibility ?? []) {
    if (existingTags.includes(exc)) {
      return { ok: false, reason: `Excluded by tag "${exc}"` };
    }
  }

  const required = part.requiredCompatibility ?? [];
  if (required.length > 0) {
    const hasRequired = required.some((t) => existingTags.includes(t));
    if (!hasRequired) {
      return { ok: false, reason: `Requires one of: ${required.join(", ")}` };
    }
  }

  return { ok: true, reason: "" };
}

interface Props {
  collectionName: string;
  selectedId?: string;
  onSelect: (partId: string, partData: PartCard) => void;
  existingCompatibilityTags?: string[];
  isAdmin?: boolean;
  label?: string;
}

export function PartPicker({
  collectionName,
  selectedId,
  onSelect,
  existingCompatibilityTags = [],
  isAdmin = true,
  label,
}: Props) {
  const [parts, setParts] = useState<PartCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, collectionName))
      .then((snap) => {
        setParts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PartCard)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [collectionName]);

  const filtered = parts.filter((p) =>
    p.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {label && <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{label}</div>}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search parts…"
        style={{
          width: "100%", padding: "6px 10px", background: C.bg2,
          border: `1px solid ${C.border}`, borderRadius: 6, color: C.text,
          fontSize: 12, marginBottom: 8, boxSizing: "border-box",
        }}
      />

      {loading ? (
        <div style={{ fontSize: 11, color: C.faint, padding: "8px 0" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ fontSize: 11, color: C.faint, padding: "8px 0" }}>No parts found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto" }}>
          {filtered.map((part) => {
            const compat = isCompatible(part, existingCompatibilityTags, isAdmin);
            const isSelected = part.id === selectedId;

            return (
              <div
                key={part.id}
                title={!compat.ok ? compat.reason : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px", borderRadius: 7, cursor: compat.ok ? "pointer" : "default",
                  background: isSelected ? C.blue + "18" : C.bg2,
                  border: `1px solid ${isSelected ? C.blue + "55" : C.border}`,
                  opacity: compat.ok ? 1 : 0.45,
                  transition: "opacity 0.15s",
                }}
                onClick={() => compat.ok && onSelect(part.id, part)}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: part.color ?? C.faint, flexShrink: 0,
                  border: `1px solid ${C.border}`,
                }} />
                <span style={{ flex: 1, fontSize: 12, color: compat.ok ? C.text : C.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {part.displayName || "(unnamed)"}
                </span>
                {!compat.ok && (
                  <button
                    title="Admin override — use regardless of compatibility"
                    onClick={(e) => { e.stopPropagation(); onSelect(part.id, part); }}
                    style={{
                      padding: "2px 6px", fontSize: 9, borderRadius: 4, cursor: "pointer",
                      background: C.yellow + "22", color: C.yellow, border: `1px solid ${C.yellow}44`,
                    }}
                  >
                    Override
                  </button>
                )}
                {(part.compatibilityTags ?? []).slice(0, 2).map((tag) => (
                  <span key={tag} style={{ fontSize: 9, background: C.bg3, color: C.faint, padding: "1px 5px", borderRadius: 3, border: `1px solid ${C.border}` }}>
                    {tag}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
