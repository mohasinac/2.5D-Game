/**
 * PartPicker — searchable inline part picker.
 * - When nothing selected: shows a text input + floating result list (max 10, keyboard-nav)
 * - When selected: shows a chip with name + Clear button
 * - Incompatible parts greyed out with admin Override button
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C, alpha } from "@/styles/theme";
import { isCompatible } from "./partCompatibility";

interface PartCard {
  id: string;
  displayName: string;
  color?: string;
  compatibilityTags?: string[];
  requiredCompatibility?: string[];
  excludedCompatibility?: string[];
  images?: { topView?: string };
}

interface Props {
  collectionName: string;
  selectedId?: string;
  onSelect: (partId: string, partData: PartCard) => void;
  onClear?: () => void;
  existingCompatibilityTags?: string[];
  isAdmin?: boolean;
  label?: string;
}

export function PartPicker({
  collectionName,
  selectedId,
  onSelect,
  onClear,
  existingCompatibilityTags = [],
  isAdmin = true,
  label,
}: Props) {
  const [parts, setParts] = useState<PartCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, collectionName))
      .then((snap) => setParts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PartCard))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [collectionName]);

  const selectedPart = parts.find((p) => p.id === selectedId);

  const filtered = parts
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.displayName?.toLowerCase().includes(q) ||
        (p.compatibilityTags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    })
    .slice(0, 10);

  const handleSelect = useCallback((part: PartCard) => {
    onSelect(part.id, part);
    setSearch("");
    setOpen(false);
    setCursor(-1);
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && cursor >= 0 && filtered[cursor]) { handleSelect(filtered[cursor]); }
    if (e.key === "Escape") { setOpen(false); setCursor(-1); }
  };

  return (
    <div style={{ position: "relative" }}>
      {label && <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{label}</div>}

      {/* Selected chip */}
      {selectedPart ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 10px", borderRadius: 7,
          background: alpha(C.blue, 0.09), border: `1px solid ${alpha(C.blue, 0.33)}`,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: selectedPart.color ?? C.faint, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 12, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedPart.displayName || "(unnamed)"}
          </span>
          {(selectedPart.compatibilityTags ?? []).slice(0, 2).map((tag) => (
            <span key={tag} style={{ fontSize: 9, background: C.bg3, color: C.faint, padding: "1px 5px", borderRadius: 3, border: `1px solid ${C.border}` }}>
              {tag}
            </span>
          ))}
          {(onClear || true) && (
            <button
              onClick={() => { onClear?.(); setSearch(""); setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              style={{ background: "none", border: "none", color: C.faint, fontSize: 14, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}
              title="Clear selection"
            >×</button>
          )}
        </div>
      ) : (
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); setCursor(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search parts…"
          style={{
            width: "100%", padding: "6px 10px", background: C.bg2,
            border: `1px solid ${C.border}`, borderRadius: 6, color: C.text,
            fontSize: 12, boxSizing: "border-box" as const,
          }}
        />
      )}

      {/* Floating dropdown */}
      {open && !selectedPart && (
        <div
          ref={listRef}
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
            background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            maxHeight: 280, overflowY: "auto",
          }}
        >
          {loading ? (
            <div style={{ fontSize: 11, color: C.faint, padding: "10px 12px" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ fontSize: 11, color: C.faint, padding: "10px 12px" }}>No parts match "{search}"</div>
          ) : (
            filtered.map((part, i) => {
              const compat = isCompatible(part, existingCompatibilityTags, isAdmin);
              const isHighlighted = i === cursor;
              return (
                <div
                  key={part.id}
                  title={!compat.ok ? compat.reason : undefined}
                  onMouseDown={() => compat.ok && handleSelect(part)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px", cursor: compat.ok ? "pointer" : "default",
                    background: isHighlighted ? alpha(C.blue, 0.13) : "transparent",
                    opacity: compat.ok ? 1 : 0.45,
                    borderBottom: `1px solid ${alpha(C.border, 0.13)}`,
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: part.color ?? C.faint, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12, color: compat.ok ? C.text : C.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {part.displayName || "(unnamed)"}
                  </span>
                  {!compat.ok && (
                    <button
                      title="Admin override — use regardless of compatibility"
                      onMouseDown={(e) => { e.stopPropagation(); handleSelect(part); }}
                      style={{ padding: "2px 6px", fontSize: 9, borderRadius: 4, cursor: "pointer", background: alpha(C.yellow, 0.13), color: C.yellow, border: `1px solid ${alpha(C.yellow, 0.27)}` }}
                    >Override</button>
                  )}
                  {(part.compatibilityTags ?? []).slice(0, 2).map((tag) => (
                    <span key={tag} style={{ fontSize: 9, background: C.bg3, color: C.faint, padding: "1px 5px", borderRadius: 3, border: `1px solid ${C.border}` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
