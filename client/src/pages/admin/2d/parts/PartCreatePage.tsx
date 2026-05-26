import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";

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
    return <div className="p-8 text-theme-muted">Unknown part type: <code>{partType}</code></div>;
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
    <div className="p-8 max-w-[560px]">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Link to="/admin/2d/parts" className="text-theme-muted text-[12px] no-underline">Part Search</Link>
          <span className="text-theme-faint">›</span>
          <Link to={`/admin/2d/parts/${partType}`} className="text-theme-muted text-[12px] no-underline">
            {label}s
          </Link>
          <span className="text-theme-faint">›</span>
          <span className="text-theme-text text-[12px]">New</span>
        </div>
        <h1 className="text-[22px] font-bold text-theme-text m-0">New {label}</h1>
      </div>

      <div className="bg-bg1 border border-border-c rounded-[10px] p-6 flex flex-col gap-4">
        <div>
          <label className="block text-[12px] text-theme-muted mb-1.5">Display Name *</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={`e.g. Tiger Defenser (${label})`}
            className="w-full px-3 py-[9px] bg-bg2 border border-border-c rounded-[7px] text-theme-text text-[13px] box-border"
          />
        </div>

        <div>
          <label className="block text-[12px] text-theme-muted mb-1.5">Color</label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-8 border-none cursor-pointer rounded-[5px]"
            />
            <span className="text-[13px] text-theme-muted">{color}</span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-2">
          <button
            onClick={handleCreate}
            disabled={saving}
            className={`flex-1 py-2.5 border-none rounded-lg text-[13px] font-semibold text-white ${saving ? "bg-bg3 cursor-not-allowed" : "bg-theme-blue cursor-pointer"}`}
          >
            {saving ? "Creating…" : `Create ${label}`}
          </button>
          <button
            onClick={() => navigate(`/admin/2d/parts/${partType}`)}
            className="px-[18px] py-2.5 bg-bg2 text-theme-muted border border-border-c rounded-lg text-[13px] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
