/**
 * BeybladeSystemEditor — compositor with dynamic slot tabs.
 *
 * Tabs: Overview, Bit Beast, Attack Ring, Weight Disk, Base › Tip,
 *       Base › Core, Base › Casing, Sub-Parts, Preview.
 *
 * Right panel: BeybladeSystemPreview (live 3-panel preview + computed stats).
 */

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, getDocs, updateDoc, serverTimestamp, collection, setDoc } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import toast from "react-hot-toast";
import { C } from "@/styles/theme";
import { SlotTab } from "./SlotTab";
import { BeybladeSystemPreview } from "./BeybladeSystemPreview";
import { PartPicker } from "./PartPicker";
import { resolveBeybladeSystem, computeBeybladeStats } from "@/lib/beybladeSystemConverter";
import type { ResolvedBeybladeSystem } from "@/lib/beybladeSystemConverter";
import type { BeybladeSystem, SubPartAttachment, SubPartParent } from "@/types/beybladeSystem";

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
  | "preview";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "overview",     label: "Overview" },
  { key: "bit_beast",    label: "Bit Beast" },
  { key: "attack_ring",  label: "Attack Ring" },
  { key: "weight_disk",  label: "Weight Disk" },
  { key: "tip",          label: "Tip" },
  { key: "core",         label: "Core" },
  { key: "casing",       label: "Casing" },
  { key: "spin_track",   label: "Spin Track" },
  { key: "sub_parts",    label: "Sub-Parts" },
  { key: "preview",      label: "Preview" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartDoc = Record<string, any>;

interface Props {
  systemId: string;
}

export function BeybladeSystemEditor({ systemId }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [system, setSystem] = useState<BeybladeSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [partCache, setPartCache] = useState<Record<string, PartDoc>>({});
  const [resolved, setResolved] = useState<ResolvedBeybladeSystem | null>(null);

  // Load system doc
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

  // Fetch a part by collection + id, cache it
  const fetchPart = useCallback(async (col: string, id: string) => {
    if (!id || partCache[id]) return;
    try {
      const snap = await getDoc(doc(db, col, id));
      if (snap.exists()) {
        setPartCache((c) => ({ ...c, [id]: { id: snap.id, ...snap.data() } }));
      }
    } catch { /* ignore */ }
  }, [partCache]);

  // Fetch sub-parts collection for picker
  const [subPartDocs, setSubPartDocs] = useState<PartDoc[]>([]);
  useEffect(() => {
    getDocs(collection(db, COLLECTIONS.SUB_PARTS))
      .then((snap) => setSubPartDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {});
  }, []);

  // Whenever system changes, fetch all referenced parts
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

  // Try to resolve the system whenever parts are available
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

  if (loading) return <div style={{ padding: 32, color: C.muted }}>Loading…</div>;
  if (!system) return <div style={{ padding: 32, color: C.red }}>System not found.</div>;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* ── LEFT: Tab editor ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, borderRight: `1px solid ${C.border}` }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 20px",
          borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{system.displayName}</div>
            <div style={{ fontSize: 11, color: C.faint }}>ID: {systemId}</div>
          </div>
          {dirty && <span style={{ fontSize: 11, color: C.yellow, background: C.yellow + "18", padding: "3px 8px", borderRadius: 5 }}>Unsaved</span>}
          {resolved && (
            <button
              onClick={publishToStats}
              disabled={saving}
              style={{
                padding: "7px 14px", background: C.green + "22", color: C.green,
                border: `1px solid ${C.green}44`, borderRadius: 7, fontSize: 12,
                fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              Publish Stats
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty}
            style={{
              padding: "7px 18px", background: dirty ? C.blue : C.bg3,
              color: dirty ? "#fff" : C.faint, border: "none", borderRadius: 7,
              fontSize: 12, fontWeight: 600, cursor: dirty ? "pointer" : "default",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {/* Tab strip */}
        <div style={{ display: "flex", gap: 2, padding: "6px 20px 0", borderBottom: `1px solid ${C.border}`, background: C.bg1, flexShrink: 0, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "6px 12px", fontSize: 11, borderRadius: "5px 5px 0 0",
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

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20, background: C.bg0 }}>

          {/* Overview */}
          {tab === "overview" && (
            <div style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 5 }}>Display Name</label>
                <input
                  value={system.displayName}
                  onChange={(e) => updateSystem({ displayName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 5 }}>Spin Direction</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["right", "left"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => updateSystem({ spinDirection: d })}
                      style={{
                        padding: "7px 18px", fontSize: 13, borderRadius: 7, cursor: "pointer",
                        background: system.spinDirection === d ? (d === "right" ? C.blue + "22" : "#ef444422") : C.bg2,
                        color: system.spinDirection === d ? (d === "right" ? C.blue : "#ef4444") : C.muted,
                        border: `1px solid ${system.spinDirection === d ? (d === "right" ? C.blue + "55" : "#ef444455") : C.border}`,
                      }}
                    >
                      {d === "right" ? "↻ Right-Spin" : "↺ Left-Spin"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>
                <div style={{ marginBottom: 4 }}>Linked Stats ID: <code style={{ color: C.text }}>{system.linkedStatsId ?? "(none — publish to create)"}</code></div>
              </div>

              {/* Combined-bey section (Phantom Fox MS etc.) */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>Combined Bey (Split Gimmick)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4 }}>Partner System ID</label>
                    <input
                      value={system.combinedWith?.partnerBeySystemId ?? ""}
                      placeholder="(none — leave blank for single bey)"
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        updateSystem({
                          combinedWith: val
                            ? { partnerBeySystemId: val, linkSubPartIndex: system.combinedWith?.linkSubPartIndex ?? 0, playerControlTarget: system.combinedWith?.playerControlTarget ?? "this" }
                            : undefined,
                        });
                      }}
                      style={{ width: "100%", padding: "7px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                  {system.combinedWith && (
                    <>
                      <div>
                        <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4 }}>Link Sub-Part Index (split spring position)</label>
                        <input
                          type="number"
                          min={0}
                          value={system.combinedWith.linkSubPartIndex}
                          onChange={(e) => updateSystem({ combinedWith: { ...system.combinedWith!, linkSubPartIndex: Number(e.target.value) } })}
                          style={{ width: 80, padding: "6px 10px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 4 }}>Player Controls</label>
                        <div style={{ display: "flex", gap: 6 }}>
                          {(["this", "partner"] as const).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => updateSystem({ combinedWith: { ...system.combinedWith!, playerControlTarget: opt } })}
                              style={{
                                padding: "5px 14px", fontSize: 11, borderRadius: 6, cursor: "pointer",
                                background: system.combinedWith!.playerControlTarget === opt ? C.blue + "22" : C.bg2,
                                color: system.combinedWith!.playerControlTarget === opt ? C.blue : C.muted,
                                border: `1px solid ${system.combinedWith!.playerControlTarget === opt ? C.blue + "55" : C.border}`,
                              }}
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

          {/* Bit Beast slot */}
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

          {/* Attack Ring slot */}
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

          {/* Weight Disk slot */}
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

          {/* Tip slot */}
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

          {/* Core slot */}
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

          {/* Casing slot */}
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

          {/* Spin Track slot (MFB) */}
          {tab === "spin_track" && (
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
                Spin Track is an MFB-specific height piece (e.g. S130, 145). Leave blank for plastic-gen beyblades. Mutually exclusive with Casing for height stacking.
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
                <div style={{ marginTop: 12, padding: "8px 12px", background: C.yellow + "18", border: `1px solid ${C.yellow}44`, borderRadius: 7, fontSize: 11, color: C.yellow }}>
                  Track equipped — all AR/WD/Casing CP height ranges will be offset by track.height at runtime (stored values remain relative to floor).
                </div>
              )}
            </div>
          )}

          {/* Sub-Parts */}
          {tab === "sub_parts" && (
            <SubPartsEditor
              attachments={system.subPartAttachments ?? []}
              onChange={(atts) => updateSystem({ subPartAttachments: atts })}
              subPartDocs={subPartDocs}
            />
          )}

          {/* Preview tab (full-width single panel) */}
          {tab === "preview" && (
            <div style={{ maxWidth: 900 }}>
              <BeybladeSystemPreview resolved={resolved} />
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Live preview sidebar ─────────────────────────────────────── */}
      <div style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", background: C.bg1 }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.faint }}>
          Live Preview
          {!resolved && <span style={{ marginLeft: 8, color: C.yellow }}>· incomplete (select all parts)</span>}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <BeybladeSystemPreview resolved={resolved} />
        </div>
      </div>
    </div>
  );
}

// ── Sub-Parts tab sub-component ───────────────────────────────────────────────

const PARENT_OPTIONS: SubPartParent[] = ["ar", "wd", "casing", "bit_beast", "tip", "core"];

function SubPartsEditor({
  attachments,
  onChange,
  subPartDocs,
}: {
  attachments: SubPartAttachment[];
  onChange: (atts: SubPartAttachment[]) => void;
  subPartDocs: PartDoc[];
}) {
  const [adding, setAdding] = useState(false);

  const update = (idx: number, patch: Partial<SubPartAttachment>) => {
    onChange(attachments.map((a, i) => i === idx ? { ...a, ...patch } : a));
  };

  const remove = (idx: number) => {
    onChange(attachments.filter((_, i) => i !== idx));
  };

  const add = (partId: string) => {
    const newAtt: SubPartAttachment = {
      subPartId: partId,
      parentPart: "ar",
      placement: "above",
      flipped: false,
    };
    onChange([...attachments, newAtt]);
    setAdding(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: C.muted }}>Sub-Parts ({attachments.length})</div>
        <button
          onClick={() => setAdding((a) => !a)}
          style={{
            padding: "4px 12px", fontSize: 11, borderRadius: 6, cursor: "pointer",
            background: adding ? C.blue : C.bg3, color: adding ? "#fff" : C.muted,
            border: `1px solid ${adding ? C.blue : C.border}`,
          }}
        >
          {adding ? "Cancel" : "+ Add Sub-Part"}
        </button>
      </div>

      {adding && (
        <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
          <PartPicker
            collectionName={COLLECTIONS.SUB_PARTS}
            onSelect={(id) => add(id)}
            label="Select Sub-Part"
          />
        </div>
      )}

      {attachments.map((att, idx) => {
        const partDoc = subPartDocs.find((p) => p.id === att.subPartId);
        return (
          <div key={idx} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: partDoc?.color ?? C.faint, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: C.text, fontWeight: 600 }}>
                {partDoc?.displayName ?? att.subPartId}
              </span>
              <button onClick={() => remove(idx)} style={{ background: "none", border: "none", color: C.red, fontSize: 14, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Attach to</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {PARENT_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => update(idx, { parentPart: p })}
                      style={{
                        padding: "2px 7px", fontSize: 10, borderRadius: 4, cursor: "pointer",
                        background: att.parentPart === p ? C.blue + "22" : C.bg3,
                        color: att.parentPart === p ? C.blue : C.faint,
                        border: `1px solid ${att.parentPart === p ? C.blue + "44" : C.border}`,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Placement</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {(["above", "below"] as const).map((pl) => (
                    <button
                      key={pl}
                      onClick={() => update(idx, { placement: pl })}
                      style={{
                        padding: "2px 7px", fontSize: 10, borderRadius: 4, cursor: "pointer",
                        background: att.placement === pl ? C.blue + "22" : C.bg3,
                        color: att.placement === pl ? C.blue : C.faint,
                        border: `1px solid ${att.placement === pl ? C.blue + "44" : C.border}`,
                      }}
                    >
                      {pl}
                    </button>
                  ))}
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={att.flipped}
                  onChange={(e) => update(idx, { flipped: e.target.checked })}
                  style={{ accentColor: C.blue }}
                />
                <span style={{ fontSize: 10, color: C.faint }}>Flipped</span>
              </label>
            </div>

            {(partDoc?.configurations?.length ?? 0) > 0 && (
              <div>
                <div style={{ fontSize: 10, color: C.faint, marginBottom: 3 }}>Config</div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {(partDoc?.configurations ?? []).map((cfg: { name: string }) => (
                    <button
                      key={cfg.name}
                      onClick={() => update(idx, { activeConfig: cfg.name })}
                      style={{
                        padding: "2px 7px", fontSize: 10, borderRadius: 4, cursor: "pointer",
                        background: att.activeConfig === cfg.name ? C.blue + "22" : C.bg3,
                        color: att.activeConfig === cfg.name ? C.blue : C.faint,
                        border: `1px solid ${att.activeConfig === cfg.name ? C.blue + "44" : C.border}`,
                      }}
                    >
                      {cfg.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {attachments.length === 0 && !adding && (
        <div style={{ fontSize: 11, color: C.faint }}>No sub-parts. Add sub-ARs, sub-casings, or WD sub-parts here.</div>
      )}
    </div>
  );
}
