import { useParams, Link } from "react-router-dom";
import { COLLECTIONS } from "@/lib/firebase";
import { C } from "@/styles/theme";
import { PartEditor } from "@/components/admin/part-editor/PartEditor";
import { makeTypeFieldRenderer } from "@/components/admin/part-editor/PartTypeFields";

const PART_TYPE_COLLECTION: Record<string, string> = {
  "bit-beasts":   COLLECTIONS.BIT_BEAST_PARTS,
  "attack-rings": COLLECTIONS.ATTACK_RING_PARTS,
  "weight-disks": COLLECTIONS.WEIGHT_DISK_PARTS,
  "sub-parts":    COLLECTIONS.SUB_PARTS,
  "tips":         COLLECTIONS.TIP_PARTS,
  "cores":        COLLECTIONS.CORE_PARTS,
  "casings":      COLLECTIONS.CASING_PARTS,
  "spin-tracks":  COLLECTIONS.SPIN_TRACK_PARTS,
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
};

// Per-type config: some part types don't use contact points or material bands
const PART_TYPE_CONFIG: Record<string, { hasContactPoints: boolean; hasMaterialBands: boolean; showInnerRadius: boolean }> = {
  "bit-beasts":   { hasContactPoints: false, hasMaterialBands: true,  showInnerRadius: false },
  "attack-rings": { hasContactPoints: true,  hasMaterialBands: true,  showInnerRadius: true  },
  "weight-disks": { hasContactPoints: true,  hasMaterialBands: true,  showInnerRadius: true  },
  "sub-parts":    { hasContactPoints: true,  hasMaterialBands: true,  showInnerRadius: true  },
  "tips":         { hasContactPoints: true,  hasMaterialBands: false, showInnerRadius: false },
  "cores":        { hasContactPoints: false, hasMaterialBands: false, showInnerRadius: false },
  "casings":      { hasContactPoints: true,  hasMaterialBands: true,  showInnerRadius: true  },
  "spin-tracks":  { hasContactPoints: true,  hasMaterialBands: true,  showInnerRadius: true  },
};

export function PartEditPage() {
  const { partType = "", id = "" } = useParams<{ partType: string; id: string }>();
  const collectionName = PART_TYPE_COLLECTION[partType];
  const label = PART_TYPE_LABEL[partType] ?? partType;
  const config = PART_TYPE_CONFIG[partType] ?? { hasContactPoints: true, hasMaterialBands: true, showInnerRadius: true };

  if (!collectionName) {
    return (
      <div style={{ padding: 32, color: C.muted }}>
        Unknown part type: <code>{partType}</code>
      </div>
    );
  }

  if (!id) {
    return (
      <div style={{ padding: 32, color: C.muted }}>Missing part ID.</div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0 }}>
        <Link to="/admin/2d/parts" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>Part Search</Link>
        <span style={{ color: C.faint }}>›</span>
        <Link to={`/admin/2d/parts/${partType}`} style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>{label}s</Link>
        <span style={{ color: C.faint }}>›</span>
        <span style={{ color: C.text, fontSize: 12 }}>Edit</span>
      </div>

      {/* Editor fills the remaining height */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <PartEditor
          collectionName={collectionName}
          partId={id}
          partTypeSlug={partType}
          hasContactPoints={config.hasContactPoints}
          hasMaterialBands={config.hasMaterialBands}
          showInnerRadius={config.showInnerRadius}
          renderTypeFields={makeTypeFieldRenderer(partType)}
        />
      </div>
    </div>
  );
}
