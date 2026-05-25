import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  collection, query, orderBy, getDocs, deleteDoc, doc,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C, alpha } from "@/styles/theme";
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
      <div style={{ padding: 32, color: C.muted }}>
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
    <div style={{ padding: 32, width: "100%", boxSizing: "border-box" as const }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Link to="/admin/2d/parts" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
              Part Search
            </Link>
            <span style={{ color: C.faint }}>›</span>
            <span style={{ color: C.text, fontSize: 12 }}>{meta.label}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
            {meta.icon} {meta.label}
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{meta.desc}</p>
        </div>
        <Link
          to={`/admin/2d/parts/${partType}/create`}
          style={{
            padding: "9px 18px", background: C.blue, color: "#fff",
            borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          + New {meta.label.slice(0, -1)}
        </Link>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder={`Search ${meta.label.toLowerCase()}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px", background: C.bg1, border: `1px solid ${C.border}`,
            borderRadius: 8, color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* Count */}
      <div style={{ fontSize: 12, color: C.faint, marginBottom: 12 }}>
        {loading ? "Loading…" : `${filtered.length} of ${parts.length} parts`}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: C.muted, padding: 32, textAlign: "center" }}>Loading parts…</div>
      ) : filtered.length === 0 ? (
        search ? (
          <EmptyState
            icon={<PackageOpen size={40} />}
            title={`No results for "${search}"`}
            action={
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", color: C.blue, cursor: "pointer", fontSize: 13 }}
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
                style={{
                  display: "inline-block", padding: "8px 16px",
                  background: alpha(C.blue, 0.13), color: C.blue, borderRadius: 7,
                  textDecoration: "none", fontSize: 13, border: `1px solid ${alpha(C.blue, 0.27)}`,
                }}
              >
                Create first {meta.label.slice(0, -1).toLowerCase()} →
              </Link>
            }
          />
        )
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((part) => (
            <div
              key={part.id}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: C.bg1, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "12px 16px",
              }}
            >
              {/* Color swatch */}
              <div
                style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: part.color ?? "#1a1a1a",
                  border: `1px solid ${C.border}`,
                }}
              />

              {/* Name + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: C.text, fontSize: 14, marginBottom: 2 }}>
                  {part.displayName}
                </div>
                {part.description && (
                  <div style={{
                    fontSize: 12, color: C.muted,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {part.description}
                  </div>
                )}
                <div style={{ fontSize: 11, color: C.faint, marginTop: 2, fontFamily: "monospace" }}>
                  {part.id}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => navigate(`/admin/2d/parts/${partType}/edit/${part.id}`)}
                  style={{
                    padding: "6px 14px", background: alpha(C.blue, 0.13), color: C.blue,
                    border: `1px solid ${alpha(C.blue, 0.27)}`, borderRadius: 7,
                    fontSize: 12, cursor: "pointer", fontWeight: 600,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(part.id, part.displayName)}
                  disabled={deleting === part.id}
                  style={{
                    padding: "6px 14px",
                    background: deleting === part.id ? C.bg1 : alpha(C.red, 0.13),
                    color: deleting === part.id ? C.faint : C.red,
                    border: `1px solid ${deleting === part.id ? C.border : alpha(C.red, 0.27)}`,
                    borderRadius: 7, fontSize: 12, cursor: deleting === part.id ? "default" : "pointer",
                  }}
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
