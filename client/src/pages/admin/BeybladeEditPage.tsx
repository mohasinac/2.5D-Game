import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, COLLECTIONS } from "@/lib/firebase";
import type { BeybladeStats } from "@/types/beybladeStats";
import { useElementTypes } from "@/hooks/useElementTypes";
import { useCombos } from "@/hooks/useCombos";
import { useSpecialMoves } from "@/hooks/useSpecialMoves";
import { useAssetLibrary } from "@/hooks/useAssetLibrary";
import { KEY_LABEL } from "@/constants/combos";
import toast from "react-hot-toast";

const LBL = "block text-xs text-muted mb-1.5";
const INP = "w-full bg-bg3 border border-border-c rounded-lg px-3 py-2 text-theme-text text-[13px]";
const SEC_TITLE = "text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-3";
import WhatsAppStyleImageEditor from "@/components/admin/WhatsAppStyleImageEditor";
import ImageCropper from "@/components/admin/ImageCropper";
import type { ImageCropperRef } from "@/components/admin/ImageCropper";
import BeybladePreview from "@/components/admin/BeybladePreview";
import Step3ContactPoints from "@/components/admin/Step3ContactPoints";
import { SearchableSelect, type SelectOption } from "@/components/admin/SearchableSelect";

const TOTAL_POINTS = 360;
const MAX_PER_TYPE = 150;

const BEY_TYPE_BTNS = [
  { value: "attack",   label: "Attack",   activeClass: "bg-theme-red text-white border-theme-red",     inactiveClass: "bg-transparent text-theme-muted border-border-c" },
  { value: "defense",  label: "Defense",  activeClass: "bg-theme-blue text-white border-theme-blue",   inactiveClass: "bg-transparent text-theme-muted border-border-c" },
  { value: "stamina",  label: "Stamina",  activeClass: "bg-theme-green text-white border-theme-green", inactiveClass: "bg-transparent text-theme-muted border-border-c" },
  { value: "balanced", label: "Balanced", activeClass: "bg-theme-muted text-white border-theme-muted", inactiveClass: "bg-transparent text-theme-muted border-border-c" },
] as const;

function StatBar({ label, value, colorClass, remaining, onChange }: {
  label: string; value: number; colorClass: string; remaining: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1">
        <span className={colorClass}>{label}</span>
        <span className="text-theme-text font-mono">{value} / {MAX_PER_TYPE}</span>
      </div>
      <input
        type="range" min={0} max={Math.min(MAX_PER_TYPE, value + remaining)} value={value}
        onChange={e => onChange(+e.target.value)}
        className="accent-theme-blue w-full"
      />
      <div
        className={`w-full h-[5px] bg-bg3 rounded-[3px] overflow-hidden mt-1`}
      >
        <div
          className={`h-full rounded-[3px] transition-[width_150ms] ${colorClass.replace("text-", "bg-")}`}
          style={{ "--pct": `${(value / MAX_PER_TYPE) * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export function BeybladeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [beyblade, setBeyblade] = useState<BeybladeStats | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editorMode, setEditorMode] = useState<"whatsapp" | "crop" | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState("");
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const cropperRef = useRef<ImageCropperRef>(null);
  const { configs: elementTypeConfigs, loading: elemTypesLoading } = useElementTypes();
  const { combos, loading: combosLoading } = useCombos();
  const { specialMoves, loading: specialMovesLoading } = useSpecialMoves();
  const { assets: bitBeastAssets, loading: bitBeastsLoading } = useAssetLibrary(COLLECTIONS.BITBEAST_ASSETS);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, id));
        if (!snap.exists()) { toast.error("Beyblade not found"); navigate("/admin/beyblades"); return; }
        const data = { id: snap.id, ...snap.data() } as BeybladeStats;
        setBeyblade(data);
        setImagePreview(data.imageUrl ?? "");
        if (data.imagePosition) setImagePosition(data.imagePosition);
      } catch { toast.error("Failed to load beyblade"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const set = (key: keyof BeybladeStats, value: any) => setBeyblade(b => b ? { ...b, [key]: value } : b);
  const setDist = (key: "attack" | "defense" | "stamina", value: number) =>
    setBeyblade(b => b ? { ...b, typeDistribution: { ...b.typeDistribution, [key]: value, total: TOTAL_POINTS } } : b);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setRawImageUrl(url);
      const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
      setEditorMode(isGif ? null : "whatsapp");
      if (isGif) setImagePreview(url);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorSave = async () => {
    if (editorMode === "crop" && cropperRef.current) {
      try {
        const blob = await cropperRef.current.getCroppedImage();
        const url = URL.createObjectURL(blob);
        setImagePreview(url);
        const croppedFile = new File([blob], imageFile?.name ?? "cropped.jpg", { type: "image/jpeg" });
        setImageFile(croppedFile);
      } catch {
        toast.error("Failed to crop image");
      }
    } else {
      setImagePreview(rawImageUrl);
    }
    setEditorMode(null);
  };

  const handleSave = async () => {
    if (!beyblade || !id) return;
    const { attack, defense, stamina } = beyblade.typeDistribution;
    if (attack + defense + stamina !== TOTAL_POINTS) { toast.error(`Points must total ${TOTAL_POINTS}`); return; }
    setSaving(true);
    try {
      let imageUrl = beyblade.imageUrl ?? "";
      if (imageFile) {
        const imageRef = ref(storage, `beyblades/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      let damageMultiplier = 1.0 + attack * 0.007;
      let damageTaken = Math.max(0.45, 1 - defense * 0.003);
      const knockbackDistance = 10 * (1 - defense * 0.00167);
      const invulnerabilityChance = 0.1 + defense * 0.000667;
      let maxStamina = Math.ceil(1000 * (1 + stamina * 0.01333));
      const spinStealFactor = 0.1 * (1 + stamina * 0.02667);
      const spinDecayRate = 8 * (1 - stamina * 0.001);
      const maxSpin = Math.ceil(2000 * (1 + stamina * 0.0008));
      const speedBonus = 1.0 + attack * 0.007;
      switch (beyblade.type) {
        case "attack": damageMultiplier *= 1.2; maxStamina = 2500; break;
        case "defense": damageTaken *= 0.8; maxStamina = 2500; break;
        case "balanced": maxStamina = Math.min(maxStamina, 2500); break;
      }
      await updateDoc(doc(db, COLLECTIONS.BEYBLADE_STATS, id), {
        displayName: beyblade.displayName, type: beyblade.type,
        spinDirection: beyblade.spinDirection, mass: beyblade.mass, radius: beyblade.radius,
        imageUrl, imagePosition,
        typeDistribution: beyblade.typeDistribution,
        damageMultiplier, damageTaken, knockbackDistance,
        invulnerabilityChance, spinDecayRate, maxSpin, spinStealFactor,
        maxStamina, speedBonus,
        pointsOfContact: beyblade.pointsOfContact ?? [],
        spinStealPoints: beyblade.spinStealPoints ?? [],
        elementTypes: beyblade.elementTypes ?? [],
        specialMoveId: (beyblade as any).specialMoveId ?? null,
        comboIds: (beyblade as any).comboIds ?? [],
        updatedAt: serverTimestamp(),
      });
      toast.success("Saved!");
    } catch (err) { console.error(err); toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-[200px]">
      <div className="spin w-8 h-8 border-2 border-theme-blue border-t-transparent rounded-full" />
    </div>
  );
  if (!beyblade) return null;

  const { attack, defense, stamina } = beyblade.typeDistribution;
  const usedPoints = attack + defense + stamina;
  const remaining = TOTAL_POINTS - usedPoints;

  return (
    <div className="page-shell p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Link to="/admin/beyblades" className="text-theme-faint text-[13px] no-underline">← Beyblades</Link>
          <h1 className="text-[22px] font-bold text-theme-text mt-1.5">Edit: {beyblade.displayName}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || usedPoints !== TOTAL_POINTS}
          className="px-5 py-2 bg-theme-blue text-white rounded-lg text-[13px] font-medium border-none cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Two-column: editors left, preview right */}
      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1fr 390px" }}>
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Basic Info */}
          <div className="bg-bg2 border border-border-c rounded-2xl p-5">
            <div className={SEC_TITLE}>Basic Info</div>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className={LBL}>Display Name</label>
                <input type="text" value={beyblade.displayName} onChange={e => set("displayName", e.target.value)} className={INP} />
              </div>
              <div>
                <label className={LBL}>Beyblade Type</label>
                <div className="flex gap-1.5">
                  {BEY_TYPE_BTNS.map(({ value, label, activeClass, inactiveClass }) => (
                    <button
                      key={value}
                      onClick={() => set("type", value)}
                      className={`flex-1 py-1.5 rounded-md text-[12px] font-medium cursor-pointer border transition-colors
                        ${beyblade.type === value ? activeClass : inactiveClass}`}
                    >{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={LBL}>Spin Direction</label>
                <div className="flex gap-1.5">
                  {(["right", "left"] as const).map(dir => (
                    <button
                      key={dir}
                      onClick={() => set("spinDirection", dir)}
                      className={`flex-1 py-1.5 rounded-md text-[12px] font-medium cursor-pointer capitalize border transition-colors
                        ${beyblade.spinDirection === dir
                          ? "bg-theme-blue text-white border-theme-blue"
                          : "bg-transparent text-theme-muted border-border-c"
                        }`}
                    >{dir}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={LBL}>Mass (g)</label>
                  <input type="number" min={30} max={80} value={beyblade.mass} onChange={e => set("mass", +e.target.value)} className={INP} />
                </div>
                <div>
                  <label className={LBL}>Radius (cm)</label>
                  <input type="number" min={2} max={7} step={0.5} value={beyblade.radius} onChange={e => set("radius", +e.target.value)} className={INP} />
                </div>
              </div>
            </div>
          </div>

          {/* Sprite Image */}
          <div className="bg-bg2 border border-border-c rounded-2xl p-5">
            <div className={SEC_TITLE}>Sprite Image</div>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-bg1 border border-border-c flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  : <span className="text-[24px] text-theme-faint">🌀</span>
                }
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-block px-4 py-1.5 bg-bg3 border border-border-c rounded-lg text-[13px] text-theme-muted">
                  {imagePreview ? "Replace Image" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imageFile && (
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditorMode("whatsapp")}
                      className="px-3 py-1 bg-bg3 border border-border-c rounded-md text-[11px] text-theme-muted cursor-pointer"
                    >
                      🖼 Reposition
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("crop")}
                      className="px-3 py-1 bg-bg3 border border-border-c rounded-md text-[11px] text-theme-muted cursor-pointer"
                    >
                      ✂️ Crop
                    </button>
                  </div>
                )}
                <p className="text-[11px] text-theme-faint mt-1">PNG with transparent background, 300×300px</p>
              </div>
            </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-bg2 border border-border-c rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className={SEC_TITLE}>Type Distribution</div>
              <span className={`text-[12px] font-mono font-bold
                ${remaining === 0 ? "text-theme-green" : remaining < 0 ? "text-theme-red" : "text-theme-yellow"}`}>
                {remaining > 0 ? `${remaining} left` : remaining < 0 ? `${Math.abs(remaining)} over!` : "✓ Balanced"}
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              <StatBar label="Attack"  value={attack}  colorClass="text-theme-red"   remaining={remaining} onChange={v => setDist("attack", v)} />
              <StatBar label="Defense" value={defense} colorClass="text-theme-blue"  remaining={remaining} onChange={v => setDist("defense", v)} />
              <StatBar label="Stamina" value={stamina} colorClass="text-theme-green" remaining={remaining} onChange={v => setDist("stamina", v)} />
            </div>
            {/* Derived stats */}
            <div className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-theme-faint">
              {((): [string, string][] => {
                const dmg = (1.0 + attack * 0.007) * (beyblade.type === "attack" ? 1.2 : 1);
                const taken = Math.max(0.45, 1 - defense * 0.003) * (beyblade.type === "defense" ? 0.8 : 1);
                const hp = beyblade.type === "stamina" ? Math.ceil(1000 * (1 + stamina * 0.01333)) : Math.min(Math.ceil(1000 * (1 + stamina * 0.01333)), 2500);
                return [
                  ["Damage", `${dmg.toFixed(2)}x`],
                  ["Taken", `${(taken * 100).toFixed(0)}%`],
                  ["Max HP", `${hp}`],
                  ["Spin Steal", `${((0.1 * (1 + stamina * 0.02667)) * 100).toFixed(1)}%`],
                  ["Max Spin", `${Math.ceil(2000 * (1 + stamina * 0.0008))}`],
                  ["Decay", `${(8 * (1 - stamina * 0.001)).toFixed(1)}/s`],
                ];
              })().map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span>{k}:</span>
                  <span className="text-theme-text font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Element Types */}
          <div className="bg-bg2 border border-border-c rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-semibold text-theme-text">
                Element Types <span className="font-normal text-theme-faint text-[12px]">(max 2)</span>
              </div>
              <a href="/admin/element-types" target="_blank" rel="noreferrer" className="text-[11px] text-theme-blue no-underline">Manage types ↗</a>
            </div>

            {/* Selected badges */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {(beyblade.elementTypes ?? []).map(slug => {
                const cfg = elementTypeConfigs.find(c => c.id === slug);
                return (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-[5px] px-2.5 py-1 rounded-[20px] text-[12px] text-theme-text border"
                    style={{
                      "--el-color": cfg?.color ?? "transparent",
                      background: cfg ? "color-mix(in srgb, var(--el-color) 20%, transparent)" : undefined,
                      borderColor: cfg ? "var(--el-color)" : undefined,
                    } as React.CSSProperties}
                  >
                    {cfg?.icon ?? "?"} {cfg?.name ?? slug}
                    <button
                      type="button"
                      onClick={() => set("elementTypes", (beyblade.elementTypes ?? []).filter(e => e !== slug))}
                      className="bg-transparent border-none text-theme-muted cursor-pointer text-[14px] leading-none p-0 ml-0.5"
                    >×</button>
                  </span>
                );
              })}
              {(beyblade.elementTypes?.length ?? 0) === 0 && (
                <span className="text-[12px] text-theme-faint">No types selected</span>
              )}
            </div>

            {(beyblade.elementTypes?.length ?? 0) < 2 && (
              <SearchableSelect
                value=""
                disabled={elemTypesLoading}
                emptyLabel={elemTypesLoading ? "Loading types…" : "Add element type…"}
                options={elementTypeConfigs
                  .filter(cfg => !(beyblade.elementTypes ?? [] as string[]).includes(cfg.id))
                  .map(cfg => ({ value: cfg.id, label: `${cfg.icon} ${cfg.name}` }))}
                onChange={v => {
                  if (!v) return;
                  const cur = beyblade.elementTypes ?? [] as string[];
                  if (!cur.includes(v) && cur.length < 2) set("elementTypes", [...cur, v]);
                }}
                className="bg-bg1 border border-border-c rounded-lg px-3 py-[7px] text-[13px] cursor-pointer min-w-[180px]"
              />
            )}
          </div>

          {/* Advanced Physics */}
          <div className="bg-bg2 border border-border-c rounded-2xl p-5">
            <div className="text-[14px] font-semibold text-theme-text mb-3">Advanced Physics</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={LBL}>Jump Force (N)</label>
                <input type="number" min={0} step={0.5} value={(beyblade as any).jumpForce ?? 0} onChange={e => set("jumpForce" as any, parseFloat(e.target.value) || 0)} className={INP} />
                <p className="text-[11px] text-theme-faint mt-0.5">0 = not jump-capable</p>
              </div>
              <div>
                <label className={LBL}>Jump Height (cm)</label>
                <input type="number" min={0} step={1} value={(beyblade as any).jumpHeight ?? 0} onChange={e => set("jumpHeight" as any, parseFloat(e.target.value) || 0)} className={INP} />
              </div>
              <div>
                <label className={LBL}>Burst Resistance (0–100)</label>
                <input type="number" min={0} max={100} step={1} value={(beyblade as any).burstResistance ?? 0} onChange={e => set("burstResistance" as any, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} className={INP} />
                <p className="text-[11px] text-theme-faint mt-0.5">Higher = harder to burst</p>
              </div>
            </div>
          </div>

          {/* Special Move & Combos */}
          <div className="bg-bg2 border border-border-c rounded-2xl p-5">
            <div className="text-[14px] font-semibold text-theme-text mb-3">Special Move &amp; Combos</div>

            {/* Special Move */}
            <div className="mb-4">
              <label className={LBL}>Special Move</label>
              <SearchableSelect
                value={(beyblade as any).specialMoveId ?? ""}
                disabled={specialMovesLoading}
                emptyLabel={specialMovesLoading ? "Loading moves…" : "(none — Special HUD hidden)"}
                options={specialMoves.map(m => ({
                  value: m.id,
                  label: `${m.iconEmoji ?? ""} ${m.name}`,
                  hint: m.description ?? (m.type ? `Type: ${m.type}` : undefined),
                }))}
                onChange={v => set("specialMoveId" as any, v || undefined)}
                className="w-full bg-bg1 border border-border-c rounded-lg px-3 py-[7px] text-[13px] cursor-pointer"
              />
              <p className="text-[11px] text-theme-faint mt-1">Costs ~100 power. If blank, the Special HUD panel is hidden in-match.</p>
            </div>

            {/* BitBeast */}
            <div className="mb-4">
              <label className={LBL}>BitBeast</label>
              <SearchableSelect
                value={(beyblade as any).bitBeastId ?? ""}
                disabled={bitBeastsLoading}
                emptyLabel={bitBeastsLoading ? "Loading bit beasts…" : "(none — BitBeast overlay hidden)"}
                options={[{ value: "", label: "— none —" }, ...bitBeastAssets.map(a => ({ value: a.id, label: a.name ?? a.id, hint: (a as any).tag ?? undefined }))]}
                onChange={v => set("bitBeastId" as any, v || undefined)}
                className="w-full bg-bg1 border border-border-c rounded-lg px-3 py-[7px] text-[13px] cursor-pointer"
              />
              <p className="text-[11px] text-theme-faint mt-1">Shown as a full-screen overlay when the special move activates.</p>
            </div>

            {/* Combo IDs */}
            <div>
              <label className={LBL}>
                Attached Combos <span className="font-normal text-theme-faint">(max 3)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {((beyblade as any).comboIds as string[] ?? []).map((cid: string) => {
                  const combo = combos.find(c => c.id === cid);
                  const seq = combo?.sequence?.map(k => KEY_LABEL[k as keyof typeof KEY_LABEL] ?? k).join("") ?? "";
                  return (
                    <span key={cid} className="inline-flex items-center gap-[5px] px-2.5 py-1 rounded-[20px] text-[12px] bg-bg3 border border-border-c text-theme-text">
                      {combo ? `${combo.name}${seq ? ` (${seq})` : ""}` : cid}
                      <button
                        type="button"
                        onClick={() => set("comboIds" as any, ((beyblade as any).comboIds as string[] ?? []).filter((c: string) => c !== cid))}
                        className="bg-transparent border-none text-theme-muted cursor-pointer text-[14px] leading-none p-0"
                      >×</button>
                    </span>
                  );
                })}
                {(((beyblade as any).comboIds as string[] ?? []).length === 0) && (
                  <span className="text-[12px] text-theme-faint">No combos attached — Combo HUD strip hidden in-match</span>
                )}
              </div>
              {(((beyblade as any).comboIds as string[] ?? []).length < 3) && (
                <SearchableSelect
                  value=""
                  disabled={combosLoading}
                  emptyLabel={combosLoading ? "Loading combos…" : "Add combo…"}
                  options={combos
                    .filter(c => !((beyblade as any).comboIds as string[] ?? []).includes(c.id))
                    .map(c => ({
                      value: c.id,
                      label: `${c.name} — ${c.sequence.map(k => KEY_LABEL[k as keyof typeof KEY_LABEL] ?? k).join("")}`,
                      hint: `${c.cost === 0 ? "free" : `${c.cost} power`} | ${c.type}`,
                    }))}
                  onChange={v => {
                    if (!v) return;
                    const cur: string[] = (beyblade as any).comboIds ?? [];
                    if (!cur.includes(v) && cur.length < 3) set("comboIds" as any, [...cur, v]);
                  }}
                  className="bg-bg1 border border-border-c rounded-lg px-3 py-[7px] text-[13px] cursor-pointer min-w-[200px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right column: sticky preview */}
        <div className="sticky top-20">
          <BeybladePreview beyblade={beyblade} />
        </div>
      </div>

      {/* Full-width contact points section */}
      <Step3ContactPoints
        beyblade={beyblade}
        onChange={(updated) => setBeyblade(b => b ? { ...b, ...updated } : b)}
      />

      {/* Image editor modal */}
      {editorMode && rawImageUrl && (
        <div className="fixed inset-0 bg-black/85 flex items-start justify-center z-[1000] overflow-y-auto py-5 px-4">
          <div className={`w-full ${editorMode === "whatsapp" ? "max-w-fit" : "max-w-[400px]"}`}>
            {editorMode === "whatsapp" && (
              <WhatsAppStyleImageEditor
                imageUrl={rawImageUrl}
                onPositionChange={(pos) => { setImagePosition(pos); set("imagePosition", pos); }}
                initialPosition={imagePosition}
                circleSize={Math.min(320, window.innerWidth - 80)}
                onSave={handleEditorSave}
                onCancel={() => setEditorMode(null)}
              />
            )}
            {editorMode === "crop" && (
              <div className="bg-bg2 rounded-xl p-4">
                <ImageCropper ref={cropperRef} imageUrl={rawImageUrl} targetWidth={300} targetHeight={300} />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setEditorMode(null)}
                    className="px-4 py-1.5 bg-bg3 border border-border-c rounded-lg text-theme-muted text-[13px] cursor-pointer"
                  >Cancel</button>
                  <button
                    onClick={handleEditorSave}
                    className="px-4 py-1.5 bg-theme-blue border-none rounded-lg text-white text-[13px] font-semibold cursor-pointer"
                  >Apply Crop</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
