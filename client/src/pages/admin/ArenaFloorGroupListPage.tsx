import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C, btn, pill, alpha } from "@/styles/theme";
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
    <svg width={size} height={size} style={{ flexShrink: 0, overflow: "visible" }}>
      {/* Floor circles */}
      <circle cx={cx1} cy={cy} r={r} fill={alpha(m.color, 0.08)} stroke={alpha(m.color, 0.45)} strokeWidth={1.5} />
      <circle cx={cx2} cy={cy} r={r} fill={alpha(m.color, 0.08)} stroke={alpha(m.color, 0.45)} strokeWidth={1.5} />

      {/* Rotation arrows on left circle */}
      <path
        d={`M${cx1-r+2} ${cy-3} A${r-2} ${r-2} 0 0 1 ${cx1+r-2} ${cy-3}`}
        fill="none" stroke={m.color} strokeWidth={1.5} strokeLinecap="round"
        markerEnd={`url(#arr-${mode})`}
        style={{ animation: mode === "independent" ? "none" : `spin 2s linear infinite` }}
      />
      {/* Rotation arrow on right circle — reversed if counter */}
      <path
        d={`M${cx2-r+2} ${cy-3} A${r-2} ${r-2} 0 0 ${isCounter ? 0 : 1} ${cx2+r-2} ${cy-3}`}
        fill="none" stroke={m.color} strokeWidth={1.5} strokeLinecap="round"
        strokeOpacity={mode === "independent" ? 0.3 : 1}
        style={{ animation: mode === "independent" ? "none" : `spin ${isCounter ? "2s" : "2s"} linear infinite` }}
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
  if (!links?.length) return <span style={{ color: C.faint, fontSize: 11 }}>—</span>;

  const byType: Record<string, number> = {};
  links.forEach(l => { byType[l.linkType] = (byType[l.linkType] ?? 0) + 1; });

  return (
    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {Object.entries(byType).map(([type, count]) => (
        <span key={type} style={{
          fontSize: 11, padding: "1px 6px", borderRadius: 20,
          background: alpha(C.bg3, 0.8), border: `1px solid ${C.border}`,
          color: C.muted, display: "flex", alignItems: "center", gap: 3,
        }}>
          {LINK_TYPE_ICONS[type]} {count > 1 ? count : ""}
        </span>
      ))}
    </div>
  );
}

/** Shows the dominant coupling mode across all links in a group */
function CouplingModeCell({ links }: { links?: ArenaLink[] }) {
  if (!links?.length) return <span style={{ color: C.faint, fontSize: 11 }}>—</span>;

  const counts: Record<string, number> = {};
  links.forEach(l => {
    const c = l.rotationCoupling ?? "independent";
    counts[c] = (counts[c] ?? 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
      <CouplingDiagram mode={sorted[0][0]} size={40} />
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
        {sorted.map(([mode, count]) => {
          const m = COUPLING_META[mode] ?? COUPLING_META.independent;
          return (
            <span key={mode} style={{
              fontSize: 9, padding: "1px 5px", borderRadius: 10,
              background: alpha(m.color, 0.12), border: `1px solid ${alpha(m.color, 0.3)}`,
              color: m.color, fontWeight: 700,
            }}>
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
    <div style={{ fontSize: 10, display: "flex", flexDirection: "column", gap: 2 }}>
      {always > 0 && (
        <span style={{ color: C.purple }}>🌀 ×{always} always open</span>
      )}
      {disc > 0 && (
        <span style={{ color: C.red }}>⚡ ×{disc} disconnect</span>
      )}
      {open - always > 0 && (
        <span style={{ color: C.green }}>✓ ×{open - always} stays open</span>
      )}
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
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" as const }}>
      <style>{`
        @keyframes spin { from { transform-origin: center; transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Arena Floor Groups</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            Link up to 7 arenas as stacked floors. Rotation coupling controls whether linked arenas spin
            independently, together, in opposite directions, or via a gear ratio.
          </p>
        </div>
        <Link
          to="/admin/arena-floor-groups/new"
          style={{ ...btn(C.yellow), color: C.bg0, textDecoration: "none", fontSize: 13 }}
        >
          + New Floor Group
        </Link>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Groups",         value: groups.length,                                                               color: C.blue },
          { label: "Active",               value: groups.filter(g => g.status === "active").length,                           color: C.green },
          { label: "Rotation Coupled",     value: `${coupledLinks} / ${totalLinks} links`,                                    color: C.yellow },
          { label: "Disconnect on Misalign", value: `${disconnectable} link${disconnectable !== 1 ? "s" : ""}`,               color: C.red },
        ].map(s => (
          <div key={s.label} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 2, textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Coupling legend ── */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16,
        padding: "10px 14px", background: C.bg1, borderRadius: 10, border: `1px solid ${C.border}`,
        alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: C.faint, fontWeight: 600, marginRight: 4 }}>ROTATION COUPLING:</span>
        {Object.entries(COUPLING_META).map(([key, m]) => (
          <span key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
            <span style={{
              background: alpha(m.color, 0.12), border: `1px solid ${alpha(m.color, 0.3)}`,
              borderRadius: 20, padding: "1px 8px", color: m.color, fontWeight: 700,
            }}>{m.symbol} {m.label}</span>
            <span style={{ color: C.faint }}>{m.desc}</span>
            <span style={{ color: C.border, margin: "0 4px" }}>·</span>
          </span>
        ))}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: C.muted }}>Loading…</div>
      ) : groups.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64, background: C.bg1, borderRadius: 14, border: `1px dashed ${C.border}` }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏟️</div>
          <div style={{ color: C.text, fontWeight: 600, marginBottom: 6 }}>No floor groups yet</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
            Create your first group to start linking arenas as floors.
          </div>
          <Link to="/admin/arena-floor-groups/new" style={{ ...btn(C.blue), textDecoration: "none" }}>
            + New Floor Group
          </Link>
        </div>
      ) : (
        <div style={{ background: C.bg1, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Name / ID", "Floors", "Arena Stack", "Links", "Rotation Coupling", "Alignment Health", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: C.faint, fontWeight: 600, textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, i) => (
                <tr key={g.id} style={{ borderBottom: i < groups.length - 1 ? `1px solid ${C.border}` : "none" }}>

                  {/* Name */}
                  <td style={{ padding: "13px 14px" }}>
                    <div style={{ fontWeight: 600, color: C.text }}>{g.name ?? "Unnamed Group"}</div>
                    <div style={{ fontSize: 11, color: C.faint, marginTop: 2, fontFamily: "monospace" }}>{g.id}</div>
                  </td>

                  {/* Floor count pips */}
                  <td style={{ padding: "13px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {Array.from({ length: 7 }).map((_, idx) => (
                        <div
                          key={idx}
                          title={idx < (g.floorArenaIds?.length ?? 0) ? `F${idx}` : "empty"}
                          style={{
                            width: 10, height: 10, borderRadius: 2,
                            background: idx < (g.floorArenaIds?.length ?? 0) ? C.blue : C.bg3,
                            border: `1px solid ${idx < (g.floorArenaIds?.length ?? 0) ? C.blue : C.border}`,
                          }}
                        />
                      ))}
                      <span style={{ color: C.muted, fontSize: 11, marginLeft: 2 }}>
                        {g.floorArenaIds?.length ?? 0}/7
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: C.faint, marginTop: 3 }}>
                      {(g.floorArenaIds?.length ?? 0) > 1
                        ? `F0 (ground) → F${(g.floorArenaIds?.length ?? 1) - 1} (top)`
                        : "—"}
                    </div>
                  </td>

                  {/* Arena stack (first 3 floors with rotation chip) */}
                  <td style={{ padding: "13px 14px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {(g.floorArenaIds ?? []).slice(0, 3).map((id, fi) => (
                        <div key={id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10, color: C.faint, fontFamily: "monospace", minWidth: 14 }}>F{fi}</span>
                          <span style={{
                            fontSize: 11, color: C.text, background: C.bg2,
                            border: `1px solid ${C.border}`, borderRadius: 4,
                            padding: "1px 6px", maxWidth: 100,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {id}
                          </span>
                        </div>
                      ))}
                      {(g.floorArenaIds?.length ?? 0) > 3 && (
                        <span style={{ fontSize: 11, color: C.faint }}>
                          +{(g.floorArenaIds?.length ?? 0) - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Link types breakdown */}
                  <td style={{ padding: "13px 14px" }}>
                    <LinkTypePills links={g.links} />
                    <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>
                      {g.linkCount ?? 0} link{(g.linkCount ?? 0) !== 1 ? "s" : ""}
                    </div>
                  </td>

                  {/* Rotation coupling diagram */}
                  <td style={{ padding: "13px 14px" }}>
                    <CouplingModeCell links={g.links} />
                  </td>

                  {/* Alignment health */}
                  <td style={{ padding: "13px 14px" }}>
                    <AlignmentHealthBar links={g.links} />
                  </td>

                  {/* Status */}
                  <td style={{ padding: "13px 14px" }}>
                    <span style={pill(g.status === "active" ? C.green : C.faint)}>
                      {g.status ?? "draft"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "13px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link
                        to={`/admin/arena-floor-groups/${g.id}`}
                        style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                          cursor: "pointer", textDecoration: "none",
                          background: alpha(C.blue, 0.13), color: C.blue, border: `1px solid ${alpha(C.blue, 0.27)}`,
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(g)}
                        style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                          cursor: "pointer", background: alpha(C.red, 0.13), color: C.red,
                          border: `1px solid ${alpha(C.red, 0.27)}`,
                        }}
                      >
                        Delete
                      </button>
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Delete Floor Group?</h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 6 }}>
              <strong style={{ color: C.text }}>{confirmDelete.name}</strong> will be permanently deleted.
            </p>
            <p style={{ color: C.red, fontSize: 13, marginBottom: 8 }}>
              ⚡ {confirmDelete.links?.filter(l => l.alignment?.disconnectsWhenMisaligned).length ?? 0} disconnect-on-misalign
              link{(confirmDelete.links?.filter(l => l.alignment?.disconnectsWhenMisaligned).length ?? 0) !== 1 ? "s" : ""} will be lost.
            </p>
            <p style={{ color: C.faint, fontSize: 13, marginBottom: 24 }}>
              All {confirmDelete.floorArenaIds?.length ?? 0} floor slots and {confirmDelete.linkCount ?? 0} links
              will be removed. Arena docs themselves are not affected.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...btn(C.bg3), color: C.text }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ ...btn(C.red), color: "#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
