import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import type { BeybladeStack, StackSlot, StackTemplate, FusionMode } from "@/types/beybladeSystem";

// ── Part data shape ────────────────────────────────────────────────────────────

interface PartEntry {
  id: string;
  collection: string;
  name: string;
  generation?: string;
  mass_g?: number;
  I_kgm2?: number;
  r_outer_cm?: number;
  r_inner_cm?: number;
  z_top_cm?: number;
  partType?: string;
  mu_k?: number;
  contactRadius_cm?: number;
}

// ── Physics summary (client-side computation) ─────────────────────────────────

const G = 9.81;
const TIP_COLLECTIONS = new Set(["tip_parts", "tip"]);

interface PhysicsSummary {
  totalMass_g: number;
  I_total_kgm2: number;
  CoM_z_cm: number;
  spinDecayRate: number;
  OWD: number;
  hasTip: boolean;
  warnings: string[];
  attackPct: number;
  defensePct: number;
  staminaPct: number;
}

function computePhysics(
  slots: StackSlot[],
  partMap: Map<string, PartEntry>
): PhysicsSummary {
  const sorted = [...slots].sort((a, b) => a.slotIndex - b.slotIndex);
  let totalMass_g = 0;
  let I_total = 0;
  let CoM_num = 0;
  let prevZTop = 0;
  let tipPart: PartEntry | null = null;
  let maxR_m = 0.001;
  const warnings: string[] = [];

  for (const slot of sorted) {
    const part = partMap.get(`${slot.partCollection}::${slot.partId}`);
    if (!part) {
      warnings.push(`Part "${slot.partId}" not loaded.`);
      continue;
    }
    const z_base = slot.z_override_cm ?? prevZTop;
    const mass = part.mass_g ?? 0;
    const z_top = z_base + (part.z_top_cm ?? 0.5);
    totalMass_g += mass;
    const I_part =
      part.I_kgm2 ??
      (mass / 1000) * Math.pow((part.r_outer_cm ?? 2.0) / 100, 2) * 0.5;
    I_total += I_part;
    CoM_num += mass * ((z_base + z_top) / 2);
    if (part.r_outer_cm) maxR_m = Math.max(maxR_m, part.r_outer_cm / 100);
    if (slot.z_override_cm === undefined) prevZTop = z_top;
    if (!tipPart && (TIP_COLLECTIONS.has(slot.partCollection) || part.partType === "tip")) {
      tipPart = part;
    }
  }

  const CoM_z_cm = totalMass_g > 0 ? CoM_num / totalMass_g : 0;
  const hasTip = !!tipPart;

  let spinDecayRate = 0;
  if (hasTip && I_total > 0 && totalMass_g > 0) {
    const mu = tipPart!.mu_k ?? 0.17;
    const r_m = (tipPart!.contactRadius_cm ?? 0.2) / 100;
    spinDecayRate = (mu * (totalMass_g / 1000) * G * r_m) / I_total;
  }

  const OWD = totalMass_g > 0
    ? Math.min(1, I_total / ((totalMass_g / 1000) * maxR_m * maxR_m))
    : 0;

  if (!hasTip) warnings.push("No tip — stack has no floor contact.");
  if (CoM_z_cm > 2.0) warnings.push("Heavy top — CoM above 2 cm may reduce stability.");

  // Derived stat bars (rough approximations from physics)
  const attackPct = Math.min(100, I_total * 1e6 * 2);
  const defensePct = Math.min(100, (totalMass_g / 80) * 100);
  const staminaPct = spinDecayRate > 0 ? Math.min(100, Math.max(0, (1 - spinDecayRate / 30) * 100)) : 0;

  return {
    totalMass_g,
    I_total_kgm2: I_total,
    CoM_z_cm,
    spinDecayRate,
    OWD: Math.max(0, Math.min(1, OWD)),
    hasTip,
    warnings,
    attackPct,
    defensePct,
    staminaPct,
  };
}

// ── Fusion helpers ─────────────────────────────────────────────────────────────

function fuseSlots(
  aSlots: StackSlot[],
  bSlots: StackSlot[],
  mode: FusionMode
): StackSlot[] {
  const reindex = (arr: StackSlot[]): StackSlot[] =>
    arr.map((s, i) => ({ ...s, slotIndex: i }));

  switch (mode) {
    case "interleave": {
      const result: StackSlot[] = [];
      const maxLen = Math.max(aSlots.length, bSlots.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < aSlots.length) result.push(aSlots[i]);
        if (i < bSlots.length) result.push(bSlots[i]);
      }
      return reindex(result);
    }
    case "b_on_a":
      return reindex([...aSlots, ...bSlots]);
    case "a_on_b":
      return reindex([...bSlots, ...aSlots]);
    case "merge_by_i":
      // For each index, keep whichever slot has higher I_kgm2 (prefer A on tie)
      // We can't know I without partMap here, so just interleave and let UI adjust
      return reindex([...aSlots, ...bSlots]);
    case "custom":
      return reindex([...aSlots]);
    default:
      return reindex([...aSlots, ...bSlots]);
  }
}

// ── Part collection display labels ─────────────────────────────────────────────

const PART_COLLECTIONS: { collection: string; label: string }[] = [
  { collection: "attack_ring_parts",  label: "Attack Ring / Layer" },
  { collection: "weight_disk_parts",  label: "Weight Disk / Disc" },
  { collection: "tip_parts",          label: "Performance Tip / Driver" },
  { collection: "core_parts",         label: "Core / Spin Gear" },
  { collection: "casing_parts",       label: "Casing / Sub-Part" },
  { collection: "spin_track_parts",   label: "Spin Track / Height Part" },
  { collection: "sub_parts",          label: "Sub-AR / Frame" },
  { collection: "bit_beast_parts",    label: "Bit Beast / God Chip" },
  { collection: "gear_parts",         label: "Gear Part" },
];

// ── Main component ─────────────────────────────────────────────────────────────

export default function StackBuilderPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // All available parts, keyed as "collection::id"
  const [allParts, setAllParts] = useState<PartEntry[]>([]);
  const [partsLoading, setPartsLoading] = useState(true);
  const partMap = useRef<Map<string, PartEntry>>(new Map());

  // Current stack being built
  const [stackName, setStackName] = useState("My Stack");
  const [slots, setSlots] = useState<StackSlot[]>([]);
  const [currentStackId, setCurrentStackId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  // Search / filter for part library
  const [partSearch, setPartSearch] = useState("");
  const [partColFilter, setPartColFilter] = useState("all");

  // Physics
  const [physics, setPhysics] = useState<PhysicsSummary | null>(null);

  // Drag state
  const dragFromIndex = useRef<number | null>(null);

  // Modals
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showFusionModal, setShowFusionModal] = useState(false);
  const [showSaveConfirm, setSaveConfirm] = useState(false);

  // Preset modal data
  const [presets, setPresets] = useState<BeybladeStack[]>([]);
  const [templates, setTemplates] = useState<StackTemplate[]>([]);
  const [presetsLoading, setPresetsLoading] = useState(false);

  // Fusion modal data
  const [fusionSourceId, setFusionSourceId] = useState("");
  const [fusionMode, setFusionMode] = useState<FusionMode>("b_on_a");
  const [fusionSourceSlots, setFusionSourceSlots] = useState<StackSlot[]>([]);
  const [fusionLoading, setFusionLoading] = useState(false);

  // Z-override editing
  const [editingZSlot, setEditingZSlot] = useState<number | null>(null);

  // ── Load all parts ───────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadParts() {
      setPartsLoading(true);
      const entries: PartEntry[] = [];
      await Promise.all(
        PART_COLLECTIONS.map(async ({ collection: col }) => {
          try {
            const snap = await getDocs(collection(db, col));
            for (const d of snap.docs) {
              const data = d.data() as Record<string, unknown>;
              const entry: PartEntry = {
                id: d.id,
                collection: col,
                name: (data.name as string) ?? d.id,
                generation: data.generation as string | undefined,
                mass_g: data.mass_g as number | undefined,
                I_kgm2: data.I_kgm2 as number | undefined,
                r_outer_cm: data.r_outer_cm as number | undefined,
                r_inner_cm: data.r_inner_cm as number | undefined,
                z_top_cm: data.z_top_cm as number | undefined,
                partType: data.partType as string | undefined,
                mu_k: data.mu_k as number | undefined,
                contactRadius_cm: data.contactRadius_cm as number | undefined,
              };
              entries.push(entry);
              partMap.current.set(`${col}::${d.id}`, entry);
            }
          } catch {
            // non-fatal — collection may be empty
          }
        })
      );
      setAllParts(entries);
      setPartsLoading(false);
    }
    loadParts();
  }, []);

  // ── Recompute physics whenever slots or parts change ────────────────────────

  useEffect(() => {
    if (slots.length === 0) { setPhysics(null); return; }
    setPhysics(computePhysics(slots, partMap.current));
  }, [slots]);

  // ── Filtered parts ───────────────────────────────────────────────────────────

  const filteredParts = allParts.filter((p) => {
    const matchCol = partColFilter === "all" || p.collection === partColFilter;
    const matchSearch = !partSearch ||
      p.name.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(partSearch.toLowerCase());
    return matchCol && matchSearch;
  });

  // ── Slot operations ──────────────────────────────────────────────────────────

  const addPart = useCallback((part: PartEntry) => {
    setSlots((prev) => [
      ...prev,
      {
        slotIndex: prev.length,
        partId: part.id,
        partCollection: part.collection,
        label: part.name,
      },
    ]);
  }, []);

  const removeSlot = useCallback((index: number) => {
    setSlots((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.map((s, i) => ({ ...s, slotIndex: i }));
    });
  }, []);

  const moveSlot = useCallback((fromIdx: number, toIdx: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next.map((s, i) => ({ ...s, slotIndex: i }));
    });
  }, []);

  const setZOverride = useCallback((slotIdx: number, value: number | undefined) => {
    setSlots((prev) =>
      prev.map((s, i) =>
        i === slotIdx ? { ...s, z_override_cm: value } : s
      )
    );
  }, []);

  // ── Native drag-and-drop ─────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragFromIndex.current = idx;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragFromIndex.current !== null && dragFromIndex.current !== idx) {
      moveSlot(dragFromIndex.current, idx);
      dragFromIndex.current = idx;
    }
  };

  const handleDragEnd = () => { dragFromIndex.current = null; };

  // ── Save / load stacks ───────────────────────────────────────────────────────

  const saveStack = async (publish = false) => {
    if (!currentUser) { toast.error("Please sign in to save."); return; }
    if (!stackName.trim()) { toast.error("Please enter a stack name."); return; }

    const id = currentStackId ?? `stack_${currentUser.uid}_${Date.now()}`;
    const stackData: BeybladeStack = {
      id,
      name: stackName.trim(),
      ownerId: currentUser.uid,
      slots,
      isPublic: publish || isPublic,
      tags: [],
      updatedAt: serverTimestamp(),
    };
    if (!currentStackId) {
      (stackData as BeybladeStack & { createdAt: unknown }).createdAt = serverTimestamp();
    }

    try {
      await setDoc(doc(db, COLLECTIONS.BEYBLADE_STACKS, id), stackData, { merge: true });
      setCurrentStackId(id);
      if (publish) setIsPublic(true);
      toast.success(publish ? "Stack published!" : "Stack saved!");
    } catch {
      toast.error("Failed to save stack.");
    }
  };

  const loadStack = async (stack: BeybladeStack) => {
    setCurrentStackId(stack.id);
    setStackName(stack.name);
    setSlots(stack.slots);
    setIsPublic(stack.isPublic);
    setShowPresetModal(false);
    toast.success(`Loaded "${stack.name}"`);
  };

  const useInBattle = () => {
    if (!currentStackId) {
      toast.error("Save your stack first.");
      return;
    }
    navigate(`/game/setup?stackId=${currentStackId}`);
  };

  // ── Load presets ─────────────────────────────────────────────────────────────

  const openPresetModal = async () => {
    setShowPresetModal(true);
    if (presets.length > 0 || templates.length > 0) return;
    setPresetsLoading(true);
    try {
      const [presSnap, tmplSnap] = await Promise.all([
        getDocs(query(
          collection(db, COLLECTIONS.BEYBLADE_STACKS),
          where("isPublic", "==", true)
        )),
        getDocs(collection(db, COLLECTIONS.STACK_TEMPLATES)),
      ]);
      setPresets(presSnap.docs.map((d) => ({ id: d.id, ...d.data() } as BeybladeStack)));
      setTemplates(tmplSnap.docs.map((d) => ({ id: d.id, ...d.data() } as StackTemplate)));
    } catch {
      toast.error("Failed to load presets.");
    } finally {
      setPresetsLoading(false);
    }
  };

  // ── Fusion ───────────────────────────────────────────────────────────────────

  const loadFusionSource = async () => {
    if (!fusionSourceId.trim()) { toast.error("Enter a stack ID."); return; }
    setFusionLoading(true);
    try {
      const d = await getDoc(doc(db, COLLECTIONS.BEYBLADE_STACKS, fusionSourceId.trim()));
      if (!d.exists()) { toast.error("Stack not found."); return; }
      const data = d.data() as BeybladeStack;
      setFusionSourceSlots(data.slots ?? []);
      toast.success(`Loaded source B: "${data.name}"`);
    } catch {
      toast.error("Failed to load source stack.");
    } finally {
      setFusionLoading(false);
    }
  };

  const applyFusion = () => {
    if (fusionSourceSlots.length === 0) { toast.error("Load source B first."); return; }
    const result = fuseSlots(slots, fusionSourceSlots, fusionMode);
    setSlots(result);
    setStackName((n) => `${n} [Fusion]`);
    setCurrentStackId(null); // new stack
    setShowFusionModal(false);
    toast.success("Fusion applied — review and save.");
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg1 text-text-primary flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-3 flex items-center gap-4 bg-bg2">
        <h1 className="text-lg font-bold text-text-primary">Stack Builder</h1>
        <input
          className="flex-1 max-w-xs bg-bg3 border border-border rounded px-3 py-1 text-sm text-text-primary"
          value={stackName}
          onChange={(e) => setStackName(e.target.value)}
          placeholder="Stack name..."
        />
        <div className="flex gap-2 ml-auto">
          <button
            onClick={openPresetModal}
            className="px-3 py-1.5 text-sm rounded border border-border bg-bg3 hover:bg-bg4 transition"
          >
            Load Preset
          </button>
          <button
            onClick={() => setShowFusionModal(true)}
            className="px-3 py-1.5 text-sm rounded border border-border bg-bg3 hover:bg-bg4 transition"
          >
            Fuse
          </button>
          <button
            onClick={() => saveStack(false)}
            className="px-3 py-1.5 text-sm rounded bg-theme-blue text-white hover:opacity-90 transition"
          >
            Save
          </button>
          <button
            onClick={() => saveStack(true)}
            className="px-3 py-1.5 text-sm rounded bg-theme-green text-white hover:opacity-90 transition"
          >
            Publish
          </button>
          <button
            onClick={useInBattle}
            className="px-3 py-1.5 text-sm rounded bg-theme-red text-white hover:opacity-90 transition"
          >
            Use in Battle
          </button>
        </div>
      </div>

      {/* Body: 3-panel layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Left: Part Library */}
        <aside className="w-72 flex-shrink-0 border-r border-border bg-bg2 flex flex-col">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Part Library</p>
            <input
              className="w-full bg-bg3 border border-border rounded px-2 py-1.5 text-sm text-text-primary mb-2"
              placeholder="Search parts..."
              value={partSearch}
              onChange={(e) => setPartSearch(e.target.value)}
            />
            <select
              className="w-full bg-bg3 border border-border rounded px-2 py-1.5 text-sm text-text-primary"
              value={partColFilter}
              onChange={(e) => setPartColFilter(e.target.value)}
            >
              <option value="all">All types</option>
              {PART_COLLECTIONS.map((pc) => (
                <option key={pc.collection} value={pc.collection}>{pc.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {partsLoading ? (
              <p className="text-xs text-text-muted text-center py-4">Loading parts...</p>
            ) : filteredParts.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">No parts found.</p>
            ) : (
              filteredParts.map((p) => (
                <button
                  key={`${p.collection}::${p.id}`}
                  onClick={() => addPart(p)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-bg3 transition mb-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-primary truncate">{p.name}</span>
                    <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 ml-1">+</span>
                  </div>
                  <div className="flex gap-2 text-xs text-text-muted mt-0.5">
                    {p.generation && <span>{p.generation}</span>}
                    {p.mass_g != null && <span>{p.mass_g}g</span>}
                    <span className="truncate">
                      {PART_COLLECTIONS.find((c) => c.collection === p.collection)?.label ?? p.collection}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Center: Stack Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase">
              Stack Canvas
              <span className="ml-2 font-normal normal-case text-text-muted">
                {slots.length} slot{slots.length !== 1 ? "s" : ""} — bottom (index 0) = floor contact
              </span>
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-muted">
                <p className="text-sm">Click a part to add it, or load a preset.</p>
              </div>
            ) : (
              <div className="space-y-2 max-w-lg mx-auto">
                {slots.map((slot, idx) => {
                  const part = partMap.current.get(`${slot.partCollection}::${slot.partId}`);
                  return (
                    <div
                      key={`${slot.slotIndex}-${slot.partId}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-2 bg-bg2 border border-border rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing select-none"
                    >
                      <span className="text-xs text-text-muted w-4 text-right">{idx}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {slot.label ?? slot.partId}
                        </p>
                        <p className="text-xs text-text-muted">
                          {PART_COLLECTIONS.find((c) => c.collection === slot.partCollection)?.label ?? slot.partCollection}
                          {part?.mass_g != null ? ` · ${part.mass_g}g` : ""}
                          {slot.z_override_cm != null ? ` · z=${slot.z_override_cm.toFixed(1)}cm` : ""}
                        </p>
                      </div>

                      {/* Z override toggle */}
                      <button
                        onClick={() => setEditingZSlot(editingZSlot === idx ? null : idx)}
                        className="text-xs text-text-muted hover:text-text-primary px-1"
                        title="Set z override"
                      >
                        z
                      </button>

                      <button
                        onClick={() => removeSlot(idx)}
                        className="text-xs text-theme-red hover:opacity-80 px-1"
                        title="Remove slot"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                {/* Z override editor (inline, shown below the edited slot) */}
                {editingZSlot !== null && (
                  <div className="bg-bg3 border border-border rounded-lg px-3 py-2 text-sm">
                    <label className="text-xs text-text-secondary block mb-1">
                      Z override for slot {editingZSlot} (cm from floor, or blank for auto):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="bg-bg2 border border-border rounded px-2 py-1 text-sm w-28"
                        defaultValue={slots[editingZSlot]?.z_override_cm ?? ""}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setZOverride(editingZSlot, isNaN(v) ? undefined : v);
                        }}
                        placeholder="auto"
                      />
                      <button
                        onClick={() => { setZOverride(editingZSlot, undefined); setEditingZSlot(null); }}
                        className="text-xs text-text-muted hover:text-text-primary"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Right: Physics Summary */}
        <aside className="w-64 flex-shrink-0 border-l border-border bg-bg2 flex flex-col">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase">Physics Summary</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!physics ? (
              <p className="text-xs text-text-muted">Add parts to see physics.</p>
            ) : (
              <>
                <StatRow label="Mass" value={`${physics.totalMass_g.toFixed(1)} g`} />
                <StatRow label="I_total" value={`${(physics.I_total_kgm2 * 1e5).toFixed(2)} ×10⁻⁵ kg·m²`} />
                <StatRow label="CoM Z" value={`${physics.CoM_z_cm.toFixed(2)} cm`} />
                <StatRow label="Spin Decay" value={`${physics.spinDecayRate.toFixed(2)} rad/s²`} />
                <StatRow label="OWD" value={physics.OWD.toFixed(3)} />

                <div className="space-y-1.5 pt-1">
                  <StatBar label="Attack" pct={physics.attackPct} color="bg-theme-red" />
                  <StatBar label="Defense" pct={physics.defensePct} color="bg-theme-blue" />
                  <StatBar label="Stamina" pct={physics.staminaPct} color="bg-theme-green" />
                </div>

                {physics.warnings.length > 0 && (
                  <div className="pt-1 space-y-1">
                    {physics.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-theme-yellow">⚠ {w}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Load Preset Modal */}
      {showPresetModal && (
        <Modal title="Load Preset" onClose={() => setShowPresetModal(false)}>
          {presetsLoading ? (
            <p className="text-sm text-text-muted py-4 text-center">Loading...</p>
          ) : (
            <>
              {templates.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Templates</p>
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSlots(t.slots.map((s) => ({
                          slotIndex: s.slotIndex,
                          partId: "",
                          partCollection: s.partTypeHint as string,
                          label: s.label,
                        })));
                        setStackName(t.name);
                        setCurrentStackId(null);
                        setShowPresetModal(false);
                        toast.success(`Template "${t.name}" loaded — fill in the parts.`);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-bg3 transition mb-1"
                    >
                      <p className="text-sm font-medium text-text-primary">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {presets.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Public Stacks</p>
                  {presets.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => loadStack(s)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-bg3 transition mb-1"
                    >
                      <p className="text-sm font-medium text-text-primary">{s.name}</p>
                      <p className="text-xs text-text-muted">{s.slots.length} slots · {s.tags.join(", ")}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No public stacks yet.</p>
              )}
            </>
          )}
        </Modal>
      )}

      {/* Fusion Modal */}
      {showFusionModal && (
        <Modal title="Fuse Stacks" onClose={() => setShowFusionModal(false)}>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-text-secondary mb-1">Stack A (current canvas): {slots.length} slots</p>
              <p className="text-xs text-text-secondary mb-1">Stack B source (enter stack ID):</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-bg3 border border-border rounded px-2 py-1.5 text-sm"
                  value={fusionSourceId}
                  onChange={(e) => setFusionSourceId(e.target.value)}
                  placeholder="stack_uid_123..."
                />
                <button
                  onClick={loadFusionSource}
                  disabled={fusionLoading}
                  className="px-3 py-1.5 rounded bg-bg3 border border-border hover:bg-bg4 transition disabled:opacity-50"
                >
                  {fusionLoading ? "..." : "Load"}
                </button>
              </div>
              {fusionSourceSlots.length > 0 && (
                <p className="text-xs text-theme-green mt-1">✓ Source B loaded: {fusionSourceSlots.length} slots</p>
              )}
            </div>

            <div>
              <p className="text-xs text-text-secondary mb-1">Fusion mode:</p>
              <select
                className="w-full bg-bg3 border border-border rounded px-2 py-1.5"
                value={fusionMode}
                onChange={(e) => setFusionMode(e.target.value as FusionMode)}
              >
                <option value="b_on_a">B on top of A</option>
                <option value="a_on_b">A on top of B</option>
                <option value="interleave">Interleave (A[0],B[0],A[1]…)</option>
                <option value="merge_by_i">Merge (both slots, review manually)</option>
                <option value="custom">Custom (A only — then add B slots manually)</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowFusionModal(false)}
                className="px-3 py-1.5 rounded border border-border hover:bg-bg3 transition"
              >
                Cancel
              </button>
              <button
                onClick={applyFusion}
                disabled={fusionSourceSlots.length === 0}
                className="px-3 py-1.5 rounded bg-theme-blue text-white hover:opacity-90 transition disabled:opacity-50"
              >
                Apply Fusion
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="text-xs font-mono text-text-primary">{value}</span>
    </div>
  );
}

function StatBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-muted">{Math.round(pct)}</span>
      </div>
      <div className="h-1.5 bg-bg3 rounded-sm overflow-hidden">
        <div
          className={`h-full rounded-sm transition-all ${color}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg2 border border-border rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary"
            tabIndex={-1}
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
