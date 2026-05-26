import React, { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C, alpha } from "@/styles/theme";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";
import type { ArenaFloorGroup, ArenaLink } from "@/types/arenaConfigNew";

// ─── Constants ────────────────────────────────────────────────────────────────

const LINK_TYPE_ICONS: Record<string, string> = {
  corridor: "🚪",
  portal:   "🌀",
  ramp:     "📐",
  pit:      "⬇️",
  trampoline: "⬆️",
};

const COUPLING_META: Record<string, { color: string; label: string; symbol: string; desc: string }> = {
  independent:  { color: C.faint,  label: "Free",   symbol: "~",  desc: "Each arena spins independently" },
  synchronized: { color: C.green,  label: "Sync",   symbol: "↻↻", desc: "Both rotate at same speed & direction" },
  counter:      { color: C.yellow, label: "Counter", symbol: "↻↺", desc: "Opposite directions, same speed" },
  driven:       { color: C.blue,   label: "Driven",  symbol: "⚙",  desc: "Lower floor drives upper via gear ratio" },
};

const ALIGN_META: Record<string, { color: string; label: string }> = {
  none:        { color: C.purple, label: "always open" },
  positional:  { color: C.blue,   label: "positional" },
  "owner-only":{ color: C.yellow, label: "owner-only" },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloorGroupRow extends ArenaFloorGroup {
  links?: ArenaLink[];
  linkCount?: number;
  status?: "active" | "draft";
}

// ─── Small visual components ──────────────────────────────────────────────────

/** Two-circle diagram showing how arenas rotate relative to each other */
function CouplingDiagram({ mode, size = 44 }: { mode: string; size?: number }) {
  const m = COUPLING_META[mode] ?? COUPLING_META.independent;
  const cx1 = size * 0.28, cx2 = size * 0.72, cy = size / 2, r = size * 0.22;
  const isSynced = mode === "synchronized";
  const isCounter = mode === "counter";
  const isDriven = mode === "driven";

  return (
    <svg width={size} height={size} className="shrink-0 overflow-visible">
      {/* Floor circles */}
      <circle cx={cx1} cy={cy} r={r} fill={alpha(m.color, 0.08)} stroke={alpha(m.color, 0.45)} strokeWidth={1.5} />
      <circle cx={cx2} cy={cy} r={r} fill={alpha(m.color, 0.08)} stroke={alpha(m.color, 0.45)} strokeWidth={1.5} />

      {/* Rotation arrows on left circle */}
      <path
        d={`M${cx1-r+2} ${cy-3} A${r-2} ${r-2} 0 0 1 ${cx1+r-2} ${cy-3}`}
        fill="none" stroke={m.color} strokeWidth={1.5} strokeLinecap="round"
        markerEnd={`url(#arr-${mode})`}
        className={mode === "independent" ? "" : "animate-spin"}
      />
      {/* Rotation arrow on right circle — reversed if counter */}
      <path
        d={`M${cx2-r+2} ${cy-3} A${r-2} ${r-2} 0 0 ${isCounter ? 0 : 1} ${cx2+r-2} ${cy-3}`}
        fill="none" stroke={m.color} strokeWidth={1.5} strokeLinecap="round"
        strokeOpacity={mode === "independent" ? 0.3 : 1}
        className={cn(mode === "independent" ? "opacity-30" : "animate-spin")}
      />

      {/* Gear connector for driven */}
      {isDriven && (
        <line x1={cx1 + r - 1} y1={cy} x2={cx2 - r + 1} y2={cy}
          stroke={m.color} strokeWidth={2} strokeDasharray="3 2" />
      )}
      {/* Link line for sync */}
      {isSynced && (
        <line x1={cx1 + r - 1} y1={cy} x2={cx2 - r + 1} y2={cy}
          stroke={alpha(m.color, 0.4)} strokeWidth={1} />
      )}

      {/* Center label */}
      <text x={size / 2} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={8} fontWeight="700" fill={m.color} fontFamily="monospace">
        {m.symbol}
      </text>

      <defs>
        <marker id={`arr-${mode}`} markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={m.color} />
        </marker>
      </defs>
    </svg>
  );
}

/** Compact link type + alignment pill row */
function LinkTypePills({ links }: { links?: ArenaLink[] }) {
  if (!links?.length) return <span className="text-faint text-xs">—</span>;

  const byType: Record<string, number> = {};
  links.forEach(l => { byType[l.linkType] = (byType[l.linkType] ?? 0) + 1; });

  return (
    <div className="flex gap-1 flex-wrap">
      {Object.entries(byType).map(([type, count]) => (
        <span key={type} className="text-xs px-1.5 py-0.5 rounded-full border border-border text-muted flex items-center gap-1 bg-bg3/80">
          {LINK_TYPE_ICONS[type]} {count > 1 ? count : ""}
        </span>
      ))}
    </div>
  );
}

/** Shows the dominant coupling mode across all links in a group */
function CouplingModeCell({ links }: { links?: ArenaLink[] }) {
  if (!links?.length) return <span className="text-faint text-xs">—</span>;

  const counts: Record<string, number> = {};
  links.forEach(l => {
    const c = l.rotationCoupling ?? "independent";
    counts[c] = (counts[c] ?? 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-1 items-center">
      <CouplingDiagram mode={sorted[0][0]} size={40} />
      <div className="flex gap-1 flex-wrap justify-center">
        {sorted.map(([mode, count]) => {
          const m = COUPLING_META[mode] ?? COUPLING_META.independent;
          return (
            <span key={mode} className="text-[9px] px-1 py-0.5 rounded-lg font-bold hud-type-bg hud-type-border hud-type-text border"
              style={{ "--tc": m.color } as React.CSSProperties}>
              {m.symbol} {count}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Alignment health summary: how many links disconnect vs stay open */
function AlignmentHealthBar({ links }: { links?: ArenaLink[] }) {
  if (!links?.length) return null;
  const always  = links.filter(l => l.alignment?.mode === "none").length;
  const disc    = links.filter(l => l.alignment?.disconnectsWhenMisaligned).length;
  const open    = links.length - disc;

  return (
    <div className="text-[10px] flex flex-col gap-0.5">
      {always > 0 && <span className="text-purple">🌀 ×{always} always open</span>}
      {disc > 0 && <span className="text-red">⚡ ×{disc} disconnect</span>}
      {open - always > 0 && <span className="text-green">✓ ×{open - always} stays open</span>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArenaFloorGroupListPage() {
  const [groups, setGroups] = useState<FloorGroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<FloorGroupRow | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "arena_floor_groups"));
        setGroups(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FloorGroupRow, "id">) })));
      } catch {
        toast.error("Failed to load floor groups");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleDelete(group: FloorGroupRow) {
    try {
      await deleteDoc(doc(db, "arena_floor_groups", group.id));
      setGroups(g => g.filter(x => x.id !== group.id));
      toast.success(`Deleted "${group.name}"`);
    } catch {
      toast.error("Delete failed");
    } finally {
      setConfirmDelete(null);
    }
  }

  const totalLinks     = groups.reduce((s, g) => s + (g.linkCount ?? 0), 0);
  const coupledLinks   = groups.reduce((s, g) => s + (g.links?.filter(l => (l.rotationCoupling ?? "independent") !== "independent").length ?? 0), 0);
  const disconnectable = groups.reduce((s, g) => s + (g.links?.filter(l => l.alignment?.disconnectsWhenMisaligned).length ?? 0), 0);

  return (
    <div className="p-6 w-full box-border">
      <style>{`
        @keyframes spin { from { transform-origin: center; transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text m-0">Arena Floor Groups</h1>
          <p className="text-muted text-sm mt-1">
            Link up to 7 arenas as stacked floors. Rotation coupling controls whether linked arenas spin
            independently, together, in opposite directions, or via a gear ratio.
          </p>
        </div>
        <Link
          to="/admin/arena-floor-groups/new"
          className="px-4 py-2 bg-yellow text-bg0 rounded-lg text-sm font-semibold no-underline"
        >
          + New Floor Group
        </Link>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Groups",           value: groups.length,                                                             cls: "text-blue" },
          { label: "Active",                 value: groups.filter(g => g.status === "active").length,                         cls: "text-green" },
          { label: "Rotation Coupled",       value: `${coupledLinks} / ${totalLinks} links`,                                  cls: "text-yellow" },
          { label: "Disconnect on Misalign", value: `${disconnectable} link${disconnectable !== 1 ? "s" : ""}`,               cls: "text-red" },
        ].map(s => (
          <div key={s.label} className="bg-bg1 border border-border rounded-xl px-4 py-3.5">
            <div className={`text-2xl font-bold ${s.cls}`}>{s.value}</div>
            <div className="text-[11px] text-faint mt-0.5 uppercase font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Coupling legend ── */}
      <div className="flex gap-2 flex-wrap mb-4 px-3.5 py-2.5 bg-bg1 rounded-xl border border-border items-center">
        <span className="text-[11px] text-faint font-semibold mr-1">ROTATION COUPLING:</span>
        {Object.entries(COUPLING_META).map(([key, m]) => (
          <span key={key} className="flex items-center gap-1 text-[11px]">
            <span className="rounded-full px-2 py-0.5 font-bold hud-type-bg hud-type-border hud-type-text border"
              style={{ "--tc": m.color } as React.CSSProperties}>
              {m.symbol} {m.label}
            </span>
            <span className="text-faint">{m.desc}</span>
            <span className="text-border mx-1">·</span>
          </span>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="text-center py-12 text-muted">Loading…</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 bg-bg1 rounded-2xl border border-dashed border-border">
          <div className="text-3xl mb-3">🏟️</div>
          <div className="text-text font-semibold mb-1.5">No floor groups yet</div>
          <div className="text-muted text-sm mb-5">
            Create your first group to start linking arenas as floors.
          </div>
          <Link to="/admin/arena-floor-groups/new"
            className="px-4 py-2 bg-blue text-white rounded-lg text-sm font-semibold no-underline">
            + New Floor Group
          </Link>
        </div>
      ) : (
        <div className="bg-bg1 rounded-2xl border border-border overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name / ID", "Floors", "Arena Stack", "Links", "Rotation Coupling", "Alignment Health", "Status", ""].map(h => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[11px] text-faint font-semibold uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, i) => (
                <tr key={g.id} className={i < groups.length - 1 ? "border-b border-border" : ""}>

                  {/* Name */}
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-text">{g.name ?? "Unnamed Group"}</div>
                    <div className="text-[11px] text-faint mt-0.5 font-mono">{g.id}</div>
                  </td>

                  {/* Floor count pips */}
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 7 }).map((_, idx) => (
                        <div
                          key={idx}
                          title={idx < (g.floorArenaIds?.length ?? 0) ? `F${idx}` : "empty"}
                          className={`w-2.5 h-2.5 rounded-sm ${idx < (g.floorArenaIds?.length ?? 0) ? "bg-blue border-blue" : "bg-bg3 border-border"} border`}
                        />
                      ))}
                      <span className="text-muted text-[11px] ml-0.5">
                        {g.floorArenaIds?.length ?? 0}/7
                      </span>
                    </div>
                    <div className="text-[10px] text-faint mt-0.5">
                      {(g.floorArenaIds?.length ?? 0) > 1
                        ? `F0 (ground) → F${(g.floorArenaIds?.length ?? 1) - 1} (top)`
                        : "—"}
                    </div>
                  </td>

                  {/* Arena stack (first 3 floors) */}
                  <td className="px-3.5 py-3">
                    <div className="flex flex-col gap-0.5">
                      {(g.floorArenaIds ?? []).slice(0, 3).map((id, fi) => (
                        <div key={id} className="flex items-center gap-1">
                          <span className="text-[10px] text-faint font-mono min-w-[14px]">F{fi}</span>
                          <span className="text-[11px] text-text bg-bg2 border border-border rounded px-1.5 py-0.5 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {id}
                          </span>
                        </div>
                      ))}
                      {(g.floorArenaIds?.length ?? 0) > 3 && (
                        <span className="text-[11px] text-faint">
                          +{(g.floorArenaIds?.length ?? 0) - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Link types breakdown */}
                  <td className="px-3.5 py-3">
                    <LinkTypePills links={g.links} />
                    <div className="text-[11px] text-faint mt-1">
                      {g.linkCount ?? 0} link{(g.linkCount ?? 0) !== 1 ? "s" : ""}
                    </div>
                  </td>

                  {/* Rotation coupling diagram */}
                  <td className="px-3.5 py-3">
                    <CouplingModeCell links={g.links} />
                  </td>

                  {/* Alignment health */}
                  <td className="px-3.5 py-3">
                    <AlignmentHealthBar links={g.links} />
                  </td>

                  {/* Status */}
                  <td className="px-3.5 py-3">
                    <Badge color={g.status === "active" ? "green" : "faint"}>
                      {g.status ?? "draft"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-3.5 py-3">
                    <div className="flex gap-1.5">
                      <Link
                        to={`/admin/arena-floor-groups/${g.id}`}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold no-underline text-theme-blue bg-blue-13 border border-blue-30"
                      >
                        Edit
                      </Link>
                      <Button variant="danger" size="xs" onClick={() => setConfirmDelete(g)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete modal ── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-bg2 border border-border rounded-2xl p-6 max-w-[380px] w-[90%]">
            <h3 className="text-lg font-bold text-text mb-2">Delete Floor Group?</h3>
            <p className="text-muted text-sm mb-1.5">
              <strong className="text-text">{confirmDelete.name}</strong> will be permanently deleted.
            </p>
            <p className="text-red text-sm mb-2">
              ⚡ {confirmDelete.links?.filter(l => l.alignment?.disconnectsWhenMisaligned).length ?? 0} disconnect-on-misalign
              link{(confirmDelete.links?.filter(l => l.alignment?.disconnectsWhenMisaligned).length ?? 0) !== 1 ? "s" : ""} will be lost.
            </p>
            <p className="text-faint text-sm mb-6">
              All {confirmDelete.floorArenaIds?.length ?? 0} floor slots and {confirmDelete.linkCount ?? 0} links
              will be removed. Arena docs themselves are not affected.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(confirmDelete)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
