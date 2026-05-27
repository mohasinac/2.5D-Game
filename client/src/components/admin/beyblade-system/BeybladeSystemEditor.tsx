/**
 * BeybladeSystemEditor — compositor with dynamic slot tabs.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useTabFromUrl } from "@/hooks/useTabFromUrl";
import { doc, getDoc, getDocs, updateDoc, serverTimestamp, collection, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { TabDropdown } from "@/components/ui/TabDropdown";
import { PreviewModal } from "@/components/ui/PreviewModal";
import { SearchableSelect } from "@/components/admin/SearchableSelect";
import { SlotTab } from "./SlotTab";
import { BeybladeSystemPreview } from "./BeybladeSystemPreview";
import { PartPicker } from "./PartPicker";
import { resolveBeybladeSystem, computeBeybladeStats } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { BeybladeSystem, SubPartAttachment, SubPartParent, BeybladeComboSlot, SpecialMoveConfig, GearAttachment } from "@/types/beybladeSystem";
import type { ComboTrigger } from "@/types/comboTask";
import { ELEMENT_COLORS, ELEMENT_ICONS } from "@/types/elementTypes";
import type { ElementType } from "@/types/elementTypes";

type Tab =
  | "overview"
  | "bit_beast"
  | "attack_ring"
  | "weight_disk"
  | "tip"
  | "core"
  | "casing"
  | "spin_track"
  | "sub_parts"
  | "gears"
  | "combos";

const TABS: Array<{ key: Tab; label: string; icon?: string }> = [
  { key: "overview",     label: "Overview" },
  { key: "bit_beast",    label: "Bit Beast" },
  { key: "attack_ring",  label: "Attack Ring" },
  { key: "weight_disk",  label: "Weight Disk" },
  { key: "tip",          label: "Tip" },
  { key: "core",         label: "Core" },
  { key: "casing",       label: "Casing" },
  { key: "spin_track",   label: "Spin Track" },
  { key: "sub_parts",    label: "Sub-Parts" },
  { key: "gears",        label: "Gears", icon: "⚙️" },
  { key: "combos",       label: "Combos", icon: "⚡" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartDoc = Record<string, any>;

interface Props {
  systemId: string;
}

export function BeybladeSystemEditor({ systemId }: Props) {
  const [tab, setTab] = useTabFromUrl("overview") as [Tab, (t: Tab) => void];
  const [system, setSystem] = useState<BeybladeSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [partCache, setPartCache] = useState<Record<string, PartDoc>>({});
  const [resolved, setResolved] = useState<ResolvedBeybladeSystem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.BEYBLADE_SYSTEMS, systemId));
        if (!snap.exists()) { toast.error("System not found"); return; }
        setSystem({ id: snap.id, ...snap.data() } as BeybladeSystem);
      } catch { toast.error("Failed to load system"); }
      finally { setLoading(false); }
    })();
  }, [systemId]);

  // Track in-flight and already-loaded part IDs so fetchPart is stable (no partCache dep).
  // A ref-based seen-set prevents duplicate Firestore reads when the effect re-runs.
  const loadedPartIdsRef = useRef<Set<string>>(new Set());
  const fetchPart = useCallback(async (col: string, id: string) => {
    if (!id || loadedPartIdsRef.current.has(id)) return;
    loadedPartIdsRef.current.add(id); // mark before async fetch to prevent duplicate loads
    try {
      const snap = await getDoc(doc(db, col, id));
      if (snap.exists()) {
        setPartCache((c) => ({ ...c, [id]: { id: snap.id, ...snap.data() } }));
      }
    } catch {
      loadedPartIdsRef.current.delete(id); // allow retry on error
    }
  }, []); // stable — no partCache dependency; uses ref instead

  const [subPartDocs, setSubPartDocs] = useState<PartDoc[]>([]);
  useEffect(() => {
    getDocs(collection(db, COLLECTIONS.SUB_PARTS))
      .then((snap) => setSubPartDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {});
  }, []);

  const [gearPartDocs, setGearPartDocs] = useState<PartDoc[]>([]);
  useEffect(() => {
    getDocs(collection(db, COLLECTIONS.GEAR_PARTS))
      .then((snap) => setGearPartDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {});
  }, []);

  const [systemOptions, setSystemOptions] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    getDocs(collection(db, COLLECTIONS.BEYBLADE_SYSTEMS))
      .then((snap) => {
        const opts = snap.docs
          .filter((d) => d.id !== systemId)
          .map((d) => ({ value: d.id, label: (d.data().displayName ?? d.data().name ?? d.id) as string }));
        setSystemOptions(opts);
      })
      .catch(() => {});
  }, [systemId]);

  useEffect(() => {
    if (!system) return;
    const fetches: Promise<void>[] = [];
    if (system.bitBeastId)    fetches.push(fetchPart(COLLECTIONS.BIT_BEAST_PARTS,   system.bitBeastId));
    if (system.attackRingId)  fetches.push(fetchPart(COLLECTIONS.ATTACK_RING_PARTS, system.attackRingId));
    if (system.weightDiskId)  fetches.push(fetchPart(COLLECTIONS.WEIGHT_DISK_PARTS, system.weightDiskId));
    if (system.tipId)         fetches.push(fetchPart(COLLECTIONS.TIP_PARTS,         system.tipId));
    if (system.coreId)        fetches.push(fetchPart(COLLECTIONS.CORE_PARTS,        system.coreId));
    if (system.casingId)      fetches.push(fetchPart(COLLECTIONS.CASING_PARTS,      system.casingId));
    if (system.spinTrackId)   fetches.push(fetchPart(COLLECTIONS.SPIN_TRACK_PARTS,  system.spinTrackId));
    for (const att of system.subPartAttachments ?? []) {
      fetches.push(fetchPart(COLLECTIONS.SUB_PARTS, att.subPartId));
    }
    Promise.all(fetches);
  }, [system, fetchPart]);

  useEffect(() => {
    if (!system) { setResolved(null); return; }
    try {
      const r = resolveBeybladeSystem(system, partCache as Parameters<typeof resolveBeybladeSystem>[1]);
      setResolved(r);
    } catch {
      setResolved(null);
    }
  }, [system, partCache]);

  const updateSystem = (patch: Partial<BeybladeSystem>) => {
    setSystem((s) => s ? { ...s, ...patch } : s);
    setDirty(true);
  };

  const save = async () => {
    if (!system) return;
    setSaving(true);
    try {
      const { id, ...data } = system;
      await updateDoc(doc(db, COLLECTIONS.BEYBLADE_SYSTEMS, id), { ...data, updatedAt: serverTimestamp() });
      toast.success("Saved");
      setDirty(false);
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const publishToStats = async () => {
    if (!resolved) { toast.error("System not fully resolved"); return; }
    setSaving(true);
    try {
      const stats = computeBeybladeStats(resolved);
      const statsId = system?.linkedStatsId ?? stats.id;
      await setDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, statsId), { ...stats, updatedAt: serverTimestamp() });
      if (!system?.linkedStatsId) {
        updateSystem({ linkedStatsId: statsId });
        await updateDoc(doc(db, COLLECTIONS.BEYBLADE_SYSTEMS, systemId), { linkedStatsId: statsId, updatedAt: serverTimestamp() });
      }
      toast.success("Stats published to beyblade_stats");
    } catch (e) {
      toast.error("Publish failed");
      console.error(e);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-muted">Loading…</div>;
  if (!system) return <div className="p-8 text-red">System not found.</div>;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Tab editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-bg1 shrink-0">
          <div className="flex-1">
            <div className="text-[15px] font-bold text-text">{system.displayName}</div>
            <div className="text-[11px] text-faint">ID: {systemId}</div>
          </div>
          {dirty && (
            <span className="text-[11px] text-yellow bg-yellow/10 px-2 py-0.5 rounded">Unsaved</span>
          )}
          <PreviewModal title="System Preview" size="lg" label="Preview">
            <BeybladeSystemPreview resolved={resolved} />
          </PreviewModal>
          {resolved && (
            <button
              onClick={publishToStats}
              disabled={saving}
              className="px-3.5 py-1.5 bg-green/10 text-green border border-green/25 rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publish Stats
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty}
            className={`px-4 py-1.5 border-none rounded-lg text-xs font-semibold ${dirty ? "bg-blue text-white cursor-pointer" : "bg-bg3 text-faint cursor-default"}`}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {/* Tab dropdown */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-border bg-bg1 shrink-0">
          <TabDropdown
            tabs={TABS.map(t => ({ key: t.key, label: t.icon ? `${t.icon} ${t.label}` : t.label }))}
            value={tab}
            onChange={(k) => setTab(k as Tab)}
          />
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5 bg-bg0">

          {tab === "overview" && (
            <div className="max-w-[500px] flex flex-col gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Display Name</label>
                <input
                  value={system.displayName}
                  onChange={(e) => updateSystem({ displayName: e.target.value })}
                  className="w-full px-3 py-2 bg-bg2 border border-border rounded-lg text-text text-[13px] box-border"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Spin Direction</label>
                <div className="flex gap-2">
                  {(["right", "left"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => updateSystem({ spinDirection: d })}
                      className={`px-4 py-1.5 text-[13px] rounded-lg cursor-pointer border ${
                        system.spinDirection === d
                          ? d === "right"
                            ? "bg-blue/10 text-blue border-blue/30"
                            : "bg-red/10 text-red border-red/30"
                          : "bg-bg2 text-muted border-border"
                      }`}
                    >
                      {d === "right" ? "↻ Right-Spin" : "↺ Left-Spin"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Element Types */}
              <div>
                <label className="block text-xs text-muted mb-1.5">Element Types (max 2)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(Object.keys(ELEMENT_ICONS) as ElementType[]).map((elem) => {
                    const active = (system.elementTypes ?? []).includes(elem);
                    const color = ELEMENT_COLORS[elem];
                    return (
                      <button
                        key={elem}
                        title={elem}
                        onClick={() => {
                          const current = (system.elementTypes ?? []) as ElementType[];
                          const next = active
                            ? current.filter(e => e !== elem)
                            : current.length < 2 ? [...current, elem] : current;
                          updateSystem({ elementTypes: next });
                        }}
                        style={active ? {
                          "--ec": color,
                          background: `${color}22`,
                          color,
                          borderColor: `${color}55`,
                        } as React.CSSProperties : undefined}
                        className={`px-2.5 py-1 text-[11px] rounded-full cursor-pointer border ${active ? "font-bold" : "font-normal bg-bg2 text-faint border-border"}`}
                      >
                        {ELEMENT_ICONS[elem]} {elem}
                      </button>
                    );
                  })}
                </div>
                {(system.elementTypes ?? []).length > 0 && (
                  <div className="text-[11px] text-faint">
                    Selected: {(system.elementTypes ?? []).map(e => `${ELEMENT_ICONS[e]} ${e}`).join(" + ")}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted">
                <div className="mb-1">Linked Stats ID: <code className="text-text">{system.linkedStatsId ?? "(none — publish to create)"}</code></div>
              </div>

              {/* Combined-bey section */}
              <div className="border-t border-border pt-3.5">
                <div className="text-[13px] font-semibold text-text mb-2.5">Combined Bey (Split Gimmick)</div>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="block text-[11px] text-muted mb-1">Partner System</label>
                    <SearchableSelect
                      value={system.combinedWith?.partnerBeySystemId ?? ""}
                      onChange={(val) => {
                        updateSystem({
                          combinedWith: val
                            ? { partnerBeySystemId: val, linkSubPartIndex: system.combinedWith?.linkSubPartIndex ?? 0, playerControlTarget: system.combinedWith?.playerControlTarget ?? "this" }
                            : undefined,
                        });
                      }}
                      options={[{ value: "", label: "(none — single bey)" }, ...systemOptions]}
                      placeholder="Select partner system…"
                    />
                  </div>
                  {system.combinedWith && (
                    <>
                      <div>
                        <label className="block text-[11px] text-muted mb-1">Link Sub-Part Index (split spring position)</label>
                        <input
                          type="number"
                          min={0}
                          value={system.combinedWith.linkSubPartIndex}
                          onChange={(e) => updateSystem({ combinedWith: { ...system.combinedWith!, linkSubPartIndex: Number(e.target.value) } })}
                          className="w-20 px-2.5 py-1.5 bg-bg2 border border-border rounded text-text text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-muted mb-1">Player Controls</label>
                        <div className="flex gap-1.5">
                          {(["this", "partner"] as const).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => updateSystem({ combinedWith: { ...system.combinedWith!, playerControlTarget: opt } })}
                              className={`px-3.5 py-1 text-[11px] rounded cursor-pointer border ${
                                system.combinedWith!.playerControlTarget === opt
                                  ? "bg-blue/10 text-blue border-blue/30"
                                  : "bg-bg2 text-muted border-border"
                              }`}
                            >
                              {opt === "this" ? "This system" : "Partner system"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "bit_beast" && (
            <SlotTab
              label="Bit Beast"
              collectionName={COLLECTIONS.BIT_BEAST_PARTS}
              selectedId={system.bitBeastId}
              selectedConfig={system.activeConfigs?.bitBeast}
              onPartSelect={(id) => updateSystem({ bitBeastId: id })}
              onConfigSelect={(cfg) => updateSystem({ activeConfigs: { ...system.activeConfigs, bitBeast: cfg } })}
              partData={system.bitBeastId ? partCache[system.bitBeastId] : null}
            />
          )}

          {tab === "attack_ring" && (
            <SlotTab
              label="Attack Ring"
              collectionName={COLLECTIONS.ATTACK_RING_PARTS}
              selectedId={system.attackRingId}
              selectedConfig={system.activeConfigs?.attackRing}
              onPartSelect={(id) => updateSystem({ attackRingId: id })}
              onConfigSelect={(cfg) => updateSystem({ activeConfigs: { ...system.activeConfigs, attackRing: cfg } })}
              canFlip
              flipped={system.attackRingFlipped}
              onFlip={(f) => updateSystem({ attackRingFlipped: f })}
              partData={system.attackRingId ? partCache[system.attackRingId] : null}
            />
          )}

          {tab === "weight_disk" && (
            <SlotTab
              label="Weight Disk"
              collectionName={COLLECTIONS.WEIGHT_DISK_PARTS}
              selectedId={system.weightDiskId}
              selectedConfig={system.activeConfigs?.weightDisk}
              onPartSelect={(id) => updateSystem({ weightDiskId: id })}
              onConfigSelect={(cfg) => updateSystem({ activeConfigs: { ...system.activeConfigs, weightDisk: cfg } })}
              partData={system.weightDiskId ? partCache[system.weightDiskId] : null}
            />
          )}

          {tab === "tip" && (
            <SlotTab
              label="Tip"
              collectionName={COLLECTIONS.TIP_PARTS}
              selectedId={system.tipId}
              selectedConfig={system.activeConfigs?.tip}
              onPartSelect={(id) => updateSystem({ tipId: id })}
              onConfigSelect={(cfg) => updateSystem({ activeConfigs: { ...system.activeConfigs, tip: cfg } })}
              partData={system.tipId ? partCache[system.tipId] : null}
            />
          )}

          {tab === "core" && (
            <SlotTab
              label="Core"
              collectionName={COLLECTIONS.CORE_PARTS}
              selectedId={system.coreId}
              selectedConfig={system.activeConfigs?.core}
              onPartSelect={(id) => updateSystem({ coreId: id })}
              onConfigSelect={(cfg) => updateSystem({ activeConfigs: { ...system.activeConfigs, core: cfg } })}
              partData={system.coreId ? partCache[system.coreId] : null}
            />
          )}

          {tab === "casing" && (
            <SlotTab
              label="Casing"
              collectionName={COLLECTIONS.CASING_PARTS}
              selectedId={system.casingId}
              selectedConfig={system.activeConfigs?.casing}
              onPartSelect={(id) => updateSystem({ casingId: id })}
              onConfigSelect={(cfg) => updateSystem({ activeConfigs: { ...system.activeConfigs, casing: cfg } })}
              partData={system.casingId ? partCache[system.casingId] : null}
            />
          )}

          {tab === "spin_track" && (
            <div>
              <div className="text-xs text-muted mb-3">
                Spin Track is an MFB-specific height piece (e.g. S130, 145). Leave blank for plastic-gen beyblades.
              </div>
              <SlotTab
                label="Spin Track"
                collectionName={COLLECTIONS.SPIN_TRACK_PARTS}
                selectedId={system.spinTrackId}
                selectedConfig={system.activeConfigs?.spinTrack}
                onPartSelect={(id) => updateSystem({ spinTrackId: id || undefined })}
                onConfigSelect={(cfg) => updateSystem({ activeConfigs: { ...system.activeConfigs, spinTrack: cfg } })}
                partData={system.spinTrackId ? partCache[system.spinTrackId] : null}
              />
              {system.spinTrackId && (
                <div className="mt-3 px-3 py-2 bg-yellow/10 border border-yellow/25 rounded-lg text-[11px] text-yellow">
                  Track equipped — all AR/WD/Casing CP height ranges will be offset by track.height at runtime.
                </div>
              )}
            </div>
          )}

          {tab === "sub_parts" && (
            <SubPartsEditor
              attachments={system.subPartAttachments ?? []}
              onChange={(atts) => updateSystem({ subPartAttachments: atts })}
              subPartDocs={subPartDocs}
            />
          )}

          {tab === "gears" && (
            <GearAttachmentsEditor
              attachments={system.gearAttachments ?? []}
              onChange={(atts) => updateSystem({ gearAttachments: atts })}
              gearPartDocs={gearPartDocs}
            />
          )}

          {tab === "combos" && (
            <BeybladeComboSlotsEditor
              comboSlots={system.comboSlots ?? []}
              specialMove={system.specialMove}
              onChange={(patch) => updateSystem(patch)}
            />
          )}

        </div>
      </div>

    </div>
  );
}

// ── Combos tab sub-component ──────────────────────────────────────────────────

const KEY_LABELS: Record<string, string> = {
  moveLeft: "←", moveRight: "→", moveUp: "↑", moveDown: "↓",
  attack: "J", defense: "K", dodge: "G", jump: "H",
};
const ALL_KEYS = Object.keys(KEY_LABELS);

const TRIGGER_OPTIONS: { value: string; label: string }[] = [
  { value: "sequence", label: "Sequence (3 keys)" },
  { value: "on_hit_received", label: "On Hit Received" },
  { value: "on_near_ring_out", label: "On Near Ring-Out" },
  { value: "on_low_spin", label: "On Low Spin" },
  { value: "on_partner_near_ring_out", label: "On Partner Near Ring-Out" },
  { value: "on_opponent_special_move", label: "On Opponent Special Move" },
  { value: "on_burst_attempt", label: "On Burst Attempt" },
];

function BeybladeComboSlotsEditor({
  comboSlots,
  specialMove,
  onChange,
}: {
  comboSlots: BeybladeComboSlot[];
  specialMove?: SpecialMoveConfig;
  onChange: (updated: Partial<BeybladeSystem>) => void;
}) {
  const updateSlots = (slots: BeybladeComboSlot[]) => onChange({ comboSlots: slots });
  const addSlot = () => updateSlots([...comboSlots, { sequence: ["attack", "attack", "attack"], effectId: "" }]);
  const removeSlot = (i: number) => updateSlots(comboSlots.filter((_, idx) => idx !== i));
  const patchSlot = (i: number, patch: Partial<BeybladeComboSlot>) =>
    updateSlots(comboSlots.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const patchSeq = (i: number, pos: 0 | 1 | 2, key: string) => {
    const seq = [...comboSlots[i].sequence] as [string, string, string];
    seq[pos] = key;
    patchSlot(i, { sequence: seq });
  };

  const seqStrings = comboSlots.map((s) => s.sequence.join(","));
  const hasDuplicates = seqStrings.some((s, i) => seqStrings.indexOf(s) !== i);

  const addSpecialMove = () =>
    onChange({ specialMove: { name: "", steps: [], cancelable: false, locksDurationTicks: 60, powerCost: 100 } });
  const removeSpecialMove = () => onChange({ specialMove: undefined });
  const patchSM = (patch: Partial<SpecialMoveConfig>) =>
    onChange({ specialMove: { ...specialMove!, ...patch } });

  return (
    <div className="max-w-[560px] flex flex-col gap-5">
      <div>
        <div className="text-[13px] font-bold text-text border-b border-border pb-1.5 mb-3">Sequence Assignment</div>
        {hasDuplicates && (
          <div className="text-[11px] text-red bg-red/10 border border-red/25 rounded px-2.5 py-1.5 mb-2.5">
            Warning: two or more slots have identical sequences — only one will fire per window.
          </div>
        )}
        {comboSlots.length === 0 && (
          <div className="text-[11px] text-faint mb-2.5">No combo slots. Add a slot to assign sequences to effects.</div>
        )}
        <div className="flex flex-col gap-2.5">
          {comboSlots.map((slot, i) => {
            const isDup = seqStrings.filter((s) => s === seqStrings[i]).length > 1;
            return (
              <div key={i} className={`bg-bg1 border rounded-lg p-3 flex flex-col gap-2.5 ${isDup ? "border-red/40" : "border-border"}`}>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-semibold text-text flex-1">
                    Slot {i + 1}
                    {slot.effectId
                      ? <span className="ml-2 text-[11px] text-purple">{slot.effectId}</span>
                      : <span className="ml-2 text-[11px] text-faint">(no effect)</span>
                    }
                  </div>
                  <button onClick={() => removeSlot(i)} className="bg-transparent border-none text-red text-sm cursor-pointer">×</button>
                </div>
                <div className="flex gap-2 items-end flex-wrap">
                  <div>
                    <div className="text-[10px] text-faint mb-0.5">Trigger</div>
                    <SearchableSelect
                      value={slot.condition?.trigger ?? "sequence"}
                      options={TRIGGER_OPTIONS}
                      onChange={(v) => {
                        const cond = v === "sequence"
                          ? { ...slot.condition, trigger: undefined }
                          : { ...slot.condition, trigger: v as ComboTrigger };
                        patchSlot(i, { condition: cond });
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-faint mb-0.5">Effect ID</div>
                    <input
                      value={slot.effectId}
                      onChange={(e) => patchSlot(i, { effectId: e.target.value.trim() })}
                      placeholder="e.g. dash-l"
                      className="w-28 px-2 py-1 bg-bg2 border border-border rounded text-text text-xs"
                    />
                  </div>
                  {slot.condition?.trigger && slot.condition.trigger !== "sequence" && (
                    <div>
                      <div className="text-[10px] text-faint mb-0.5">Cooldown (ms)</div>
                      <input
                        type="number" min={0} step={500}
                        value={slot.condition?.triggerCooldownMs ?? 3000}
                        onChange={(e) => patchSlot(i, { condition: { ...slot.condition, triggerCooldownMs: parseInt(e.target.value, 10) } })}
                        className="w-20 px-2 py-1 bg-bg2 border border-border rounded text-text text-xs"
                      />
                    </div>
                  )}
                </div>

                {(!slot.condition?.trigger || slot.condition.trigger === "sequence") && (
                  <div className="flex gap-2 items-end flex-wrap">
                    {([0, 1, 2] as const).map((pos) => (
                      <div key={pos}>
                        <div className="text-[10px] text-faint mb-0.5">Key {pos + 1}</div>
                        <SearchableSelect
                          value={slot.sequence[pos]}
                          options={ALL_KEYS.map((k) => ({ value: k, label: `${KEY_LABELS[k]} ${k}` }))}
                          onChange={(v) => patchSeq(i, pos, v)}
                        />
                      </div>
                    ))}
                    <div className="text-[11px] text-faint self-center">
                      {slot.sequence.map((k) => KEY_LABELS[k] ?? k).join(" → ")}
                    </div>
                  </div>
                )}

                {slot.condition?.trigger && slot.condition.trigger !== "sequence" && (
                  <div className="text-[11px] text-blue bg-blue/[0.07] rounded px-2 py-1">
                    Reactive: fires automatically when <strong>{slot.condition.trigger.replace(/_/g, " ")}</strong> triggers
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={addSlot} className="mt-2.5 px-3.5 py-1.5 bg-bg2 border border-border rounded text-muted text-[11px] cursor-pointer">
          + Add Slot
        </button>
      </div>

      <div>
        <div className="text-[13px] font-bold text-text border-b border-border pb-1.5 mb-3">Special Move</div>
        {!specialMove ? (
          <button onClick={addSpecialMove} className="px-3.5 py-1.5 bg-bg2 border border-border rounded text-muted text-[11px] cursor-pointer">
            + Add Special Move
          </button>
        ) : (
          <div className="bg-bg1 border border-border rounded-lg p-3.5 flex flex-col gap-3">
            <div>
              <div className="text-[10px] text-faint mb-0.5">Name</div>
              <input
                value={specialMove.name}
                onChange={(e) => patchSM({ name: e.target.value })}
                placeholder="e.g. Stampede Rush"
                className="w-full px-2.5 py-1.5 bg-bg2 border border-border rounded text-text text-xs box-border"
              />
            </div>
            <div className="flex gap-3.5 flex-wrap items-end">
              <div>
                <div className="text-[10px] text-faint mb-0.5">Locks Duration (ticks)</div>
                <input
                  type="number" min={0}
                  value={specialMove.locksDurationTicks}
                  onChange={(e) => patchSM({ locksDurationTicks: Number(e.target.value) })}
                  className="w-20 px-2 py-1 bg-bg2 border border-border rounded text-text text-xs"
                />
              </div>
              <div>
                <div className="text-[10px] text-faint mb-0.5">Power Cost</div>
                <input
                  type="number" min={0}
                  value={specialMove.powerCost}
                  onChange={(e) => patchSM({ powerCost: Number(e.target.value) })}
                  className="w-20 px-2 py-1 bg-bg2 border border-border rounded text-text text-xs"
                />
              </div>
              <label className="flex items-center gap-1.5 text-xs text-text cursor-pointer">
                <input type="checkbox" checked={specialMove.cancelable} onChange={(e) => patchSM({ cancelable: e.target.checked })} className="accent-blue" />
                Cancelable
              </label>
              <button onClick={removeSpecialMove} className="px-3 py-1 bg-red/10 border border-red/25 rounded text-red text-[11px] cursor-pointer">Remove</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Gear Attachments tab ──────────────────────────────────────────────────────

const GEAR_MOUNT_OPTIONS: GearAttachment["parentPart"][] = ["ar", "wd", "casing", "core"];

function GearAttachmentsEditor({
  attachments, onChange, gearPartDocs,
}: {
  attachments: GearAttachment[];
  onChange: (atts: GearAttachment[]) => void;
  gearPartDocs: PartDoc[];
}) {
  const [adding, setAdding] = useState(false);
  const update = (idx: number, patch: Partial<GearAttachment>) =>
    onChange(attachments.map((a, i) => i === idx ? { ...a, ...patch } : a));
  const remove = (idx: number) => onChange(attachments.filter((_, i) => i !== idx));
  const add = (partId: string) => { onChange([...attachments, { gearId: partId, parentPart: "ar" }]); setAdding(false); };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[11px] text-faint mb-1">
        Gears attach to a parent part and mesh with the spin axis to provide gear-ratio speed changes, clutch releases, or spring-wound launch assist.
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">Gear Attachments ({attachments.length})</div>
        <button
          onClick={() => setAdding((a) => !a)}
          className={`px-3 py-1 text-[11px] rounded cursor-pointer border ${adding ? "bg-blue text-white border-blue" : "bg-bg3 text-muted border-border"}`}
        >
          {adding ? "Cancel" : "+ Add Gear"}
        </button>
      </div>
      {adding && (
        <div className="bg-bg1 border border-border rounded-lg p-3">
          <PartPicker collectionName={COLLECTIONS.GEAR_PARTS} onSelect={(id) => add(id)} label="Select Gear Part" />
        </div>
      )}
      {attachments.map((att, idx) => {
        const partDoc = gearPartDocs.find((p) => p.id === att.gearId);
        return (
          <div key={idx} className="bg-bg2 border border-border rounded-lg px-3 py-2.5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚙️</span>
              <span className="flex-1 text-xs text-text font-semibold">{partDoc?.displayName ?? att.gearId}</span>
              <button onClick={() => remove(idx)} className="bg-transparent border-none text-red text-sm cursor-pointer">×</button>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <div>
                <div className="text-[10px] text-faint mb-0.5">Mount Point</div>
                <div className="flex gap-0.5">
                  {GEAR_MOUNT_OPTIONS.map((mp) => (
                    <button key={mp} onClick={() => update(idx, { parentPart: mp })}
                      className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer border ${att.parentPart === mp ? "bg-blue/10 text-blue border-blue/25" : "bg-bg3 text-faint border-border"}`}
                    >{mp}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-faint mb-0.5">Active Config</div>
                <input
                  value={att.activeConfig ?? ""}
                  onChange={(e) => update(idx, { activeConfig: e.target.value.trim() || undefined })}
                  placeholder="(default)"
                  className="w-36 px-2 py-1 bg-bg3 border border-border rounded text-text text-[11px]"
                />
              </div>
            </div>
            {partDoc && (
              <div className="flex gap-3.5 flex-wrap text-[10px] text-faint">
                {partDoc.gearRatio != null && <span>Ratio: <span className="text-text">{partDoc.gearRatio}</span></span>}
                {partDoc.gearTeeth != null && <span>Teeth: <span className="text-text">{partDoc.gearTeeth}</span></span>}
                {partDoc.clutchMode && <span>Clutch: <span className="text-yellow">{partDoc.clutchMode}</span></span>}
              </div>
            )}
          </div>
        );
      })}
      {attachments.length === 0 && !adding && (
        <div className="text-[11px] text-faint">No gears attached. Add Engine Gear or CEW inserts here.</div>
      )}
    </div>
  );
}

// ── Sub-Parts tab sub-component ───────────────────────────────────────────────

const PARENT_OPTIONS: SubPartParent[] = ["ar", "wd", "casing", "bit_beast", "tip", "core"];

function SubPartsEditor({
  attachments, onChange, subPartDocs,
}: {
  attachments: SubPartAttachment[];
  onChange: (atts: SubPartAttachment[]) => void;
  subPartDocs: PartDoc[];
}) {
  const [adding, setAdding] = useState(false);
  const update = (idx: number, patch: Partial<SubPartAttachment>) =>
    onChange(attachments.map((a, i) => i === idx ? { ...a, ...patch } : a));
  const remove = (idx: number) => onChange(attachments.filter((_, i) => i !== idx));
  const add = (partId: string) => {
    onChange([...attachments, { subPartId: partId, parentPart: "ar", placement: "above", flipped: false }]);
    setAdding(false);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">Sub-Parts ({attachments.length})</div>
        <button
          onClick={() => setAdding((a) => !a)}
          className={`px-3 py-1 text-[11px] rounded cursor-pointer border ${adding ? "bg-blue text-white border-blue" : "bg-bg3 text-muted border-border"}`}
        >
          {adding ? "Cancel" : "+ Add Sub-Part"}
        </button>
      </div>
      {adding && (
        <div className="bg-bg1 border border-border rounded-lg p-3">
          <PartPicker collectionName={COLLECTIONS.SUB_PARTS} onSelect={(id) => add(id)} label="Select Sub-Part" />
        </div>
      )}
      {attachments.map((att, idx) => {
        const partDoc = subPartDocs.find((p) => p.id === att.subPartId);
        return (
          <div key={idx} className="bg-bg2 border border-border rounded-lg px-3 py-2.5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-faint" style={partDoc?.color ? { background: partDoc.color } : undefined} />
              <span className="flex-1 text-xs text-text font-semibold">{partDoc?.displayName ?? att.subPartId}</span>
              <button onClick={() => remove(idx)} className="bg-transparent border-none text-red text-sm cursor-pointer">×</button>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <div>
                <div className="text-[10px] text-faint mb-0.5">Attach to</div>
                <div className="flex gap-0.5">
                  {PARENT_OPTIONS.map((p) => (
                    <button key={p} onClick={() => update(idx, { parentPart: p })}
                      className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer border ${att.parentPart === p ? "bg-blue/10 text-blue border-blue/25" : "bg-bg3 text-faint border-border"}`}
                    >{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-faint mb-0.5">Placement</div>
                <div className="flex gap-0.5">
                  {(["above", "below"] as const).map((pl) => (
                    <button key={pl} onClick={() => update(idx, { placement: pl })}
                      className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer border ${att.placement === pl ? "bg-blue/10 text-blue border-blue/25" : "bg-bg3 text-faint border-border"}`}
                    >{pl}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={att.flipped} onChange={(e) => update(idx, { flipped: e.target.checked })} className="accent-blue" />
                <span className="text-[10px] text-faint">Flipped</span>
              </label>
            </div>
            {(partDoc?.configurations?.length ?? 0) > 0 && (
              <div>
                <div className="text-[10px] text-faint mb-0.5">Config</div>
                <div className="flex gap-0.5 flex-wrap">
                  {(partDoc?.configurations ?? []).map((cfg: { name: string }) => (
                    <button key={cfg.name} onClick={() => update(idx, { activeConfig: cfg.name })}
                      className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer border ${att.activeConfig === cfg.name ? "bg-blue/10 text-blue border-blue/25" : "bg-bg3 text-faint border-border"}`}
                    >{cfg.name}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {attachments.length === 0 && !adding && (
        <div className="text-[11px] text-faint">No sub-parts. Add sub-ARs, sub-casings, or WD sub-parts here.</div>
      )}
    </div>
  );
}
