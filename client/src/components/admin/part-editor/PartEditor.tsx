/**
 * PartEditor — generic editor shell for any part type.
 *
 * Sections (tabbed):
 *   Overview      display name, color, compatibility tags
 *   Shape         PartShapeEditor (preset / trace / Bezier / Fourier / side / bottom)
 *   Images        PartImagesSection (top/side/bottom upload)
 *   Dimensions    PartDimensionFields
 *   Material      MaterialSelector + MaterialBandsEditor
 *   Contact Points ContactPointEditor
 *   Configurations PartConfigurationsEditor
 *   Pockets       PocketListEditor
 *
 * Part-type-specific fields (weight, gripFactor, tipShape, etc.) are rendered
 * in a "Type Fields" section using the renderTypeFields prop.
 */

import { useState, useEffect } from "react";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";
import { doc, getDoc, updateDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { C, alpha } from "@/styles/theme";
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
import { SearchableTabSelect, SearchableSelect, SearchableMultiSelect } from "@/components/admin/SearchableSelect";

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
import type { BasePart, PartDimensions, Material, MaterialBand, SystemContactPoint, PartImages, PartSelfRotation, PartLayer } from "@/types/beybladeSystem";
import { PartSelfRotationSection } from "./PartSelfRotationSection";

// Preview is no longer a tab — it's always visible in the right panel.
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
  /** Render part-type-specific fields (weight, gripFactor, etc.) */
  renderTypeFields?: (part: Record<string, unknown>, onChange: (patch: Record<string, unknown>) => void) => React.ReactNode;
  /** Whether this part type has contact points */
  hasContactPoints?: boolean;
  /** Whether this part type has material bands */
  hasMaterialBands?: boolean;
  /** Whether to show inner radius field */
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

  if (loading) return <div style={{ padding: 32, color: C.muted }}>Loading…</div>;
  if (!part) return <div style={{ padding: 32, color: C.red }}>Part not found.</div>;

  const storagePath = `parts/${collectionName}/${partId}`;

  // Type-cast helpers with fallbacks
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

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "14px 24px",
        borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0,
      }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: part.color ?? C.faint, flexShrink: 0,
            border: `2px solid ${C.border}`,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {part.displayName || "Unnamed Part"}
          </div>
          <div style={{ fontSize: 11, color: C.faint }}>ID: {partId}</div>
        </div>
        {dirty && (
          <span style={{ fontSize: 11, color: C.yellow, background: alpha(C.yellow, 0.09), padding: "3px 8px", borderRadius: 5 }}>
            Unsaved changes
          </span>
        )}
        <button
          onClick={save}
          disabled={saving || !dirty}
          style={{
            padding: "8px 20px", background: dirty ? C.blue : C.bg3,
            color: dirty ? "#fff" : C.faint, border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: dirty ? "pointer" : "default",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Tab strip */}
      <div style={{ display: "flex", gap: 2, padding: "8px 24px 0", borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0, flexWrap: "wrap", alignItems: "flex-end" }}>
        <SearchableTabSelect
          tabs={TABS.filter((t) => {
            if (t.key === "contacts" && !hasContactPoints) return false;
            if (t.key === "material" && !hasMaterialBands) return false;
            if (t.key === "type" && !renderTypeFields) return false;
            return true;
          }).map(t => ({ key: t.key, label: t.label }))}
          activeTab={tab}
          onSelect={(k) => setTab(k as Tab)}
          style={{ minWidth: 160, marginBottom: 8, marginRight: 8 }}
        />
        {TABS.filter((t) => {
          if (t.key === "contacts" && !hasContactPoints) return false;
          if (t.key === "material" && !hasMaterialBands) return false;
          if (t.key === "type" && !renderTypeFields) return false;
          return true;
        }).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "7px 14px", fontSize: 12, borderRadius: "6px 6px 0 0",
              background: tab === t.key ? C.bg0 : "transparent",
              color: tab === t.key ? C.text : C.muted,
              border: `1px solid ${tab === t.key ? C.border : "transparent"}`,
              borderBottom: tab === t.key ? `1px solid ${C.bg0}` : "none",
              cursor: "pointer", marginBottom: tab === t.key ? -1 : 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Two-column body: left = tab content, right = always-visible part preview */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", background: C.bg0 }}>

        {/* Overview */}
        {tab === "overview" && (
          <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Display Name</label>
              <input
                value={part.displayName ?? ""}
                onChange={(e) => update({ displayName: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Description</label>
              <textarea
                value={part.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
                rows={3}
                style={{ width: "100%", padding: "9px 12px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="color" value={part.color ?? "#1a1a1a"} onChange={(e) => update({ color: e.target.value })} style={{ width: 44, height: 34, border: "none", cursor: "pointer", borderRadius: 6 }} />
                <input value={part.color ?? ""} onChange={(e) => update({ color: e.target.value })} style={{ width: 100, padding: "7px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, fontFamily: "monospace" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Physics Coupling</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={part.rotatable !== false}
                  onChange={(e) => update({ rotatable: e.target.checked })}
                  style={{ accentColor: C.blue, width: 16, height: 16 }}
                />
                <span>Rotatable</span>
                <span style={{ fontSize: 11, color: C.faint }}>(co-rotates with bey spin axis; uncheck to free-spin independently)</span>
              </label>
            </div>
            {/* Part-Driven Rotation */}
            <PartSelfRotationSection
              value={(part.selfRotation as PartSelfRotation | undefined) ?? null}
              onChange={(sr) => update({ selfRotation: sr ?? undefined })}
            />
            <TagsField label="Compatibility Tags" value={compatibilityTags} onChange={(v) => update({ compatibilityTags: v })} />
            <TagsField label="Required Compatibility" value={requiredCompatibility} onChange={(v) => update({ requiredCompatibility: v })} />
            <TagsField label="Excluded Compatibility" value={excludedCompatibility} onChange={(v) => update({ excludedCompatibility: v })} />
            {/* Combo Effects */}
            <div>
              <div style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Combo Effects</div>
              <SearchableMultiSelect
                values={(part.comboEffects as string[] | undefined) ?? []}
                options={comboEffectOptions}
                onChange={(ids) => update({ comboEffects: ids })}
              />
            </div>
            {/* Slot wiring */}
            <SlotWiringSection
              slotsInto={(part.slotsInto as PartLayer | undefined) ?? null}
              slotPosition={(part.slotPosition as number | undefined) ?? null}
              onChangeSlotsInto={(v) => update({ slotsInto: v ?? undefined })}
              onChangeSlotPosition={(v) => update({ slotPosition: v ?? undefined })}
            />
          </div>
        )}

        {/* Shape */}
        {tab === "shape" && (
          <PartShapeEditor
            value={geometry}
            onChange={(g) => update({ geometry: g })}
            images={images}
          />
        )}

        {/* Images */}
        {tab === "images" && (
          <PartImagesSection
            images={images}
            onChange={(imgs) => update({ images: imgs })}
            storagePath={storagePath}
          />
        )}

        {/* Dimensions */}
        {tab === "dimensions" && (
          <div style={{ maxWidth: 420 }}>
            <PartDimensionFields
              value={dimensions}
              onChange={(d) => update({ dimensions: d })}
              showInnerRadius={showInnerRadius}
            />
          </div>
        )}

        {/* Material */}
        {tab === "material" && (
          <div style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 24 }}>
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

        {/* Contact Points */}
        {tab === "contacts" && hasContactPoints && (
          <ContactPointEditor
            value={contactPoints}
            onChange={(cps) => update({ contactPoints: cps })}
            fourierProfile={geometry.fourierProfile}
            outerRadius={dimensions.outerRadius}
          />
        )}

        {/* Configurations */}
        {tab === "configs" && (
          <div style={{ maxWidth: 680 }}>
            <PartConfigurationsEditor
              value={configurations}
              onChange={(cfgs) => update({ configurations: cfgs })}
              partTypeSlug={partTypeSlug}
            />
          </div>
        )}

        {/* Pockets */}
        {tab === "pockets" && (
          <PocketListEditor
            value={pockets}
            onChange={(ps) => update({ pockets: ps })}
            outerRadius={dimensions.outerRadius}
          />
        )}

        {/* Type-specific fields */}
        {tab === "type" && renderTypeFields && (
          <div style={{ maxWidth: 600 }}>
            {renderTypeFields(part, update)}
          </div>
        )}
      </div>

      {/* Right panel — always-visible part preview */}
      <div style={{
        width: 260, flexShrink: 0, borderLeft: `1px solid ${C.border}`,
        background: C.bg1, overflowY: "auto", padding: "20px 16px",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        <PartLayerPreview
          images={images}
          partKind={partKind}
          displayName={(part.displayName as string) || "Untitled Part"}
          color={part.color as string | undefined}
          dimensions={dimensions}
        />
        <div style={{ fontSize: 11, color: C.faint, textAlign: "center" }}>
          {dimensions.outerRadius ? `⌀ ${(dimensions.outerRadius * 2 / 10).toFixed(1)} cm` : ""}
          {dimensions.height ? `  ×  h ${(dimensions.height / 10).toFixed(1)} cm` : ""}
        </div>
      </div>

      </div>{/* end two-column body */}
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
      <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>Slot Wiring</label>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Slots Into</div>
          <SearchableSelect
            value={slotsInto ?? ""}
            options={[{ value: "", label: "(not set)" }, ...PART_LAYER_OPTIONS]}
            onChange={(v) => onChangeSlotsInto((v as PartLayer) || null)}
            placeholder="Select slot layer…"
          />
        </div>
        <div style={{ minWidth: 100 }}>
          <div style={{ fontSize: 11, color: C.faint, marginBottom: 4 }}>Slot Position (0-indexed)</div>
          <input
            type="number"
            min={0}
            step={1}
            value={slotPosition ?? ""}
            placeholder="0"
            onChange={(e) => onChangeSlotPosition(e.target.value === "" ? null : Number(e.target.value))}
            style={{ width: 90, padding: "6px 9px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12 }}
          />
        </div>
      </div>
      <div style={{ fontSize: 10, color: C.faint, marginTop: 5 }}>
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
      <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6 }}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {value.map((t) => (
          <span key={t} style={{ fontSize: 11, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 8px", color: C.text, display: "flex", alignItems: "center", gap: 4 }}>
            {t}
            <button onClick={() => onChange(value.filter((x) => x !== t))} style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", fontSize: 12, padding: 0 }}>×</button>
          </span>
        ))}
        {value.length === 0 && <span style={{ fontSize: 11, color: C.faint }}>None</span>}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="add tag…"
          style={{ flex: 1, padding: "6px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12 }}
        />
        <button onClick={add} style={{ padding: "6px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.muted, cursor: "pointer" }}>Add</button>
      </div>
    </div>
  );
}

