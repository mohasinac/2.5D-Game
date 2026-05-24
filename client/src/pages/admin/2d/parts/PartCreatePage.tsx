import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";

const PART_TYPE_COLLECTION: Record<string, string> = {
  "bit-beasts":   COLLECTIONS.BIT_BEAST_PARTS,
  "attack-rings": COLLECTIONS.ATTACK_RING_PARTS,
  "weight-disks": COLLECTIONS.WEIGHT_DISK_PARTS,
  "sub-parts":    COLLECTIONS.SUB_PARTS,
  "tips":         COLLECTIONS.TIP_PARTS,
  "cores":        COLLECTIONS.CORE_PARTS,
  "casings":      COLLECTIONS.CASING_PARTS,
  "spin-tracks":  COLLECTIONS.SPIN_TRACK_PARTS,
  "gears":        COLLECTIONS.GEAR_PARTS,
};

const PART_TYPE_LABEL: Record<string, string> = {
  "bit-beasts":   "Bit Beast",
  "attack-rings": "Attack Ring",
  "weight-disks": "Weight Disk",
  "sub-parts":    "Sub-Part",
  "tips":         "Tip",
  "cores":        "Core",
  "casings":      "Casing",
  "spin-tracks":  "Spin Track",
  "gears":        "Gear",
};

export function PartCreatePage() {
  const { partType = "" } = useParams<{ partType: string }>();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [color, setColor] = useState("#1a1a1a");
  const [saving, setSaving] = useState(false);

  const collectionName = PART_TYPE_COLLECTION[partType];
  const label = PART_TYPE_LABEL[partType] ?? partType;

  if (!collectionName) {
    return <div style={{ padding: 32, color: C.muted }}>Unknown part type: <code>{partType}</code></div>;
  }

  const handleCreate = async () => {
    if (!displayName.trim()) { toast.error("Display name required"); return; }
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, collectionName), {
        displayName: displayName.trim(),
        color,
        geometry: { type: "preset", preset: "circle" },
        dimensions: { height: 30, outerRadius: 35, innerRadius: 5 },
        compatibilityTags: [],
        requiredCompatibility: [],
        excludedCompatibility: [],
        images: {},
        pockets: [],
        configurations: [],
        contactPoints: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success(`${label} created`);
      navigate(`/admin/2d/parts/${partType}/edit/${ref.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create part");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Link to="/admin/2d/parts" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>Part Search</Link>
          <span style={{ color: C.faint }}>›</span>
          <Link to={`/admin/2d/parts/${partType}`} style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>
            {label}s
          </Link>
          <span style={{ color: C.faint }}>›</span>
          <span style={{ color: C.text, fontSize: 12 }}>New</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>New {label}</h1>
      </div>

      <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Display Name *</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={`e.g. Tiger Defenser (${label})`}
            style={{
              width: "100%", padding: "9px 12px", background: C.bg2,
              border: `1px solid ${C.border}`, borderRadius: 7, color: C.text,
              fontSize: 13, boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Color</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: 40, height: 32, border: "none", cursor: "pointer", borderRadius: 5 }}
            />
            <span style={{ fontSize: 13, color: C.muted }}>{color}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              flex: 1, padding: "10px 0", background: saving ? C.bg3 : C.blue,
              color: "#fff", border: "none", borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Creating…" : `Create ${label}`}
          </button>
          <button
            onClick={() => navigate(`/admin/2d/parts/${partType}`)}
            style={{
              padding: "10px 18px", background: C.bg2, color: C.muted,
              border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
