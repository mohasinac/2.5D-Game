/**
 * PartPicker — searchable inline part picker.
 * - When nothing selected: shows a text input + floating result list (max 10, keyboard-nav)
 * - When selected: shows a chip with name + Clear button
 * - Incompatible parts greyed out with admin Override button
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
    <div className="relative">
      {label && <div className="text-[11px] text-muted mb-1.5">{label}</div>}

      {/* Selected chip */}
      {selectedPart ? (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] bg-blue/[0.09] border border-blue/30">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: selectedPart.color ?? "var(--faint)" }}
          />
          <span className="flex-1 text-[12px] text-text overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedPart.displayName || "(unnamed)"}
          </span>
          {(selectedPart.compatibilityTags ?? []).slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] bg-bg3 text-faint px-[5px] py-px rounded-[3px] border border-border">
              {tag}
            </span>
          ))}
          {(onClear || true) && (
            <button
              onClick={() => { onClear?.(); setSearch(""); setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="bg-transparent border-none text-faint text-sm cursor-pointer leading-none px-0.5"
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
          className="w-full px-2.5 py-1.5 bg-bg2 border border-border rounded-[6px] text-text text-[12px] box-border"
        />
      )}

      {/* Floating dropdown */}
      {open && !selectedPart && (
        <div
          ref={listRef}
          className="absolute top-[calc(100%+4px)] left-0 right-0 z-[100] bg-bg1 border border-border rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.4)] max-h-[280px] overflow-y-auto"
        >
          {loading ? (
            <div className="text-[11px] text-faint px-3 py-2.5">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-[11px] text-faint px-3 py-2.5">No parts match "{search}"</div>
          ) : (
            filtered.map((part, i) => {
              const compat = isCompatible(part, existingCompatibilityTags, isAdmin);
              const isHighlighted = i === cursor;
              return (
                <div
                  key={part.id}
                  title={!compat.ok ? compat.reason : undefined}
                  onMouseDown={() => compat.ok && handleSelect(part)}
                  className={`flex items-center gap-2 px-3 py-[7px] border-b border-border/[0.13] ${compat.ok ? "cursor-pointer" : "cursor-default opacity-45"} ${isHighlighted ? "bg-blue-13" : "bg-transparent"}`}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: part.color ?? "var(--faint)" }}
                  />
                  <span className={`flex-1 text-[12px] overflow-hidden text-ellipsis whitespace-nowrap ${compat.ok ? "text-text" : "text-faint"}`}>
                    {part.displayName || "(unnamed)"}
                  </span>
                  {!compat.ok && (
                    <button
                      title="Admin override — use regardless of compatibility"
                      onMouseDown={(e) => { e.stopPropagation(); handleSelect(part); }}
                      className="px-1.5 py-0.5 text-[9px] rounded cursor-pointer bg-yellow/10 text-yellow border border-yellow/25"
                    >Override</button>
                  )}
                  {(part.compatibilityTags ?? []).slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] bg-bg3 text-faint px-[5px] py-px rounded-[3px] border border-border">
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
