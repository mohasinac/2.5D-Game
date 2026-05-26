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
  "gears":        { hasContactPoints: true,  hasMaterialBands: true,  showInnerRadius: true  },
};

export function PartEditPage() {
  const { partType = "", id = "" } = useParams<{ partType: string; id: string }>();
  const collectionName = PART_TYPE_COLLECTION[partType];
  const label = PART_TYPE_LABEL[partType] ?? partType;
  const config = PART_TYPE_CONFIG[partType] ?? { hasContactPoints: true, hasMaterialBands: true, showInnerRadius: true };

  if (!collectionName) {
    return (
      <div className="p-8 text-theme-muted">
        Unknown part type: <code>{partType}</code>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="p-8 text-theme-muted">Missing part ID.</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border-c bg-bg1 shrink-0">
        <Link to="/admin/2d/parts" className="text-theme-muted text-[12px] no-underline">Part Search</Link>
        <span className="text-theme-faint">›</span>
        <Link to={`/admin/2d/parts/${partType}`} className="text-theme-muted text-[12px] no-underline">{label}s</Link>
        <span className="text-theme-faint">›</span>
        <span className="text-theme-text text-[12px]">Edit</span>
      </div>

      {/* Editor fills the remaining height */}
      <div className="flex-1 overflow-hidden">
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
