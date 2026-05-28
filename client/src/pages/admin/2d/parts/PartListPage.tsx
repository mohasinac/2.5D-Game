import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  collection, query, orderBy, getDocs, deleteDoc, doc,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageOpen } from "lucide-react";

const PART_TYPE_META: Record<string, { label: string; icon: string; desc: string; collection: string }> = {
  "bit-beasts":    { label: "Bit Beasts",    icon: "🐉", desc: "Special move identity pieces.", collection: COLLECTIONS.BIT_BEAST_PARTS },
  "attack-rings":  { label: "Attack Rings",  icon: "⚔️", desc: "Blade contact geometry — attack patterns and CP layout.", collection: COLLECTIONS.ATTACK_RING_PARTS },
  "weight-disks":  { label: "Weight Disks",  icon: "🪨", desc: "Spin inertia, mass distribution, and stability.", collection: COLLECTIONS.WEIGHT_DISK_PARTS },
  "sub-parts":     { label: "Sub-Parts",     icon: "🔩", desc: "Free-spin, partial-slip, ratchet, and switch mechanisms.", collection: COLLECTIONS.SUB_PARTS },
  "tips":          { label: "Tips",          icon: "🔺", desc: "Movement pattern, floor contact shape, and grip factor.", collection: COLLECTIONS.TIP_PARTS },
  "cores":         { label: "Cores",         icon: "⚙️", desc: "Engine gear, clutch release, spin injection gimmicks.", collection: COLLECTIONS.CORE_PARTS },
  "casings":       { label: "Casings",       icon: "🛡️", desc: "Body shell, tip slot, and core slot housing.", collection: COLLECTIONS.CASING_PARTS },
  "spin-tracks":   { label: "Spin Tracks",   icon: "📏", desc: "Height piece between tip and fusion wheel.", collection: COLLECTIONS.SPIN_TRACK_PARTS },
  "gears":         { label: "Gears",         icon: "⚙️", desc: "Swappable gear attachments that shift beyblade archetype (attack/defense/stamina/balance).", collection: COLLECTIONS.GEAR_PARTS },
};

interface PartRow {
  id: string;
  displayName: string;
  color?: string;
  description?: string;
  updatedAt?: unknown;
}

export function PartListPage() {
  const { partType = "" } = useParams<{ partType: string }>();
  const navigate = useNavigate();
  const meta = PART_TYPE_META[partType];

  const [parts, setParts] = useState<PartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!meta) return;
    setLoading(true);
    const q = query(collection(db, meta.collection), orderBy("displayName"));
    getDocs(q)
      .then((snap) => {
        setParts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PartRow)));
      })
      .catch(() => toast.error("Failed to load parts"))
      .finally(() => setLoading(false));
  }, [meta]);

  if (!meta) {
    return (
      <div className="p-8 text-theme-muted">
        Unknown part type: <code>{partType}</code>
      </div>
    );
  }

  const filtered = parts.filter((p) =>
    p.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, meta.collection, id));
      setParts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Deleted "${name}"`);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full box-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Link to="/admin/2d/parts" className="text-theme-muted text-[12px] no-underline">
              Part Search
            </Link>
            <span className="text-theme-faint">›</span>
            <span className="text-theme-text text-[12px]">{meta.label}</span>
          </div>
          <h1 className="text-[22px] font-bold text-theme-text m-0">
            {meta.icon} {meta.label}
          </h1>
          <p className="text-theme-muted text-[13px] mt-1">{meta.desc}</p>
        </div>
        <Link
          to={`/admin/2d/parts/${partType}/create`}
          className="px-[18px] py-[9px] bg-theme-blue text-white rounded-lg no-underline text-[13px] font-semibold whitespace-nowrap"
        >
          + New {meta.label.slice(0, -1)}
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${meta.label.toLowerCase()}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-bg1 border border-border-c rounded-lg text-theme-text text-[13px] outline-none box-border"
        />
      </div>

      {/* Count */}
      <div className="text-[12px] text-theme-faint mb-3">
        {loading ? "Loading…" : `${filtered.length} of ${parts.length} parts`}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-theme-muted py-8 text-center">Loading parts…</div>
      ) : filtered.length === 0 ? (
        search ? (
          <EmptyState
            icon={<PackageOpen size={40} />}
            title={`No results for "${search}"`}
            action={
              <button
                onClick={() => setSearch("")}
                className="bg-transparent border-none text-theme-blue cursor-pointer text-[13px]"
              >
                Clear search
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<PackageOpen size={40} />}
            title={`No ${meta.label.toLowerCase()} yet`}
            description={`Create your first ${meta.label.slice(0, -1).toLowerCase()} to start building beyblade systems.`}
            action={
              <Link
                to={`/admin/2d/parts/${partType}/create`}
                className="inline-block px-4 py-2 bg-theme-blue/[.13] text-theme-blue rounded-[7px] no-underline text-[13px] border border-theme-blue/[.27]"
              >
                Create first {meta.label.slice(0, -1).toLowerCase()} →
              </Link>
            }
          />
        )
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((part) => (
            <div
              key={part.id}
              className="flex items-center gap-3.5 bg-bg1 border border-border-c rounded-[10px] px-4 py-3"
            >
              {/* Color swatch */}
              <div
                className="w-7 h-7 rounded-[6px] shrink-0 border border-border-c [background:var(--swatch-color)]"
                style={{ "--swatch-color": part.color ?? "#1a1a1a" } as React.CSSProperties}
              />

              {/* Name + description */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-theme-text text-[14px] mb-0.5">
                  {part.displayName}
                </div>
                {part.description && (
                  <div className="text-[12px] text-theme-muted overflow-hidden text-ellipsis whitespace-nowrap">
                    {part.description}
                  </div>
                )}
                <div className="text-[11px] text-theme-faint mt-0.5 font-mono">
                  {part.id}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/admin/2d/parts/${partType}/edit/${part.id}`)}
                  className="px-3.5 py-1.5 bg-theme-blue/[.13] text-theme-blue border border-theme-blue/[.27] rounded-[7px] text-[12px] cursor-pointer font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(part.id, part.displayName)}
                  disabled={deleting === part.id}
                  className={`px-3.5 py-1.5 rounded-[7px] text-[12px] border ${
                    deleting === part.id
                      ? "bg-bg1 text-theme-faint border-border-c cursor-default"
                      : "bg-theme-red/[.13] text-theme-red border-theme-red/[.27] cursor-pointer"
                  }`}
                >
                  {deleting === part.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
