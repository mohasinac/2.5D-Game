import { useState, useEffect } from "react";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";
import { doc, getDoc, updateDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";
import { PartShapeEditor } from "./PartShapeEditor";
import { PartImagesSection } from "./PartImagesSection";
import { PartDimensionFields } from "./PartDimensionFields";
import { MaterialSelector } from "./MaterialSelector";
import { MaterialBandsEditor } from "./MaterialBandsEditor";
import { ContactPointEditor } from "./ContactPointEditor";
import { PartConfigurationsEditor } from "./PartConfigurationsEditor";
import { PocketListEditor } from "./PocketListEditor";
import { PartLayerPreview, type PartKind } from "./PartLayerPreview";
import { SearchableSelect, SearchableMultiSelect } from "@/components/admin/SearchableSelect";
import { TabDropdown } from "@/components/ui/TabDropdown";
import { PreviewOverlay } from "@/components/ui/PreviewOverlay";
import type { BasePart, PartDimensions, Material, MaterialBand, SystemContactPoint, PartImages, PartSelfRotation, PartLayer } from "@/types/beybladeSystem";
import { PartSelfRotationSection } from "./PartSelfRotationSection";

const SLUG_TO_KIND: Record<string, PartKind> = {
  "bit-beasts":   "bitBeast",
  "attack-rings": "attackRing",
  "weight-disks": "weightDisk",
  "spin-tracks":  "spinTrack",
  "casings":      "casing",
  "cores":        "core",
  "tips":         "tip",
  "sub-parts":    "subPart",
};

type Tab = "overview" | "shape" | "images" | "dimensions" | "material" | "contacts" | "configs" | "pockets" | "type";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "overview",    label: "Overview" },
  { key: "shape",       label: "Shape" },
  { key: "images",      label: "Images" },
  { key: "dimensions",  label: "Dimensions" },
  { key: "material",    label: "Material" },
  { key: "contacts",    label: "Contact Points" },
  { key: "configs",     label: "Configurations" },
  { key: "pockets",     label: "Pockets" },
  { key: "type",        label: "Type Fields" },
];

interface Props {
  collectionName: string;
  partId: string;
  partTypeSlug: string;
  renderTypeFields?: (part: Record<string, unknown>, onChange: (patch: Record<string, unknown>) => void) => React.ReactNode;
  hasContactPoints?: boolean;
  hasMaterialBands?: boolean;
  showInnerRadius?: boolean;
}

export function PartEditor({
  collectionName,
  partId,
  partTypeSlug,
  renderTypeFields,
  hasContactPoints = true,
  hasMaterialBands = true,
  showInnerRadius = true,
}: Props) {
  const [tab, setTab] = useTabFromUrl("overview") as [Tab, (t: Tab) => void];
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [part, setPart] = useState<Record<string, any> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [comboEffectOptions, setComboEffectOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [snap, ceSnap] = await Promise.all([
          getDoc(doc(db, collectionName, partId)),
          getDocs(collection(db, COLLECTIONS.COMBO_EFFECTS)),
        ]);
        if (!snap.exists()) { toast.error("Part not found"); return; }
        setPart({ id: snap.id, ...snap.data() });
        setComboEffectOptions(ceSnap.docs.map(d => ({ value: d.id, label: ((d.data().name ?? d.data().displayName) as string | undefined) ?? d.id })));
      } catch { toast.error("Failed to load part"); }
      finally { setLoading(false); }
    })();
  }, [collectionName, partId]);

  const update = (patch: Record<string, unknown>) => {
    setPart((p) => p ? { ...p, ...patch } : p);
    setDirty(true);
  };

  const save = async () => {
    if (!part) return;
    setSaving(true);
    try {
      const { id, ...data } = part;
      await updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() });
      toast.success("Saved");
      setDirty(false);
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-muted">Loading…</div>;
  if (!part) return <div className="p-8 text-red">Part not found.</div>;

  const storagePath = `parts/${collectionName}/${partId}`;

  const images: PartImages = part.images ?? {};
  const geometry = part.geometry ?? { type: "preset" as const, preset: "circle" as const };
  const dimensions: PartDimensions = part.dimensions ?? { height: 30, outerRadius: 35, innerRadius: 5 };
  const material: Material = part.material ?? "abs";
  const materialBands: MaterialBand[] = part.materials ?? [];
  const contactPoints: SystemContactPoint[] = part.contactPoints ?? [];
  const configurations = part.configurations ?? [];
  const pockets = part.pockets ?? [];
  const compatibilityTags: string[] = part.compatibilityTags ?? [];
  const requiredCompatibility: string[] = part.requiredCompatibility ?? [];
  const excludedCompatibility: string[] = part.excludedCompatibility ?? [];

  const partKind = SLUG_TO_KIND[partTypeSlug] ?? "subPart";

  const visibleTabs = TABS.filter((t) => {
    if (t.key === "contacts" && !hasContactPoints) return false;
    if (t.key === "material" && !hasMaterialBands) return false;
    if (t.key === "type" && !renderTypeFields) return false;
    return true;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-border bg-bg1 shrink-0">
        <div
          className="w-7 h-7 rounded-full shrink-0 border-2 border-border"
          style={{ background: part.color ?? "var(--faint)" }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-text truncate">
            {part.displayName || "Unnamed Part"}
          </div>
          <div className="text-[11px] text-faint">ID: {partId}</div>
        </div>

        <TabDropdown
          tabs={visibleTabs.map(t => ({ key: t.key, label: t.label }))}
          value={tab}
          onChange={(k) => setTab(k as Tab)}
        />

        <button
          onClick={() => setPreviewOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted hover:text-text hover:bg-bg3 transition-colors"
          title="Toggle preview"
        >
          <Eye size={13} />
          Preview
        </button>

        {dirty && (
          <span className="text-[11px] text-yellow bg-yellow/[.09] px-2 py-1 rounded">
            Unsaved changes
          </span>
        )}
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="px-5 py-2 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-default bg-blue text-white hover:opacity-90 disabled:bg-bg3 disabled:text-faint"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6 bg-bg0">

        {/* Overview */}
        {tab === "overview" && (
          <div className="max-w-xl flex flex-col gap-5">
            <div>
              <label className="block text-xs text-muted mb-1.5">Display Name</label>
              <input
                value={part.displayName ?? ""}
                onChange={(e) => update({ displayName: e.target.value })}
                className="w-full px-3 py-2 bg-bg2 border border-border rounded-lg text-text text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Description</label>
              <textarea
                value={part.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-bg2 border border-border rounded-lg text-text text-sm resize-y"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Color</label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={part.color ?? "#1a1a1a"}
                  onChange={(e) => update({ color: e.target.value })}
                  className="w-11 h-9 rounded-md cursor-pointer border-0"
                />
                <input
                  value={part.color ?? ""}
                  onChange={(e) => update({ color: e.target.value })}
                  className="w-28 px-2.5 py-1.5 bg-bg2 border border-border rounded-md text-text text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Physics Coupling</label>
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={part.rotatable !== false}
                  onChange={(e) => update({ rotatable: e.target.checked })}
                  className="w-4 h-4 accent-blue"
                />
                <span>Rotatable</span>
                <span className="text-[11px] text-faint">(co-rotates with bey spin axis; uncheck to free-spin independently)</span>
              </label>
            </div>
            <PartSelfRotationSection
              value={(part.selfRotation as PartSelfRotation | undefined) ?? null}
              onChange={(sr) => update({ selfRotation: sr ?? undefined })}
            />
            <TagsField label="Compatibility Tags" value={compatibilityTags} onChange={(v) => update({ compatibilityTags: v })} />
            <TagsField label="Required Compatibility" value={requiredCompatibility} onChange={(v) => update({ requiredCompatibility: v })} />
            <TagsField label="Excluded Compatibility" value={excludedCompatibility} onChange={(v) => update({ excludedCompatibility: v })} />
            <div>
              <div className="text-xs text-muted mb-1.5">Combo Effects</div>
              <SearchableMultiSelect
                values={(part.comboEffects as string[] | undefined) ?? []}
                options={comboEffectOptions}
                onChange={(ids) => update({ comboEffects: ids })}
              />
            </div>
            <SlotWiringSection
              slotsInto={(part.slotsInto as PartLayer | undefined) ?? null}
              slotPosition={(part.slotPosition as number | undefined) ?? null}
              onChangeSlotsInto={(v) => update({ slotsInto: v ?? undefined })}
              onChangeSlotPosition={(v) => update({ slotPosition: v ?? undefined })}
            />
          </div>
        )}

        {tab === "shape" && (
          <PartShapeEditor
            value={geometry}
            onChange={(g) => update({ geometry: g })}
            images={images}
          />
        )}

        {tab === "images" && (
          <PartImagesSection
            images={images}
            onChange={(imgs) => update({ images: imgs })}
            storagePath={storagePath}
          />
        )}

        {tab === "dimensions" && (
          <div className="max-w-sm">
            <PartDimensionFields
              value={dimensions}
              onChange={(d) => update({ dimensions: d })}
              showInnerRadius={showInnerRadius}
            />
          </div>
        )}

        {tab === "material" && (
          <div className="max-w-lg flex flex-col gap-6">
            <MaterialSelector
              value={material}
              onChange={(m) => update({ material: m })}
              label="Primary Material"
            />
            {hasMaterialBands && (
              <MaterialBandsEditor
                value={materialBands}
                onChange={(bands) => update({ materials: bands })}
              />
            )}
          </div>
        )}

        {tab === "contacts" && hasContactPoints && (
          <ContactPointEditor
            value={contactPoints}
            onChange={(cps) => update({ contactPoints: cps })}
            fourierProfile={geometry.fourierProfile}
            outerRadius={dimensions.outerRadius}
          />
        )}

        {tab === "configs" && (
          <div className="max-w-2xl">
            <PartConfigurationsEditor
              value={configurations}
              onChange={(cfgs) => update({ configurations: cfgs })}
              partTypeSlug={partTypeSlug}
            />
          </div>
        )}

        {tab === "pockets" && (
          <PocketListEditor
            value={pockets}
            onChange={(ps) => update({ pockets: ps })}
            outerRadius={dimensions.outerRadius}
          />
        )}

        {tab === "type" && renderTypeFields && (
          <div className="max-w-xl">
            {renderTypeFields(part, update)}
          </div>
        )}
      </div>

      {/* Toggleable preview overlay */}
      <PreviewOverlay
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Part Preview"
        width="w-72"
      >
        <div className="p-4 flex flex-col gap-3">
          <PartLayerPreview
            images={images}
            partKind={partKind}
            displayName={(part.displayName as string) || "Untitled Part"}
            color={part.color as string | undefined}
            dimensions={dimensions}
          />
          <div className="text-[11px] text-faint text-center">
            {dimensions.outerRadius ? `⌀ ${(dimensions.outerRadius * 2 / 10).toFixed(1)} cm` : ""}
            {dimensions.height ? `  ×  h ${(dimensions.height / 10).toFixed(1)} cm` : ""}
          </div>
        </div>
      </PreviewOverlay>
    </div>
  );
}

// ── Slot Wiring section ────────────────────────────────────────────────────────

const PART_LAYER_OPTIONS: Array<{ value: PartLayer; label: string }> = [
  { value: "bit_beast",  label: "Bit Beast" },
  { value: "ar",         label: "Attack Ring (AR)" },
  { value: "wd",         label: "Weight Disk (WD)" },
  { value: "tip",        label: "Tip" },
  { value: "core",       label: "Core" },
  { value: "casing",     label: "Casing" },
  { value: "spin_track", label: "Spin Track" },
  { value: "sub_part",   label: "Sub Part" },
  { value: "gear",       label: "Gear" },
];

function SlotWiringSection({
  slotsInto, slotPosition, onChangeSlotsInto, onChangeSlotPosition,
}: {
  slotsInto: PartLayer | null;
  slotPosition: number | null;
  onChangeSlotsInto: (v: PartLayer | null) => void;
  onChangeSlotPosition: (v: number | null) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">Slot Wiring</label>
      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-40">
          <div className="text-[11px] text-faint mb-1">Slots Into</div>
          <SearchableSelect
            value={slotsInto ?? ""}
            options={[{ value: "", label: "(not set)" }, ...PART_LAYER_OPTIONS]}
            onChange={(v) => onChangeSlotsInto((v as PartLayer) || null)}
            placeholder="Select slot layer…"
          />
        </div>
        <div className="min-w-24">
          <div className="text-[11px] text-faint mb-1">Slot Position (0-indexed)</div>
          <input
            type="number"
            min={0}
            step={1}
            value={slotPosition ?? ""}
            placeholder="0"
            onChange={(e) => onChangeSlotPosition(e.target.value === "" ? null : Number(e.target.value))}
            className="w-24 px-2.5 py-1.5 bg-bg2 border border-border rounded-md text-text text-xs"
          />
        </div>
      </div>
      <div className="text-[10px] text-faint mt-1.5">
        Slot position only matters for beys with multiple sockets of the same layer (e.g. dual gear ports). Leave blank for single-slot systems.
      </div>
    </div>
  );
}

// ── Tags field helper ──────────────────────────────────────────────────────────

function TagsField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const tag = input.trim().toLowerCase().replace(/\s+/g, "_");
    if (!tag || value.includes(tag)) { setInput(""); return; }
    onChange([...value, tag]);
    setInput("");
  };

  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((t) => (
          <span key={t} className="text-[11px] bg-bg3 border border-border rounded px-2 py-0.5 text-text flex items-center gap-1">
            {t}
            <button
              onClick={() => onChange(value.filter((x) => x !== t))}
              className="text-faint hover:text-red text-xs leading-none"
            >×</button>
          </span>
        ))}
        {value.length === 0 && <span className="text-[11px] text-faint">None</span>}
      </div>
      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="add tag…"
          className="flex-1 px-2.5 py-1.5 bg-bg2 border border-border rounded-md text-text text-xs"
        />
        <button
          onClick={add}
          className="px-3 py-1.5 bg-bg3 border border-border rounded-md text-xs text-muted hover:text-text transition-colors"
        >Add</button>
      </div>
    </div>
  );
}
