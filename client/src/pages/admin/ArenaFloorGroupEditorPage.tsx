import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, alpha } from "@/styles/theme";

const PILL_BASE = "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border";
import toast from "react-hot-toast";
import type { ArenaFloorGroup, ArenaLink, ArenaConfig, FloorStackPosition } from "@/types/arenaConfigNew";
import ArenaLinkEditorPanel from "@/components/admin/ArenaLinkEditorPanel";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

const MAX_FLOORS = 7;

// ─── Link & coupling metadata ─────────────────────────────────────────────────

const LINK_TYPE_META: Record<string, { icon: string; label: string; color: string; defaultAlignment: string; desc: string }> = {
  corridor:   { icon: "🚪", label: "Corridor",   color: C.blue,   defaultAlignment: "positional", desc: "Horizontal passage — severs when misaligned" },
  portal:     { icon: "🌀", label: "Portal",     color: C.purple, defaultAlignment: "none",       desc: "Instant warp — always open, ignores rotation" },
  ramp:       { icon: "📐", label: "Ramp",       color: C.yellow, defaultAlignment: "owner-only", desc: "Physical slope — owned by source arena, severs on misalign" },
  pit:        { icon: "⬇️",  label: "Pit",        color: C.red,    defaultAlignment: "positional", desc: "Gravity fall — stays open, bey can land anywhere" },
  trampoline: { icon: "⬆️",  label: "Trampoline", color: C.green,  defaultAlignment: "positional", desc: "Launch upward — auto-bounce from pit, player can cancel" },
};

const COUPLING_META: Record<string, { label: string; color: string; desc: string; arrows: [string, string] }> = {
  independent:  { label: "Independent",  color: C.faint,  desc: "Each arena rotates freely",                  arrows: ["↻", "↻"] },
  synchronized: { label: "Synchronized", color: C.green,  desc: "Both rotate same speed & direction",          arrows: ["↻", "↻"] },
  counter:      { label: "Counter",      color: C.yellow, desc: "Opposite directions, same speed",             arrows: ["↻", "↺"] },
  driven:       { label: "Driven",       color: C.blue,   desc: "Lower floor drives upper via gear ratio",     arrows: ["↻", "⚙"] },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloorSlot {
  arenaId: string;
  arenaName?: string;
  rotationSpeedDegPerSec?: number;
  rotationDirection?: "cw" | "ccw";
  rotationMode?: "none" | "auto" | "linked";
  /** Horizontal offset of this floor's center from the group world origin (cm). */
  xOffsetCm: number;
  yOffsetCm: number;
  /** Elevation above ground floor (cm). Ground floor = 0. */
  zOffsetCm: number;
}

interface FloorPairLink {
  lowerFloor: number;
  links: ArenaLink[];
}

// ─── Visual sub-components ────────────────────────────────────────────────────

/**
 * Rotation indicator: two concentric arcs showing direction (CW = arc on right, CCW = arc on left)
 * with a dot needle showing current rotation.
 */
function RotationDial({
  direction, speedDegPerSec, size = 32,
}: {
  direction?: "cw" | "ccw"; speedDegPerSec?: number; size?: number;
}) {
  const speed = speedDegPerSec ?? 0;
  const secPerRev = speed > 0 ? (360 / speed) : 0;
  const color = speed > 0 ? C.blue : C.faint;
  const cx = size / 2, cy = size / 2, r = size / 2 - 3;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={alpha(color, 0.2)} strokeWidth={2} />
        {/* Active arc — CW = right half, CCW = left half */}
        {speed > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke={color} strokeWidth={2.5}
            strokeDasharray={`${r * Math.PI} ${r * 2 * Math.PI}`}
            strokeDashoffset={direction === "ccw" ? 0 : r * Math.PI}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
          />
        )}
        {/* Direction arrow dot at 12 o'clock */}
        <circle cx={cx} cy={cy - r + 1} r={2.5} fill={color} />
        {/* CW / CCW label */}
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          fontSize={7} fontWeight="700" fill={color} fontFamily="monospace">
          {speed > 0 ? (direction === "cw" ? "CW" : "CCW") : "—"}
        </text>
      </svg>
      {speed > 0 && (
        <span className="text-[9px] text-theme-faint">{speed}°/s</span>
      )}
      {speed > 0 && secPerRev > 0 && (
        <span className="text-[9px] font-semibold hud-type-text" style={{ "--tc": color } as React.CSSProperties}>{secPerRev.toFixed(1)}s/rev</span>
      )}
    </div>
  );
}

/**
 * Coupling diagram between two floor circles.
 * Visualizes the rotational relationship arrows.
 */
function CouplingStrip({ link }: { link: ArenaLink }) {
  const coupling = link.rotationCoupling ?? "independent";
  const m = COUPLING_META[coupling] ?? COUPLING_META.independent;
  const alignMode = link.alignment?.mode ?? "positional";
  const meta = LINK_TYPE_META[link.linkType] ?? LINK_TYPE_META.corridor;

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-[7px] rounded-lg mb-1 relative link-row hud-type-border hud-type-bg border"
      style={{ "--tc": meta.color } as React.CSSProperties}
    >
      {/* Link type */}
      <span className="text-[15px]">{meta.icon}</span>
      <span className="text-[12px] font-semibold min-w-[64px] hud-type-text" style={{ "--tc": meta.color } as React.CSSProperties}>{meta.label}</span>

      {/* Coupling arrows diagram */}
      <div className="flex items-center gap-1">
        <span className="text-[14px] opacity-70 hud-type-text" style={{ "--tc": m.color } as React.CSSProperties}>{m.arrows[0]}</span>
        <div className="flex flex-col items-center gap-px">
          {coupling === "driven" && link.rotationDrivenRatio != null && (
            <span className="text-[9px] font-bold hud-type-text" style={{ "--tc": m.color } as React.CSSProperties}>×{link.rotationDrivenRatio.toFixed(1)}</span>
          )}
          <div
            className={`w-5 h-0.5 rounded-[1px] ${coupling === "independent" ? "hud-type-bg" : "hud-type-dot"}`}
            style={{ "--tc": m.color } as React.CSSProperties}
          />
        </div>
        <span className="text-[14px] opacity-70 hud-type-text" style={{ "--tc": m.color } as React.CSSProperties}>{m.arrows[1]}</span>
      </div>

      {/* Coupling pill */}
      <span
        className="text-[10px] px-[7px] py-px rounded-[20px] font-bold hud-type-bg hud-type-border hud-type-text border"
        style={{ "--tc": m.color } as React.CSSProperties}
      >{m.label}</span>

      {/* Alignment mode */}
      <span
        className={`text-[10px] px-[7px] py-px rounded-[20px] bg-bg3/80 border border-border-c ${alignMode === "none" ? "text-theme-purple" : alignMode === "owner-only" ? "text-theme-yellow" : "text-theme-blue"}`}
      >
        {alignMode === "none"
          ? "always open"
          : alignMode === "owner-only"
          ? `owner ±${link.alignment?.errorMarginDeg ?? 12}°`
          : `±${link.alignment?.errorMarginDeg ?? 10}°`}
      </span>

      {/* Disconnect badge */}
      {link.alignment?.disconnectsWhenMisaligned && (
        <span
          className="text-[10px] px-1.5 py-px rounded-[20px] bg-red-13 text-theme-red border border-red-30"
        >
          ⚡ severs
        </span>
      )}

      {/* Traversal ticks */}
      {link.traversal && (
        <span className="ml-auto text-[10px] text-theme-faint">
          {link.traversal.traversalTicks}t transit
        </span>
      )}

      {/* Edit / remove */}
      <div className="flex gap-[5px]">
        <button
          onClick={() => { /* set edit — handled by parent */ }}
          data-edit-link="true"
          className="px-2 py-[3px] rounded-[5px] text-[11px] cursor-pointer bg-blue-13 text-theme-blue border border-blue-30"
        >Edit</button>
      </div>
    </div>
  );
}

/**
 * Small inline floor → floor motion diagram showing traversal direction and type.
 */
function LinkMotionDiagram({ linkType, size = 80 }: { linkType: string; size?: number }) {
  const DIAGRAMS: Record<string, React.ReactElement> = {
    pit: (
      <svg width={size} height={32} className="block">
        {/* Falling bey path */}
        <circle cx={size/2} cy={6} r={5} fill={alpha(C.red, 0.3)} stroke={C.red} strokeWidth={1.5} />
        <path d={`M${size/2} 11 L${size/2} 26`} stroke={C.red} strokeWidth={1.5} strokeDasharray="3 2"
          markerEnd="url(#pit-arr)" />
        <defs><marker id="pit-arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.red} />
        </marker></defs>
        <text x={size/2+8} y={20} fontSize={9} fill={C.faint}>gravity fall</text>
      </svg>
    ),
    trampoline: (
      <svg width={size} height={32} className="block">
        {/* Rising bey path (bounce arc) */}
        <circle cx={size/2} cy={26} r={5} fill={alpha(C.green, 0.3)} stroke={C.green} strokeWidth={1.5} />
        <path d={`M${size/2-8} 26 Q${size/2} 10 ${size/2+8} 26`} fill="none" stroke={C.green} strokeWidth={1.5} strokeDasharray="3 2" />
        <path d={`M${size/2} 21 L${size/2} 6`} stroke={C.green} strokeWidth={1.5} markerEnd="url(#tramp-arr)" />
        <defs><marker id="tramp-arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.green} />
        </marker></defs>
        <text x={size/2+8} y={14} fontSize={9} fill={C.faint}>bounce up</text>
      </svg>
    ),
    ramp: (
      <svg width={size} height={32} className="block">
        {/* Angled ascent */}
        <circle cx={12} cy={26} r={4} fill={alpha(C.yellow, 0.3)} stroke={C.yellow} strokeWidth={1.5} />
        <path d={`M12 22 L${size-12} 6`} stroke={C.yellow} strokeWidth={2} markerEnd="url(#ramp-arr)" />
        <defs><marker id="ramp-arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.yellow} />
        </marker></defs>
        <text x={size/2-8} y={22} fontSize={9} fill={C.faint} transform={`rotate(-22,${size/2-8},22)`}>climb</text>
      </svg>
    ),
    portal: (
      <svg width={size} height={32} className="block">
        {/* Warp ring */}
        <ellipse cx={size/2} cy={16} rx={14} ry={8} fill={alpha(C.purple, 0.12)} stroke={C.purple} strokeWidth={1.5} strokeDasharray="4 2" />
        <circle cx={size/2} cy={16} r={3} fill={C.purple} />
        <text x={size/2} y={28} fontSize={8} textAnchor="middle" fill={C.faint}>instant warp</text>
      </svg>
    ),
    corridor: (
      <svg width={size} height={32} className="block">
        <circle cx={10} cy={16} r={4} fill={alpha(C.blue, 0.3)} stroke={C.blue} strokeWidth={1.5} />
        <path d={`M16 16 L${size-16} 16`} stroke={C.blue} strokeWidth={2} markerEnd="url(#corr-arr)" />
        <circle cx={size-10} cy={16} r={4} fill={alpha(C.blue, 0.15)} stroke={C.blue} strokeWidth={1} strokeDasharray="2 2" />
        <defs><marker id="corr-arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.blue} />
        </marker></defs>
        <text x={size/2} y={28} fontSize={8} textAnchor="middle" fill={C.faint}>horizontal pass</text>
      </svg>
    ),
  };

  return DIAGRAMS[linkType] ?? DIAGRAMS.corridor;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArenaFloorGroupEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("draft");
  const [minFloorHeightCm, setMinFloorHeightCm] = useState(60);
  const [floors, setFloors] = useState<FloorSlot[]>([{ arenaId: "", xOffsetCm: 0, yOffsetCm: 0, zOffsetCm: 0 }]);
  const [pairLinks, setPairLinks] = useState<FloorPairLink[]>([]);
  const [availableArenas, setAvailableArenas] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [editingLink, setEditingLink] = useState<{ pairIdx: number; linkIdx: number | null } | null>(null);
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);

  useEffect(() => {
    getDocs(collection(db, "arenas")).then(snap => {
      setAvailableArenas(snap.docs.map(d => ({ id: d.id, name: (d.data() as ArenaConfig).name ?? d.id })));
    });
  }, []);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.ARENA_FLOOR_GROUPS, id!));
        if (!snap.exists()) { toast.error("Group not found"); navigate("/admin/arena-floor-groups"); return; }
        const data = snap.data() as ArenaFloorGroup & { description?: string; status?: string; links?: ArenaLink[] };
        setName(data.name ?? "");
        setDescription(data.description ?? "");
        setStatus((data.status as "active" | "draft") ?? "draft");
        setMinFloorHeightCm(data.minFloorHeightCm ?? 60);
        setFloors((data.floorArenaIds ?? []).map((aid, fi) => {
          const pos = (data.floorPositions ?? []).find(p => p.floorIndex === fi);
          return {
            arenaId: aid,
            xOffsetCm: pos?.xOffsetCm ?? 0,
            yOffsetCm: pos?.yOffsetCm ?? 0,
            zOffsetCm: pos?.zOffsetCm ?? fi * (data.minFloorHeightCm ?? 60),
            rotationSpeedDegPerSec: pos?.rotationSpeedDegPerSec,
            rotationDirection: pos?.rotationDirection,
            rotationMode: pos?.rotationMode ?? "none",
          };
        }));
        const flat = data.links ?? [];
        const pairs: FloorPairLink[] = [];
        flat.forEach(link => {
          const fromIdx = (data.floorArenaIds ?? []).indexOf(link.fromArenaId);
          const toIdx   = (data.floorArenaIds ?? []).indexOf(link.toArenaId);
          const lower   = Math.min(fromIdx, toIdx);
          if (lower < 0) return;
          const existing = pairs.find(p => p.lowerFloor === lower);
          if (existing) existing.links.push(link);
          else pairs.push({ lowerFloor: lower, links: [link] });
        });
        setPairLinks(pairs);
      } catch { toast.error("Failed to load group"); }
      finally { setLoading(false); }
    })();
  }, [id, isNew, navigate]);

  function addFloor() {
    if (floors.length >= MAX_FLOORS) return;
    setFloors(f => [...f, {
      arenaId: "",
      xOffsetCm: 0,
      yOffsetCm: 0,
      zOffsetCm: f.length * minFloorHeightCm,
    }]);
  }

  function removeFloor(idx: number) {
    setFloors(f => f.filter((_, i) => i !== idx));
    setPairLinks(pl => pl
      .filter(p => p.lowerFloor !== idx && p.lowerFloor !== idx - 1)
      .map(p => ({ ...p, lowerFloor: p.lowerFloor > idx ? p.lowerFloor - 1 : p.lowerFloor }))
    );
  }

  function updateFloor(idx: number, patch: Partial<FloorSlot>) {
    setFloors(f => f.map((s, i) => i === idx ? { ...s, ...patch } : s));
  }

  function handleDragStart(idx: number) { setDragIdx(idx); }
  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); return; }
    const next = [...floors];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setFloors(next);
    setDragIdx(null);
  }

  function getPairLinks(lowerFloor: number) {
    return pairLinks.find(p => p.lowerFloor === lowerFloor)?.links ?? [];
  }

  function upsertLink(pairIdx: number, link: ArenaLink) {
    setPairLinks(pl => {
      const existing = pl.find(p => p.lowerFloor === pairIdx);
      if (existing) {
        const li = existing.links.findIndex(l => l.id === link.id);
        if (li >= 0) existing.links[li] = link; else existing.links.push(link);
        return [...pl];
      }
      return [...pl, { lowerFloor: pairIdx, links: [link] }];
    });
  }

  function removeLink(pairIdx: number, linkId: string) {
    setPairLinks(pl => pl.map(p =>
      p.lowerFloor === pairIdx ? { ...p, links: p.links.filter(l => l.id !== linkId) } : p
    ));
  }

  async function save() {
    if (!name.trim()) { toast.error("Name required"); return; }
    const filledFloors = floors.filter(f => f.arenaId.trim());
    if (filledFloors.length < 2) { toast.error("At least 2 floors required"); return; }
    setSaving(true);
    try {
      const docId = isNew ? crypto.randomUUID() : id!;
      const allLinks = pairLinks.flatMap(p => p.links);
      const floorPositions: FloorStackPosition[] = filledFloors.map((f, fi) => ({
        floorIndex: fi,
        xOffsetCm: f.xOffsetCm ?? 0,
        yOffsetCm: f.yOffsetCm ?? 0,
        zOffsetCm: f.zOffsetCm ?? fi * minFloorHeightCm,
        rotationSpeedDegPerSec: f.rotationSpeedDegPerSec,
        rotationDirection: f.rotationDirection,
        rotationMode: f.rotationMode,
      }));
      await setDoc(doc(db, COLLECTIONS.ARENA_FLOOR_GROUPS, docId), {
        name: name.trim(),
        description: description.trim(),
        status,
        floorArenaIds: filledFloors.map(f => f.arenaId),
        floorPositions,
        minFloorHeightCm,
        links: allLinks,
        linkCount: allLinks.length,
        updatedAt: new Date().toISOString(),
      });
      toast.success(isNew ? "Floor group created" : "Saved");
      if (isNew) navigate(`/admin/arena-floor-groups/${docId}`);
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="p-12 text-center text-theme-muted">Loading…</div>;

  const filledCount = floors.filter(f => f.arenaId.trim()).length;

  return (
    <div className="p-6 w-full box-border">
      <style>{`
        .floor-slot { transition: opacity 0.15s, transform 0.15s; }
        .floor-slot:hover .slot-drag-handle { opacity: 1 !important; }
        .link-row:hover { background: ${alpha(C.blue, 0.07)} !important; }
        @keyframes rotCW  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes rotCCW { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
      `}</style>

      {/* ── Header ── */}
      <Link to="/admin/arena-floor-groups" className="text-theme-faint text-[13px] no-underline">← Floor Groups</Link>
      <div className="flex items-center gap-3 mt-2 mb-6">
        <h1 className="text-[22px] font-bold text-theme-text m-0">
          {isNew ? "New Floor Group" : name || "Floor Group"}
        </h1>
        <span className={`${PILL_BASE} ${status === "active" ? "bg-green/[.13] text-green border-green/[.27]" : "bg-faint/[.13] text-faint border-faint/[.27]"}`}>{status}</span>
        <div className="ml-auto flex gap-2.5">
          <button
            onClick={() => setStatus(s => s === "active" ? "draft" : "active")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${status === "active" ? "bg-bg3 text-text border border-border" : "bg-green text-white"}`}
          >
            {status === "active" ? "Set Draft" : "Set Active"}
          </button>
          <button onClick={save} disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 items-start grid-cols-[1fr_310px]">

        {/* ── Left: Visual floor stack ── */}
        <div>
          {/* Floor count bar */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="text-[12px] text-theme-muted">{filledCount}/{MAX_FLOORS} floors configured</div>
            <div className="flex gap-1">
              {Array.from({ length: MAX_FLOORS }).map((_, i) => (
                <div key={i} title={i < filledCount ? `F${i}` : "empty"} className={`w-2 h-2 rounded-[2px] ${i < filledCount ? "bg-theme-blue" : "bg-bg3"}`} />
              ))}
            </div>
            {floors.length < MAX_FLOORS && (
              <button onClick={addFloor} className="px-2.5 py-1 rounded-md text-xs text-text bg-bg3 border border-border hover:bg-bg2">
                + Add Floor
              </button>
            )}
          </div>

          {/* Floor slots — rendered top → bottom (highest index = top visually) */}
          {[...floors].reverse().map((slot, revIdx) => {
            const idx = floors.length - 1 - revIdx;
            const linksBelow = getPairLinks(idx - 1);
            const isExpanded = expandedFloor === idx;

            return (
              <div key={idx}>
                {/* ── Floor slot ── */}
                <div
                  className={`floor-slot rounded-xl p-[12px_14px] ${dragIdx === idx ? "bg-blue-15 border border-theme-blue" : "bg-bg1 border border-border-c"}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                >
                  <div className="grid gap-2.5 items-center grid-cols-[28px_1fr_auto_auto_auto]">
                    {/* Floor badge */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold bg-blue-15 border border-blue-30 text-theme-blue">
                      F{idx}
                    </div>

                    {/* Arena picker */}
                    <div>
                      <SearchableSelect
                        value={slot.arenaId}
                        options={availableArenas.map(a => ({ value: a.id, label: a.name }))}
                        onChange={v => updateFloor(idx, { arenaId: v })}
                        emptyLabel="— Select arena —"
                        className="w-full"
                      />
                      {slot.arenaId && (
                        <div className="text-[10px] text-theme-faint mt-0.5 font-mono">{slot.arenaId}</div>
                      )}
                    </div>

                    {/* Rotation dial */}
                    <RotationDial
                      direction={slot.rotationDirection}
                      speedDegPerSec={slot.rotationSpeedDegPerSec}
                      size={32}
                    />

                    {/* Expand rotation settings */}
                    <button
                      onClick={() => setExpandedFloor(isExpanded ? null : idx)}
                      className={`px-2 py-1 rounded-md text-[11px] cursor-pointer border ${isExpanded ? "bg-blue-15 text-theme-blue border-theme-blue" : "bg-bg3 text-theme-faint border-border-c"}`}
                    >
                      ↻ rot
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => removeFloor(idx)}
                      disabled={floors.length <= 1}
                      className={`w-[26px] h-[26px] rounded-md text-[14px] cursor-pointer bg-red-13 text-theme-red border border-red-30 ${floors.length <= 1 ? "opacity-30" : ""}`}
                    >
                      ×
                    </button>
                  </div>

                  {/* ── Expanded controls: rotation + position ── */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-border-c flex flex-col gap-3">

                      {/* Rotation row */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {/* Mode */}
                        <div>
                          <label className="text-[11px] text-theme-faint block mb-1">ROTATION MODE</label>
                          <SearchableSelect
                            value={slot.rotationMode ?? "none"}
                            options={[{ value: "none", label: "None (static)" }, { value: "auto", label: "Auto (constant)" }, { value: "linked", label: "Linked (coupling)" }]}
                            onChange={v => updateFloor(idx, { rotationMode: v as FloorSlot["rotationMode"] })}
                            className="w-full"
                          />
                        </div>

                        {/* Speed */}
                        <div>
                          <label className="text-[11px] text-theme-faint block mb-1">
                            SPEED (°/s) &nbsp;
                            <span className="text-theme-muted">
                              {slot.rotationSpeedDegPerSec
                                ? `${(360 / slot.rotationSpeedDegPerSec).toFixed(1)}s/rev`
                                : "—"}
                            </span>
                          </label>
                          <input
                            type="number" min={0} max={360} step={5}
                            value={slot.rotationSpeedDegPerSec ?? 0}
                            onChange={e => updateFloor(idx, { rotationSpeedDegPerSec: +e.target.value })}
                            className="w-full bg-bg3 border border-border-c rounded-md px-2 py-[5px] text-theme-text text-[12px] box-border"
                          />
                        </div>

                        {/* Direction */}
                        <div>
                          <label className="text-[11px] text-theme-faint block mb-1">DIRECTION</label>
                          <div className="flex gap-1.5">
                            {(["cw", "ccw"] as const).map(dir => (
                              <button key={dir} onClick={() => updateFloor(idx, { rotationDirection: dir })}
                                className={`flex-1 py-[5px] rounded-md text-[13px] cursor-pointer border ${slot.rotationDirection === dir ? "bg-blue-15 border-theme-blue text-theme-blue" : "bg-bg3 border-border-c text-theme-muted"}`}>
                                {dir === "cw" ? "↻ CW" : "↺ CCW"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Position row */}
                      <div className="pt-2 border-t border-border-c">
                        <label className="text-[11px] text-theme-faint block mb-1.5">
                          FLOOR POSITION &nbsp;
                          <span className="text-theme-muted font-normal">offsets from group world origin (cm)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {([
                            { key: "xOffsetCm", label: "X offset", hint: "← / →" },
                            { key: "yOffsetCm", label: "Y offset", hint: "↑ / ↓" },
                            { key: "zOffsetCm", label: "Elevation", hint: "height" },
                          ] as { key: keyof FloorSlot; label: string; hint: string }[]).map(({ key, label, hint }) => (
                            <div key={key as string}>
                              <label className="text-[11px] text-theme-faint block mb-1">
                                {label} <span className="text-theme-muted font-normal">({hint})</span>
                              </label>
                              <input
                                type="number" step={1}
                                value={(slot[key] as number) ?? 0}
                                onChange={e => updateFloor(idx, { [key]: +e.target.value })}
                                className="w-full bg-bg3 border border-border-c rounded-md px-2 py-[5px] text-theme-text text-[12px] box-border"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-theme-faint mt-1">
                          Non-zero X/Y offsets misalign floors so beys can knock each other off edges when crossing.
                          Elevation sets the floor height for camera and collision math.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Links between this floor and the one below ── */}
                {idx > 0 && (
                  <div className="my-1.5 ml-10 relative">
                    {/* Vertical connector line */}
                    <div
                      className={`absolute rounded-[1px] inset-y-0 -left-[26px] w-0.5 ${linksBelow.length > 0 ? "bg-blue-20" : "bg-border-c/50"}`}
                    />

                    {/* Existing links */}
                    {linksBelow.map((link, li) => {
                      const meta = LINK_TYPE_META[link.linkType] ?? LINK_TYPE_META.corridor;
                      const coupling = link.rotationCoupling ?? "independent";
                      const couplingMeta = COUPLING_META[coupling];

                      return (
                        <div key={link.id} className="mb-1.5">
                          {/* Link dot on connector */}
                          <div
                            className="absolute w-3 h-3 rounded-full mt-2 border-2 border-bg1 -left-[31px] hud-type-dot"
                            style={{ "--tc": meta.color } as React.CSSProperties}
                          />

                          {/* Motion diagram + link row */}
                          <div className="flex gap-2 items-center mb-1">
                            <LinkMotionDiagram linkType={link.linkType} size={80} />
                            <div className="flex-1">
                              <div
                                className="flex items-center gap-1.5 px-2 py-[5px] rounded-lg link-row hud-type-border hud-type-bg border"
                                style={{ "--tc": meta.color } as React.CSSProperties}
                              >
                                <span className="text-[14px]">{meta.icon}</span>
                                <span className="text-[12px] font-semibold hud-type-text" style={{ "--tc": meta.color } as React.CSSProperties}>{meta.label}</span>
                                {/* Coupling arrows */}
                                <span className="text-[12px] opacity-80 hud-type-text" style={{ "--tc": couplingMeta.color } as React.CSSProperties}>
                                  {couplingMeta.arrows[0]}
                                  {coupling === "driven" && link.rotationDrivenRatio != null
                                    ? <span className="text-[9px] hud-type-text" style={{ "--tc": couplingMeta.color } as React.CSSProperties}>×{link.rotationDrivenRatio.toFixed(1)}</span>
                                    : null}
                                  →{couplingMeta.arrows[1]}
                                </span>
                                <span
                                  className="text-[10px] px-1.5 py-px rounded-[10px] hud-type-bg hud-type-border hud-type-text border"
                                  style={{ "--tc": couplingMeta.color } as React.CSSProperties}
                                >
                                  {couplingMeta.label}
                                </span>
                                <span className={`text-[10px] ${link.alignment?.mode === "none" ? "text-theme-purple" : link.alignment?.mode === "owner-only" ? "text-theme-yellow" : "text-theme-blue"}`}>
                                  {link.alignment?.mode === "none"
                                    ? "always open"
                                    : `±${link.alignment?.errorMarginDeg ?? 10}°`}
                                </span>
                                {link.alignment?.disconnectsWhenMisaligned && (
                                  <span className="text-[10px] text-theme-red">⚡ severs</span>
                                )}
                                {link.traversal && (
                                  <span className="ml-auto text-[10px] text-theme-faint">
                                    {link.traversal.traversalTicks}t
                                  </span>
                                )}
                                <button
                                  onClick={() => setEditingLink({ pairIdx: idx - 1, linkIdx: li })}
                                  className="px-[7px] py-[2px] rounded cursor-pointer text-[10px] bg-blue-13 text-theme-blue border border-blue-30"
                                >Edit</button>
                                <button
                                  onClick={() => removeLink(idx - 1, link.id)}
                                  className="px-[7px] py-[2px] rounded cursor-pointer text-[10px] bg-red-13 text-theme-red border border-red-30"
                                >✕</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add link button */}
                    <button
                      onClick={() => setEditingLink({ pairIdx: idx - 1, linkIdx: null })}
                      disabled={!floors[idx]?.arenaId || !floors[idx - 1]?.arenaId}
                      className={`flex items-center gap-1.5 px-3 py-[5px] rounded-lg text-[12px] font-medium cursor-pointer w-full justify-center bg-transparent border border-dashed border-border-c text-theme-muted ${(!floors[idx]?.arenaId || !floors[idx - 1]?.arenaId) ? "opacity-40" : ""}`}
                    >
                      + Add link between F{idx - 1} and F{idx}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Ground floor label */}
          <div className="text-center mt-2 text-[11px] text-theme-faint">
            ▼ Ground Floor (F0)
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="flex flex-col gap-3.5">

          {/* Group settings */}
          <div className="bg-bg1 rounded-xl border border-border-c p-4">
            <p className="text-[11px] text-theme-faint font-semibold uppercase mb-3">Group Settings</p>
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-[12px] text-theme-muted block mb-1">Name</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sky Temple"
                  className="w-full bg-bg3 border border-border-c rounded-lg px-2.5 py-1.5 text-theme-text text-[13px] box-border"
                />
              </div>
              <div>
                <label className="text-[12px] text-theme-muted block mb-1">Description</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)}
                  rows={2} placeholder="Optional description…"
                  className="w-full bg-bg3 border border-border-c rounded-lg px-2.5 py-1.5 text-theme-text text-[13px] resize-y box-border"
                />
              </div>
              <div>
                <label className="text-[12px] text-theme-muted block mb-1">
                  Min Floor Height (cm)
                </label>
                <input
                  type="number" min={20} max={500} step={5}
                  value={minFloorHeightCm}
                  onChange={e => setMinFloorHeightCm(+e.target.value)}
                  className="w-full bg-bg3 border border-border-c rounded-lg px-2.5 py-1.5 text-theme-text text-[13px] box-border"
                />
                <p className="text-[10px] text-theme-faint mt-1 leading-[1.4]">
                  Vertical clearance between floors. Governs camera zoom headroom and whether the floor above occludes the view.
                  Default: 60 cm.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-bg1 rounded-xl border border-border-c p-4">
            <p className="text-[11px] text-theme-faint font-semibold uppercase mb-3">Summary</p>
            <div className="flex flex-col gap-2 text-[13px]">
              <Row label="Floors" value={`${filledCount} / ${MAX_FLOORS}`} color={C.blue} />
              <Row label="Total Links" value={pairLinks.reduce((s, p) => s + p.links.length, 0)} />
              {Object.entries(LINK_TYPE_META).map(([type, meta]) => {
                const count = pairLinks.reduce((s, p) => s + p.links.filter(l => l.linkType === type).length, 0);
                return count ? <Row key={type} label={`${meta.icon} ${meta.label}`} value={count} color={meta.color} /> : null;
              })}
            </div>
          </div>

          {/* Rotation coupling visual legend */}
          <div className="bg-bg1 rounded-xl border border-border-c p-4">
            <p className="text-[11px] text-theme-faint font-semibold uppercase mb-3">Rotation Coupling</p>
            <p className="text-[11px] text-theme-muted mb-2.5 leading-[1.5]">
              Controls how each linked arena pair rotates relative to each other.
              Affects ramp/corridor alignment timing and difficulty.
            </p>
            {Object.entries(COUPLING_META).map(([key, m]) => (
              <div key={key} className="flex gap-2 items-center mb-2">
                <span className="text-[14px] min-w-[32px]">{m.arrows[0]}{m.arrows[1]}</span>
                <span
                  className="text-[10px] px-[7px] py-px rounded-[10px] font-bold min-w-[64px] text-center hud-type-bg hud-type-border hud-type-text border"
                  style={{ "--tc": m.color } as React.CSSProperties}
                >{m.label}</span>
                <span className="text-[11px] text-theme-muted leading-[1.4]">{m.desc}</span>
              </div>
            ))}
          </div>

          {/* Alignment defaults per link type */}
          <div className="bg-bg1 rounded-xl border border-border-c p-4">
            <p className="text-[11px] text-theme-faint font-semibold uppercase mb-2.5">Alignment Behavior</p>
            <p className="text-[11px] text-theme-muted mb-2.5 leading-[1.5]">
              When two arenas rotate, openings must line up for beys to traverse.
              Different link types have different tolerances.
            </p>
            {Object.entries(LINK_TYPE_META).map(([type, meta]) => (
              <div key={type} className="flex gap-2 mb-2 items-start">
                <span className="text-[14px] min-w-[20px]">{meta.icon}</span>
                <div>
                  <span className="text-[12px] text-theme-text font-semibold">{meta.label}: </span>
                  <span className="text-[11px] text-theme-muted">{meta.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Link editor modal ── */}
      {editingLink && (
        <ArenaLinkEditorPanel
          fromArenaId={floors[editingLink.pairIdx]?.arenaId ?? ""}
          toArenaId={floors[editingLink.pairIdx + 1]?.arenaId ?? ""}
          existing={
            editingLink.linkIdx !== null
              ? pairLinks.find(p => p.lowerFloor === editingLink.pairIdx)?.links[editingLink.linkIdx!]
              : undefined
          }
          onSave={link => { upsertLink(editingLink.pairIdx, link); setEditingLink(null); }}
          onClose={() => setEditingLink(null)}
        />
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-theme-muted">{label}</span>
      <span className={`font-semibold ${!color ? "text-theme-text" : ""}`} style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}
